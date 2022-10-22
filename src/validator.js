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

module.exports = {
  validatePassword
}