function referenceGenerator(){
    const date = new Date;
    const timeStamp = date.getFullYear();

    const randomNumber = Math.floor(Math.random()*900 + 100)

    return `BG-${timeStamp}-${randomNumber}`
}

module.exports = {referenceGenerator};