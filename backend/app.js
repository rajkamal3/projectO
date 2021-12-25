const express = require('express');
const dotenv = require('dotenv');
const path = require('path');

const { bankNiftyOpensDailyStrangle, bankNiftyClosesDailyStrangle } = require('./controllers/bankNiftyStrangle');

dotenv.config({
    path: `${__dirname}/config.env`
});

const app = express();

app.use(express.json());

dotenv.config({
    path: `${__dirname}/../config.env`
});

app.get('/api/bankNiftyOpensDailyStrangle/:strangleDifference', bankNiftyOpensDailyStrangle);
app.get('/api/bankNiftyClosesDailyStrangle/:strangleDifference', bankNiftyClosesDailyStrangle);

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
