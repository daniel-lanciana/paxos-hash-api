import logger from './logger';
import { Router } from 'express';
import crypto from 'crypto';
import * as db from './db/level';

const routes = Router();
const HASH_ALGORITHM = 'sha256';
const HASH_OUTPUT_FORMAT = 'hex';

routes.post('/messages', (req, res) => {
    // SHA256 hex representation is case insensitive, but we always want to return uppercase
    const digest = crypto.createHash(HASH_ALGORITHM)
        .update(req.body.message)
        .digest(HASH_OUTPUT_FORMAT)
        .toUpperCase();

    db.set(digest, req.body.message);
    res.send({ digest: digest });
});

routes.get('/messages/:digest', (req, res) => {
    db.get(req.params.digest.toUpperCase())
        .then((message) => {
            message ? res.send({ message: message }) : res.send(404);
        })
        .catch((error) => {
            logger.error(error.message);
            res.send(404);
        });
});

export default routes;
