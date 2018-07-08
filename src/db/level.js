import level from 'level';
import { promisify } from 'util';

// Package to use the LevelDB file system key-value data store developed by Google.
// Includes leveldown (low-level bindings), levelup (high-level abstraction interface) and encoding-down (automatically
// return values as strings instead of default data buffer).
const client = level('./db');

function set(key, value) {
    client.put(key, value);
}

function get(key) {
    return client.get(key);
}

export { set, get };
