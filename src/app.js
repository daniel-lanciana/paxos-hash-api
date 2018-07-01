import express from 'express';
import path from 'path';

// Morgan for HTTP request logging, Winston for application logging
import morgan from 'morgan';
import logger from './logger';

import bodyParser from 'body-parser';
import helmet from 'helmet';
import forceHttps from 'express-force-https';
import csurf from 'csurf';

import routes from './routes';

const app = express();
const PORT = process.env.PORT || 8080;

// Security (https://expressjs.com/en/advanced/best-practice-security.html)
app.use(helmet());
app.use(forceHttps);
app.use(csurf);

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
