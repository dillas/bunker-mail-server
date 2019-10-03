const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require("nodemailer");
const app = express();


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use((request, response, next) => {
  response.header("Access-Control-Allow-Origin", "*");
  response.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.post('/send', (req, res) => {
  const emailBody = `
    <p>Вид отдыха: ${req.body.gameCategory}</p>
    <p>Количество человек: ${req.body.count}</p>
    <p>Дата: ${req.body.dateTime}</p>
    <p>Имя: ${req.body.person}</p>
    <p>Телефон: ${req.body.phone}</p>
    <p>Электронная почта: ${req.body.email}</p>
    <p>Коментарии: ${req.body.comment}</p>
  `

  async function main() {
    let testAccount = await nodemailer.createTestAccount();
    let transporter = nodemailer.createTransport({
      host: 'mail.nic.ru',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: "web@bunker42.com", // generated ethereal user
        pass: "exhfd1QpTE" // generated ethereal password
      }
    });

    await transporter.verify(function(error, success) {
      if (error) {
        console.log(error);
      } else {
        console.log("Server is ready to take our messages");
      }
    });
    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: 'web@bunker42.com', // sender address
      to: 'web@bunker42.com', // list of receivers
      subject: 'Hello ✔', // Subject line
      text: emailBody, // plain text body
      html: emailBody // html body
    });

    console.log('Message sent: %s', info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
  }

  main().catch(console.error);
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});