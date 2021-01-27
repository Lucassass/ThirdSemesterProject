import chai, { assert } from 'chai';
import chaiHttp from 'chai-http';
chai.use(chaiHttp);
const expect = chai.expect;
import request from 'supertest'; // dont removed, is being used but doesnt show.createTestAccount()
import { resolveProjectReferencePath } from 'typescript';

// @ts-ignore
//import forever from 'forever-monitor';
//import fc, {Arbitrary, AsyncCommand, emailAddress} from 'fast-check';

//1. signout

//https://www.chaijs.com/plugins/chai-http/

let agent = chai.request.agent('http://kubuntu.stream.stud-srv.sdu.dk');
describe('Test AR 1', () => {
    let paramsSend = '';

    it('POST email on /forgotPass, Responds with true if email exists in database', () =>
        chai
            .request('http://kubuntu.stream.stud-srv.sdu.dk')
            .post('/service02/forgotPass')
            .set('Content-Type', 'application/json')
            .send({ email: 'markusmunks@gmail.com' })
            .then((res) => {
                expect(res).to.have.status(200);
                expect(res.body.isSent).to.equal(true, 'isSent');
                expect(res.body.params).to.not.be.undefined;
                paramsSend = res.body.params;
            }));
    it('Should confirm access to reset password, and changes password', () => {
        agent.get(`/service03/reset?${paramsSend}`).then((res) => {
            expect(res).to.redirect;
            return agent
                .post(`/service02/resetPassword_form`)
                .set('Content-Type', 'application/json')
                .send({ password: 'somePass1' })
                .then((res) => {
                    expect(res).to.have.status(201);
                    expect(res.body.success).to.equal(true, 'success');
                });
        });
    });

    it('POST /login to confirm new password, and sets cookies for authentication', () => {
        chai.request('http://kubuntu.stream.stud-srv.sdu.dk')
            .post('/service01/login')
            .set('Content-Type', 'application/json')
            .send({ email: 'markusmunks@gmail.com', password: 'somePass1' })
            .then((res) => {
                expect(res).to.have.status(200);
                expect(res).to.have.cookie('authcookie');
                expect(res).to.have.cookie('refreshcookie');
            });
    });

    /*
    it('The redirection', () => {
        agent
            .post(`/service02/resetPassword_form`)
            .set('Content-Type', 'application/json')
            .send({ password: 'somePassword' })
            .then((res) => {
                expect(res).to.have.status(201);
            });
    });
    */
});
