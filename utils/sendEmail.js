const nodemailer = require("nodemailer");
const confirmation = require('../template/confirmation');

const sendEmail = async (options) => {
  
  const transporter = nodemailer.createTransport({
    service: "gmail",
    port:587,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD, 
    },
  });

  const message ={
    from: `${process.env.FROM_NAME} <${process.env.SMTP_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    html: confirmation(options.args),
  };

  const info = await transporter.sendMail(message);

  console.log("Message sent: %s", info.messageId);
  
}

module.exports = sendEmail;
