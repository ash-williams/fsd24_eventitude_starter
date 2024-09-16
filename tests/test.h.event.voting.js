/* 
    Test the POST /question/:question_id/vote end point and the DELETE /question/:question_id/vote
*/
const chai = require('chai')
const chaiHttp = require('chai-http')

const expect = chai.expect
chai.use(chaiHttp)

const path = require('path')
const filename = path.basename(__filename)

const good_user_data = require('./data/good_user_data.json')

const SERVER_URL = 'http://localhost:3333'
let SESSION_TOKEN_USER1 = ''
let SESSION_TOKEN_USER2 = ''
let SESSION_TOKEN_USER3 = ''

describe("Log into account.", () => {

    before(() => {
        console.log("[Script: " + filename + "]")
    })

    it("Should return 200, and JSON with user_id and session_token", () => {
        return chai.request(SERVER_URL)
            .post("/login")
            .send({
                "email": good_user_data[0].email,
                "password": good_user_data[0].password
                })
            .then((res) => {
                expect(res).to.have.status(200)
                expect(res).to.be.json
                expect(res.body).to.have.property("user_id")
                expect(res.body).to.have.property("session_token")
                SESSION_TOKEN_USER1 = res.body.session_token
            })
            .catch((err) => {
                throw err
            })
    })

    it("Should return 200, and JSON with user_id and session_token", () => {
        return chai.request(SERVER_URL)
            .post("/login")
            .send({
                "email": good_user_data[1].email,
                "password": good_user_data[1].password
                })
            .then((res) => {
                expect(res).to.have.status(200)
                expect(res).to.be.json
                expect(res.body).to.have.property("user_id")
                expect(res.body).to.have.property("session_token")
                SESSION_TOKEN_USER2 = res.body.session_token
            })
            .catch((err) => {
                throw err
            })
    })

    it("Should return 200, and JSON with user_id and session_token", () => {
        return chai.request(SERVER_URL)
            .post("/login")
            .send({
                "email": good_user_data[2].email,
                "password": good_user_data[2].password
                })
            .then((res) => {
                expect(res).to.have.status(200)
                expect(res).to.be.json
                expect(res.body).to.have.property("user_id")
                expect(res.body).to.have.property("session_token")
                SESSION_TOKEN_USER3 = res.body.session_token
            })
            .catch((err) => {
                throw err
            })
    })
})

describe("Test asking questions if logged in", () => {
    before(() => {
        console.log('[Script: ' + filename + ']')
    })

    it('Should return 201, and JSON with the question_id of new question - user 2 asking a question on event 1 as they are already attending', () => {
        return chai.request(SERVER_URL)
            .post('/event/1/question')
            .set('X-Authorization', SESSION_TOKEN_USER2)
            .send({
                "question": "How long is this event?"
            })
            .then((res) => {
                expect(res).to.have.status(201)
                expect(res).to.be.json
                expect(res.body).to.have.property("question_id")
            })
            .catch((err) => {
                throw err
            })
    })

    it('Should return 201, and JSON with the question_id of new question - user 2 asking a question on event 1 as they are already attending', () => {
        return chai.request(SERVER_URL)
            .post('/event/1/question')
            .set('X-Authorization', SESSION_TOKEN_USER2)
            .send({
                "question": "How do I find this address?"
            })
            .then((res) => {
                expect(res).to.have.status(201)
                expect(res).to.be.json
                expect(res.body).to.have.property("question_id")
            })
            .catch((err) => {
                throw err
            })
    })
})


describe("Test voting on questions if not logged in", () => {
    before(() => {
        console.log('[Script: ' + filename + ']')
    })

    it('Should return 401 - upvoting', () => {
        return chai.request(SERVER_URL)
            .post('/question/3/vote')
            .then((res) => {
                expect(res).to.have.status(401)
            })
            .catch((err) => {
                throw err
            })
    })

    it('Should return 401 - downvoting', () => {
        return chai.request(SERVER_URL)
            .delete('/question/3/vote')
            .then((res) => {
                expect(res).to.have.status(401)
            })
            .catch((err) => {
                throw err
            })
    })
})

describe("Test voting on questions if logged in", () => {
    before(() => {
        console.log('[Script: ' + filename + ']')
    })

    it('Should return 200 - user1 upvoting on question 3', () => {
        return chai.request(SERVER_URL)
            .post('/question/3/vote')
            .set('X-Authorization', SESSION_TOKEN_USER1)
            .then((res) => {
                expect(res).to.have.status(200)
            })
            .catch((err) => {
                throw err
            })
    })

    it('Should return 200 - user2 downvoting on question 3', () => {
        return chai.request(SERVER_URL)
            .delete('/question/3/vote')
            .set('X-Authorization', SESSION_TOKEN_USER2)
            .then((res) => {
                expect(res).to.have.status(200)
            })
            .catch((err) => {
                throw err
            })
    })

    it('Should return 403 - user2 upvoting question 3 as they have already voted', () => {
        return chai.request(SERVER_URL)
            .post('/question/3/vote')
            .set('X-Authorization', SESSION_TOKEN_USER2)
            .then((res) => {
                expect(res).to.have.status(403)
            })
            .catch((err) => {
                throw err
            })
    })

    it('Should return 200 - user3 downvoting question 3', () => {
        return chai.request(SERVER_URL)
            .delete('/question/3/vote')
            .set('X-Authorization', SESSION_TOKEN_USER3)
            .then((res) => {
                expect(res).to.have.status(200)
            })
            .catch((err) => {
                throw err
            })
    })


    it('Should return 200 - checking event 1 details for question 3 presence and details (votes should be -1)', () => {
        return chai.request(SERVER_URL)
            .get('/event/1')
            .then((res) => {
                expect(res).to.have.status(200)
                expect(res).to.be.json
                expect(res.body).to.have.property("questions")
                expect(res.headers['content-type']).to.have.string('application/json');

                //If ordering correctly, question 3 should appear after question 4
                expect(res.body.questions[0].question_id).to.equal(4)
                expect(res.body.questions[1].question_id).to.equal(3)

                let questions = res.body.questions;
                let question = questions[1]; 
                // console.log(question)

                expect(questions.length).to.equal(2)
                expect(question).to.have.property("question_id")
                expect(question).to.have.property("question")
                expect(question).to.have.property("votes")
                expect(question).to.have.property("asked_by")
                expect(question.asked_by).to.have.property("user_id")
                expect(question.asked_by).to.have.property("first_name")
                expect(question.question_id).to.equal(3)
                expect(question.question).to.equal("How long is this event?")
                expect(question.votes).to.equal(-1)
                expect(question.asked_by.user_id).to.equal(2)
                expect(question.asked_by.first_name).to.equal("Jonie")
            })
            .catch((err) => {
                throw err
            })
    })
})