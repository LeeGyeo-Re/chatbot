var mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Space = new Schema({
  location : String,
  area : String,
  spaceId : Number,
  coachId : String,
  callNumber : String,
  cost : {
    date : Number,
    month : Number,
    lesson : Number
  }
});

module.exports = mongoose.model('space',Space);
