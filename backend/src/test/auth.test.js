const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');

chai.use(chaiHttp);
const expect = chai.expect;

describe('Auth APIs', () => {

    describe('POST /api/auth/register', () => {
        it('should register a new user', (done) => {
            chai.request(app)
                .post('/api/auth/register')
                .send({
                    name: 'Test User',
                    email: 'testuser@test.com',
                    password: 'test1234'
                })
                .end((err, res) => {
                    expect(res).to.have.status(201);
                    expect(res.body).to.have.property('message', 'User registered successfully!');
                    done();
                });
        });

        it('should not register with existing email', (done) => {
            chai.request(app)
                .post('/api/auth/register')
                .send({
                    name: 'Test User',
                    email: 'testuser@test.com',
                    password: 'test1234'
                })
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    expect(res.body).to.have.property('message', 'Email already registered!');
                    done();
                });
        });
    });

    describe('POST /api/auth/login', () => {
        it('should login successfully', (done) => {
            chai.request(app)
                .post('/api/auth/login')
                .send({
                    email: 'testuser@test.com',
                    password: 'test1234'
                })
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('token');
                    expect(res.body).to.have.property('message', 'Login successful!');
                    done();
                });
        });

        it('should not login with wrong password', (done) => {
            chai.request(app)
                .post('/api/auth/login')
                .send({
                    email: 'testuser@test.com',
                    password: 'wrongpassword'
                })
                .end((err, res) => {
                    expect(res).to.have.status(401);
                    expect(res.body).to.have.property('message', 'Invalid email or password!');
                    done();
                });
        });
    });
});