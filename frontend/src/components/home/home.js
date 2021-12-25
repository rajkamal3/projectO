import React, { useState } from 'react';
import styles from './home.module.css';
import axios from 'axios';

const Home = () => {
    const [strikePrice, setStrikePrice] = useState(null);

    const bankNiftyOpens = () => {
        axios
            .get('/api/bankNiftyOpensDailyStrangle/200')
            .then(res => {
                setStrikePrice(res.data.strikePrice);
                alert('Strangle 200: ' + res.data.status);
            })
            .catch(err => {
                alert('Strangle 200: An error occured!');
            });

        axios
            .get('/api/bankNiftyOpensDailyStrangle/400')
            .then(res => {
                setStrikePrice(res.data.strikePrice);
                alert('Strangle 400: ' + res.data.status);
            })
            .catch(err => {
                alert('Strangle 400: An error occured!');
            });
        axios
            .get('/api/bankNiftyOpensDailyStrangle/600')
            .then(res => {
                setStrikePrice(res.data.strikePrice);
                alert('Strangle 600: ' + res.data.status);
            })
            .catch(err => {
                alert('Strangle 600: An error occured!');
            });
        axios
            .get('/api/bankNiftyOpensDailyStrangle/800')
            .then(res => {
                setStrikePrice(res.data.strikePrice);
                alert('Strangle 800: ' + res.data.status);
            })
            .catch(err => {
                alert('Strangle 800: An error occured!');
            });
        axios
            .get('/api/bankNiftyOpensDailyStrangle/1000')
            .then(res => {
                setStrikePrice(res.data.strikePrice);
                alert('Strangle 1000: ' + res.data.status);
            })
            .catch(err => {
                alert('Strangle 1000: An error occured!');
            });
        axios
            .get('/api/bankNiftyOpensDailyStrangle/2000')
            .then(res => {
                setStrikePrice(res.data.strikePrice);
                alert('Strangle Opp 1000: ' + res.data.status);
            })
            .catch(err => {
                alert('Strangle Opp 1000: An error occured!');
            });

        document.querySelector('.marketOpensButton').style.backgroundColor = '#90c695';
    };

    const bankNiftyCloses = () => {
        axios
            .get('/api/bankNiftyClosesDailyStrangle/200')
            .then(res => {
                alert('Straddle 200: ' + res.data.status);
            })
            .catch(err => {
                alert('Straddle 200: An error occured!');
            });
        axios
            .get('/api/bankNiftyClosesDailyStrangle/400')
            .then(res => {
                alert('Straddle 400: ' + res.data.status);
            })
            .catch(err => {
                alert('Straddle 400: An error occured!');
            });
        axios
            .get('/api/bankNiftyClosesDailyStrangle/600')
            .then(res => {
                alert('Straddle 600: ' + res.data.status);
            })
            .catch(err => {
                alert('Straddle 600: An error occured!');
            });
        axios
            .get('/api/bankNiftyClosesDailyStrangle/800')
            .then(res => {
                alert('Straddle 800: ' + res.data.status);
            })
            .catch(err => {
                alert('Straddle 800: An error occured!');
            });
        axios
            .get('/api/bankNiftyClosesDailyStrangle/1000')
            .then(res => {
                alert('Straddle 1000: ' + res.data.status);
            })
            .catch(err => {
                alert('Straddle 1000: An error occured!');
            });
        axios
            .get('/api/bankNiftyClosesDailyStrangle/2000')
            .then(res => {
                alert('Straddle Opp 1000: ' + res.data.status);
            })
            .catch(err => {
                alert('Straddle Opp 1000: An error occured!');
            });

        document.querySelector('.marketClosesButton').style.backgroundColor = '#90c695';
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>projectO</div>
            <div className={styles.strategy}>
                <div>Short Strangle - Bank Nifty</div>
                <div className={styles.buttonsContainer}>
                    <div className={[styles.marketOpensClosesButtons, 'marketOpensButton'].join(' ')} onClick={bankNiftyOpens}>
                        Market Opens
                    </div>
                    <div className={[styles.marketOpensClosesButtons, 'marketClosesButton'].join(' ')} onClick={bankNiftyCloses}>
                        Market Closes
                    </div>
                </div>
            </div>
            {strikePrice && <div className={styles.strategy}>Strike Price: {strikePrice}</div>}
        </div>
    );
};

export default Home;
