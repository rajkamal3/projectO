const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const nextThursday = require('date-fns/nextThursday');

const app = express();

app.use(express.json());

dotenv.config({
    path: `${__dirname}/config.env`
});

let optionChain;
let ceStart;
let peStart;
let strikePrice;
const expiryHolidays = ['March 11, 2021', 'May 12, 2021', 'August 19, 2021', 'November 04, 2021'];

axios
    .post(`https://ewmw.edelweiss.in/api/Market/optionchainguest`, {
        aTyp: 'OPTIDX',
        exp: '18 Aug 2021',
        uSym: 'BANKNIFTY'
    })
    .then(res => {
        optionChain = res.data.opChn;
        // console.log(optionChain);
        optionChain.map(option => {
            if (option.atm === true) {
                ceStart = option.ceQt.ltp;
                peStart = option.peQt.ltp;
                strikePrice = option.stkPrc;
                console.log(strikePrice, ceStart, peStart);
            }
        });
    });

(async function () {
    await marketOpens();
})();

async function marketOpens() {
    const doc = new GoogleSpreadsheet('1FJAbRAKktVWb5SBIMEqZWnq-PzHkJt9BbJARmuvAWnM');

    await doc.useServiceAccountAuth({
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY
    });

    await doc.loadInfo();
    // console.log(doc);

    const sheet = doc.sheetsByIndex[0];
    // console.log(sheet.title);
    // console.log(sheet.rowCount);

    // const rows = await sheet.getRows();
    // console.log(rows[0].date);

    // console.log(doc);

    await sheet.addRow({
        Date: new Date().toGMTString().substr(5, 11),
        'Strike Price': strikePrice,
        'CE Start': ceStart,
        'CE End': '',
        'PE Start': peStart,
        'PE End': ''
    });
}

console.log(nextThursday(new Date()));

app.listen(3000, () => {
    console.log('App is running...');
});
