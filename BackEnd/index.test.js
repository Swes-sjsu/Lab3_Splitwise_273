const assert = require("chai").assert;
const index = require("./index");
const chai = require("chai");
chai.use(require("chai-http"));
const expect = require("chai").expect;
const agent = require("chai").request.agent(index);
describe("Login Test", function () {
    it("Incorrect Password", () => {
      agent
        .post("/login")
        .send({ email: "swetha@sp.com", password: "Test@sdsdsada12345" })
        .then(function (res) {
          expect(res.text).to.equal('Please enter valid password!');
        })
        .catch((error) => {
          console.log(error);
        });
    });
});

describe("Get Users accross the app", function () {
  it("it should GET the userid, username and email based on the given userid ", (done) => {
    let userid = 22;
    agent
      .get('/getuseroptions/:'+userid)
      .send(userid)
      .then(function (res) {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('idusers');
        res.body.should.have.property('usersname');
        res.body.should.have.property('email');
        res.body.should.have.property('idusers').eql(userid);
      })
      .catch((error) => {
        console.log(error);
      });
  });
});

