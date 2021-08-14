import React, { useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
    useEffect(() => {
        axios
            .post(`https://ewmw.edelweiss.in/api/Market/optionchainguest`, {
                aTyp: 'OPTIDX',
                exp: '18 Aug 2021',
                uSym: 'BANKNIFTY'
            })
            .then(res => {
                console.log(res);
            });
    }, []);

    return <div>2Pac</div>;
}

export default App;
