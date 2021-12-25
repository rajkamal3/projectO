const axios = require('axios');
const nextThursday = require('date-fns/nextThursday');
const { loadSheet } = require('../utils/loadSheet');
const { expiryHolidays } = require('../utils/constants');

let optionChainDailyStrangleOpp1000;
let ceStartDailyStrangleOpp1000;
let peStartDailyStrangleOpp1000;
let strikePriceDailyStrangleOpp1000;

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const today = new Date(new Date().toJSON());
const dayName = days[today.getDay()];

let nextExpiry;

if (dayName !== 'Thursday') {
    nextExpiry = nextThursday(new Date());

    expiryHolidays.filter(date => {
        if (new Date(nextExpiry).toLocaleDateString() === new Date(date).toLocaleDateString()) {
            nextExpiry.setDate(nextExpiry.getDate() - 1);
        }
    });
} else {
    nextExpiry = new Date(new Date().toJSON());
}

console.log(nextExpiry);

// Daily Strangle 1000 Points
exports.getBankNiftyDataDailyStrangleOpp1000 = async (req, res, next) => {
    console.log('Fetching data...');
    axios
        .post(process.env.OPTIONCHAIN_URL, {
            aTyp: 'OPTIDX',
            exp: new Date(nextExpiry).toDateString().substr(4, 11).trim(),
            uSym: 'BANKNIFTY'
        })
        .then(res => {
            optionChainDailyStrangleOpp1000 = res.data.opChn;
            optionChainDailyStrangleOpp1000.map(option => {
                if (option.atm === true) {
                    const atm = optionChainDailyStrangleOpp1000.indexOf(option);
                    const otmCe = optionChainDailyStrangleOpp1000[atm - 5];
                    const otmPe = optionChainDailyStrangleOpp1000[atm + 5];

                    ceStartDailyStrangleOpp1000 = otmCe.ceQt.ltp;
                    peStartDailyStrangleOpp1000 = otmPe.peQt.ltp;
                    strikePriceDailyStrangleOpp1000 = option.stkPrc;
                }
            });
        })
        .catch(err => {
            console.log('Failed to fetch data...');
        });

    next();
};

exports.bankNiftyOpensDailyStrangleOpp1000 = async (req, res, next) => {
    const sheet = await loadSheet(3);
    console.log('Market opens...');

    await sheet.addRow({
        Date: new Date().toGMTString().substr(5, 11),
        'Strike Price': strikePriceDailyStrangleOpp1000,
        'CE Start': ceStartDailyStrangleOpp1000,
        'CE End': '',
        'PE Start': peStartDailyStrangleOpp1000,
        'PE End': '',
        Total: ''
    });

    res.status(200).json({
        status: 'Success'
    });
};

exports.bankNiftyClosesDailyStrangleOpp1000 = async (req, res, next) => {
    const sheet = await loadSheet(3);
    console.log('Market closes...');

    await sheet.loadCells('A1:G500');
    const lastRow = await sheet.getRows();
    const currentCell = lastRow[lastRow.length - 1]._rowNumber;
    const todayStrike = sheet.getCellByA1('B' + currentCell).value.toString() + '.0';

    let ceEnd, peEnd;

    optionChainDailyStrangleOpp1000.map(option => {
        if (option.stkPrc === todayStrike) {
            const atm = optionChainDailyStrangleOpp1000.indexOf(option);
            console.log(atm);
            const otmCe = optionChainDailyStrangleOpp1000[atm - 5];
            const otmPe = optionChainDailyStrangleOpp1000[atm + 5];

            ceEnd = otmCe.ceQt.ltp;
            peEnd = otmPe.peQt.ltp;
            strikePriceDailyStrangleOpp1000 = option.stkPrc;
        }
    });

    sheet.getCellByA1('D' + currentCell).value = ceEnd;
    sheet.getCellByA1('F' + currentCell).value = peEnd;
    sheet.getCellByA1('G' + currentCell).formula = `=MINUS(C${currentCell},D${currentCell}) + MINUS(E${currentCell},F${currentCell})`;

    await sheet.saveUpdatedCells();

    res.status(200).json({
        status: 'Success'
    });
};
