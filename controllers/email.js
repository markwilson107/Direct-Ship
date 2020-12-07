const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
        host: process.env.emailHost,
        port: process.env.emailPort,
        secure: false,
        auth: {
            user: process.env.emailAccount,
            pass: process.env.emailPassword
        },
        tls: {
            rejectUnauthorized: false
        }
    });

const sendMail = (emailAddress, emailSubject, emailText, cb) => {
    var mailOptions = {
        from: 'noreply@tcwa.com',
        to: emailAddress,
        subject: emailSubject,
        html : emailText
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



