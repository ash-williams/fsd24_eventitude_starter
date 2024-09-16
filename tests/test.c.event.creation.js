/*
    Test the POST /events endpoint
*/
const chai = require("chai");
const chaiHttp = require("chai-http")

const expect = chai.expect
chai.use(chaiHttp)

const path = require('path')
const filename = path.basename(__filename)

const SERVER_URL = 'http://localhost:3333'

const good_user_data = require('./data/good_user_data.json');
const good_event_data = require('./data/good_event_data.json');
const bad_event_data = require('./data/bad_event_data.json');

let SESSION_TOKEN = ''

describe("Test adding events if not logged in", () => {
    before(() => {
        console.log('[Script: ' + filename + ']')
    })

    good_event_data.forEach((event) => {
        it('Should return 401', () => {
            return chai.request(SERVER_URL)
                .post('/events')
                .send({
                    "name": event.name,
                    "description": event.description,
                    "location": event.location,
                    "start": event.start,
                    "close_registration": event.close_registration,
                    "max_attendees": event.max_attendees
                })
                .then((res) => {
                    expect(res).to.have.status(401)
                })
                .catch((err) => {
                    throw err
                })
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
                SESSION_TOKEN = res.body.session_token
            })
            .catch((err) => {
                throw err
            })
    })
})


describe('Test successful creation of events when logged in', () => {
    before(() => {
        console.log("[Script: " + filename + "]")
    })

    good_event_data.forEach((event) => {
        it('Should return 201, and JSON with event_id of new event: ' + event.name, () => {
            return chai.request(SERVER_URL)
                .post("/events")
                .set('X-Authorization', SESSION_TOKEN)
                .send({
                    "name": event.name,
                    "description": event.description,
                    "location": event.location,
                    "start": event.start,
                    "close_registration": event.close_registration,
                    "max_attendees": event.max_attendees
                })
                .then((res) => {
                    expect(res).to.have.status(201)
                    expect(res).to.be.json
                    expect(res.body).to.have.property("event_id")
                })
                .catch((err) => {
                    throw err
                })
        })
    })
})



describe('Test creation of events when logged in which should not pass validation checks', () => {
    before(() => {
        console.log("[Script: " + filename + "]")
    })

    it('Should return 400 status code: missing name', () => {
        return chai.request(SERVER_URL)
            .post('/events')
            .set('X-Authorization', SESSION_TOKEN)
            .send({
                "description": good_event_data[0].description,
                "location": good_event_data[0].location,
                "start": good_event_data[0].start,
                "close_registration": good_event_data[0].close_registration,
                "max_attendees": good_event_data[0].max_attendees
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

    it('Should return 400 status code: missing description', () => {
        return chai.request(SERVER_URL)
            .post('/events')
            .set('X-Authorization', SESSION_TOKEN)
            .send({
                "name": good_event_data[0].name,
                "location": good_event_data[0].location,
                "start": good_event_data[0].start,
                "close_registration": good_event_data[0].close_registration,
                "max_attendees": good_event_data[0].max_attendees
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

    it('Should return 400 status code: missing location', () => {
        return chai.request(SERVER_URL)
            .post('/events')
            .set('X-Authorization', SESSION_TOKEN)
            .send({
                "description": good_event_data[0].description,
                "name": good_event_data[0].name,
                "start": good_event_data[0].start,
                "close_registration": good_event_data[0].close_registration,
                "max_attendees": good_event_data[0].max_attendees
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

    it('Should return 400 status code: missing start', () => {
        return chai.request(SERVER_URL)
            .post('/events')
            .set('X-Authorization', SESSION_TOKEN)
            .send({
                "description": good_event_data[0].description,
                "location": good_event_data[0].location,
                "name": good_event_data[0].name,
                "close_registration": good_event_data[0].close_registration,
                "max_attendees": good_event_data[0].max_attendees
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

    it('Should return 400 status code: missing close_registration', () => {
        return chai.request(SERVER_URL)
            .post('/events')
            .set('X-Authorization', SESSION_TOKEN)
            .send({
                "description": good_event_data[0].description,
                "location": good_event_data[0].location,
                "start": good_event_data[0].start,
                "name": good_event_data[0].name,
                "max_attendees": good_event_data[0].max_attendees
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

    it('Should return 400 status code: missing max_attendees', () => {
        return chai.request(SERVER_URL)
            .post('/events')
            .set('X-Authorization', SESSION_TOKEN)
            .send({
                "description": good_event_data[0].description,
                "location": good_event_data[0].location,
                "start": good_event_data[0].start,
                "close_registration": good_event_data[0].close_registration,
                "name": good_event_data[0].name
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

    it('Should return 400 status code: extra field', () => {
        return chai.request(SERVER_URL)
            .post('/events')
            .set('X-Authorization', SESSION_TOKEN)
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
                .post('/events')
                .set('X-Authorization', SESSION_TOKEN)
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