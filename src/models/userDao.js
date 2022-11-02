
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

const getUserByEmail = async(email) => {
const [user] = await dataSource.query (
    `SELECT
      id,
      name,
      email,
      password
    FROM users
    WHERE email = ? ` , [email]
  )
}
