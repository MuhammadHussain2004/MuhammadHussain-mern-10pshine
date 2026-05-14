const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');

chai.use(chaiHttp);
const expect = chai.expect;

let token = '';
let noteId = '';

describe('Notes APIs', () => {
    before((done) => {
        chai.request(app)
            .post('/api/auth/login')
            .send({
                email: 'mhkplayer14@gmail.com',
                password: '10pshine@1234'
            })
            .end((err, res) => {
                token = res.body.token;
                done();
            });
    });

    describe('POST /api/notes', () => {
        it('should create a new note', (done) => {
            chai.request(app)
                .post('/api/notes')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    title: 'Test Note',
                    content: 'Test Content'
                })
                .end((err, res) => {
                    expect(res).to.have.status(201);
                    expect(res.body).to.have.property('message', 'Note created successfully!');
                    noteId = res.body.noteId;
                    done();
                });
        });
    });

    describe('GET /api/notes', () => {
        it('should get all notes', (done) => {
            chai.request(app)
                .get('/api/notes')
                .set('Authorization', `Bearer ${token}`)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('notes');
                    expect(res.body.notes).to.be.an('array');
                    done();
                });
        });
    });

    describe('PUT /api/notes/:id', () => {
        it('should update a note', (done) => {
            chai.request(app)
                .put(`/api/notes/${noteId}`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    title: 'Updated Note',
                    content: 'Updated Content'
                })
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('message', 'Note updated successfully!');
                    done();
                });
        });
    });

    describe('DELETE /api/notes/:id', () => {
        it('should delete a note', (done) => {
            chai.request(app)
                .delete(`/api/notes/${noteId}`)
                .set('Authorization', `Bearer ${token}`)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('message', 'Note deleted successfully!');
                    done();
                });
        });
    });
});