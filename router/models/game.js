var mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Game = new Schema({
  userId: String,
  games: String,
  created: {type:Date, default: Date.now}
});

module.exports = mongoose.model('game',Game);
