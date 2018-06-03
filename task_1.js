const express = require('express');
const hbs = require('hbs');
const urlToTitle = require('url-to-title');
const URLArrayMaker = require('./url_util');

const port = process.env.PORT || 3000;
const app = express();
app.set('view engine', 'hbs');

console.log('Starting the server!');


app.get('/I/want/title/', (req, res) => {
    let addresses = URLArrayMaker.validator(req.query.address);
    console.log(addresses);
    getTitleArray(addresses, (err, titlesArray) => {
        if (err) {
            res.status(400).send(err);
        } else {
            console.log(titlesArray);
            res.render('index.hbs', {
                titles: titlesArray
            })
        }
    })
});


function getTitleArray(addresses, callback) {
    let titles = [];

    addresses.forEach((urls, index) => {

        urlToTitle(urls, (err, title) => {
            if (title) {
                titles.push(title);
            }
            if (err) {
                titles.push(urls.slice(11, urls.search('.com')) + ' - NO RESPONSE');
            }
            if ((addresses.length - 1) === index) {
                callback(null, titles);
            }
        });
    });
}

app.get('*', (req, res) => {
    res.status(404).send('<h1>404 Not Found!</h1>');
});

app.listen(port, () => {
    console.log(`Server is listening on the port ${port}!`);
});
