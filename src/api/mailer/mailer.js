const restful = require('node-restful')
const mongoose = restful.mongoose

const mailerSchema = new mongoose.Schema({
  name: String,
  email: String,
  planet: String,
  ship: String,
  tasks: [Number]
})