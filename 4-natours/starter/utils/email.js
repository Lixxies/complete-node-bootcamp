import nodemailer from 'nodemailer';
class Email {
    constructor(user, url) {
        this.to = user.email;
        this.firstName = user.name.split(' ')[0];
        this.url = url;
        this.from = `Liza <${process.env.EMAIL_FROM}>`;
    }

    newTransport() {
        if (process.env.NODE_ENV === 'development') {
            return nodemailer.createTransport({
                host: process.env.EMAIL_HOST,
                port: process.env.EMAIL_PORT,
                auth: {
                    user: process.env.EMAIL_USERNAME,
                    pass: process.env.EMAIL_PASSWORD
                }
            })
        }
    }

    async send(template, subject) {
        // 1) Render HTML based on a template
        // 2) Define email options
        const emailOptions = {
            from: this.from,
            to: this.to,
            subject,
            template,
            text: 'Email converted to text'

        }
        // 3) Create a transport and send email
        await this.newTransport().sendMail(emailOptions);
    }

    async sendWelcome() {
        await this.send('welcomeTemplate', 'Welcome to the Natours Family!')
    }

    async sendPasswordRest() {
        await this.send('passwordResetTemplate', 'Your password reset token (valid for only 10 minutes)')
    }
}

export default Email;
