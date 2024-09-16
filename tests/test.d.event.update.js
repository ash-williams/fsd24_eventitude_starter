/*
    Test the PATCH /event/:event_id
*/
const chai = require('chai')
const chaiHttp = require('chai-http')

const expect = chai.expect
chai.use(chaiHttp)

const path = require('path')
const filename = path.basename(__filename)

const good_user_data = require('./data/good_user_data.json')
const bad_event_data = require('./data/bad_event_data.json')
const good_event_data = require('./data/good_event_data.json')

const SERVER_URL = 'http://localhost:3333'
let SESSION_TOKEN_USER1 = ''
let SESSION_TOKEN_USER2 = ''

describe('Updating an event when not authenticated', () => {
    before(() => {
        console.log('[Script: ' + filename + ']')
    })

    it('Should return a 401', () => {
        return chai.request(SERVER_URL)
            .patch('/event/1')
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


describe('Test updating events when logged in which should not pass validation checks', () => {
    before(() => {
        console.log("[Script: " + filename + "]")
    })

    it('Should return 400 status code: extra field', () => {
        return chai.request(SERVER_URL)
            .patch('/event/1')
            .set('X-Authorization', SESSION_TOKEN_USER1)
            .send({
                "name": good_event_data[0].name,
                "description": good_event_data[0].description,
                "location": good_event_data[0].location,
                "start": good_event_data[0].start,
                "close_registration": good_event_data[0].close_registration,
                "max_attendees": good_event_data[0].max_attendees,
                "extra": "field"
            })
            .then((res) => {
                expect(res).to.have.status(400)
                expect(res).to.be.json
                expect(res.body).to.have.property('error_message')
            })
            .catch((err) => {
                throw err
            });
    });


    bad_event_data.forEach((event) => {
        it('Should return a 400 status code: ' + event.test_description, () => {
            return chai.request(SERVER_URL)
                .patch('/event/1')
                .set('X-Authorization', SESSION_TOKEN_USER1)
                .send({
                    "name": event.name,
                    "description": event.description,
                    "location": event.location,
                    "start": event.start,
                    "close_registration": event.close_registration,
                    "max_attendees": event.max_attendees
                })
                .then((res) => {
                    expect(res).to.have.status(400)
                    expect(res).to.be.json
                    expect(res.body).to.have.property('error_message')
                })
                .catch((err) => {
                    throw err
                })
        })
    })
})


describe('Test updating events when logged in which should pass validation checks', () => {
    before(() => {
        console.log("[Script: " + filename + "]")
    })

    it('Should return 200 status code: missing name', () => {
        return chai.request(SERVER_URL)
            .patch('/event/1')
            .set('X-Authorization', SESSION_TOKEN_USER1)
            .send({
                "description": good_event_data[0].description,
                "location": good_event_data[0].location,
                "start": good_event_data[0].start,
                "close_registration": good_event_data[0].close_registration,
                "max_attendees": good_event_data[0].max_attendees
            })
            .then((res) => {
                expect(res).to.have.status(200)
            })
            .catch((err) => {
                throw err
            });
    });

    it('Should return 200 status code: missing description', () => {
        return chai.request(SERVER_URL)
            .patch('/event/1')
            .set('X-Authorization', SESSION_TOKEN_USER1)
            .send({
                "name": good_event_data[0].name,
                "location": good_event_data[0].location,
                "start": good_event_data[0].start,
                "close_registration": good_event_data[0].close_registration,
                "max_attendees": good_event_data[0].max_attendees
            })
            .then((res) => {
                expect(res).to.have.status(200)
            })
            .catch((err) => {
                throw err
            });
    });

    it('Should return 200 status code: missing location', () => {
        return chai.request(SERVER_URL)
            .patch('/event/1')
            .set('X-Authorization', SESSION_TOKEN_USER1)
            .send({
                "description": good_event_data[0].description,
                "name": good_event_data[0].name,
                "start": good_event_data[0].start,
                "close_registration": good_event_data[0].close_registration,
                "max_attendees": good_event_data[0].max_attendees
            })
            .then((res) => {
                expect(res).to.have.status(200)
            })
            .catch((err) => {
                throw err
            });
    });

    it('Should return 200 status code: missing start', () => {
        return chai.request(SERVER_URL)
            .patch('/event/1')
            .set('X-Authorization', SESSION_TOKEN_USER1)
            .send({
                "description": good_event_data[0].description,
                "location": good_event_data[0].location,
                "name": good_event_data[0].name,
                "close_registration": good_event_data[0].close_registration,
                "max_attendees": good_event_data[0].max_attendees
            })
            .then((res) => {
                expect(res).to.have.status(200)
            })
            .catch((err) => {
                throw err
            });
    });

    it('Should return 200 status code: missing close_registration', () => {
        return chai.request(SERVER_URL)
            .patch('/event/1')
            .set('X-Authorization', SESSION_TOKEN_USER1)
            .send({
                "description": good_event_data[0].description,
                "location": good_event_data[0].location,
                "start": good_event_data[0].start,
                "name": good_event_data[0].name,
                "max_attendees": good_event_data[0].max_attendees
            })
            .then((res) => {
                expect(res).to.have.status(200)
            })
            .catch((err) => {
                throw err
            });
    });

    it('Should return 200 status code: missing max_attendees', () => {
        return chai.request(SERVER_URL)
            .patch('/event/1')
            .set('X-Authorization', SESSION_TOKEN_USER1)
            .send({
                "description": good_event_data[0].description,
                "location": good_event_data[0].location,
                "start": good_event_data[0].start,
                "close_registration": good_event_data[0].close_registration,
                "name": good_event_data[0].name
            })
            .then((res) => {
                expect(res).to.have.status(200)
            })
            .catch((err) => {
                throw err
            });
    });

    it('Should return 200 status code', () => {
        return chai.request(SERVER_URL)
            .patch('/event/1')
            .set('X-Authorization', SESSION_TOKEN_USER1)
            .send({
                "description": "New description",
                "max_attendees": 300
            })
            .then((res) => {
                expect(res).to.have.status(200)
            })
            .catch((err) => {
                throw err
            });
    });
});


describe('Test updating events when logged in which should fail', () => {
    before(() => {
        console.log("[Script: " + filename + "]")
    })

    it('Should return 404 status code for events that do not exist', () => {
        return chai.request(SERVER_URL)
            .patch('/event/1000')
            .set('X-Authorization', SESSION_TOKEN_USER1)
            .send({
                "description": "New description",
                "max_attendees": 300
            })
            .then((res) => {
                expect(res).to.have.status(404)
            })
            .catch((err) => {
                throw err
            });
    });

    it('Should return 403 if event was not created by the logged in user', () => {
        return chai.request(SERVER_URL)
            .patch('/event/1')
            .set('X-Authorization', SESSION_TOKEN_USER2)
            .send({"name": "Hello World"})
            .then((res) => {
                expect(res).to.have.status(403)
            })
            .catch((err) => {
                throw err
            })
    })
})


describe('Test checking updates actually appear in the database', () => {
    before(() => {
        console.log("[Script: " + filename + "]")
    })

    it('Should return 200 status code with the new event details', () => {
        return chai.request(SERVER_URL)
            .get('/event/1')
            .then((res) => {
                expect(res).to.have.status(200)
                expect(res).to.be.json
                expect(res.body).to.have.property('description')
                expect(res.body).to.have.property('max_attendees')
                expect(res.body.description).to.equal('New description')
                expect(res.body.max_attendees).to.equal(300)
            })
            .catch((err) => {
                throw err
            });
    });

})