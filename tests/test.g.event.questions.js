/* 
    Test the POST /event/:event_id/question end point and DELETE /question/:question_id end point
*/
const chai = require('chai')
const chaiHttp = require('chai-http')

const expect = chai.expect
chai.use(chaiHttp)

const path = require('path')
const filename = path.basename(__filename)

const good_user_data = require('./data/good_user_data.json')
// const good_post_data = require('./data/good_post_data.json')

const SERVER_URL = 'http://localhost:3333'
let SESSION_TOKEN_USER1 = ''
let SESSION_TOKEN_USER2 = ''
let SESSION_TOKEN_USER3 = ''

describe("Test asking question if not logged in", () => {
    before(() => {
        console.log('[Script: ' + filename + ']')
    })

    
    it('Should return 401', () => {
        return chai.request(SERVER_URL)
            .post('/event/1/question')
            .send({
                "question": "Whats the time mr wolf?"
            })
            .then((res) => {
                expect(res).to.have.status(401)
            })
            .catch((err) => {
                throw err
            })
    })
})

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

    it('Should return 403 - user 1 asking a question on event 1 as they are the creator', () => {
        return chai.request(SERVER_URL)
            .post('/event/1/question')
            .set('X-Authorization', SESSION_TOKEN_USER1)
            .send({
                "question": "How long is this event?"
            })
            .then((res) => {
                expect(res).to.have.status(403)
            })
            .catch((err) => {
                throw err
            })
    })

    it('Should return 403 - user 2 asking a question on event 4 as they are not registered', () => {
        return chai.request(SERVER_URL)
            .post('/event/4/question')
            .set('X-Authorization', SESSION_TOKEN_USER2)
            .send({
                "question": "How long is this event?"
            })
            .then((res) => {
                expect(res).to.have.status(403)
            })
            .catch((err) => {
                throw err
            })
    })

    it('Should return 200 - user 2 registering for event 4', () => {
        return chai.request(SERVER_URL)
            .post('/event/4')
            .set('X-Authorization', SESSION_TOKEN_USER2)
            .then((res) => {
                expect(res).to.have.status(200)
            })
            .catch((err) => {
                throw err
            })
    })

    it('Should return 201, with the question_id - user 2 asking a question on event 4 as they have now registered', () => {
        return chai.request(SERVER_URL)
            .post('/event/4/question')
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

    it('Should return 400 if question is empty', () => {
        return chai.request(SERVER_URL)
            .post('/event/4/question')
            .set('X-Authorization', SESSION_TOKEN_USER2)
            .send({
                "question": ""
            })
            .then((res) => {
                expect(res).to.have.status(400)
            })
            .catch((err) => {
                throw err
            })
    })

    it('Should return 400 if question is missing', () => {
        return chai.request(SERVER_URL)
            .post('/event/4/question')
            .set('X-Authorization', SESSION_TOKEN_USER2)
            .send({
            })
            .then((res) => {
                expect(res).to.have.status(400)
            })
            .catch((err) => {
                throw err
            })
    })

    it('Should return 400 if extra field is present', () => {
        return chai.request(SERVER_URL)
            .post('/event/4/question')
            .set('X-Authorization', SESSION_TOKEN_USER2)
            .send({
                "question": "Hello?",
                "extra": "field"
            })
            .then((res) => {
                expect(res).to.have.status(400)
            })
            .catch((err) => {
                throw err
            })
    })
})



describe("Test deleting a question if not logged in", () => {
    before(() => {
        console.log('[Script: ' + filename + ']')
    })

    
    it('Should return 401', () => {
        return chai.request(SERVER_URL)
            .delete('/question/1')
            .then((res) => {
                expect(res).to.have.status(401)
            })
            .catch((err) => {
                throw err
            })
    })
})

describe("Test deleting a question", () => {
    before(() => {
        console.log('[Script: ' + filename + ']')
    })

    
    it('Should return 403 - user 3 trying to delete question 1. They are not the author or event creator', () => {
        return chai.request(SERVER_URL)
            .delete('/question/1')
            .set('X-Authorization', SESSION_TOKEN_USER3)
            .then((res) => {
                expect(res).to.have.status(403)
            })
            .catch((err) => {
                throw err
            })
    })

    it('Should return 200 - user 1 trying to delete question 1. They are event creator', () => {
        return chai.request(SERVER_URL)
            .delete('/question/1')
            .set('X-Authorization', SESSION_TOKEN_USER1)
            .then((res) => {
                expect(res).to.have.status(200)
            })
            .catch((err) => {
                throw err
            })
    })

    it('Should return 404 - user 1 trying to delete question 1. It no longer exists', () => {
        return chai.request(SERVER_URL)
            .delete('/question/1')
            .set('X-Authorization', SESSION_TOKEN_USER1)
            .then((res) => {
                expect(res).to.have.status(404)
            })
            .catch((err) => {
                throw err
            })
    })

    it('Should return 200 - user 2 trying to delete question 2. They are the author.', () => {
        return chai.request(SERVER_URL)
            .delete('/question/2')
            .set('X-Authorization', SESSION_TOKEN_USER2)
            .then((res) => {
                expect(res).to.have.status(200)
            })
            .catch((err) => {
                throw err
            })
    })

    it('Should return 404 - user 2 trying to delete question 2. It no longer exists.', () => {
        return chai.request(SERVER_URL)
            .delete('/question/2')
            .set('X-Authorization', SESSION_TOKEN_USER2)
            .then((res) => {
                expect(res).to.have.status(404)
            })
            .catch((err) => {
                throw err
            })
    })
})

