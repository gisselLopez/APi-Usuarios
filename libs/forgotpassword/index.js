const nodemailer = require("nodemailer");

module.exports = class Mail {
  async sendMail(correo, token) {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user:`${process.env.EMAIL_ADDRESS}`,
        pass:`${process.env.EMAIL_PASSWORD}`,
      },
    });
    await transporter.sendMail({
      from: `Password recovery${process.env.EMAIL_ADDRESS}`, 
      to: correo, 
      subject: "Password recovery", 
      text: `password change token: ${token}` 
    });
  }
}






