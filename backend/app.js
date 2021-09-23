const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const nextThursday = require('date-fns/nextThursday');
const { loadSheet } = require('./controllers/loadSheet');
const { expiryHolidays } = require('./utils/constants');
const path = require('path');

dotenv.config({
    path: `${__dirname}/config.env`
});

const app = express();

app.use(express.json());

dotenv.config({
    path: `${__dirname}/../config.env`
});

// Daily Straddle
let optionChainDailyStraddle;
let ceStartDailyStraddle;
let peStartDailyStraddle;
let strikePriceDailyStraddle;

// Daily Strangle
let optionChainDailyStrangle;
let ceStartDailyStrangle;
let peStartDailyStrangle;
let strikePriceDailyStrangle;

// Daily Strangle 1000 Points
let optionChainDailyStrangle1000;
let ceStartDailyStrangle1000;
let peStartDailyStrangle1000;
let strikePriceDailyStrangle1000;

let nextExpiry = nextThursday(new Date());

expiryHolidays.filter(date => {
    if (new Date(nextExpiry).toLocaleDateString() === new Date(date).toLocaleDateString()) {
        nextExpiry.setDate(nextExpiry.getDate() - 1);
    }
});

// Daily Straddle
function getDataDailyStraddle(req, res, next) {
    console.log('Fetching data...');
    axios
        .post(process.env.OPTIONCHAIN_URL, {
            aTyp: 'OPTIDX',
            exp: new Date(nextExpiry).toDateString().substr(4, 11).trim(),
            uSym: 'BANKNIFTY'
        })
        .then(res => {
            optionChainDailyStraddle = res.data.opChn;
            optionChainDailyStraddle.map(option => {
                if (option.atm === true) {
                    ceStartDailyStraddle = option.ceQt.ltp;
                    peStartDailyStraddle = option.peQt.ltp;
                    strikePriceDailyStraddle = option.stkPrc;
                }
            });
        })
        .catch(err => {
            console.log('Failed to fetch data...');
        });

    next();
}

async function marketOpensDailyStraddle(req, res, next) {
    const sheet = await loadSheet(0);
    console.log('Market opens...');

    await sheet.addRow({
        Date: new Date().toGMTString().substr(5, 11),
        'Strike Price': strikePriceDailyStraddle,
        'CE Start': ceStartDailyStraddle,
        'CE End': '',
        'PE Start': peStartDailyStraddle,
        'PE End': '',
        Total: ''
    });

    res.status(200).json({
        status: 'Success'
    });
}

async function marketClosesDailyStraddle(req, res, next) {
    const sheet = await loadSheet(0);
    console.log('Market closes...');

    await sheet.loadCells('A1:G500');
    const lastRow = await sheet.getRows();
    const currentCell = lastRow[lastRow.length - 1]._rowNumber;
    const todayStrike = sheet.getCellByA1('B' + currentCell).value.toString() + '.0';

    let ceEnd, peEnd;

    optionChainDailyStraddle.map(option => {
        if (option.stkPrc === todayStrike) {
            ceEnd = option.ceQt.ltp;
            peEnd = option.peQt.ltp;
        }
    });

    sheet.getCellByA1('D' + currentCell).value = ceEnd;
    sheet.getCellByA1('F' + currentCell).value = peEnd;
    sheet.getCellByA1('G' + currentCell).formula = `=MINUS(C${currentCell},D${currentCell}) + MINUS(E${currentCell},F${currentCell})`;

    await sheet.saveUpdatedCells();

    res.status(200).json({
        status: 'Success'
    });
}

// Daily Strangle
function getDataDailyStrangle(req, res, next) {
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
                    const otmCe = optionChainDailyStrangle[atm + 1];
                    const otmPe = optionChainDailyStrangle[atm - 1];

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
}

async function marketOpensDailyStrangle(req, res, next) {
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
}

async function marketClosesDailyStrangle(req, res, next) {
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
            const otmCe = optionChainDailyStrangle[atm + 1];
            const otmPe = optionChainDailyStrangle[atm - 1];

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
}

// Daily Strangle 1000 Points
function getDataDailyStrangle1000(req, res, next) {
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
}

async function marketOpensDailyStrangle1000(req, res, next) {
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
}

async function marketClosesDailyStrangle1000(req, res, next) {
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
}

app.get('/api/marketOpensDailyStraddle', getDataDailyStraddle, marketOpensDailyStraddle);
app.get('/api/marketClosesDailyStraddle', getDataDailyStraddle, marketClosesDailyStraddle);

app.get('/api/marketOpensDailyStrangle', getDataDailyStrangle, marketOpensDailyStrangle);
app.get('/api/marketClosesDailyStrangle', getDataDailyStrangle, marketClosesDailyStrangle);

app.get('/api/marketOpensDailyStrangle1000', getDataDailyStrangle1000, marketOpensDailyStrangle1000);
app.get('/api/marketClosesDailyStrangle1000', getDataDailyStrangle1000, marketClosesDailyStrangle1000);

if (process.env.NODE_ENV === 'prod') {
    app.use(express.static(`${__dirname}/../frontend/build`));
    app.get('/*', (req, res) => res.sendFile(path.resolve(`${__dirname}/../frontend/build/index.html`)));
} else {
    app.get('/', (req, res) => {
        res.send(`I'm a freakin' server!`);
    });
}

app.listen(process.env.PORT || 3000, () => {
    console.log(`App is running on port ${process.env.PORT || 3000}...`);
});
