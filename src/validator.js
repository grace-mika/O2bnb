const validatePassword = (password) => {
  const re = new RegExp(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,20})/
  );

  if (!re.test(password)) {
      const error =  new Error('INVALID_USER');
      error.statusCode = 400;
      throw error;
  };
}

const validateEmail = (email) => {
  const re = new RegExp(
    /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/
  );

  if (!re.test(email)) {
    const error = new Error('INVALID_USER');
    error.statusCode = 400;
    throw error;
  };
}

module.exports = {
  validatePassword,
  validateEmail
}