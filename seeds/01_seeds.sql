INSERT INTO users (name, email, password)
VALUES ('Fatuma', 'sfatex@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u'),
('Asmanur', 'asu@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u'),
('Welid', 'kingwawa@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u'),
('Liala', 'lilu@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u'),
('Semir', 'ssw@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u'),
('Said', 'y78_3f@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u');


INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, 
cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street,
 city, province, post_code)
 VALUES(1,'Speed lamp','description','https://images.pexels.com/photos/2086676/pexels-photo-2086676.jpeg?auto=compress&cs=tinysrgb&h=350',
 'https://images.pexels.com/photos/2086676/pexels-photo-2086676.jpeg',867, 4, 4, 6,'Canada', 'Brybeck Crescent', 'Kitchener','Ontario','N2M5G4'),
 (2,'Headed know','description','https://images.pexels.com/photos/2080018/pexels-photo-2080018.jpeg?auto=compress&cs=tinysrgb&h=350','https://images.pexels.com/photos/2080018/pexels-photo-2080018.jpeg',
 650,3,3,6,'Canada','1392 Gaza Junction','Toronto','Ontario','N1X7G6'),
 (3,'Game fill','description','images.pexels.com/photos/1756826/pexels-photo-1756826.jpeg?auto=compress&cs=tinysrgb&h=350','https://images.pexels.com/photos/1756826/pexels-photo-1756826.jpeg',
 780,2,4,6,'Canada', '834 Buwmi Road','Rotunif','Newfoundland And Labrador','58224'),
 (1,'Port out','description' ,'https://images.pexels.com/photos/1475938/pexels-photo-1475938.jpeg?auto=compress&cs=tinysrgb&h=350', 'https://images.pexels.com/photos/1475938/pexels-photo-1475938.jpeg',1100,2,2,4,
 'Canada','1392 Gaza Junction','Upetafpuv', 'Nova Scotia','C5D8H5');
 

 INSERT INTO reservations (start_date,end_date,property_id,guest_id)
 VALUES ('2018-09-11','2018-09-26',2,3),
 ('2019-01-04', '2019-02-01', 2,2),
 ('2018-05-01', '2018-05-27', 1,4),
 ('2015-09-13', '2015-09-30', 3,5),
 ('2023-04-23', '2023-05-02', 3,4);


 INSERT INTO property_reviews (guest_id ,property_id,reservation_id,rating,message)
 VALUES(3,2,1,5,'messages'),
 (4,3,5,4,'messages'),
 (4,1,3,3,'messages'),
 (5,3,5,4,'messages');