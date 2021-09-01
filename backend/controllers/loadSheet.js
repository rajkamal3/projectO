const { GoogleSpreadsheet } = require('google-spreadsheet');

exports.loadSheet = async sheetNumber => {
    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID);

    await doc.useServiceAccountAuth({
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n')
    });

    await doc.loadInfo();

    const sheet = doc.sheetsByIndex[sheetNumber];

    return sheet;
};
