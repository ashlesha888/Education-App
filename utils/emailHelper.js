import transporter from "../config/mail.js";
import {
  buildEmailTemplate, buildCoursePurchaseTemplate, buildPasswordResetTemplate, buildCourseCompletionTemplate, 
} from "./emailTemplates.js";



/**
 * Send Email
 */
export const sendEmail =
async ({

  to,

  subject,

  html,

}) => {

  await transporter.sendMail({

    from:
      process.env.MAIL_FROM,

    to,

    subject,

    html,

  });

};
/**
 * Welcome Email
 */
export const sendWelcomeEmail =
async (

  user

) => {

  const html =
    buildEmailTemplate({

      title:
        "Welcome",

      heading:
        `Welcome ${user.firstName}!`,

      message:
        "Thank you for joining StudyNotion. We are excited to have you on board.",

      buttonText:
        "Explore Courses",

      buttonLink:
        process.env.FRONTEND_URL,

    });

  await sendEmail({

    to:
      user.email,

    subject:
      "Welcome to StudyNotion",

    html,

  });

};

/**
 * Send Course Purchase Email
 */
export const sendCoursePurchaseEmail =
async (

  user,

  course

) => {

  const html =
    buildCoursePurchaseTemplate({

      studentName:
        user.firstName,

      courseName:
        course.courseName,

    });

  await sendEmail({

    to:
      user.email,

    subject:
      "Course Purchase Successful",

    html,

  });

};
/**
 * Password Reset Email
 */
export const sendPasswordResetEmail =
async (

  user

) => {

  const html =
    buildPasswordResetTemplate({

      firstName:
        user.firstName,

    });

  await sendEmail({

    to:
      user.email,

    subject:
      "Password Changed",

    html,

  });

};
/**
 * Course Completion Email
 */
export const sendCourseCompletionEmail =
async (

  user,

  course

) => {

  const html =
    buildCourseCompletionTemplate({

      studentName:
        user.firstName,

      courseName:
        course.courseName,

    });

  await sendEmail({

    to:
      user.email,

    subject:
      "Course Completed",

    html,

  });

};
export const EmailService = {

  sendEmail,

  sendWelcomeEmail,

  sendCoursePurchaseEmail,

  sendPasswordResetEmail,

  sendCourseCompletionEmail,

};