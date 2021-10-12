// Creating connection to the lightBnB database
const { Pool } = require('pg');

const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});

const properties = require('./json/properties.json');
const users = require('./json/users.json');

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function(email) {
//   let user;
//   for (const userId in users) {
//     user = users[userId];
//     if (user.email.toLowerCase() === email.toLowerCase()) {
//       break;
//     } else {
//       user = null;
//     }
//   }
//   return Promise.resolve(user);
return pool
  .query("SELECT * FROM users WHERE email = $1",[email])
  .then((result) => {
    // console.log("****99999999",result.rows);
    return result.rows[0];
  })
  .catch((err) => {
    console.log(err.message);
  });

 }
//  getUserWithEmail("tristanjacobs@gmail.com");

exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
  // return Promise.resolve(users[id]);

  return pool
  .query("SELECT * FROM users WHERE id =$1",[id])
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
const addUser =  function(user) {
  // const userId = Object.keys(users).length + 1;
  // user.id = userId;
  // users[userId] = user;
  // return Promise.resolve(user);

  return pool
  .query(`INSERT INTO users (name,email,password) VALUES ($1,$2,$3) RETURNING *`,[user.name,user.email,user.password])
  .then((result) => {
    console.log(result.rows);
    return result.rows
  })
  .catch((err) => {
    console.log(err.message);
  });

}
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  // return getAllProperties(null, 2);

  return pool
  .query(`SELECT properties.*, reservations.* 
  FROM reservations
  JOIN properties ON property_id = properties.id
  WHERE reservations.guest_id = $1 AND reservations.end_date < now()::date`,[guest_id])
  .then((result) => {
   // console.log("++++",result.rows);
    return result.rows;
  })
  .catch((err) => {
    console.log(err.message);
  });

}
exports.getAllReservations = getAllReservations;


/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */

 const getAllProperties = (options, limit =10) => {
  // return pool
  //   .query(`SELECT * FROM properties LIMIT $1`, [limit])
  //   .then((result) => {
  //     // console.log(result.rows);
  //     return result.rows
  //   })
  //   .catch((err) => {
  //     console.log(err.message);
  //   });

  
    const queryParams = [];
    let queryString = `
    SELECT properties.*, avg(property_reviews.rating) as average_rating
    FROM properties
    JOIN property_reviews ON properties.id = property_id
    `;

    // Filter properties located in a specific city
    if (options.city) {
      queryParams.push(`%${options.city}%`);
      queryString += `WHERE city LIKE $${queryParams.length} `;
    }
    
     //Get all listings owned by a specific owner
    if(options.owner_id){
      queryParams.push(options.owner_id);
      queryString +=` WHERE owner_id = $${queryParams.length} `;
    }
    console.log("*****",options);

    //Return properties between given price range
    if(options.maximum_price_per_night){
      queryParams.push(options.maximum_price_per_night * 100);
      if(queryParams.length > 1){
      queryString += ` AND cost_per_night <= $${queryParams.length} `;
    }else{
      queryString += ` WHERE cost_per_night <= $${queryParams.length} `;
    }
  }
    
  if(options.minimum_price_per_night){
    queryParams.push(options.minimum_price_per_night * 100);
    if(queryParams.length > 1){
    queryString += ` AND cost_per_night >= $${queryParams.length} `;
  }else{
    queryString += ` WHERE cost_per_night >= $${queryParams.length} `;
  }
}

//Return properties having rating of greater than or equal to minimum_rating
if(options.minimum_rating){
  queryParams.push(options.minimum_rating);
  if(queryParams.length > 1){
  queryString += ` AND rating >= $${queryParams.length} `;
}else{
  queryString += ` WHERE rating >= $${queryParams.length} `;
}
}

    queryParams.push(limit); 
    queryString += `
    GROUP BY properties.id
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
const addProperty = function(property) {
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);
}
exports.addProperty = addProperty;
