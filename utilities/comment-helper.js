const helper = {};

helper.getTimestampUTC = () => {
    let standardTimeZone = new Date();
    let userTimeZone = new Date(
        standardTimeZone.getUTCFullYear(), 
        standardTimeZone.getUTCMonth(), 
        standardTimeZone.getUTCDate(), 
        standardTimeZone.getUTCHours(), 
        standardTimeZone.getUTCMinutes(), 
        standardTimeZone.getUTCSeconds());

    return Math.floor(userTimeZone.getTime() / 1000)
}

module.exports = helper;