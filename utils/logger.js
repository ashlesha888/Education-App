export const logError = (
  error
) => {

  if (
    process.env.NODE_ENV ===
    "development"
  ) {

    console.error(error);

    return;

  }

  console.error({

    time:
      new Date(),

    message:
      error.message,

    statusCode:
      error.statusCode,

  });

};



