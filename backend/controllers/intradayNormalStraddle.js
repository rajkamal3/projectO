// async function intradayNormalStraddle() {
//     let optionChainDailyStraddle;
//     let ceStartDailyStraddle;
//     let peStartDailyStraddle;
//     let strikePriceDailyStraddle;

//     console.log('Fetching data...');
//     axios
//         .post(process.env.OPTIONCHAIN_URL, {
//             aTyp: 'OPTIDX',
//             exp: new Date(nextExpiry).toDateString().substr(4, 11).trim(),
//             uSym: 'BANKNIFTY'
//         })
//         .then(res => {
//             optionChainDailyStraddle = res.data.opChn;
//             optionChainDailyStraddle.map(option => {
//                 if (option.atm === true) {
//                     ceStartDailyStraddle = option.ceQt.ltp;
//                     peStartDailyStraddle = option.peQt.ltp;
//                     strikePriceDailyStraddle = option.stkPrc;
//                 }
//             });
//         })
//         .catch(err => {
//             console.log('Failed to fetch data...');
//         });

//     const sheet = await loadSheet(0);
//     console.log('Market opens...');

//     await sheet.addRow({
//         Date: new Date().toGMTString().substr(5, 11),
//         'Strike Price': strikePriceDailyStraddle,
//         'CE Start': ceStartDailyStraddle,
//         'CE End': '',
//         'PE Start': peStartDailyStraddle,
//         'PE End': '',
//         Total: ''
//     });

//     res.status(200).json({
//         status: 'Success'
//     });

//     const sheet = await loadSheet(0);
//     console.log('Market closes...');

//     await sheet.loadCells('A1:G500');
//     const lastRow = await sheet.getRows();
//     const currentCell = lastRow[lastRow.length - 1]._rowNumber;
//     const todayStrike = sheet.getCellByA1('B' + currentCell).value.toString() + '.0';

//     let ceEnd, peEnd;

//     optionChainDailyStraddle.map(option => {
//         if (option.stkPrc === todayStrike) {
//             ceEnd = option.ceQt.ltp;
//             peEnd = option.peQt.ltp;
//         }
//     });

//     sheet.getCellByA1('D' + currentCell).value = ceEnd;
//     sheet.getCellByA1('F' + currentCell).value = peEnd;
//     sheet.getCellByA1('G' + currentCell).formula = `=MINUS(C${currentCell},D${currentCell}) + MINUS(E${currentCell},F${currentCell})`;

//     await sheet.saveUpdatedCells();

//     res.status(200).json({
//         status: 'Success'
//     });
// }

// module.exports = intradayNormalStraddle;
