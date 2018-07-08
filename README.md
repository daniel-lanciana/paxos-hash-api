# Paxos Hash API

Engineering challenge for [Paxos](https://www.paxos.com).

### Problem

Publish a small service on the web that has two endpoints:

1. `/messages` takes a message (a string) as a POST and returns the SHA256 hash digest
of that message (in hexadecimal format)
2. `/messages/<hash>` is a GET request that returns the original message. A request to a
non-existent <hash> should return a 404 error.

### Analysis

Ordering of requests is important as SHA256 hashing is a one-way operation (i.e. infeasible to reverse) -- therefore without use of pre-calculated seed digests we require a POST request before the subsequent GET request can be fulfilled.

### Design

- Express for a small and fast Node.js web application framework
- Boilerplate code optimized for deployment to Heroku and featuring:
  - ES6, yarn, tests, linting, clustering, logging, security and the latest dependencies (as of July 1, 2018) 
  - Link: [Heroku Express.js with Babel Boilerplate](https://github.com/daniel-lanciana/heroku-express-babel)
- TDD using Jest and SuperTest
- ES6 syntax
- Hash digest outputs are all uppercase -- however inputs are case-insensitive
- Pseudo-interface pattern (explicitly exporting named functions) allowing for simple swapping of concrete data store implementations (see _Branches_ below)
- Deployed to Heroku (see _Run_ below) with Papertrail logging and served over HTTPS

For simplicity, no:
  - Hash salt
  - Additional endpoints (e.g. delete message)
  - Detailed error responses (e.g. 400 bad request, JSON error messages)
  - Authorization or authentication (i.e. Passport)
  - API versioning (e.g. /v1/messages)
  - Response cache headers (e.g. never expires)

### Branches

Different data store implementations with tests. Split into branches for simplicity and non-pollution of dependencies.

##### master

- In-memory hash object
- Promisify get requests to conform to interface
- Advantages:
  - Simplest implementation
- Disadvantages:
  - Clustering not supported (as each process does not share memory)
  - Data storage limited to around 1.5Gb (Node hard memory limit)
  - Data lost on server restart (as no persistence)

##### db-level

- LevelDB on-disk key-value store
- [level](https://github.com/Level/level) module that bundles leveldown, levelup and decoding get operations from Buffer to String
- Asynchronous data store and retrieval
- Advantages:
  - Developed by Google and used in Chrome
  - Open source and active community
  - One of the fastest on-disk stores
  - No external service required
  - Works in a clustered environment (as file system shared between processes)
  - Data _may_ be persisted on server restart depending on the provider (unfortunately Heroku boots with a clean filesystem)
- Disadvantages:
  - Slower performance than in-memory data stores (due to I/O operations)
  - Data storage limited to file system size
  - Data lost if Heroku restarted (as filesystem is ephemeral)
  - No query language
  - Not optimized for clustering (as only one process can access the database at a time)

##### db-redis

- Redis in-memory store
- Promisify get requests to conform to interface
- Requires a REDIS_URL environment variable 
- [Redis-mock](https://github.com/faeldt/redis-mock) module used in tests
- Advantages:
  - Fast
  - Open source and active community
  - Distributed
  - Supports clustering (as an external service)
  - Free Heroku add-on with logging and metrics
  - Additional (paid) Heroku SQL-querying (Data Links) and low-latency failover (Premium)
- Disadvantages:
  - Replies on an external service
  - Cost to scale memory and connections (e.g. 1Gb store with max 1,000 connections for $200/month)
  - No in-built query language

### Run

Redis branch deployed to Heroku: https://paxos-hash-microservice.herokuapp.com/messages 

_Note: it may already contain hashed messages and may take 30 seconds to wake (free tier dynos go to sleep)._

or..

```sh
# Clone the project
git clone git@github.com:daniel-lanciana/paxos-hash-api.git
cd paxos-hash-api

# Install dependencies
yarn

# Run tests (optional)
yarn test

# Build and start local server
yarn run dev

# Open http://localhost:8080/messages
```

### Conclusion

Due to the type of operations (i.e. no querying, simple key/value storage) the best option is a resilient, scalable, supported in-memory data store. Redis is perfect for the job.

Potential bottlenecks:
 - High number of concurrent requests. **Solution**: Scale out horizontally with auto-scaling dynos. Caching responses.
 - High number of stored messages. **Solution**: Scale Redis vertically if costs allow, otherwise bring in-house (e.g. EC2 instances). In-house bring provisioning, monitoring, maintenance, security and scaling overheads.

In any case, swapping implementations requires minimal changes to the codebase.