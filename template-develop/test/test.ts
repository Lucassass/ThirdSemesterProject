import chai, { assert } from 'chai';
import chaiHttp from 'chai-http';
chai.use(chaiHttp);
const expect = chai.expect;
import request from 'supertest'; // dont removed, is being used but doesnt show.createTestAccount()

// @ts-ignore
//import forever from 'forever-monitor';
//import fc, {Arbitrary, AsyncCommand, emailAddress} from 'fast-check';

//1. signout

//https://www.chaijs.com/plugins/chai-http/

let agent = chai.request.agent('http://kubuntu.stream.stud-srv.sdu.dk');

describe('Authentication Service: GET /login', () => {
    it('Responds with 200 OK', () =>
        chai
            .request('http://kubuntu.stream.stud-srv.sdu.dk')
            .get('/service03/login/')
            .then((res) => {
                expect(res).to.have.status(200);
            })
            .catch((err) => {
                throw err;
            }));
    it('Serves HTML', () =>
        chai
            .request('http://kubuntu.stream.stud-srv.sdu.dk')
            .get('/service03/login/')
            .then((res) => {
                expect(res).to.be.html;
            })
            .catch((err) => {
                throw err;
            }));
});

describe('Authentication Service: POST /login', () => {
    it('Responds with 200 OK if credentials exist in database', () =>
        agent
            .post('/service01/login')
            .type('form')
            .send({ email: 'markusmunks@gmail.com', password: '123' })
            .then((res) => {
                expect(res).to.have.status(200);
            }));
    it('Sets cookies for authentication', () =>
        agent
            .post('/service01/login')
            .type('form')
            .send({ email: 'markusmunks@gmail.com', password: '123' })
            .set('Content-Type', 'application/json')
            .then((res) => {
                expect(res).to.have.cookie('authcookie');
                expect(res).to.have.cookie('refreshcookie');
            }));
    it("Responds with 401 Unauthorized if credentials don't exist in database", () =>
        agent
            .post('/service01/login')
            .type('form')
            .send({ email: 'ooga@booga.com', password: 'hunter123' })
            .then((res) => expect(res).to.have.status(401)));
});

describe('Authentication Service: POST /refresh', () => {
    it('Responds with 200 OK and sets cookies, if given a valid refresh token', () =>
        agent.post('/service01/refresh').then((res) => {
            expect(res).to.have.status(200);
            expect(res).to.have.cookie('authcookie');
            expect(res).to.have.cookie('refreshcookie');
        }));
    it('middleware rejects invalid refresh tokens, responding with 404 Unauthorized', () => {
        chai.request('http://kubuntu.stream.stud-srv.sdu.dk')
            .post('/service03/login/')
            .set('Cookie', 'refreshcookie=oogabooga; expires=Thu, 18 Dec 2022 12:00:00 UTC')
            .then((res) => expect(res).to.have.status(404));
    });
});

describe('Authentication Service: POST /logout', () => {
    it('Blacklists refreshtoken in database', () =>
        agent.post('/service01/logout').then((res) => expect(res).to.have.status(200)));
    it('Subsequent /refresh calls responds with 403', () =>
        agent.post('/service01/logout').then((res) => expect(res).to.have.status(403)));
    it('Deletes old cookies', () =>
        agent
            .post('/service01/login')
            .type('form')
            .send({ email: 'markusmunks@gmail.com', password: '123' })
            .set('Content-Type', 'application/json')
            .then((res) => {
                expect(res).to.have.cookie('authcookie');
                expect(res).to.have.cookie('refreshcookie');

                return agent.post('/service01/logout').then((res) => {
                    expect(res).to.have.cookie('authcookie');
                    expect(res).to.have.cookie('refreshcookie');
                });
            }));
});

describe('Mail service: POST /forgotPass', () => {
    it('Responds with true if email exists in database', () =>
        chai
            .request('http://kubuntu.stream.stud-srv.sdu.dk')
            .post('/service02/forgotPass')
            .type('form')
            .send({ email: 'markusmunks@gmail.com' })
            .set('Content-Type', 'application/json')
            .then((res) => {
                expect(res.body.isSent).to.equal(true, 'isSent');
            }));
    it('Responds with status code 200, even with a non-existing email', () =>
        chai
            .request('http://kubuntu.stream.stud-srv.sdu.dk')
            .post('/service02/forgotPass')
            .type('form')
            .send({ email: 'markusmunkssadadsasd@gmail.com' })
            .set('Content-Type', 'application/json')
            .then((res) => {
                expect(res).to.have.status(200);
                expect(res.body.isSent).to.equal(false, 'user isnt in the database');
            }));
    it('Responds with status code 200, even with a string that is not an email', () =>
        chai
            .request('http://kubuntu.stream.stud-srv.sdu.dk')
            .post('/service02/forgotPass')
            .type('form')
            .send({ email: 'This is not an email' })
            .set('Content-Type', 'application/json')
            .then((res) => {
                expect(res).to.have.status(200);
                expect(res.body.msg).to.equal('not a real Email', 'This is not an email');
            }));
    it('Responds with status code 304 when no data is POSTed', () =>
        chai
            .request('http://kubuntu.stream.stud-srv.sdu.dk')
            .post('/service02/forgotPass')
            .type('form')
            .set('Content-Type', 'application/json')
            .then((res) => {
                expect(res).to.have.status(304);
            }));
});

describe('Mail service: POST /reset', () => {
    it('Denies access, when no params is set in body', () => {
        chai.request('http://kubuntu.stream.stud-srv.sdu.dk')
            .post('/service02/reset')
            .set('Content-Type', 'application/json')
            .then((res) => {
                expect(res).to.have.status(200);
                expect(res.body.valid).to.equal(false, 'the user is unauthorized');
            });
    });
    it('Denies access, when wrong params is set in body', () => {
        chai.request('http://kubuntu.stream.stud-srv.sdu.dk')
            .post('/service02/reset')
            .set('Content-Type', 'application/json')
            .send({ params: 'This is random params' })
            .then((res) => {
                expect(res).to.have.status(200);
                expect(res.body.valid).to.equal(false, 'the user is unauthorized');
            });
    });
});

describe('Mail service: POST /resetPassword_form with bad mailtoken', () => {
    it('Rejects an invalid mailtoken', () => {
        chai.request('http://kubuntu.stream.stud-srv.sdu.dk')
            .post('/service02/resetPassword_form')
            .set('Cookie', 'mailtoken=29106901269016')
            .send({ password: 'thisIsMyNewPassword' })
            .then((res) => {
                expect(res).to.have.status(401);
            });
    });
    it('Rejects a POST without a mailtoken', () => {
        chai.request('http://kubuntu.stream.stud-srv.sdu.dk')
            .post('/service02/resetPassword_form')
            .send({ password: 'thisIsMyNewPassword' })
            .then((res) => {
                expect(res).to.have.status(406);
            });
    });
});

agent.close();
