const generateReferralCode = (name) =>{
    const randomNum = Math.floor(1000 + Math.random() * 9000); // Generates a 4-digit random number
    const namePart = name.replace(/\s+/g, '').toUpperCase(); // Removes spaces and converts to uppercase
    return `${namePart}${randomNum}`;
}

module.exports = generateReferralCode