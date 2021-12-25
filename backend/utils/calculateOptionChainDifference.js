const calculateOptionChainDifference = difference => {
    let optionChainDifference;

    switch (Number(difference)) {
        case 200:
            optionChainDifference = 1;
            break;
        case 400:
            optionChainDifference = 2;
            break;
        case 600:
            optionChainDifference = 3;
            break;
        case 800:
            optionChainDifference = 4;
            break;
        case 1000:
            optionChainDifference = 5;
            break;
        case 2000:
            optionChainDifference = '-5';
            break;
    }

    return optionChainDifference;
};

module.exports = { calculateOptionChainDifference };
