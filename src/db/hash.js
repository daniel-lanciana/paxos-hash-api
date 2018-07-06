const hash = {};

function set(key, value) {
    hash[key] = value;
}

function get(key) {
    return hash[key];
}

export { set, get };
