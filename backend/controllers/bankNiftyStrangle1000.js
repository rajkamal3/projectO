const axios = require('axios');
const nextThursday = require('date-fns/nextThursday');
const { loadSheet } = require('../utils/loadSheet');
const { expiryHolidays } = require('../utils/constants');

let optionChainDailyStrangle1000;
let ceStartDailyStrangle1000;
let peStartDailyStrangle1000;
let strikePriceDailyStrangle1000;

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
exports.getBankNiftyDataDailyStrangle1000 = async (req, res, next) => {
    console.log('Fetching data...');
    axios
        .post(process.env.OPTIONCHAIN_URL, {
            aTyp: 'OPTIDX',
            exp: new Date(nextExpiry).toDateString().substr(4, 11).trim(),
            uSym: 'BANKNIFTY'
        })
        .then(res => {
            optionChainDailyStrangle1000 = res.data.opChn;
            optionChainDailyStrangle1000.map(option => {
                if (option.atm === true) {
                    const atm = optionChainDailyStrangle1000.indexOf(option);
                    const otmCe = optionChainDailyStrangle1000[atm + 5];
                    const otmPe = optionChainDailyStrangle1000[atm - 5];

                    ceStartDailyStrangle1000 = otmCe.ceQt.ltp;
                    peStartDailyStrangle1000 = otmPe.peQt.ltp;
                    strikePriceDailyStrangle1000 = option.stkPrc;
                }
            });
        })
        .catch(err => {
            console.log('Failed to fetch data...');
        });

    next();
};

exports.bankNiftyOpensDailyStrangle1000 = async (req, res, next) => {
    const sheet = await loadSheet(2);
    console.log('Market opens...');

    await sheet.addRow({
        Date: new Date().toGMTString().substr(5, 11),
        'Strike Price': strikePriceDailyStrangle1000,
        'CE Start': ceStartDailyStrangle1000,
        'CE End': '',
        'PE Start': peStartDailyStrangle1000,
        'PE End': '',
        Total: ''
    });

    res.status(200).json({
        status: 'Success'
    });
};

exports.bankNiftyClosesDailyStrangle1000 = async (req, res, next) => {
    const sheet = await loadSheet(2);
    console.log('Market closes...');

    await sheet.loadCells('A1:G500');
    const lastRow = await sheet.getRows();
    const currentCell = lastRow[lastRow.length - 1]._rowNumber;
    const todayStrike = sheet.getCellByA1('B' + currentCell).value.toString() + '.0';

    let ceEnd, peEnd;

    optionChainDailyStrangle1000.map(option => {
        if (option.stkPrc === todayStrike) {
            const atm = optionChainDailyStrangle1000.indexOf(option);
            console.log(atm);
            const otmCe = optionChainDailyStrangle1000[atm + 5];
            const otmPe = optionChainDailyStrangle1000[atm - 5];

            ceEnd = otmCe.ceQt.ltp;
            peEnd = otmPe.peQt.ltp;
            strikePriceDailyStrangle1000 = option.stkPrc;
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
