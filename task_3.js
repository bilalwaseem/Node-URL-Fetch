// Note: there is no need for using flow library i.e. RSVP or Q
// as recent versions of node supports builtin async/await functionality
const express = require('express');
const hbs = require('hbs');
const urlToTitle = require('url-to-title');
const URLArrayMaker = require('./url_util');

const port = process.env.PORT || 3000;
const app = express();

//using handlebars as view engine
app.set('view engine', 'hbs');

console.log('Starting the server!');


app.get('/I/want/title/', (req, res) => {
    let addresses = URLArrayMaker.validator(req.query.address);
    console.log(addresses);

    //storing the pending resolved/reject promises in an array
    let promisesArray = [];
    for (let i = 0; i < addresses.length; i++) {
        promisesArray.push(getTitle(addresses[i]));
    }

    //resolves all the promises in the array
    Promise.all(promisesArray).then((titlesArray) => {
        console.log(titlesArray);
        res.render('index.hbs', {
            titles: titlesArray
        })
    }, (err) => {
        res.status(400).send(err);
    })

});

function getTitle(address) {
    return new Promise((resolve, reject) => {
        urlToTitle(address, (err, title) => {
            if (title) {
                resolve(title);
            }
            if (err) {
                //extracting the name from the URL
                resolve(address.slice(11, address.search('.com')) + ' - NO-RESPONSE');
            }
        });
    });
}


//for other routes
app.get('*', (req, res) => {
    res.status(404).send('<h1>404 Not Found!</h1>');
});

app.listen(port, () => {
    console.log(`Server is listening on port ${port}!`);
});
