const mongoose = require('mongoose')


const mailerSchema = new mongoose.Schema({
  name: String,
  email: String,
  planet: String,
  ship: String,
  tasks: {
    fuel: Boolean,
    unship: Boolean,
    eletricMaintenance: Boolean,
    mechanicMaintenance: Boolean,
    thrustersMaintenance: Boolean,
    systemValidation: Boolean,
    cleaning: Boolean
  },
  arrivalDate: { type: Date },
  departureDate: { type: Date }
})

module.exports = mongoose.model('Mailer', mailerSchema)