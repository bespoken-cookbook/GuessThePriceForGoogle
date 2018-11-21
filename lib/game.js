const getScore = function(userResponse, productPrice) {
    if (userResponse == productPrice) {
        return 1000;
    }

    let percentageDiff = (userResponse - productPrice)/productPrice;

    if (percentageDiff < 0) {
        percentageDiff = percentageDiff * -1;
    }

    if (percentageDiff <= 0.1) {
        return 800;
    }

    if (percentageDiff <= 0.3) {
        return 500;
    }

    return 0;
};

module.exports = {
    getScore: getScore
};