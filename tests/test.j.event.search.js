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

describe("Searching with no criteria, and no authentication, to test pagination.", () => {
    it("Should return 200, with an array of 20 objects", () => {
        return chai.request(SERVER_URL)
            .get("/search")
            .then((res) => {
                expect(res).to.have.status(200)
                expect(res.body.length).to.equal(20)
            })
            .catch((err) => {
                throw err
            })
    })

    it("Should return 200, with an array of 20 objects when offsetting by 20", () => {
        return chai.request(SERVER_URL)
            .get("/search?offset=20")
            .then((res) => {
                expect(res).to.have.status(200)
                expect(res.body.length).to.equal(20)
            })
            .catch((err) => {
                throw err
            })
    })

    it("Should return 200, with an array of 10 objects when offsetting by 40", () => {
        return chai.request(SERVER_URL)
            .get("/search?offset=40")
            .then((res) => {
                expect(res).to.have.status(200)
                expect(res.body.length).to.equal(10)
            })
            .catch((err) => {
                throw err
            })
    })

    it("Should return 200, with an array of 5 objects when limiting to 5", () => {
        return chai.request(SERVER_URL)
            .get("/search?limit=5")
            .then((res) => {
                expect(res).to.have.status(200)
                expect(res.body.length).to.equal(5)
            })
            .catch((err) => {
                throw err
            })
    })

    it("Should return 200, with an array of 0 objects when limiting to 5 and offsetting by 50", () => {
        return chai.request(SERVER_URL)
            .get("/search?limit=5&offset=50")
            .then((res) => {
                expect(res).to.have.status(200)
                expect(res.body.length).to.equal(0)
            })
            .catch((err) => {
                throw err
            })
    })
})


describe("Searching by status", () => {
    it("Should return 400 if status is not recognised", () => {
        return chai.request(SERVER_URL)
            .get("/search?status=HELLO")
            .then((res) => {
                expect(res).to.have.status(400)
            })
            .catch((err) => {
                throw err
            })
    })

    it("Should return 400 if status is MY_EVENTS but not authenticated", () => {
        return chai.request(SERVER_URL)
            .get("/search?status=MY_EVENTS")
            .then((res) => {
                expect(res).to.have.status(400)
            })
            .catch((err) => {
                throw err
            })
    })

    it("Should return 400 if status is ATTENDING but not authenticated", () => {
        return chai.request(SERVER_URL)
            .get("/search?status=ATTENDING")
            .then((res) => {
                expect(res).to.have.status(400)
            })
            .catch((err) => {
                throw err
            })
    })

    it("Should return 200 with 50 objects if status is MY_EVENTS and logged in as user1 (with a limit of 100)", () => {
        return chai.request(SERVER_URL)
            .get("/search?status=MY_EVENTS&limit=100")
            .set('X-Authorization', SESSION_TOKEN_USER1)
            .then((res) => {
                expect(res).to.have.status(200)
                expect(res.body.length).to.equal(50)
            })
            .catch((err) => {
                throw err
            })
    })

    it("Should return 200 with 0 objects if status is MY_EVENTS and logged in as user2 (with a limit of 100)", () => {
        return chai.request(SERVER_URL)
            .get("/search?status=MY_EVENTS&limit=100")
            .set('X-Authorization', SESSION_TOKEN_USER2)
            .then((res) => {
                expect(res).to.have.status(200)
                expect(res.body.length).to.equal(0)
            })
            .catch((err) => {
                throw err
            })
    })

    it("Should return 200 with 0 objects if status is ATTENDING and logged in as user1 (with a limit of 100)", () => {
        return chai.request(SERVER_URL)
            .get("/search?status=ATTENDING&limit=100")
            .set('X-Authorization', SESSION_TOKEN_USER1)
            .then((res) => {
                expect(res).to.have.status(200)
                expect(res.body.length).to.equal(0)
            })
            .catch((err) => {
                throw err
            })
    })

    it("Should return 200 with 2 objects if status is ATTENDING and logged in as user2 (with a limit of 100)", () => {
        return chai.request(SERVER_URL)
            .get("/search?status=ATTENDING&limit=100")
            .set('X-Authorization', SESSION_TOKEN_USER2)
            .then((res) => {
                expect(res).to.have.status(200)
                expect(res.body.length).to.equal(2)
            })
            .catch((err) => {
                throw err
            })
    })

    it("Should return 200 with 1 objects if status is ARCHIVE (with limit of 100)", () => {
        return chai.request(SERVER_URL)
            .get("/search?status=ARCHIVE&limit=100")
            .then((res) => {
                expect(res).to.have.status(200)
                expect(res.body.length).to.equal(1)
            })
            .catch((err) => {
                throw err
            })
    })

    it("Should return 200 with 49 objects if status is OPEN (with limit of 100)", () => {
        return chai.request(SERVER_URL)
            .get("/search?status=OPEN&limit=100")
            .then((res) => {
                expect(res).to.have.status(200)
                expect(res.body.length).to.equal(49)
            })
            .catch((err) => {
                throw err
            })
    })
})

describe("Searching by query string", () => {
    it("Should return 200, with 2 objects when searching OPEN events with the string 'Programmer'", () => {
        return chai.request(SERVER_URL)
            .get("/search?status=OPEN&q=programmer&limit=100")
            .then((res) => {
                expect(res).to.have.status(200)
                expect(res.body.length).to.equal(2)
            })
            .catch((err) => {
                throw err
            })
    })

    it("Should return 200, with 13 objects when searching OPEN events with the string 'engineer'", () => {
        return chai.request(SERVER_URL)
            .get("/search?status=OPEN&q=engineer&limit=100")
            .then((res) => {
                expect(res).to.have.status(200)
                expect(res.body.length).to.equal(13)
            })
            .catch((err) => {
                throw err
            })
    })

    it("Should return 200, with 1 objects when searching all events with the string 'cost'", () => {
        return chai.request(SERVER_URL)
            .get("/search?q=cost&limit=100")
            .then((res) => {
                expect(res).to.have.status(200)
                expect(res.body.length).to.equal(1)
            })
            .catch((err) => {
                throw err
            })
    })

    it("Should return 200, with 0 objects when searching OPEN events with the string 'cost'", () => {
        return chai.request(SERVER_URL)
            .get("/search?q=cost&status=OPEN&limit=100")
            .then((res) => {
                expect(res).to.have.status(200)
                expect(res.body.length).to.equal(0)
            })
            .catch((err) => {
                throw err
            })
    })
})

