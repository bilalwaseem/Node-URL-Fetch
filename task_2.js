const express = require('express');
const hbs = require('hbs');
const urlToTitle = require('url-to-title');
const URLArrayMaker = require('./url_util');
const async = require("async");

const port = process.env.PORT || 3000;
const app = express();

//using handlebars as view engine
app.set('view engine', 'hbs');

console.log('Starting the server!');

//making the callback function async as there is an async function called in it
app.get('/I/want/title/', (req, res) => {
    let addresses = URLArrayMaker.validator(req.query.address);
    console.log(addresses);

    //using async.each method which asynchronously iterates the passed array during which we can pass the array element
    //into async functions which can be ensured to be completed by calling the callback
    let titlesArray = [];
    async.each(addresses, (address, callback) => {
        urlToTitle(address, (err, title) => {
            if (title) {
                titlesArray.push(title);
                callback();
            }
            if (err) {
                //extracting the name from the URL
                titlesArray.push(address.slice(11, address.search('.com')) + ' - NO RESPONSE');
                callback();
            }
        });

    }, (err) => {
        if (err) {
            res.status(400).send(err);
        }
        else {
            console.log(titlesArray);
            res.render('index.hbs', {
                titles: titlesArray
            });
        }

    });
});

//for other routes
app.get('*', (req, res) => {
    res.status(404).send('<h1>404 Not Found!</h1>');
});

app.listen(port, () => {
    console.log(`Server is listening on the port ${port}!`);
});
