const chai = require('chai');
const expect = require('chai').expect;
const chaiHttp = require('chai-http');

chai.use(chaiHttp);

const app = require('../index.js');

describe('Endpoint /api/register', function() {
    this.timeout(5000);
    // POST - register students
    it('should add students to db', function() {
        return chai.request(app)
            .post('/api/register')
            .send({
                teacher: 'teacherjoe@gmail.com',
                students:
                    [
                        'studenttan@example.com'
                    ]
            })
            .then(function(res) {
                expect(res).to.have.status(204);
            });
    });

    // POST - teacher does not exist in system
    it('should return bad request', function() {
        return chai.request(app)
            .post('/api/register')
            .send({
                teacher: 'teacherong@gmail.com',
                students:
                    [
                        'studenttan@example.com'
                    ]
            })
            .then(function(res) {
                throw res;
            })
            .catch(function(err) {
                expect(err).to.have.status(400);
            });
    });

    // POST - wrong type
    it('should return bad request for type', function() {
        return chai.request(app)
            .post('/api/register')
            .type('form')
            .send({
                teacher: 'teacherjoe@gmail.com',
                students:
                    [
                        'studenttan@example.com'
                    ]
            })
            .then(function(res) {
                throw res;
            })
            .catch(function(err) {
                expect(err).to.have.status(400);
            });
    });
})
