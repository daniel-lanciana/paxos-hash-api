const WORKERS = process.env.WEB_CONCURRENCY || 1;

const throng = require('throng');

// Clustering concurrency
// https://devcenter.heroku.com/articles/node-concurrency
// https://github.com/hunterloftis/throng
throng({
    workers: WORKERS,
    start: start
});

function start() {
    var app = require('./app.js')();
}