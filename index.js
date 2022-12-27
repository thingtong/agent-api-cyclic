/*const express = require('express');

const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const agents = require('./modules/agents');
const http = require('http');
mongoose.Promise = global.Promise;*/

const express = require('express');
const fs = require("fs");
var path = require('path');
const app = express();
const mongoose = require('mongoose');

const PORT = process.env.PORT || 3000 ;
//const agents = require('./modules/agents');
mongoose.connect('mongodb://myUserAdmin:hehzyvc1fdt9k4ug@150.95.80.101:27017/test?authSource=admin', {
//mongoose.connect('mongodb://localhost:27017/test', {
  useNewUrlParser: true
});

const agents = mongoose.model('agents', new mongoose.Schema({
  contractStatus: Number,
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
app.post('/agent', async (req, res) => {
  const payload = req.body;
  const employeeIds = payload.employeeId
  
  const employeeId = { employeeId: payload.employeeId };
  const contractStatus = { contractStatus: payload.contractStatus };

  await agents.countDocuments(employeeId); // 0
  let ress = await agents.findOneAndUpdate(employeeId, contractStatus, {
    new: true,
    upsert: true,
    rawResult: true // Return the raw result from the MongoDB driver
  });
  
  ress.value instanceof agents; // true
  // The below property will be `false` if MongoDB upserted a new
  // document, and `true` if MongoDB updated an existing object.
  ress.lastErrorObject.updatedExisting; // false
  //const agent = await agents.findByIdAndUpdate(employeeId, {$set:payload});
  //res.json(agent);
  
  res.status(200).send({
    "status": "ok",
    "message": 'agent with employeeId = ' + employeeIds + ' is update',
    "user": ress
  });
});
app.listen(PORT, () => {
  console.log('Application is running on port'+ PORT);
});








/*mongoose.connect('mongodb://localhost:27017/test', 
//mongoose.connect('mongodb://myUserAdmin:hehzyvc1fdt9k4ug@150.95.80.101:27017/test?authSource=admin',  

//'mongodb://myUserAdmin:hehzyvc1fdt9k4ug@150.95.80.101:27017/test'

{
     // useNewUrlParser: true,
    }
  )
  .then(() => {
    console.log("Successfully connected to the database");
  })
  .catch((err) => {
    console.log("Could not connect to the database. Error...", err);
    process.exit();
  });
 //app.use(express.static('public'));
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ message: "Server is running :D" });
});

app.post('/agent', async (req, res, next) => {
  const agent = req.body;
  const employeeId = agent.employeeId
  const contractStatus = agent.contractStatus
  
  db.collection('agent').findAndModify(
    {employeeId: employeeId}, // query
   // [['_id','asc']],  // sort order
    {$set: {contractStatus: contractStatus}}, // replacement, replaces only the field "hi"
    {}, // options
    function(err, object) {
        if (err){
            console.warn(err.message);  // returns error if no matching object found
        }else{
            console.dir(object);
        }
    });


  res.status(200).send({
    "status": "ok",
    "message": "User with employeeId = "+employeeId+" is update",
    "user": agent
  });
  /*await mongoose.db.collection('agents').findAndModify( 
    {employeeId: agent.employeeId},
    {$set: {contractStatus: agent.contractStatus}},
    );
    await mongoose.close();
    res.status(200).send({
      "status": "ok",
      "message": "User with employeeId = "+agent.employeeId+" is update",
      "user": agent
    });
  })

let PORT = 8080;

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
// Import express
/*const express = require('express');

const { MongoClient } = require("mongodb");
//const uri = "mongodb://myUserAdmin:myUserAdmin@localhost:27017";


const app = express()
const port = 3000
//app.use(express.json());


const uri = "mongodb://localhost:27017";
//app.post('/users/create', async(req, res) => {
  app.post('/agent/update', async(req, res) => {
  const agent = req.body;
  const client = new MongoClient(uri);
  await client.connect();
  await client.db('test').collection('agents').findAndModify( 
    {employeeId: agent.employeeId},
    {$set: {contractStatus: agent.contractStatus}},
    );
  /* await client.db('test').collection('agents').insertOne({
    id: parseInt(user.id),
    fname: user.fname,
    lname: user.lname,
    username: user.username,
    email: user.email,
    avatar: user.avatar
  });*/



  /*await client.close();
  res.status(200).send({
    "status": "ok",
    "message": "User with employeeId = "+agent.employeeId+" is update",
    "user": agent
  });
})
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})*/

