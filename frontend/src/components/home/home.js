import React from 'react';
import styles from './home.module.css';
import axios from 'axios';

const Home = () => {
    const marketOpens = () => {
        axios
            .get('/api/marketOpensDailyStraddle')
            .then(res => {
                alert('Daily Straddle: ' + res.data.status);
            })
            .catch(err => {
                alert('Daily Straddle: An error occured!');
            });
        axios
            .get('/api/marketOpensDailyStrangle')
            .then(res => {
                alert('Daily Strangle: ' + res.data.status);
            })
            .catch(err => {
                alert('Daily Strangle: An error occured!');
            });
        axios
            .get('/api/marketOpensDailyStrangle1000')
            .then(res => {
                alert('Daily Strangle 1000: ' + res.data.status);
            })
            .catch(err => {
                alert('Daily Strangle 1000: An error occured!');
            });
        axios
            .get('/api/marketOpensNiftyDailyStrangle500')
            .then(res => {
                alert('Nifty Daily Strangle 500: ' + res.data.status);
            })
            .catch(err => {
                alert('Nifty Daily Strangle 500: An error occured!');
            });

        document.querySelector('.marketOpensButton').style.backgroundColor = '#90c695';
    };

    const marketCloses = () => {
        axios
            .get('/api/marketClosesDailyStraddle')
            .then(res => {
                alert('Daily Straddle: ' + res.data.status);
            })
            .catch(err => {
                alert('Daily Straddle: An error occured!');
            });
        axios
            .get('/api/marketClosesDailyStrangle')
            .then(res => {
                alert('Daily Strangle: ' + res.data.status);
            })
            .catch(err => {
                alert('Daily Strangle: An error occured!');
            });
        axios
            .get('/api/marketClosesDailyStrangle1000')
            .then(res => {
                alert('Daily Strangle 1000: ' + res.data.status);
            })
            .catch(err => {
                alert('Daily Strangle 1000: An error occured!');
            });
        axios
            .get('/api/marketClosesNiftyDailyStrangle500')
            .then(res => {
                alert('Nifty Daily Strangle 500: ' + res.data.status);
            })
            .catch(err => {
                alert('Nifty Daily Strangle 500: An error occured!');
            });

        document.querySelector('.marketClosesButton').style.backgroundColor = '#90c695';
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>projectO</div>
            <div className={styles.strategy}>
                <div>Short Straddle &amp; Strangle - Daily</div>
                <div className={styles.buttonsContainer}>
                    <div className={[styles.marketOpensClosesButtons, 'marketOpensButton'].join(' ')} onClick={marketOpens}>
                        Market Opens
                    </div>
                    <div className={[styles.marketOpensClosesButtons, 'marketClosesButton'].join(' ')} onClick={marketCloses}>
                        Market Closes
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
