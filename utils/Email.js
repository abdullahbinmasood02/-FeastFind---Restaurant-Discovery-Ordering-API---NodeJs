const nodemailer = require("nodemailer");
const htmlToText = require("html-to-text");
const pug = require("pug");

module.exports = class Email {
  constructor(user, url) {
    this.from = `<Abdullah Bin Masood> ${process.env.NODE_ENV.EMAIL_FROM}`;
    this.url = url;
    this.to = user.email;
    this.firstName = user.name.split(" ")[0];
  }
  //function to create the email transporter
  createNewTransporter() {
    if (process.env.NODE_ENV === "prod") {
      return 1;
    }
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }
  //function sending the actual email
  async send(template, subject) {
    const transporter = this.createNewTransporter();
    const html = pug.renderFile(`${__dirname}/../views/emails/${template}.pug`);

    await transporter.sendMail({
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.convert(html),
    });
  }
  async sendWelcome() {
    await this.send("welcome", "Welcome To FeastFind Family!");
  }
  async sendPasswordReset() {
    await this.send(
      "passwordReset",
      "Your Password Reset Token (valid for 10 mins)",
    );
  }
};
