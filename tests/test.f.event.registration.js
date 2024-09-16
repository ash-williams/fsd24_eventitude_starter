/*
    Test the POST /event/:event_id - Registering for an event
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

describe('Registering for an event when not authenticated', () => {
    before(() => {
        console.log('[Script: ' + filename + ']')
    })

    it('Should return a 401', () => {
        return chai.request(SERVER_URL)
            .post('/event/1')
            .then((res) => {
                expect(res).to.have.status(401)
            })
            .catch((err) => {
                throw err
            })
    })
})


describe('Log into user account', () => {
    before(() => {
        console.log('[Script: ' + filename + ']')
    })

    it('Should return 200, and JSON with user_id and session_token of the user', () => {
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

    it('Should return 200, and JSON with user_id and session_token of the user', () => {
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
})

describe('Registering for an event when authenticated', () => {
    before(() => {
        console.log('[Script: ' + filename + ']')
    })

    it('Should return a 200 - User 2 registering to attend event 1', () => {
        return chai.request(SERVER_URL)
            .post('/event/1')
            .set('X-Authorization', SESSION_TOKEN_USER2)
            .then((res) => {
                expect(res).to.have.status(200)
            })
            .catch((err) => {
                throw err
            })
    })

    it('Should return a 403 - User 1 registering to attend event 1, as they are the creator', () => {
        return chai.request(SERVER_URL)
            .post('/event/1')
            .set('X-Authorization', SESSION_TOKEN_USER1)
            .then((res) => {
                expect(res).to.have.status(403)
                expect(res).to.be.json
                expect(res.body).to.have.property("error_message")
                expect(res.body.error_message).to.equal("You are already registered")
            })
            .catch((err) => {
                throw err
            })
    })

    it('Should return a 403 - User 2 registering to attend event 1, as they are already registered', () => {
        return chai.request(SERVER_URL)
            .post('/event/1')
            .set('X-Authorization', SESSION_TOKEN_USER2)
            .then((res) => {
                expect(res).to.have.status(403)
                expect(res).to.be.json
                expect(res.body).to.have.property("error_message")
                expect(res.body.error_message).to.equal("You are already registered")
            })
            .catch((err) => {
                throw err
            })
    })

    it('Should return a 403 - User 2 registering to attend event 2, as it was archieved in a previous test', () => {
        return chai.request(SERVER_URL)
            .post('/event/2')
            .set('X-Authorization', SESSION_TOKEN_USER2)
            .then((res) => {
                expect(res).to.have.status(403)
                expect(res).to.be.json
                expect(res.body).to.have.property("error_message")
                expect(res.body.error_message).to.equal("Registration is closed")
            })
            .catch((err) => {
                throw err
            })
    })

    it('Should return a 404 - User 2 registering to attend event 1000, as it does not exist', () => {
        return chai.request(SERVER_URL)
            .post('/event/1000')
            .set('X-Authorization', SESSION_TOKEN_USER2)
            .then((res) => {
                expect(res).to.have.status(404)
            })
            .catch((err) => {
                throw err
            })
    })
})


describe('Registering for an event at max capacity', () => {
    before(() => {
        console.log('[Script: ' + filename + ']')
    })

    it('Should return a 200 - Updating max_attendees of event 3', () => {
        return chai.request(SERVER_URL)
            .patch('/event/3')
            .set('X-Authorization', SESSION_TOKEN_USER1)
            .send({"max_attendees": 1})
            .then((res) => {
                expect(res).to.have.status(200)
            })
            .catch((err) => {
                throw err
            })
    })

    it('Should return a 403 - User 2 registering to attend event 3, as it is at capacity', () => {
        return chai.request(SERVER_URL)
            .post('/event/3')
            .set('X-Authorization', SESSION_TOKEN_USER2)
            .then((res) => {
                expect(res).to.have.status(403)
                expect(res).to.be.json
                expect(res.body).to.have.property("error_message")
                expect(res.body.error_message).to.equal("Event is at capacity")
            })
            .catch((err) => {
                throw err
            })
    })

})