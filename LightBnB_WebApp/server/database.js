const { Pool } = require('pg');

const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});
pool.connect();

const properties = require('./json/properties.json');
const users = require('./json/users.json');

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function (email) {

  return pool
    .query("SELECT * FROM users WHERE email = $1", [email])
    .then((result) => {
      return result.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
    });

}


exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function (id) {
  // return Promise.resolve(users[id]);

  return pool
    .query("SELECT * FROM users WHERE id = $1", [id])
    .then((result) => {
      console.log(result.rows);
      return result.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
    });


}
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser = function (user) {

  return pool
    .query(`INSERT INTO users (name,email,password) VALUES ($1,$2,$3) RETURNING *`, [user.name, user.email, user.password])
    .then((result) => {
      console.log(result.rows);
      return result.rows
    })
    .catch((err) => {
      console.log(err.message);
    });

}
exports.addUser = addUser;

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>} A promise to the reservations.
 */

const getFulfilledReservations = function (guest_id, limit = 10) {

  const queryString = `
    SELECT properties.*, reservations.*, AVG(rating) as average_rating
    FROM reservations
    JOIN properties ON reservations.property_id = properties.id
    JOIN property_reviews ON properties.id = property_reviews.property_id
    WHERE reservations.guest_id = $1
    AND reservations.end_date < now()::date
    GROUP BY properties.id, reservations.id
    ORDER BY reservations.start_date 
    LIMIT $2;`;
  const params = [guest_id, limit];
  return pool
    .query(queryString, params)
    .then((result) => {
      return result.rows;
    })
    .catch((err) => {
      console.log(err.message);
    });

}
exports.getFulfilledReservations = getFulfilledReservations;

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */

const getAllProperties = (options, limit = 10) => {

  const queryParams = [];
  let queryString = `
    SELECT properties.*, avg(property_reviews.rating) as average_rating, count(property_reviews.rating) as review_count
    FROM properties
   LEFT JOIN property_reviews ON properties.id = property_id
    `;

  // Filter properties located in a specific city
  if (options.city) {
    queryParams.push(`%${options.city}%`);
    queryString += `WHERE city LIKE $${queryParams.length} `;
  }

  //Get all listings owned by a specific owner
  if (options.owner_id) {
    queryParams.push(options.owner_id);
    queryString += ` WHERE owner_id = $${queryParams.length} `;
  }
  console.log("*****", options);

  //Return properties between given price range
  if (options.maximum_price_per_night) {
    queryParams.push(options.maximum_price_per_night * 100);
    if (queryParams.length > 1) {
      queryString += ` AND cost_per_night <= $${queryParams.length} `;
    } else {
      queryString += ` WHERE cost_per_night <= $${queryParams.length} `;
    }
  }

  if (options.minimum_price_per_night) {
    queryParams.push(options.minimum_price_per_night * 100);
    if (queryParams.length > 1) {
      queryString += ` AND cost_per_night >= $${queryParams.length} `;
    } else {
      queryString += ` WHERE cost_per_night >= $${queryParams.length} `;
    }
  }
  queryString += `
    GROUP BY properties.id`

  //Return properties having rating of greater than or equal to minimum_rating
  if (options.minimum_rating) {
    queryParams.push(options.minimum_rating);
    queryString += ` HAVING AVG(rating)  >= $${queryParams.length} `;
  }

  queryParams.push(limit);
  queryString += `  
    ORDER BY cost_per_night
    LIMIT $${queryParams.length};
    `;

  console.log("++++++99999", queryString, queryParams);

  return pool.query(queryString, queryParams).then((res) => res.rows);
};

exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */

const addProperty = function (property) {

  return pool
    .query(`INSERT INTO properties (owner_id,title, description,thumbnail_photo_url,cover_photo_url,
    cost_per_night,parking_spaces,number_of_bathrooms,number_of_bedrooms,country,street,city,province,post_code) 
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) RETURNING *`, [property.owner_id, property.title, property.decription,
    property.thumbnail_photo_url, property.cover_photo_url, property.cost_per_night, property.parking_spaces,
    property.number_of_bathrooms, property.number_of_bedrooms, property.country, property.street, property.city,
    property.province, property.post_code])
    .then((result) => {
      console.log(result.rows);
      return result.rows
    })
    .catch((err) => {
      console.log(err.message);
    });

}
exports.addProperty = addProperty;

/**
 * Add a reservation to the database
 * @param {{}} property An object containing all of the reservations details.
 * @return {Promise<{}>} A promise to the reservation.
 */

