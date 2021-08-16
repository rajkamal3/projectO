const express = require('express');
const axios = require('axios');
const cron = require('node-cron');
const dotenv = require('dotenv');
const nextThursday = require('date-fns/nextThursday');
const { loadSheet } = require('./controllers/loadSheet');
const { expiryHolidays } = require('./utils/constants');

const app = express();

app.use(express.json());

dotenv.config({
    path: `${__dirname}/../config.env`
});

let optionChain;
let ceStart;
let peStart;
let strikePrice;

let nextExpiry = nextThursday(new Date());

expiryHolidays.filter(date => {
    if (new Date(nextExpiry).toLocaleDateString() === new Date(date).toLocaleDateString()) {
        nextExpiry.setDate(nextExpiry.getDate() - 1);
    }
});

function getData(req, res, next) {
    console.log('Fetching data...');
    axios
        .post(process.env.OPTIONCHAIN_URL, {
            aTyp: 'OPTIDX',
            exp: new Date(nextExpiry).toDateString().substr(4, 11).trim(),
            uSym: 'BANKNIFTY'
        })
        .then(res => {
            optionChain = res.data.opChn;
            optionChain.map(option => {
                if (option.atm === true) {
                    ceStart = option.ceQt.ltp;
                    peStart = option.peQt.ltp;
                    strikePrice = option.stkPrc;
                }
            });
        })
        .catch(err => {
            console.log('Failed to fetch data...');
        });

    next();
}

async function marketOpens(req, res, next) {
    const sheet = await loadSheet();
    console.log('Market opens...');

    await sheet.addRow({
        Date: new Date().toGMTString().substr(5, 11),
        'Strike Price': strikePrice,
        'CE Start': ceStart,
        'CE End': '',
        'PE Start': peStart,
        'PE End': '',
        Total: ''
    });

    res.status(200).json({
        status: 'success'
    });
}

async function marketCloses(req, res, next) {
    const sheet = await loadSheet();
    console.log('Market closes...');

    await sheet.loadCells('A1:G500');
    const lastRow = await sheet.getRows();
    const currentCell = lastRow[lastRow.length - 1]._rowNumber;
    const todayStrike = sheet.getCellByA1('B' + currentCell).value.toString() + '.0';

    let ceEnd, peEnd;

    optionChain.map(option => {
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
        status: 'success'
    });
}

app.get('/api/marketOpens', getData, marketOpens);
app.get('/api/marketCloses', getData, marketCloses);

cron.schedule(
    '50 21 * * 1-5',
    async () => {
        axios.get('https://stokr-projecto.herokuapp.com/api/marketOpens');
    },
    {
        scheduled: true,
        timezone: 'Asia/Kolkata'
    }
);

cron.schedule(
    '51 21 * * 1-5',
    async () => {
        axios.get('https://stokr-projecto.herokuapp.com/api/marketCloses');
    },
    {
        scheduled: true,
        timezone: 'Asia/Kolkata'
    }
);

app.listen(process.env.PORT || 3000, () => {
    console.log('App is running...');
});
