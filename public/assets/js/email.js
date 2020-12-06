const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
        host: process.env.emailHost,
        port: emailPort,
        auth: {
            user: process.env.emailAccount,
            pass: process.env.emailPassword
        }
    });

const sendMail = (emailAddress, emailSubject, emailText, cb) => {
    var mailOptions = {
        from: 'youremail@gmail.com',
        to: emailAddress,
        subject: emailSubject,
        text: emailText
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
        console.log(error);
        } else {
        console.log('Email sent: ' + info.response);
        }
    });
}

module.exports = sendMail;



