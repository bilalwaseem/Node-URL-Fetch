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

    //calling the function using promises
    getTitleArray(addresses).then((titlesArray) => {
        console.log(titlesArray);
        res.render('index.hbs', {
            titles: titlesArray
        })
    }, (err) => {
        res.status(400).send(err);
    })

});

function getTitleArray(addresses) {
    let promisedArray = new Promise((resolve, reject) => {
        let titles = [];
        //iterating over every element of the array and then passing it to url fetch function using the promise flow structure
        //using counter for returning from the loop to resolve i.e. its exit condition
        let check = 0;
        for (let i = 0; i < addresses.length; i++) {
            urlToTitle(addresses[i], (err, title) => {
                if (title) {
                    titles.push(title);
                }
                if (err) {
                    //extracting the name from the URL
                    titles.push(addresses[i].slice(11, addresses[i].search('.com')) + ' - NO-RESPONSE');
                }
                if ((addresses.length - 1) === check) {
                    resolve(titles);
                }
                check++;
            });
        }
    });
    return promisedArray;
}

//for other routes
app.get('*', (req, res) => {
    res.status(404).send('<h1>404 Not Found!</h1>');
});

app.listen(port, () => {
    console.log(`Server is listening on port ${port}!`);
});
