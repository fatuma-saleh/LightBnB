SELECT city,COUNT(reservations.*) AS total_reservations
FROM properties
JOIN reservations ON property_id =properties.id
GROUP BY city
ORDER BY COUNT(reservations.*) DESC;


