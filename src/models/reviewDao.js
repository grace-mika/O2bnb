const dataSource = require('./dataSource');

const getReviews = async(productId) => {
  let result = {};
  const stars = await dataSource.query(
    `SELECT
      COUNT(id) AS total,
      SUM(clean_star + communication_star + location_star) / (COUNT(id)*3) AS totalAvg,
      AVG(clean_star) as cleanAvg,
      AVG(communication_star) as communicationAvg,
      AVG(location_star) as locationAvg
    FROM product_reviews
    WHERE product_id = ${productId};
    `
  );

  const reviewsByProduct = await dataSource.query(
    `SELECT
      @rownum:=@rownum+1 as id,
      DATE_FORMAT(reviews.created_at, '%Y-%m-%d') as created_at,
      reviews.content,
      users.name,
    FROM product_reviews
    JOIN users ON product_reviews.user_id = users.id
    WHERE reviews.product_id = ${productId} AND (@rownum:=0)=0;
    `
  );
  
  result.stars = stars;
  result.reviews = reviewsByProduct;

  return result;
};

module.exports = {
  getReviews
}