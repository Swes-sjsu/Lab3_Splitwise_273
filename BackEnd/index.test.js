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
          expect(res.text).to.equal('{Invalid credentials }');
        })
        .catch((error) => {
          console.log(error);
        });
    });
});