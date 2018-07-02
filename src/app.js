import express from 'express';
import path from 'path';
import routes from './routes';

// Morgan for HTTP request logging, Winston for application logging
import morgan from 'morgan';
import logger from './logger';
// Helmet for HTTP security headers, force HTTPS, and CSRF protection
import helmet from 'helmet';
// Populate req.body
import bodyParser from 'body-parser';
// Clustered Node apps
//import throng from 'throng';

const app = express();
const PORT = process.env.PORT || 8080;

// Security (https://expressjs.com/en/advanced/best-practice-security.html)
app.use(helmet());

// View engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'pug');

app.use(morgan('dev', {
  skip: () => app.get('env') === 'test'
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '../public')));

// Routes
app.use('/', routes);

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Error handler
app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  res
    .status(err.status || 500)
    .render('error', {
      message: err.message
    });
});

app.listen(PORT, () => logger.info(`Listening on port ${PORT}`));

export default app;



//
//const ENVIRONMENT = process.env.NODE_ENV || 'development';
//const PORT = process.env.PORT || 8080;
//const WORKERS = process.env.WEB_CONCURRENCY || 1;
//
////var app = function() {
////  return express()
////    // Security (https://expressjs.com/en/advanced/best-practice-security.html)
////    .use(helmet())
////    // View engine
////    .set('views', path.join(__dirname, '../views'))
////    .set('view engine', 'pug')
////    // Logging
////    .use(morgan('dev', {
////      skip: () => ENVIRONMENT === 'test'
////    }))
////    .use(bodyParser.json())
////    .use(bodyParser.urlencoded({ extended: false }))
////    .use(express.static(path.join(__dirname, '../public')))
////    .use('/', routes)
////    // Catch 404 and forward to error handler
////    .use((req, res, next) => {
////      const err = new Error('Not Found');
////      err.status = 404;
////      next(err);
////    })
////    // Error handler
////    .use((err, req, res, next) => { // eslint-disable-line no-unused-vars
////      res
////        .status(err.status || 500)
////        .render('error', {
////          message: err.message
////        });
////    })
////    .listen(PORT, () => logger.info(`Listening on port ${PORT}`));
////};
////
////// Clustering concurrency
////// https://devcenter.heroku.com/articles/node-concurrency
////// https://github.com/hunterloftis/throng
////throng({
////  workers: WORKERS,
////  start: app
////});
//
//export default app;
