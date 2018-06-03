const express = require('express');
const hbs = require('hbs');
const urlToTitle = require('url-to-title');

const port = process.env.PORT || 3000;
const app = express();
app.set('view engine', 'hbs');

console.log('Starting the server!');


app.get('/I/want/title/', (req, res) => {
    let addresses = req.query.address;

    if (!Array.isArray(addresses)) {
        addresses = [addresses];
    }


    for (var i = 0; i < addresses.length; i++) {
        if (!addresses[i].includes('http://')) {
            addresses[i] = 'http://' + addresses[i];
        }
        if (!addresses[i].includes('www.')) {
            console.log(addresses[i].search('http://'));
            addresses[i] = addresses[i].slice(0, 7) + 'www.' + addresses[i].slice(7);
        }
    }
    console.log(addresses);

    getTitleArray(addresses).then((titlesArray) => {
        console.log("Title :", titlesArray);
        res.render('index.hbs', {
            titles: titlesArray
        })
    }, (err)=> {
        res.status(400).send(err);
    })
    
});

function getTitleArray(addresses) {
    var promise = new Promise((resolve, reject) => {
        var titles = [];
        addresses.forEach((urls, index) => {
            urlToTitle(urls, (err, title) => {
                if (title) {
                    titles.push(title);
                }
                if (err) {
                    titles.push(urls.slice(11, urls.search('.com')) + ' - NO-RESPONSE');
                }
                if ((addresses.length - 1) === index) {
                    resolve(titles);
                }
            });
        });
    });
    return promise;
};

app.get('*', (req, res) => {
    res.status(404).send('<h1>404 Not Found!</h1>');
});

app.listen(port, () => {
    console.log(`Server is listening on port ${port}!`);
});
