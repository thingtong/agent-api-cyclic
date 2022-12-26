const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const agentSchema = new Schema({
  contractStatus: Number,
  employeeId: String
},
{ timestamps: true, versionKey: false }
);
const agentModel = mongoose.model('agents', agentSchema);
module.exports = agentModel;

