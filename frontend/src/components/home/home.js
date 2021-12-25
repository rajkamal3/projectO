import React from 'react';
import styles from './home.module.css';
import axios from 'axios';

const Home = () => {
    const bankNiftyOpens = () => {
        axios
            .get('/api/bankNiftyOpensDailyStrangle200')
            .then(res => {
                alert('Strangle 200: ' + res.data.status);
            })
            .catch(err => {
                alert('Strangle 200: An error occured!');
            });
        axios
            .get('/api/bankNiftyOpensDailyStrangle400')
            .then(res => {
                alert('Strangle 400: ' + res.data.status);
            })
            .catch(err => {
                alert('Strangle 400: An error occured!');
            });
        axios
            .get('/api/bankNiftyOpensDailyStrangle600')
            .then(res => {
                alert('Strangle 600: ' + res.data.status);
            })
            .catch(err => {
                alert('Strangle 600: An error occured!');
            });
        axios
            .get('/api/bankNiftyOpensDailyStrangle800')
            .then(res => {
                alert('Strangle 800: ' + res.data.status);
            })
            .catch(err => {
                alert('Strangle 800: An error occured!');
            });
        axios
            .get('/api/bankNiftyOpensDailyStrangle1000')
            .then(res => {
                alert('Strangle 1000: ' + res.data.status);
            })
            .catch(err => {
                alert('Strangle 1000: An error occured!');
            });
        axios
            .get('/api/bankNiftyOpensDailyStrangleOpp1000')
            .then(res => {
                alert('Strangle Opp 1000: ' + res.data.status);
            })
            .catch(err => {
                alert('Strangle Opp 1000: An error occured!');
            });

        document.querySelector('.marketOpensButton').style.backgroundColor = '#90c695';
    };

    const bankNiftyCloses = () => {
        axios
            .get('/api/bankNiftyClosesDailyStrangle200')
            .then(res => {
                alert('Straddle 200: ' + res.data.status);
            })
            .catch(err => {
                alert('Straddle 200: An error occured!');
            });
        axios
            .get('/api/bankNiftyClosesDailyStrangle400')
            .then(res => {
                alert('Strangle 400: ' + res.data.status);
            })
            .catch(err => {
                alert('Strangle 400: An error occured!');
            });
        axios
            .get('/api/bankNiftyClosesDailyStrangle600')
            .then(res => {
                alert('Strangle 600: ' + res.data.status);
            })
            .catch(err => {
                alert('Strangle 600: An error occured!');
            });
        axios
            .get('/api/bankNiftyClosesDailyStrangle800')
            .then(res => {
                alert('Strangle 800: ' + res.data.status);
            })
            .catch(err => {
                alert('Strangle 800: An error occured!');
            });
        axios
            .get('/api/bankNiftyClosesDailyStrangle1000')
            .then(res => {
                alert('Strangle 1000: ' + res.data.status);
            })
            .catch(err => {
                alert('Strangle 1000: An error occured!');
            });
        axios
            .get('/api/bankNiftyClosesDailyStrangleOpp1000')
            .then(res => {
                alert('Strangle Opp 1000: ' + res.data.status);
            })
            .catch(err => {
                alert('Strangle Opp 1000: An error occured!');
            });

        document.querySelector('.marketClosesButton').style.backgroundColor = '#90c695';
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>projectO</div>
            <div className={styles.strategy}>
                <div>Short Straddle &amp; Strangle - Bank Nifty</div>
                <div className={styles.buttonsContainer}>
                    <div className={[styles.marketOpensClosesButtons, 'marketOpensButton'].join(' ')} onClick={bankNiftyOpens}>
                        Market Opens
                    </div>
                    <div className={[styles.marketOpensClosesButtons, 'marketClosesButton'].join(' ')} onClick={bankNiftyCloses}>
                        Market Closes
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
