const { GoogleSpreadsheet } = require('google-spreadsheet');

exports.loadSheet = async () => {
    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID);

    await doc.useServiceAccountAuth({
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY
    });

    await doc.loadInfo();

    const sheet = doc.sheetsByIndex[0];

    return sheet;
};
