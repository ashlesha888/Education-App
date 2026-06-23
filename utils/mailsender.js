import nodemailer from 'nodemailer';

const mailSender = async (email, title, body) => {
  try {
    
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST, 
      auth: {
        user: process.env.MAIL_USER, 
        pass: process.env.MAIL_PASS, 
      },
    });

    
    const info = await transporter.sendMail({
      from: `"StudyNotion || Your E-Learning Platform" <${process.env.MAIL_USER}>`,
      to: `${email}`,
      subject: `${title}`,
      html: `${body}`,
    });

    console.log(`Email sent successfully: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error(`Error occurred while sending mail: ${error.message}`);
    throw error;
  }
};

export default mailSender;
