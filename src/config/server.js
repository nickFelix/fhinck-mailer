const port = 3003

const bodyParser = require('body-parser')
const express = require('express')
const nodemailer = require('nodemailer')
const multer = require('multer')
const server = express()
const Mailer = require('../models/mailer')
const router = express.Router()
const upload = multer().any()
const allowCors = require('./cors')

server.use(bodyParser.urlencoded({ extended: true }))
server.use(bodyParser.json())
server.use(allowCors)

router.post('/mailer', function (req, res) {

  upload(req, res, function (err) {
    if (err) {
      res.json({ success: false, message: 'File was not able to be uploaded.' });
    } else {
      if (!req.files) {
        res.json({ success: false, message: 'No file was selected' })
      } else {
        sendMail(req, res)
      }
    }

  })

})

function sendMail(req, res) {
  var mailer = new Mailer()
  var receivers = [];
  var returnID;

  mailer.name = req.body.name
  mailer.email = req.body.email
  mailer.planet = req.body.planet
  mailer.ship = req.body.ship
  mailer.tasks = req.body.tasks
  mailer.arrivalDate = req.body.arrivalDate
  mailer.departureDate = req.body.departureDate

  if (!mailer.tasks)
    res.status(422).send('tasks param missing')

  mailer.save(function (error, mailer) {
    if (error)
      res.send(error)

    returnID = mailer.id
  })

  var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'nickdesafiofhinck@gmail.com',
      pass: 'desafiofhinck123'
    }
  })

  Object.keys(mailer._doc.tasks).forEach(function (key) {
    switch (key) {
      default:
        break;
      case 'fuel':
        receivers.push('fuel@fhinck.com')
        break;
      case 'unship':
        receivers.push('cargo@fhinck.com')
        break;
      case 'eletricMaintenance':
        receivers.push('eletr@fhinck.com')
        break;
      case 'mechanicMaintenance':
        receivers.push('mechanic@fhinck.com')
        break;
      case 'thrustersMaintenance':
        receivers.push('prop@fhinck.com')
        break;
      case 'systemValidation':
        receivers.push('sys@fhinck.com')
        break;
      case 'cleaning':
        receivers.push('clean@fhinck.com')
        break;
    }
  })

  receivers.push(mailer.email)

  var selfieName;
  var shipName;

  var tmpSelfieName = req.files[0].mimetype.split('/')
  var tmpShipName = req.files[1].mimetype.split('/')

  selfieName = 'selfie.' + tmpSelfieName[1]
  shipName = 'ship.' + tmpShipName[1]

  var mailOptions = {
    from: 'nickdesafiofhinck@gmail.com',
    to: receivers,
    subject: 'Formulário de Autorização',
    text: `
    Informações sobre o piloto que deseja atracar na base

      Nome do Piloto: ${mailer.name}
      Email: ${mailer.email}
      Planeta: ${mailer.planet}
      Nave: ${mailer.ship}
      Previsão de chegada: ${mailer.arrivalDate}
      Previsao de saída: ${mailer.departureDate}

      A imagem do piloto e da nave estão em anexo neste email

      Que a força esteja com você
    `,
    attachments: [
      {
        filename: selfieName,
        content: req.files[0].buffer
      },
      {
        filename: shipName,
        content: req.files[1].buffer
      }
    ]
  }

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      res.send(error)
    } else {
      res.json({
        message: "Email Sent",
        requestID: returnID
      })

    }

  })
}


server.use('/api', router)

//Iniciando o Servidor (Aplicação):
//==============================================================
server.listen(port, function () {
  console.log(`BACKEND is running on port ${port}.`)
})