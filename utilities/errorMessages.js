function getErrorMessages(errors) {
  const errorObj = {};

  errors.forEach(error => {
    errorObj[error.param] = error.msg
  });

  return errorObj;
};

module.exports = {getErrorMessages : getErrorMessages};