var mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Coach = new Schema({
  location: String,
  area : String,
  coachId: String,
  name : String,
  phone : Number,
  created: {type:Date, default: Date.now}
});

module.exports = mongoose.model('coach',Coach);
