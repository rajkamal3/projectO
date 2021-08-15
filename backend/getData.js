const axios = require('axios');
const nextThursday = require('date-fns/nextThursday');

function getData() {
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

    return { optionChain, ceStart, peStart, strikePrice };
}

module.exports = getData;
