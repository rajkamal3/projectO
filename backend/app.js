const express = require('express');
const axios = require('axios');
const cron = require('node-cron');
const dotenv = require('dotenv');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const nextThursday = require('date-fns/nextThursday');
// const getData = require('./getData');

const app = express();

app.use(express.json());

dotenv.config({
    path: `${__dirname}/../config.env`
});

let optionChain;
let ceStart;
let peStart;
let strikePrice;
const expiryHolidays = ['March 11, 2021', 'May 12, 2021', 'August 19, 2021', 'November 04, 2021'];

let nextExpiry = nextThursday(new Date());

expiryHolidays.filter(date => {
    if (new Date(nextExpiry).toLocaleDateString() === new Date(date).toLocaleDateString()) {
        nextExpiry.setDate(nextExpiry.getDate() - 1);
    }
});

axios
    .post(process.env.EDELWEISS_OPTIONCHAIN_URL, {
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

// const { optionChain, ceStart, peStart, strikePrice } = getData();

(function () {
    marketOpens();
})();

async function marketOpens() {
    const doc = new GoogleSpreadsheet('1FJAbRAKktVWb5SBIMEqZWnq-PzHkJt9BbJARmuvAWnM');

    await doc.useServiceAccountAuth({
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY
    });

    await doc.loadInfo();

    const sheet = doc.sheetsByIndex[0];

    cron.schedule(
        '55 23 * * *',
        async () => {
            console.log('starday');

            await sheet.addRow({
                Date: new Date().toGMTString().substr(5, 11),
                'Strike Price': strikePrice,
                'CE Start': ceStart,
                'CE End': '',
                'PE Start': peStart,
                'PE End': '',
                Total: ''
            });
        },
        {
            scheduled: true,
            timezone: 'Asia/Kolkata'
        }
    );

    cron.schedule(
        '56 23 * * *',
        async () => {
            console.log('enday');

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
            sheet.getCellByA1(
                'G' + currentCell
            ).formula = `=MINUS(C${currentCell},D${currentCell}) + MINUS(E${currentCell},F${currentCell})`;

            await sheet.saveUpdatedCells();
        },
        {
            scheduled: true,
            timezone: 'Asia/Kolkata'
        }
    );
}

app.listen(3000, () => {
    console.log('App is running...');
});
