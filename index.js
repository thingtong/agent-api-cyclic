const express = require('express');
const fs = require("fs");
var path = require('path');
const app = express();
const mongoose = require('mongoose');
const PORT = process.env.PORT || 3000 ;
//const crypto = require("crypto");
const crypto = require('crypto-js');
password = 'd6F3Efeq';
console.log();
var db=decrypt("U2FsdGVkX1+v4xmRAhetcM6bKAUSgMzv+rYfTd9g0jJxxyjfXTe0r9XNUy+xe7P4I034+C5EzcVm61cMEqEkBs7CUbtD7XfYblIiY12KbzUhFyNOg1HwjBiIt0ug0+7hLmr+5Nn1x0IWB2FKnAENlA==")
mongoose.connect(db, {
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
  const filter = { 'employeeId': payload.employeeId,'contractStatus': { $ne: 1 } };
  const update = { contractStatus: payload.contractStatus };
  await agents.countDocuments(filter); // 0
  let ress = await agents.findOneAndUpdate(filter, update, {
    new: true,
    upsert: false,
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
function decrypt(text){
  const result = crypto.AES.decrypt(text, password);
  return result.toString(crypto.enc.Utf8);
}