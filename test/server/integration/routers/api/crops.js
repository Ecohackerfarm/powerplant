const rootUrl = '/api/crops';
const jsonType = 'application/json; charset=utf-8';

import {expect} from 'chai';
import app from  '/server/app';
import {sendForm,
  randString,
  allStrings,
  createTestCrop,
  createTestCompanionship} from '../routerHelpers';
import supertest from 'supertest';
import Crop from "/server/models/crop";
import {Types} from 'mongoose';

const {ObjectId} = Types;
const request = supertest(app);

let createdCropId;
describe(rootUrl + "/", () => {
  let count;
  before((done) => {
    createTestCrop((crop) => {
      createdCropId = crop._id;
      Crop.count({}, (err, num) => {
        count = num;
        done();
      });
    });
  });
  describe("GET", () => {
    it("should return all crops with no arguments", () => {
      return request.get(rootUrl)
        .expect(200)
        .expect('Content-Type', jsonType)
        .then((res) => {
          expect(res.body).to.have.length(count);
        });
    });
    it("should return crops matching a query string", () => {
      return request.get(rootUrl + "?name=test")
        .expect(200)
        .expect('Content-Type', jsonType)
        .then((res) => {
          expect(res.body).to.have.length.above(0);
          res.body.forEach((apple) => {
            expect(apple.name).to.include("test");
          });
        });
    });
    it("should return no crops for gibberish query string", () => {
      return request.get(rootUrl + "?name=jf93 FJ(Fiojs")
        .expect(200)
        .expect('Content-Type', jsonType)
        .expect([]);
    });
    it("should not populate the list of companionships", () => {
      return request.get(rootUrl + "?name=apple")
        .then((res) => {
          res.body.forEach((apple) => {
            expect(apple).to.have.property('companionships').and.to.satisfy(allStrings);
          });
        });
    });
  });
  describe("POST", () => {
    const crop = {
      name: "my test crop",
      display_name: "Simon's crop for testing"
    };
    it("should create new crop from just name and display name", () => {
      return sendForm(request.post(rootUrl), crop)
        .expect(201)
        .then((res) => {
          expect(res.body).to.have.property("_id");
          expect(res.body).to.have.property("name").and.to.equal(crop.name);
          expect(res.body).to.have.property("display_name").and.to.equal(crop.display_name);
        });
    });
    it("should provide the location of the new resource", () => {
      return sendForm(request.post(rootUrl), crop)
        .expect(201)
        .then((res) => {
          expect(res.header.location).to.include(rootUrl);
        });
    });
    it("should 400 missing name or display", () => {
      delete crop.name;
      return sendForm(request.post(rootUrl), crop)
        .expect(400);
    });
  });
});

describe(rootUrl + "/:cropId", () => {
  let testId;
  let compId;
  before((done) => {
    createTestCompanionship((comp) => {
      testId = comp.crop1._id.toString();
      compId = comp._id.toString();
      done();
    });
  });
  describe("GET", () => {
    it("should 400 a bad id", () => {
      return request.get(rootUrl + "/a9jfw0aw903j j (JF) fjw")
        .expect(400)
        .expect('Content-Type', jsonType);
    });
    it("should 404 a valid but nonexistent crop id", () => {
      return request.get(rootUrl + "/" + ObjectId().toString())
        .expect(404)
        .expect('Content-Type', jsonType);
    });
    it("should return the specified crop", () => {
      return request.get(rootUrl + "/" + testId)
        .expect(200)
        .then((res) => {
          const test = res.body;
          expect(test).to.have.property('name').and.to.match(RegExp('test', 'i'));
        });
    });
    it("should not populate companionship list", () => {
      return request.get(rootUrl + "/" + testId)
        .expect(200)
        .then((res) => {
          const test = res.body;
          expect(test).to.have.property('companionships').and.to.satisfy(allStrings);
        });
    });
  });
  describe("PUT", () => {
    it("should make the specified valid changes", () => {
      const changes = {display_name: randString(),
                     alternate_display: randString()};
      return sendForm(request.put(rootUrl + "/" + testId), changes)
        .expect(200)
        .expect('Content-Type', jsonType)
        .then((res) => {
          const newTest = res.body;
          expect(newTest).to.have.property('display_name').and.to.equal(changes.display_name);
          expect(newTest).to.have.property('alternate_display').and.to.equal(changes.alternate_display);
        })
    });
    it("should not effect invalid field changes", () => {
      const changes = {blahblah: randString()};
      return sendForm(request.put(rootUrl + "/" + testId), changes)
        .expect(200)
        .expect('Content-Type', jsonType)
        .then((res) => {
          expect(res.body).to.not.have.property('blahblah');
        });
    });
    it("should not allow ID changes", () => {
      const changes = {_id: ObjectId().toString()};
      return sendForm(request.put(rootUrl + "/" + testId), changes)
        .expect(400);
    });
  });
  describe("DELETE", () => {
    it("should delete a valid crop", () => {
      return request.delete(rootUrl + "/" + testId)
        .expect(204);
    });
    it("should delete all associated companionships", () => {
      return request.get('/api/companionships/' + compId)
        .expect(404);
    });
  });
});

describe(rootUrl + "/:cropId/companionships", () => {
  let testId;
  before((done) => {
    createTestCompanionship((comp) => {
      testId = comp.crop1._id.toString();
      done();
    });
  });
  describe("GET", () => {
    it("should fetch an array", () => {
      return request.get(rootUrl + "/" + testId + "/companionships")
        .expect(200)
        .expect('Content-Type', jsonType)
        .then((res) => {
          expect(res.body).to.have.length.above(0);
        });
    });
    it("should populate companionships", () => {
      return request.get(rootUrl + "/" + testId + "/companionships")
        .expect(200)
        .then((res) => {
          res.body.forEach((item) => {
            expect(item).to.contain.all.keys('crop1', 'crop2', 'compatibility');
          })
        });
    });
    it("should only fetch matching companionships", () => {
      return request.get(rootUrl + "/" + testId + "/companionships")
        .expect(200)
        .then((res) => {
          res.body.forEach((item) => {
            expect(item).to.satisfy((item) => {
              return item.crop1 === testId || item.crop2 === testId;
            });
          });
        });
    });
  });
});

describe(rootUrl + "/:cropId1/companionships/:cropId2", () => {
  let appleId;
  let testId;
  before(() => {
    return request.get(rootUrl + "?name=apple")
      .then((res) => {
        appleId = res.body[0]._id;
        return request.get(rootUrl + "?name=test")
          .then((res) => {
            testId = res.body[0]._id;
          });
      });
  });
  describe("GET", () => {
    it("should provide proper location on existing companionship", () => {
      return request.get(rootUrl + "/" + appleId + "/companionships/" + appleId)
        .expect(303)
        .then((res) => {
          return request.get(res.header.location)
            .expect(200)
            .then((res) => {
              const c = res.body;
              expect(c).to.contain.all.keys('crop1', 'crop2', 'compatibility');
              expect(c).to.satisfy((c) => {
                return c.crop1._id === appleId && c.crop2._id === appleId;
              });
            });
        });
    });
    it("should response 204 on existing crops but nonexistent companionship", () => {
      return request.get(rootUrl + "/" + appleId + "/companionships/" + testId)
        .expect(204);
    });
  })
});
