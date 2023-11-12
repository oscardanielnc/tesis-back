const nodemailer = require('nodemailer')

async function sendEmail(toEmail,subject,text) {
    const config = {
        host: 'smtp.gmail.com',
        port: 587,
        auth: {
            user: 'soportepspsystem@gmail.com',
            pass: 'pqpz uiev smdg cgvh'
        }
    }
    const msg = {
        from: 'soportepspsystem@gmail.com',
        to: toEmail,
        subject: subject,
        text: text
    }

    const transport = nodemailer.createTransport(config)
    const info = await transport.sendMail(msg)
}

module.exports = {
    sendEmail
}