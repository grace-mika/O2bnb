const database = require('./dataSource');

const signUp = async (
  userName,
  password,
  email,
  date_of_birth
) => {
  try {
    return await database.query(
      `INSERT INTO users(
                userName,
                password,
                email,
                date_of_birth
            ) VALUES (?, ?, ?, ?)
            `,
      [userName, password, email, date_of_birth]
    );
  } catch (err) {
    const error = new Error('INVALID_DATA_INPUT');
    error.statusCode = 500;
    throw error;
  }
};