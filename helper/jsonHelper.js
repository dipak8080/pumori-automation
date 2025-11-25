const fs = require('fs');
const path = require('path');

function updateMainCodeInfo(referenceNumber){
    // Use a different variable name for the file path
    const filePath = path.join(__dirname, '..', 'mainCodeInfo.json');

    // Read existing JSON
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    // Replace only the key
    data.referenceNo = referenceNumber;

    // Write back to file
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

module.exports = { updateMainCodeInfo };
