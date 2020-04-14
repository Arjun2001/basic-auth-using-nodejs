const request = require('supertest');
const { expect } = require('chai');
const db = require('../db/connection');

const users = db.get('users');

const app = require('../app');

describe('Auth - GET /', () => {
    it('should respond with a message', async () => {
    const response = await request(app)
        .get('/auth')
        .expect(200);
    expect(response.body.message).to.equal('Auth route works🔒🔏🔐🔓');
    });
});

describe('POST/ auth/signup', () => {
    before(async () => {
        await users.drop();
    });

    it('should require a username', async () => {
        const response = await request(app)
        .post('/auth/signup')
        .send({})
        .expect(422);
        expect(response.body.message).to.equal('child "username" fails because ["username" is required]');
    });
    it('should require a password', async () => {
        const response = await request(app)
        .post('/auth/signup')
        .send({ username: 'testuser' })
        .expect(422);
        expect(response.body.message).to.equal('child "password" fails because ["password" is required]');
    });
    it('should create a new user', async () => {
        const newUser = ({
            username: 'testuser',
            password: '1234567890',
        });
        const response = await request(app)
        .post('/auth/signup')
        .send(newUser)
        .expect(200);
    expect(response.body).to.have.property('token');
    });
    it('should not allow a user with existing username', async () => {
        const newUser = ({
            username: 'testuser',
            password: '1234567890',
        });
        const response = await request(app)
        .post('/auth/signup')
        .send(newUser)
        .expect(409);
    expect(response.body.message).to.equal('Username is taken');
    });
});

describe('POST/ auth/login', () => {
    it('should require a username', async () => {
        const response = await request(app)
        .post('/auth/login')
        .send({})
        .expect(422);
        expect(response.body.message).to.equal('Unable to Login');
    });
    it('should require a password', async () => {
        const response = await request(app)
        .post('/auth/login')
        .send({ username: 'testuser' })
        .expect(422);
        expect(response.body.message).to.equal('Unable to Login');
    });
    it('should only allow valid users to login', async () => {
        const newUser = ({
            username: 'testuser123',
            password: '1234567890123',
        });
        const response = await request(app)
        .post('/auth/login')
        .send(newUser)
        .expect(422);
    expect(response.body.message).to.equal('Unable to Login');
    });
    it('should only allow valid users to login', async () => {
        const newUser = ({
            username: 'testuser',
            password: '1234567890',
        });
        const response = await request(app)
        .post('/auth/login')
        .send(newUser)
        .expect(200);
    expect(response.body).to.have.property('token');
    });
});
