let validator = (addresses) => {
    //check to see a single address in string if so, converting to array
    if (!Array.isArray(addresses)) {
        addresses = [addresses];
    }

    //checking if http and www are attached or not and then handling it
    for (let i = 0; i < addresses.length; i++) {
        if (!addresses[i].includes('http://')) {
            addresses[i] = 'http://' + addresses[i];
        }
        if (!addresses[i].includes('www.')) {
            console.log(addresses[i].search('http://'));
            addresses[i] = addresses[i].slice(0, 7) + 'www.' + addresses[i].slice(7);
        }
    }
    return addresses;
};

module.exports = {validator};