const addReservation = function (reservation) {
  return pool.query(`
    INSERT INTO reservations (start_date, end_date, property_id, guest_id)
    VALUES ($1, $2, $3, $4) RETURNING *;
  `, [reservation.start_date, reservation.end_date, reservation.property_id, reservation.guest_id])
    .then(res => res.rows[0])
}

exports.addReservation = addReservation;



/**
 * Gets upcoming reservations
 * @param {{}} property guest_id
 * @return {Promise<{}>} A promise to the reservations of user
 */
const getUpcomingReservations = function (guest_id, limit = 10) {
  const queryString = `
  SELECT properties.*, reservations.*, avg(rating) as average_rating
  FROM reservations
  JOIN properties ON reservations.property_id = properties.id
  JOIN property_reviews ON properties.id = property_reviews.property_id 
  WHERE reservations.guest_id = $1
  AND reservations.start_date > now()::date
  GROUP BY properties.id, reservations.id
  ORDER BY reservations.start_date 
  LIMIT $2;`;
  const params = [guest_id, limit];
  return pool.query(queryString, params)
    .then(res => res.rows);
}

exports.getUpcomingReservations = getUpcomingReservations;


/**
 * Gets individual reservations
 * @param {{}} property Guest_id
 * @return {Promise<{}>} A promise to reservations of the guest with that id
 */

const getIndividualReservation = function (reservationId) {
  const queryString = `SELECT * FROM reservations WHERE reservations.id = $1`;
  return pool.query(queryString, [reservationId])
    .then(res => res.rows[0]);
}

exports.getIndividualReservation = getIndividualReservation;


/**
 * Updates a reservation
 * @param {{}} property An object containing all of the reservation details.
 * @return {Promise<{}>} A promise to the reservation.
 */

const updateReservation = function (reservationData) {

  console.log("update reservation")
  let queryString = `UPDATE reservations SET `;
  const queryParams = [];
  if (reservationData.start_date) {
    queryParams.push(reservationData.start_date);
    queryString += `start_date = $1`;
    if (reservationData.end_date) {
      queryParams.push(reservationData.end_date);
      queryString += `, end_date = $2`;
    }
  } else {
    queryParams.push(reservationData.end_date);
    queryString += `end_date = $1`;
  }
  queryString += ` WHERE id = $${queryParams.length + 1} RETURNING *;`
  queryParams.push(reservationData.reservation_id);
  console.log("start_date", reservationData.start_date)
  console.log("end_date", reservationData.end_date)
  console.log("id", reservationData.reservation_id)
  console.log("query string +++", queryString,queryParams);

  return pool.query(queryString, queryParams)
    .then(res => res.rows[0])
    .catch(err => console.error(err));
}

exports.updateReservation = updateReservation;


/**
 * Delete a reservation from  the database
 * @param {{}} property reservation_id
 * @return {Promise<{}>} A promise to console log success
 */
const deleteReservation = function (reservationId) {
  const queryParams = [reservationId];
  const queryString = `DELETE FROM reservations WHERE id = $1`;
  return pool.query(queryString, queryParams)
    .then(() => console.log("Successfully deleted!"))
    .catch(() => console.error(err));

};

exports.deleteReservation = deleteReservation;

/**
 * Gets review of  a property 
 * @param {{}} property property id
 * @return {Promise<{}>} A promise to the property.
 */
const getReviewsByProperty = function (propertyId) {
  const queryString = `
  SELECT property_reviews.id, property_reviews.rating AS review_rating, property_reviews.message AS review_text,      users.name, properties.title AS property_title, reservations.start_date, reservations.end_date  
   FROM property_reviews     JOIN reservations ON reservations.id = property_reviews.reservation_id      
   JOIN properties ON properties.id = property_reviews.property_id  
     JOIN users ON users.id = property_reviews.guest_id   
    WHERE properties.id = $1  
    ORDER BY reservations.start_date ASC;
    
  `
  const queryParams = [propertyId];
  console.log("QQQQQQ", queryString)
  return pool.query(queryString, queryParams).then(res => res.rows)
}

exports.getReviewsByProperty = getReviewsByProperty;


/**
 * Add a review to the database
 * @param {{}} property An object containing all of the review details.
 * @return {Promise<{}>} A promise to the review.
 */
const addReview = function (review) {
  const queryString = `
    INSERT INTO property_reviews (guest_id, property_id, reservation_id, rating, message) 
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
  `;
  const queryParams = [review.guest_id, review.property_id, review.id, parseInt(review.rating), review.message];
  return pool.query(queryString, queryParams).then(res => res.rows);
}

exports.addReview = addReview;
