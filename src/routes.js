import { Router } from 'express';
import crypto from 'crypto';

const routes = Router();
const HASH_ALGORITHM = 'sha256';
const HASH_OUTPUT_FORMAT = 'hex';
const foo = {};

routes.post('/messages', (req, res) => {
    // SHA256 hex representation is case insensitive, but we always want to return uppercase
    const digest = crypto.createHash(HASH_ALGORITHM)
        .update(req.body.message)
        .digest(HASH_OUTPUT_FORMAT)
        .toUpperCase();

    foo[digest] = req.body.message;

    res.send({ digest: digest });
});

routes.get('/messages/:digest', (req, res) => {
    const message = foo[req.params.digest];
    message ? res.send({ message: message }) : res.send(404);
});

export default routes;
