const nodemailer = require('nodemailer');
const pug = require('pug');
// const htmlToText = require('html_to_text');

class Email {
  constructor(user, keyMessage) {
    this.from = `EduSchool <${process.env.EMAIL_FROM}>`;
    this.to = user.email;
    this.firstName = user.firstName;
    this.keyMessage = keyMessage;
  }

  // eslint-disable-next-line class-methods-use-this
  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      return nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
      });
    }

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async send(template, subject) {
    if (!template) {
      const html = pug.renderFile(`${__dirname}/../view/email/${template}.pug`, {
        firstName: this.firstName,
        keyMessage: this.keyMessage,
        subject,
      });
    }

    const mailOptions = {
      to: this.to,
      from: this.from,
      subject,
      text: this.url,
      // html,
      // text: htmlToText.fromString(html)
    };

    return await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {}

  async sendPasswordResetToken() {
    await this.send('', 'YOUR PASSWORD RESET TOKEN (EXPIRES IN 10 MINUTES)');
  }
}

module.exports = Email;
