import request from 'supertest';
import async from 'async';
import app from '../src/app.js';

describe('/messages', () => {
    describe('when requesting all messages', () => {
        it('should return page not found', async () => {
            await request(app)
                .get('/messages')
                .expect(404);
        });
    });

    describe('when submitting with no message', () => {
        it('should return page not found', async () => {
            await request(app)
                .post('/messages')
                .expect(404);
        });
    });

    describe('when requesting a message that does not exist', () => {
        it('should return page not found', async () => {
            await request(app)
                .get('/messages/foo')
                .expect(404);
        });
    });

    describe('when posting a message', () => {
        it('should return the hash digest', async () => {
            await request(app)
                .post('/messages')
                .send({ message: 'foo' })
                .expect(200)
                .then(response => {
                    expect(response.type).toEqual('application/json');
                    expect(response.body.digest).toEqual('2C26B46B68FFC68FF99B453C1D30413413422D706483BFA0F98A5E886266E7AE');
                });
        });
    });

    it('should return previously hashed messages', function(done) {
        async.series([
            function(callback) {
                request(app)
                    .post('/messages')
                    .send({ message: 'foo' })
                    .expect(200)
                    .then(response => {
                        expect(response.type).toEqual('application/json');
                        expect(response.body.digest).toEqual('2C26B46B68FFC68FF99B453C1D30413413422D706483BFA0F98A5E886266E7AE');
                        // Next request
                        callback();
                    });
            },
            function(callback) {
                request(app)
                    .get('/messages/2C26B46B68FFC68FF99B453C1D30413413422D706483BFA0F98A5E886266E7AE')
                    .expect(200)
                    .then(response => {
                        expect(response.body.message).toEqual('foo');
                        // Next request
                        callback();
                    });
            }
        ], done);
    });
});