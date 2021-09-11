// const nextThursday = require('date-fns/nextThursday');
// const { expiryHolidays } = require('./constants');

// function calculateNextExpiry() {
//     let nextExpiry = nextThursday(new Date());

//     expiryHolidays.filter(date => {
//         if (new Date(nextExpiry).toLocaleDateString() === new Date(date).toLocaleDateString()) {
//             nextExpiry.setDate(nextExpiry.getDate() - 1);
//         }
//     });

//     return nextExpiry;
// }

// module.exports = calculateNextExpiry;
