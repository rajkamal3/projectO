import React from 'react';
import styles from './home.module.css';
import axios from 'axios';

const Home = () => {
    const marketOpens = () => {
        axios
            .get('/api/marketOpens')
            .then(res => {
                alert(res.data.status);
            })
            .catch(err => {
                alert('An error occured!');
            });
    };

    const marketCloses = () => {
        axios
            .get('/api/marketCloses')
            .then(res => {
                alert(res.data.status);
            })
            .catch(err => {
                alert('An error occured!');
            });
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>projectO</div>
            <div className={styles.strategy}>
                <div>9:15 AM SHORT STRADDLE</div>
                <div className={styles.buttonsContainer}>
                    <div className={styles.marketOpensClosesButtons} onClick={marketOpens}>
                        Market Opens
                    </div>
                    <div className={styles.marketOpensClosesButtons} onClick={marketCloses}>
                        Market Closes
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
