const express = require('express');
const dotenv = require('dotenv');
const path = require('path');

const {
    getBankNiftyDataDailyStrangle200,
    bankNiftyOpensDailyStrangle200,
    bankNiftyClosesDailyStrangle200
} = require('./controllers/bankNiftyStrangle200');
const {
    getBankNiftyDataDailyStrangle400,
    bankNiftyOpensDailyStrangle400,
    bankNiftyClosesDailyStrangle400
} = require('./controllers/bankNiftyStrangle400');
const {
    getBankNiftyDataDailyStrangle600,
    bankNiftyOpensDailyStrangle600,
    bankNiftyClosesDailyStrangle600
} = require('./controllers/bankNiftyStrangle600');
const {
    getBankNiftyDataDailyStrangle800,
    bankNiftyOpensDailyStrangle800,
    bankNiftyClosesDailyStrangle800
} = require('./controllers/bankNiftyStrangle800');
const {
    getBankNiftyDataDailyStrangle1000,
    bankNiftyOpensDailyStrangle1000,
    bankNiftyClosesDailyStrangle1000
} = require('./controllers/bankNiftyStrangle1000');
const {
    getBankNiftyDataDailyStrangleOpp1000,
    bankNiftyOpensDailyStrangleOpp1000,
    bankNiftyClosesDailyStrangleOpp1000
} = require('./controllers/bankNiftyStrangleOpp1000');

dotenv.config({
    path: `${__dirname}/config.env`
});

const app = express();

app.use(express.json());

dotenv.config({
    path: `${__dirname}/../config.env`
});

app.get('/api/bankNiftyOpensDailyStrangle200', getBankNiftyDataDailyStrangle200, bankNiftyOpensDailyStrangle200);
app.get('/api/bankNiftyClosesDailyStrangle200', getBankNiftyDataDailyStrangle200, bankNiftyClosesDailyStrangle200);

app.get('/api/bankNiftyOpensDailyStrangle400', getBankNiftyDataDailyStrangle400, bankNiftyOpensDailyStrangle400);
app.get('/api/bankNiftyClosesDailyStrangle400', getBankNiftyDataDailyStrangle400, bankNiftyClosesDailyStrangle400);

app.get('/api/bankNiftyOpensDailyStrangle600', getBankNiftyDataDailyStrangle600, bankNiftyOpensDailyStrangle600);
app.get('/api/bankNiftyClosesDailyStrangle600', getBankNiftyDataDailyStrangle600, bankNiftyClosesDailyStrangle600);

app.get('/api/bankNiftyOpensDailyStrangle800', getBankNiftyDataDailyStrangle800, bankNiftyOpensDailyStrangle800);
app.get('/api/bankNiftyClosesDailyStrangle800', getBankNiftyDataDailyStrangle800, bankNiftyClosesDailyStrangle800);

app.get('/api/bankNiftyOpensDailyStrangle1000', getBankNiftyDataDailyStrangle1000, bankNiftyOpensDailyStrangle1000);
app.get('/api/bankNiftyClosesDailyStrangle1000', getBankNiftyDataDailyStrangle1000, bankNiftyClosesDailyStrangle1000);

app.get('/api/bankNiftyOpensDailyStrangleOpp1000', getBankNiftyDataDailyStrangleOpp1000, bankNiftyOpensDailyStrangleOpp1000);
app.get('/api/bankNiftyClosesDailyStrangleOpp1000', getBankNiftyDataDailyStrangleOpp1000, bankNiftyClosesDailyStrangleOpp1000);

if (false) {
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
