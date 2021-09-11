import React, { useEffect } from 'react';
import styles from './home.module.css';
import axios from 'axios';

const Home = () => {
    useEffect(() => {
        axios.get('/api/wakeUp').then(res => {
            console.log(res);
        });
    }, []);

    const marketOpens = () => {
        axios
            .get('/api/marketOpensDailyStraddle')
            .then(res => {
                alert(res.data.status);
            })
            .catch(err => {
                alert('An error occured!');
            });
        axios
            .get('/api/marketOpensDailyStrangle')
            .then(res => {
                alert(res.data.status);
            })
            .catch(err => {
                alert('An error occured!');
            });
        axios
            .get('/api/marketOpensDailyStrangle1000')
            .then(res => {
                alert(res.data.status);
            })
            .catch(err => {
                alert('An error occured!');
            });

        document.querySelector('.marketOpensButton').style.backgroundColor = '#90c695';
    };

    const marketCloses = () => {
        axios
            .get('/api/marketClosesDailyStraddle')
            .then(res => {
                alert(res.data.status);
            })
            .catch(err => {
                alert('An error occured!');
            });
        axios
            .get('/api/marketClosesDailyStrangle')
            .then(res => {
                alert(res.data.status);
            })
            .catch(err => {
                alert('An error occured!');
            });
        axios
            .get('/api/marketClosesDailyStrangle1000')
            .then(res => {
                alert(res.data.status);
            })
            .catch(err => {
                alert('An error occured!');
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
