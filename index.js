const express = require('express'); /* import the express package  */
const app = express();
const bodyParser = require('body-parser'); /*import the body-parser package to access the values of the form elements */
const nodemailer = require('nodemailer'); /* import nodemailer package to email the extracted values of the hml form */
const xoauth2 = require('xoauth2');

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static(__dirname + '/')); /* This will solve the issue of serving static files with the html page, such as images*/

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html'); /* serve the user the index.html page when they type the link to the app */
});

app.post('/', (req, res) => { /* the following code will execute once the user fills the form and presses on the Email button */

  const emailBody = /* this will hold the contents of the form values in an html format to forward to a gmail account*/`
    <h3>Contact info:<h3>
    <ul>
    <li>Name: ${req.body.name}</li>
    <li>Email: ${req.body.email}</li>
    <li>Phone: ${req.body.phone}</li>
    <li>Reply Preference: ${req.body.replyPreference}</li>
    </ul>
    <h3>Message:</h3>
    <p>${req.body.message}</p>
    `;
    /* the following code is to specify a mail provider, and conents of the email */

  let transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      type: 'OAuth2',
      user: 'naelaj2@gmail.com',
      clientId: '780638131485-r8e1sofl86lsl9br4lmfq1317g4retsf.apps.googleusercontent.com',
      clientSecret: 'pGufsWg5YSlmJsbNaSbEpwAA',
      refreshToken: '1/-s2_2Qj2w98N8DtkUXRJliEGcQr7SyAWJeJyHP1CbdHkxHaDWc51yJJRkl1_Z2b5'
    },
    tls: {rejectUnauthorized: false}
  });

  //this will contain the body of the email using the emailBody variable we declared earlier
  let mailOptions = {
    from: '"node Mailer Contact" <naelaj2@gmail.com>',
    to: "naelaj2@gmail.com",
    subject: "Node Contact Request",
    text: '',
    html: emailBody // html body
  };

  transporter.sendMail(mailOptions, (error, info)=> { //nodemiler code to verify that there are no errors before sending email
      if(error){
        return console.log(error);
      }

      console.log('Message sent: %s', info.messageId);
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

      res.sendFile(__dirname + '/Submitted.html'); /*if no error, email will get sent, and the user will be sesrved the Submitted.HTML
      page as confirmation */
  });

});

app.listen(process.env.PORT || 4000, () => { //process.env.PORT to enable dynamic port listening on the Heroku server, else listen on port 4000 if possible
  console.log("Listening to port now..")
});
