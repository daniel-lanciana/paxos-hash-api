import { promisify } from 'util';

const hash = {};
const hashGet = (key, callback) => {
    callback(null, hash[key]);
};
const getAsync = promisify(hashGet);

function set(key, value) {
    hash[key] = value;
}

function get(key) {
    return getAsync(key);
}

export { set, get };
