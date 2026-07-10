export const buildEmailTemplate = ({

  title,

  heading,

  message,

  buttonText = null,

  buttonLink = null,

}) => {

  return `

    <div
      style="
      font-family:Arial;
      max-width:600px;
      margin:auto;
      ">

      <h2>${title}</h2>

      <h3>${heading}</h3>

      <p>${message}</p>

      ${
        buttonText
          ? `
          <a
            href="${buttonLink}"
            style="
              background:#3B82F6;
              color:white;
              padding:12px 18px;
              text-decoration:none;
              border-radius:6px;
            ">
            ${buttonText}
          </a>
          `
          : ""
      }

    </div>

  `;

};

/**
 * Course Purchase Email Template
 */
export const buildCoursePurchaseTemplate = ({
  studentName,
  courseName,
}) => {

  return buildEmailTemplate({

    title: "Course Purchased",

    heading: `Hi ${studentName},`,

    message:
      `Congratulations! Your purchase for "${courseName}" was successful. You can now start learning.`,

    buttonText: "Go To Course",

    buttonLink: process.env.FRONTEND_URL,

  });

};

/**
 * Password Reset Success Template
 */
export const buildPasswordResetTemplate = ({
  firstName,
}) => {

  return buildEmailTemplate({

    title: "Password Updated",

    heading:
      `Hi ${firstName},`,

    message:
      "Your password has been changed successfully. If this wasn't you, please contact support immediately.",

  });

};
/**
 * Course Completion Email
 */
export const buildCourseCompletionTemplate = ({
  studentName,
  courseName,
}) => {

  return buildEmailTemplate({

    title:
      "Course Completed",

    heading:
      `Congratulations ${studentName}!`,

    message:
      `You have successfully completed "${courseName}". Keep learning and keep growing!`,

  });

};