  var mongoose = require('mongoose');
  const Schema = mongoose.Schema;

  const User = new Schema({
    userId: String,
    userName: String,
    area : String,
    teamId : String,
    teamName : String,
    level : Number,
    stayIn : Boolean,
    coachId: String,
    count: Number,
    first : String,
    second : String,
    created: {type:Date, default: Date.now}
  });

  module.exports = mongoose.model('user',User);
