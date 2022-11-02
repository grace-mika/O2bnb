const { dataSource } = require('./data-source');

const getUserByEmail = async(email) => {
  const [ result ] = await dataSource.query (
    `SELECT
      id,
      name,
      email,
      password,
      date_of_birth
    FROM users
    WHERE email = ?
    `, [email]
  );

  return result;
}

const getUserById =async(id) => {
  const [ result ] = await dataSource.query(
    `SELECT
      id,
      name,
      email,
      password,
      date_of_brith
    FROM users
    WHERE id = ?
    `, [ id ]
  );

  return result;
} ;

const createUser = async(name, email, hashedPassword, date_of_birth) => {
  const result = await dataSource.query(
    `INSERT INTO users(
      name,
      email,
      password,
      date_of_birth
    ) VALUES(?, ?, ?, ?)
    `, [ name, email, hashedPassword, dateOfBirth ]
  );
  return result;
};


const checkUser = async (email) => {
  
  const [result] = await DataSource.query(
    `SELECT EXISTS (
      SELECT *
      FROM users
      WHERE email = ?) AS boolean`,
      [email]
  )
  console.log(result.boolean)
  return result;
}

module.exports = {
  getUserByEmail,
  getUserById,
  createUser,
  checkUser
}