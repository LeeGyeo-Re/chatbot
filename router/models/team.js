var mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Team = new Schema({
  area : String,
  teamId : String,
  teamName : String
});

module.exports = mongoose.model('team',Team);
