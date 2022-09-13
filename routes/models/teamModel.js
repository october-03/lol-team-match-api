const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String, required: true
  },
  position: {
    type: String, required: true
  },
  password: {
    type: String, required: true
  },
  created: {
    type: Number, default: Date.now
  }
});

const teamSchema = new mongoose.Schema({
  name: {
    type: String, required: true
  },
  code: {
    type: String, required: true
  },
  uniqueCode: {
    type: String, required: true, default: '0000',
  },
  top: {type: userSchema, default: null},
  jg: {type: userSchema, default: null},
  mid: {type: userSchema, default: null},
  adc: {type: userSchema, default: null},
  sup: {type: userSchema, default: null},
  created: {
    type: Number, default: Date.now
  },
  type: {
    type: String, required: true, default: 'solo'
  },
  isFull: {
    type: Boolean, default: false
  }
})

module.exports = mongoose.model('Team', teamSchema);