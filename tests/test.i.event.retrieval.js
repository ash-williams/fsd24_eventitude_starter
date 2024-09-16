/* 
    Test the GET /event/:event_id end point 
*/
const chai = require('chai')
const chaiHttp = require('chai-http')

const expect = chai.expect
chai.use(chaiHttp)

const path = require('path')
const filename = path.basename(__filename)

const good_user_data = require('./data/good_user_data.json')
const good_event_data = require('./data/good_event_data.json')

const SERVER_URL = 'http://localhost:3333'
let SESSION_TOKEN_USER1 = ''
let SESSION_TOKEN_USER2 = ''


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
})

describe("Getting details of event 1 when not authenticated.", () => {
    it("Should return 200, with correct details, but no attendees", () => {
        return chai.request(SERVER_URL)
            .get("/event/1")
            .then((res) => {
                expect(res).to.have.status(200)
                expect(res).to.be.json

                expect(res.body).to.have.property("event_id")
                expect(res.body.event_id).to.equal(1)
                expect(res.body).to.have.property("creator")

                expect(res.body.creator).to.have.property("creator_id")
                expect(res.body.creator).to.have.property("first_name")
                expect(res.body.creator).to.have.property("last_name")
                expect(res.body.creator).to.have.property("email")

                expect(res.body.creator.creator_id).to.equal(1)
                expect(res.body.creator.first_name).to.equal(good_user_data[0].first_name)
                expect(res.body.creator.last_name).to.equal(good_user_data[0].last_name)
                expect(res.body.creator.email).to.equal(good_user_data[0].email)

                expect(res.body).to.have.property("name")
                expect(res.body).to.have.property("description")
                expect(res.body).to.have.property("location")
                expect(res.body).to.have.property("start")
                expect(res.body).to.have.property("close_registration")
                expect(res.body).to.have.property("max_attendees")

                expect(res.body.name).to.equal(good_event_data[0].name)
                expect(res.body.description).to.equal("New description")
                expect(res.body.location).to.equal(good_event_data[0].location)
                expect(res.body.start).to.equal(Number(good_event_data[0].start))
                expect(res.body.close_registration).to.equal(Number(good_event_data[0].close_registration))
                expect(res.body.max_attendees).to.equal(300)

                expect(res.body).to.have.property("number_attending")
                expect(res.body.number_attending).to.equal(2)

                expect(res.body).to.not.have.property("attendees") // Only the creator can see the attendees

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


describe("Getting details of event 1 when logged in as user 2.", () => {
    it("Should return 200, with correct details, but no attendees", () => {
        return chai.request(SERVER_URL)
            .get("/event/1")
            .set('X-Authorization', SESSION_TOKEN_USER2)
            .then((res) => {
                expect(res).to.have.status(200)
                expect(res).to.be.json

                expect(res.body).to.have.property("event_id")
                expect(res.body.event_id).to.equal(1)
                expect(res.body).to.have.property("creator")

                expect(res.body.creator).to.have.property("creator_id")
                expect(res.body.creator).to.have.property("first_name")
                expect(res.body.creator).to.have.property("last_name")
                expect(res.body.creator).to.have.property("email")

                expect(res.body.creator.creator_id).to.equal(1)
                expect(res.body.creator.first_name).to.equal(good_user_data[0].first_name)
                expect(res.body.creator.last_name).to.equal(good_user_data[0].last_name)
                expect(res.body.creator.email).to.equal(good_user_data[0].email)

                expect(res.body).to.have.property("name")
                expect(res.body).to.have.property("description")
                expect(res.body).to.have.property("location")
                expect(res.body).to.have.property("start")
                expect(res.body).to.have.property("close_registration")
                expect(res.body).to.have.property("max_attendees")

                expect(res.body.name).to.equal(good_event_data[0].name)
                expect(res.body.description).to.equal("New description")
                expect(res.body.location).to.equal(good_event_data[0].location)
                expect(res.body.start).to.equal(Number(good_event_data[0].start))
                expect(res.body.close_registration).to.equal(Number(good_event_data[0].close_registration))
                expect(res.body.max_attendees).to.equal(300)

                expect(res.body).to.have.property("number_attending")
                expect(res.body.number_attending).to.equal(2)

                expect(res.body).to.not.have.property("attendees") // Only the creator can see the attendees

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


describe("Getting details of event 1 when logged in as user 1.", () => {
    it("Should return 200, with correct details, and also include the list of attendees", () => {
        return chai.request(SERVER_URL)
            .get("/event/1")
            .set('X-Authorization', SESSION_TOKEN_USER1)
            .then((res) => {
                expect(res).to.have.status(200)
                expect(res).to.be.json

                expect(res.body).to.have.property("event_id")
                expect(res.body.event_id).to.equal(1)
                expect(res.body).to.have.property("creator")

                expect(res.body.creator).to.have.property("creator_id")
                expect(res.body.creator).to.have.property("first_name")
                expect(res.body.creator).to.have.property("last_name")
                expect(res.body.creator).to.have.property("email")

                expect(res.body.creator.creator_id).to.equal(1)
                expect(res.body.creator.first_name).to.equal(good_user_data[0].first_name)
                expect(res.body.creator.last_name).to.equal(good_user_data[0].last_name)
                expect(res.body.creator.email).to.equal(good_user_data[0].email)

                expect(res.body).to.have.property("name")
                expect(res.body).to.have.property("description")
                expect(res.body).to.have.property("location")
                expect(res.body).to.have.property("start")
                expect(res.body).to.have.property("close_registration")
                expect(res.body).to.have.property("max_attendees")

                expect(res.body.name).to.equal(good_event_data[0].name)
                expect(res.body.description).to.equal("New description")
                expect(res.body.location).to.equal(good_event_data[0].location)
                expect(res.body.start).to.equal(Number(good_event_data[0].start))
                expect(res.body.close_registration).to.equal(Number(good_event_data[0].close_registration))
                expect(res.body.max_attendees).to.equal(300)

                expect(res.body).to.have.property("number_attending")
                expect(res.body.number_attending).to.equal(2)

                expect(res.body).to.have.property("attendees") // Only the creator can see the attendees
                expect(res.body.attendees.length).to.equal(2)
                expect(res.body.attendees[0]).to.have.property("user_id")
                expect(res.body.attendees[0]).to.have.property("first_name")
                expect(res.body.attendees[0]).to.have.property("last_name")
                expect(res.body.attendees[0]).to.have.property("email")

                expect(res.body.attendees[0].user_id).to.equal(1)
                expect(res.body.attendees[0].first_name).to.equal(good_user_data[0].first_name)
                expect(res.body.attendees[0].last_name).to.equal(good_user_data[0].last_name)
                expect(res.body.attendees[0].email).to.equal(good_user_data[0].email)

                expect(res.body.attendees[1].user_id).to.equal(2)
                expect(res.body.attendees[1].first_name).to.equal(good_user_data[1].first_name)
                expect(res.body.attendees[1].last_name).to.equal(good_user_data[1].last_name)
                expect(res.body.attendees[1].email).to.equal(good_user_data[1].email)

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

describe("Getting details of event that does not exist", () => {
    it("Should return 404", () => {
        return chai.request(SERVER_URL)
            .get("/event/1000")
            .then((res) => {
                expect(res).to.have.status(404)
            })
    })
})