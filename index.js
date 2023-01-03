const express = require('express');
const fs = require("fs");
var path = require('path');
const app = express();
const mongoose = require('mongoose');
const PORT = process.env.PORT || 3000 ;
//mongoose.connect('mongodb://localhost:27017/test', {
  mongoose.connect('mongodb://myUserAdmin:hehzyvc1fdt9k4ug@150.95.80.101:27017/test?authSource=admin', {
  useNewUrlParser: true
});
const agents = mongoose.model('agents', new mongoose.Schema({
  contractStatus: Number,
  status: Number,
  employeeId: String
}));
//////////////////////////////////////////////////////////////
function authentication(req, res, next) {
  var authheader = req.headers.authorization;
  console.log(req.headers);
  if (!authheader) {
      var err = new Error('You are not authenticated!');
      res.setHeader('WWW-Authenticate', 'Basic');
      err.status = 401;
      return next(err)
  }
  var auth = new Buffer.from(authheader.split(' ')[1],
  'base64').toString().split(':');
  var user = auth[0];
  var pass = auth[1];
  if (user == 'admin' && pass == 'password') {
    // If Authorized user
      next();
  } else {
      var err = new Error('You are not authenticated!');
      res.setHeader('WWW-Authenticate', 'Basic');
      err.status = 401;
      return next(err);
  }

}
/////////////////////////////////////////////////////////
app.use(authentication)
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.post('/update/contactStatus', async (req, res) => {
  const payload = req.body;
  const employeeIds = payload.employeeId
  const employeeId = { employeeId: payload.employeeId,contractStatus:'1'};
  const contractStatus = { contractStatus: payload.contractStatus };
  await agents.countDocuments(employeeId); // 0
  let ress = await agents.findOneAndUpdate(employeeId, contractStatus, {
    new: true,
    upsert: true,
    rawResult: true // Return the raw result from the MongoDB driver
  });
  ress.value instanceof agents; // true
  ress.lastErrorObject.updatedExisting; // false
  res.status(200).send({
    "status": "ok",
    "message": 'agent with employeeId = ' + employeeIds + ' is update',
    "user": ress
  });
});
app.post('/update/status', async (req, res) => {
  const payload = req.body;
  const employeeIds = payload.employeeId
  const employeeId = { employeeId: payload.employeeId };
  const status= { status: payload.status };
  await agents.countDocuments(employeeId); // 0
  let ress = await agents.findOneAndUpdate(employeeId, status, {
    new: true,
    upsert: true,
    rawResult: true // Return the raw result from the MongoDB driver
  });
  ress.value instanceof agents; // true
  ress.lastErrorObject.updatedExisting; // false
  res.status(200).send({
    "status": "ok",
    "message": 'agent with employeeId = ' + employeeIds + ' is update',
    "user": ress
  });
});
app.listen(PORT, () => {
  console.log('Application is running on port'+ PORT);
});


