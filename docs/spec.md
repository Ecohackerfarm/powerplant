# TOC
   - [data_validation](#data_validation)
     - [#idValidation()](#data_validation-idvalidation)
     - [#getCompanionshipScores()](#data_validation-getcompanionshipscores)
     - [#fetchModel()](#data_validation-fetchmodel)
     - [#checkModel()](#data_validation-checkmodel)
   - [/api/companionships/](#apicompanionships)
     - [GET](#apicompanionships-get)
     - [POST](#apicompanionships-post)
   - [/api/companionships/scores](#apicompanionshipsscores)
     - [GET](#apicompanionshipsscores-get)
   - [/api/companionships/:id](#apicompanionshipsid)
     - [GET](#apicompanionshipsid-get)
     - [PUT](#apicompanionshipsid-put)
     - [DELETE](#apicompanionshipsid-delete)
   - [/api/crops/](#apicrops)
     - [GET](#apicrops-get)
     - [POST](#apicrops-post)
   - [/api/crops/:cropId](#apicropscropid)
     - [GET](#apicropscropid-get)
     - [PUT](#apicropscropid-put)
     - [DELETE](#apicropscropid-delete)
   - [/api/crops/:cropId/companionships](#apicropscropidcompanionships)
     - [GET](#apicropscropidcompanionships-get)
   - [/api/crops/:cropId1/companionships/:cropId2](#apicropscropid1companionshipscropid2)
     - [GET](#apicropscropid1companionshipscropid2-get)
   - [/api/*](#api)
     - [GET](#api-get)
<a name=""></a>
 
<a name="data_validation"></a>
# data_validation
<a name="data_validation-idvalidation"></a>
## #idValidation()
should reject invalid ids.

```js
var ids = ['12345', 'JF(jrf9Nd3gkd0fj2ln  j F)'];
var res = {};
var req = { ids: ids };
var error = void 0;
var next = function next(err) {
  error = err;
};
_data_validation2.default.idValidator(req, res, next);
(0, _chai.expect)(error.status).to.equal(400);
```

should accept valid ids.

```js
var ids = [ObjectId(), ObjectId()];
var req = { ids: ids };
var res = {};
var error = void 0;
var next = function next(err) {
  error = err;
};
_data_validation2.default.idValidator(req, res, next);
(0, _chai.expect)(typeof error === 'undefined' ? 'undefined' : _typeof(error)).to.equal('undefined');
(0, _chai.expect)(req.ids).to.equal(ids);
```

<a name="data_validation-getcompanionshipscores"></a>
## #getCompanionshipScores()
should return 1 or -1 for correct crops.

```js
var results = _data_validation2.default.getCompanionshipScores(sample, ids);
(0, _chai.expect)(results[a]).to.equal(1);
(0, _chai.expect)(results[b]).to.equal(-1);
(0, _chai.expect)(results[c]).to.equal(1);
```

should override positive companionships with a negative.

```js
ids.push(ObjectId());
var d = ObjectId();
var newData = [{ crop1: ids[1],
  crop2: a,
  compatibility: -1 }, { crop1: b,
  crop2: ids[1],
  compatibility: 3 }, { crop1: ids[1],
  crop2: d,
  compatibility: 2 }];
sample.push(newData);
var results = _data_validation2.default.getCompanionshipScores(sample, ids);
var max = 6;
(0, _chai.expect)(results[a]).to.equal(-1);
(0, _chai.expect)(results[b]).to.equal(-1);
(0, _chai.expect)(results[c]).to.equal(3 / 6);
(0, _chai.expect)(results[d]).to.equal(2 / 6);
```

<a name="data_validation-fetchmodel"></a>
## #fetchModel()
should throw 404 on nonexistent id.

```js
return _crop2.default.findOne({}).then(function (crop) {
  validId = crop._id;
  var ids = [ObjectId(), crop._id];
  var req = { ids: ids };
  var res = {};
  return fetchModelError(_crop2.default, "crops", req, res).then(function (err) {
    (0, _chai.expect)(err.status).to.equal(404);
  });
});
```

should save models for valid id.

```js
var ids = [validId, validId];
var req = { ids: ids };
var res = {};
return fetchModelError(_crop2.default, "crops", req, res).then(function (err) {
  (0, _chai.expect)(req.crops).to.have.length(2);
  (0, _chai.expect)(typeof err === 'undefined' ? 'undefined' : _typeof(err)).to.equal('undefined');
});
```

<a name="data_validation-checkmodel"></a>
## #checkModel()
should return false for invalid id.

```js
var ids = [ObjectId(), validId];
var req = { ids: ids };
var res = {};
return checkModelError(_crop2.default, req, res).then(function (err) {
  (0, _chai.expect)(err.status).to.equal(404);
});
```

should return true for valid id.

```js
var ids = [validId, validId];
var req = { ids: ids };
var res = {};
return checkModelError(_crop2.default, req, res).then(function (err) {
  (0, _chai.expect)(typeof error === 'undefined' ? 'undefined' : _typeof(error)).to.equal('undefined');
  (0, _chai.expect)(req.ids).to.equal(ids);
});
```

<a name="apicompanionships"></a>
# /api/companionships/
<a name="apicompanionships-get"></a>
## GET
should return an array of companionships.

```js
this.timeout(5000); // needed to leave as a non-arrow function so that 'this' reference above works
return request.get(url).expect(200).expect('Content-Type', jsonType).then(function (res) {
  (0, _chai.expect)(res.body).to.be.an('array').and.to.have.length.above(0);
  res.body.forEach(_routerHelpers.checkCompanionship);
});
```

<a name="apicompanionships-post"></a>
## POST
should create a new companionship with valid existing crop ids.

```js
var newComp = {
  crop1: crop1,
  crop2: crop2,
  compatibility: -1
};
return (0, _routerHelpers.sendForm)(request.post(url), newComp).expect(201);
```

should 303 if trying to create a companionship that already exists.

```js
var newComp = {
  crop1: crop2,
  crop2: crop1,
  compatibility: -1
};
return (0, _routerHelpers.sendForm)(request.post(url), newComp).expect(303).then(function (res) {
  (0, _chai.expect)(res.header).to.have.property('location').and.to.contain("/api/companionships/");
});
```

should 404 with nonexistent crop ids.

```js
// TODO: This is a BIZARRE bug
// when using a nonexistent but valid object id here, the error object gets printed to the console
// i see no print statement in the entire project that prints an error object
// figure out where this is coming from?
var newComp = {
  crop1: ObjectId().toString(),
  crop2: ObjectId().toString(),
  compatibility: false
};
return (0, _routerHelpers.sendForm)(request.post(url), newComp).expect(404);
```

should 400 with invalid crop ids.

```js
var newComp = {
  crop1: "ja;fsifa093",
  crop2: "jf930wjf93wf",
  compatiblity: true
};
return (0, _routerHelpers.sendForm)(request.post(url), newComp).expect(400);
```

<a name="apicompanionshipsscores"></a>
# /api/companionships/scores
<a name="apicompanionshipsscores-get"></a>
## GET
should 400 with no query.

```js
return request.get(url).expect(400);
```

should return numerical scores with all valid crop ids.

```js
return request.get(url + "?id=" + appleId + "," + potatoId + "," + beanId).expect(200).expect('Content-Type', jsonType).then(function (res) {
  (0, _chai.expect)(Object.keys(res.body)).to.have.length.above(0);
  for (var id in res.body) {
    (0, _chai.expect)(res.body[id]).to.be.within(-1, 1);
  }
});
```

should 400 if there is a malformed crop id.

```js
return request.get(url + "?id=" + appleId + ",fa3j9w0f a0f9jwf").expect(400);
```

should 404 if there is a nonexistent crop id.

```js
return request.get(url + "?id=" + appleId + "," + ObjectId().toString()).expect(404);
```

<a name="apicompanionshipsid"></a>
# /api/companionships/:id
<a name="apicompanionshipsid-get"></a>
## GET
should 400 for a malformed id.

```js
return request.get(url + "/a").expect(400);
```

should 404 for a nonexistent id.

```js
return request.get(url + "/" + ObjectId().toString()).expect(404);
```

should return the correct companionship for a valid id.

```js
return request.get(url + "/" + validId).expect(200).expect('Content-Type', jsonType).then(function (res) {
  (0, _chai.expect)(res.body).to.have.property('_id').and.to.equal(validId);
});
```

<a name="apicompanionshipsid-put"></a>
## PUT
should modify the specified fields of a valid id.

```js
var changes = {
  compatibility: validCompatibility > 0 ? -1 : 3
};
return (0, _routerHelpers.sendForm)(request.put(url + "/" + validId), changes).expect(200).expect('Content-Type', jsonType).then(function (res) {
  (0, _chai.expect)(res.body).to.have.property('_id').and.to.equal(validId);
  (0, _chai.expect)(res.body).to.have.property('compatibility').and.to.equal(changes.compatibility);
});
```

should 404 on nonexistent id.

```js
return (0, _routerHelpers.sendForm)(request.put(url + "/" + ObjectId().toString()), {}).expect(404);
```

should 400 on invalid id.

```js
return (0, _routerHelpers.sendForm)(request.put(url + "/afw2j"), {}).expect(400);
```

<a name="apicompanionshipsid-delete"></a>
## DELETE
should delete a valid companionship.

```js
return request.delete(url + "/" + validId).expect(200).then(function (res) {
  return _companionship2.default.findById(validId, function (err, comp) {
    (0, _chai.expect)(comp).to.be.null;
  });
});
```

<a name="apicrops"></a>
# /api/crops/
<a name="apicrops-get"></a>
## GET
should return all crops with no arguments.

```js
return request.get(rootUrl).expect(200).expect('Content-Type', jsonType).then(function (res) {
  (0, _chai.expect)(res.body).to.have.length(count);
});
```

should return crops matching a query string.

```js
return request.get(rootUrl + "?name=test").expect(200).expect('Content-Type', jsonType).then(function (res) {
  (0, _chai.expect)(res.body).to.have.length.above(0);
  res.body.forEach(function (apple) {
    (0, _chai.expect)(apple.name).to.include("test");
  });
});
```

should return no crops for gibberish query string.

```js
return request.get(rootUrl + "?name=jf93 FJ(Fiojs").expect(200).expect('Content-Type', jsonType).expect([]);
```

should not populate the list of companionships.

```js
return request.get(rootUrl + "?name=apple").then(function (res) {
  res.body.forEach(function (apple) {
    (0, _chai.expect)(apple).to.have.property('companionships').and.to.satisfy(_routerHelpers.allStrings);
  });
});
```

<a name="apicrops-post"></a>
## POST
should create new crop from just name and display name.

```js
return (0, _routerHelpers.sendForm)(request.post(rootUrl), crop).expect(201).then(function (res) {
  (0, _chai.expect)(res.body).to.have.property("_id");
  (0, _chai.expect)(res.body).to.have.property("name").and.to.equal(crop.name);
  (0, _chai.expect)(res.body).to.have.property("display_name").and.to.equal(crop.display_name);
});
```

should provide the location of the new resource.

```js
return (0, _routerHelpers.sendForm)(request.post(rootUrl), crop).expect(201).then(function (res) {
  (0, _chai.expect)(res.header.location).to.include(rootUrl);
});
```

should 400 missing name or display.

```js
delete crop.name;
return (0, _routerHelpers.sendForm)(request.post(rootUrl), crop).expect(400);
```

<a name="apicropscropid"></a>
# /api/crops/:cropId
<a name="apicropscropid-get"></a>
## GET
should 400 a bad id.

```js
return request.get(rootUrl + "/a9jfw0aw903j j (JF) fjw").expect(400).expect('Content-Type', jsonType);
```

should 404 a valid but nonexistent crop id.

```js
return request.get(rootUrl + "/" + ObjectId().toString()).expect(404).expect('Content-Type', jsonType);
```

should return the specified crop.

```js
return request.get(rootUrl + "/" + testId).expect(200).then(function (res) {
  var test = res.body;
  (0, _chai.expect)(test).to.have.property('name').and.to.match(RegExp('test', 'i'));
});
```

should not populate companionship list.

```js
return request.get(rootUrl + "/" + testId).expect(200).then(function (res) {
  var test = res.body;
  (0, _chai.expect)(test).to.have.property('companionships').and.to.satisfy(_routerHelpers.allStrings);
});
```

<a name="apicropscropid-put"></a>
## PUT
should make the specified valid changes.

```js
var changes = { display_name: (0, _routerHelpers.randString)(),
  alternate_display: (0, _routerHelpers.randString)() };
return (0, _routerHelpers.sendForm)(request.put(rootUrl + "/" + testId), changes).expect(200).expect('Content-Type', jsonType).then(function (res) {
  var newTest = res.body;
  (0, _chai.expect)(newTest).to.have.property('display_name').and.to.equal(changes.display_name);
  (0, _chai.expect)(newTest).to.have.property('alternate_display').and.to.equal(changes.alternate_display);
});
```

should not effect invalid field changes.

```js
var changes = { blahblah: (0, _routerHelpers.randString)() };
return (0, _routerHelpers.sendForm)(request.put(rootUrl + "/" + testId), changes).expect(200).expect('Content-Type', jsonType).then(function (res) {
  (0, _chai.expect)(res.body).to.not.have.property('blahblah');
});
```

should not allow ID changes.

```js
var changes = { _id: ObjectId().toString() };
return (0, _routerHelpers.sendForm)(request.put(rootUrl + "/" + testId), changes).expect(400);
```

<a name="apicropscropid-delete"></a>
## DELETE
should delete a valid crop.

```js
return request.delete(rootUrl + "/" + testId).expect(204);
```

should delete all associated companionships.

```js
return request.get('/api/companionships/' + compId).expect(404);
```

<a name="apicropscropidcompanionships"></a>
# /api/crops/:cropId/companionships
<a name="apicropscropidcompanionships-get"></a>
## GET
should fetch an array.

```js
return request.get(rootUrl + "/" + testId + "/companionships").expect(200).expect('Content-Type', jsonType).then(function (res) {
  (0, _chai.expect)(res.body).to.have.length.above(0);
});
```

should populate companionships.

```js
return request.get(rootUrl + "/" + testId + "/companionships").expect(200).then(function (res) {
  res.body.forEach(function (item) {
    (0, _chai.expect)(item).to.contain.all.keys('crop1', 'crop2', 'compatibility');
  });
});
```

should only fetch matching companionships.

```js
return request.get(rootUrl + "/" + testId + "/companionships").expect(200).then(function (res) {
  res.body.forEach(function (item) {
    (0, _chai.expect)(item).to.satisfy(function (item) {
      return item.crop1 === testId || item.crop2 === testId;
    });
  });
});
```

<a name="apicropscropid1companionshipscropid2"></a>
# /api/crops/:cropId1/companionships/:cropId2
<a name="apicropscropid1companionshipscropid2-get"></a>
## GET
should provide proper location on existing companionship.

```js
return request.get(rootUrl + "/" + appleId + "/companionships/" + appleId).expect(303).then(function (res) {
  return request.get(res.header.location).expect(200).then(function (res) {
    var c = res.body;
    (0, _chai.expect)(c).to.contain.all.keys('crop1', 'crop2', 'compatibility');
    (0, _chai.expect)(c).to.satisfy(function (c) {
      return c.crop1._id === appleId && c.crop2._id === appleId;
    });
  });
});
```

should response 204 on existing crops but nonexistent companionship.

```js
return request.get(rootUrl + "/" + appleId + "/companionships/" + testId).expect(204);
```

<a name="api"></a>
# /api/*
<a name="api-get"></a>
## GET
should give JSON 404 for unknown route.

```js
return request.get(rootUrl + "/fja93jf9w3jfsf.jf93jf-fj").expect(404).expect('Content-Type', jsonType);
```

