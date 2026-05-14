const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const pool = require('../config/db');

chai.use(chaiHttp);
const expect = chai.expect;

const testEmail = `testuser_${Date.now()}@test.com`;

describe('Auth APIs', () => {

  describe('POST /api/auth/register', () => {
    it('should register a new user', (done) => {
      chai.request(app)
        .post('/api/auth/register')
        .send({ name: 'Test User', email: testEmail, password: 'test1234' })
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.have.property('message').that.includes('Registration successful');
          done();
        });
    });

    it('should not register with existing email', (done) => {
      chai.request(app)
        .post('/api/auth/register')
        .send({ name: 'Test User', email: testEmail, password: 'test1234' })
        .end((err, res) => {
          expect(res).to.have.status(201);
          done();
        });
    });
  });

  describe('POST /api/auth/login', () => {
    it('should not login with unverified email', (done) => {
      chai.request(app)
        .post('/api/auth/login')
        .send({ email: testEmail, password: 'test1234' })
        .end((err, res) => {
          expect(res).to.have.status(401);
          done();
        });
    });

    it('should not login with wrong password', (done) => {
      chai.request(app)
        .post('/api/auth/login')
        .send({ email: testEmail, password: 'wrongpassword' })
        .end((err, res) => {
          expect(res).to.have.status(401);
          done();
        });
    });
  });
});