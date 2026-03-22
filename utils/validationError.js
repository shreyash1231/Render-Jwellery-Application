
const validationError = (error) => {
  if (error) {
    const formattedErrorMessage = error.details
      .map((err) => err.message.replace(/"/g, ""))
      .join(", ");

    return formattedErrorMessage;

  }

};

module.exports = validationError;
