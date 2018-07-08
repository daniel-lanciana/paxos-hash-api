import redis from 'redis';
import { promisify } from 'util';

const client = redis.createClient(process.env.REDIS_URL);
const getAsync = promisify(client.get).bind(client);

function set(key, value) {
    client.set(key, value);
}

function get(key) {
    return getAsync(key);
}

export { set, get };

