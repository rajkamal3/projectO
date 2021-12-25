const axios = require('axios');
const nextThursday = require('date-fns/nextThursday');
const { loadSheet } = require('../utils/loadSheet');
const { expiryHolidays } = require('../utils/constants');

let optionChainDailyStrangle;
let ceStartDailyStrangle;
let peStartDailyStrangle;
let strikePriceDailyStrangle;

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

exports.getBankNiftyDataDailyStrangle600 = async (req, res, next) => {
    console.log('Fetching data...');
    axios
        .post(process.env.OPTIONCHAIN_URL, {
            aTyp: 'OPTIDX',
            exp: new Date(nextExpiry).toDateString().substr(4, 11).trim(),
            uSym: 'BANKNIFTY'
        })
        .then(res => {
            optionChainDailyStrangle = res.data.opChn;
            optionChainDailyStrangle.map(option => {
                if (option.atm === true) {
                    const atm = optionChainDailyStrangle.indexOf(option);
                    const otmCe = optionChainDailyStrangle[atm + 3];
                    const otmPe = optionChainDailyStrangle[atm - 3];

                    ceStartDailyStrangle = otmCe.ceQt.ltp;
                    peStartDailyStrangle = otmPe.peQt.ltp;
                    strikePriceDailyStrangle = option.stkPrc;
                }
            });
        })
        .catch(err => {
            console.log('Failed to fetch data...');
        });

    next();
};

exports.bankNiftyOpensDailyStrangle600 = async (req, res, next) => {
    const sheet = await loadSheet(1);
    console.log('Market opens...');

    await sheet.addRow({
        Date: new Date().toGMTString().substr(5, 11),
        'Strike Price': strikePriceDailyStrangle,
        'CE Start': ceStartDailyStrangle,
        'CE End': '',
        'PE Start': peStartDailyStrangle,
        'PE End': '',
        Total: ''
    });

    res.status(200).json({
        status: 'Success'
    });
};

exports.bankNiftyClosesDailyStrangle600 = async (req, res, next) => {
    const sheet = await loadSheet(1);
    console.log('Market closes...');

    await sheet.loadCells('A1:G500');
    const lastRow = await sheet.getRows();
    const currentCell = lastRow[lastRow.length - 1]._rowNumber;
    const todayStrike = sheet.getCellByA1('B' + currentCell).value.toString() + '.0';

    let ceEnd, peEnd;

    optionChainDailyStrangle.map(option => {
        if (option.stkPrc === todayStrike) {
            const atm = optionChainDailyStrangle.indexOf(option);
            console.log(atm);
            const otmCe = optionChainDailyStrangle[atm + 3];
            const otmPe = optionChainDailyStrangle[atm - 3];

            ceEnd = otmCe.ceQt.ltp;
            peEnd = otmPe.peQt.ltp;
            strikePriceDailyStrangle = option.stkPrc;
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
