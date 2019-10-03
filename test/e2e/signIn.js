const request = require('supertest');
const utils = require('../utils');
const jwt = require('jsonwebtoken');

describe('users/signIn', () => {
    const customer = {
        name: 'Test Customer',
        email: `${utils.randomString()}@comingsoon.com`,
        contact: utils.randomNumber(),
        password: utils.randomString()
    };

    before('register new customer', (done) => {
        request(utils.BASE_URL)
            .post('/signUp')
            .send(customer)
            .set('Accept', 'application/json')
            .set('Version', '1.0.0')
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, result) => {
                console.log(result.body.response);
                done();
            });
    });

    it('login with incorrect password', (done) => {
        request(utils.BASE_URL)
            .post('/signIn')
            .send({
                email: customer.email,
                password: utils.randomString()
            })
            .set('Accept', 'application/json')
            .set('Version', '1.0.0')
            .expect('Content-Type', /json/)
            .expect(401)
            .end((err, result) => {
                console.log(result.body.response);
                done();
            });
    });

    it('login with incorrect email', (done) => {
        request(utils.BASE_URL)
            .post('/signIn')
            .send({
                email: utils.randomString(),
                password: customer.password
            })
            .set('Accept', 'application/json')
            .set('Version', '1.0.0')
            .expect('Content-Type', /json/)
            .expect(401)
            .end((err, result) => {
                console.log(result.body.response);
                done();
            });
    });

    it('login with incorrect request', (done) => {
        request(utils.BASE_URL)
            .get('/signIn')
            .send({
                email: customer.email,
                password: customer.password
            })
            .set('Accept', 'application/json')
            .set('Version', '1.0.0')
            .expect('Content-Type', /json/)
            .expect(405)
            .end((err, result) => {
                console.log(result.body.response);
                done();
            });
    });

    it('login with correct credentials', (done) => {
        request(utils.BASE_URL)
            .post('/signIn')
            .send({
                email: customer.email,
                password: customer.password
            })
            .set('Accept', 'application/json')
            .set('Version', '1.0.0')
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, result) => {
                console.log(result.body.response);
                done();
            });
    });
});