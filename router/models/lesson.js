var mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Lesson = new Schema({
  userId: String,
  firstLesson: Number,
  secondLesson: Number,
});

module.exports = mongoose.model('lesson',Lesson);
