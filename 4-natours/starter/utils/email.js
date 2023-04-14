import nodemailer from 'nodemailer';

export default async function sendEmail(options) {
    const { email, subject, message } = options

    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD
        }
    })

    const emailOptions = {
        from: 'Liza <test@test.com>',
        to: email,
        subject,
        text: message

    }

    await transporter.sendMail(emailOptions)
}
