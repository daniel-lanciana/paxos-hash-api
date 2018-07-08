# Heroku Express.js with Babel Boilerplate

[![Dependencies Status](https://david-dm.org/daniel-lanciana/heroku-express-babel/status.svg)](https://david-dm.org/daniel-lanciana/heroku-express-babel)
[![Dev Dependencies Status](https://david-dm.org/daniel-lanciana/heroku-express-babel/dev-status.svg)](https://david-dm.org/daniel-lanciana/heroku-express-babel)
[![NSP Status](https://nodesecurity.io/orgs/daniel-lanciana/projects/505f74f1-0ff2-4ac0-98e1-441146324228/badge)](https://nodesecurity.io/orgs/daniel-lanciana/projects/505f74f1-0ff2-4ac0-98e1-441146324228)

Slightly more opinionated and less agnostic version of Vassilis Mastorostergios' [Express.js with Babel Boilerplate](https://github.com/vmasto/express-babel).

### Original Features:
- [Express.js](https://expressjs.com/) as the web framework
- ES2017+ support with [Babel](https://babeljs.io/)
- Automatic polyfill requires based on environment with [babel-preset-env](https://github.com/babel/babel-preset-env)
- Linting with [ESLint](http://eslint.org/)
- Testing with [Jest](https://facebook.github.io/jest/)

### Added Features:
- Node clustering concurrency (https://devcenter.heroku.com/articles/node-concurrency)
- Updated engines and all dependencies (current as of July 1, 2018)
- Logging with [Winston](https://github.com/winstonjs/winston) (custom format, rotating logs to disk)
- Security with [Helmet](https://github.com/helmetjs/helmet)
- NPM dev script clean builds before restarting (so changes take effect)
- Optional environment variables for server port, minimum log level, max log size and web concurrency

### Opinionated Features:
- Yarn instead of NPM
- Configured for deployment to Heroku
- Heroku node garbage collection strategy (https://devcenter.heroku.com/articles/node-best-practices), applied to package.json "start" script (instead of the Procfile) for consistency

### Getting Started

```sh
# Clone the project
git clone git@github.com:daniel-lanciana/heroku-express-babel.git
cd heroku-express-babel

# Make it your own
rm -rf .git && git init && npm init

# Install dependencies
yarn

# Build and start local server (server will restart when code changes)
yarn run dev

# Run tests (Jest runner and basic assertions, supertest API testing)
yarn test

# Run tests with coverage
yarn test --coverage

# Static code analysis (i.e. linting) using ESLint
yarn run lint
```

### Environmental Variables (Devlopment)

Rename `.env.example` to `.env` and add your environment variables. Powered by [dotenv](https://www.npmjs.com/package/dotenv).

Add Heroku environment variables via the web console.

### Deploy to Heroku

Either through the [command line](https://devcenter.heroku.com/articles/getting-started-with-nodejs#introduction) or create a Heroku app and connect to GitHub and deploy from the web console.

### License

MIT License. See the [LICENSE](LICENSE) file.
