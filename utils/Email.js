const nodemailer = require("nodemailer");

async function sendEmail(options) {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: "Abdullah Bin Masood <abdullahbinmasood02@gmail.com>",
    to: options.receiver,
    subject: options.subject,
    text: options.message,
  };
  await transporter.sendMail(mailOptions);
}

module.exports = sendEmail;
