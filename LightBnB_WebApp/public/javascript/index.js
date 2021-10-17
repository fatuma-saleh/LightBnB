// $(() => {
//   getAllListings().then(function( json ) {
//     propertyListings.addProperties(json.properties);
//     views_manager.show('listings');
//      $('.reserve-button').on('click', function() {
//       // (document).on('click','.reserve-button', function(){
//       const idData = $(this).attr('id').substring(17);
//     views_manager.show('newReservation', idData);
//     })
//   });
// });

$(() => { // jQuery shortcut for document.ready
  getAllListings().then(function( json ) {
    propertyListings.addProperties(json.properties);
    views_manager.show('listings');
    $(document).on('click','.reserve-button' , function() {
      const idData = $(this).attr('id').substring(17);
      views_manager.show('newReservation', idData);
    })
    
    // $('.review_details').on('click', function() {
    //   const idData = $(this).attr('id').substring(15);
    //   console.log(idData);
    // })
    
    
    // $('.review_details').on('click', function() {
      $(document).on('click','.review_details' , function() {
      const idData = $(this).attr('id').substring(15);
      views_manager.show('showReviews', idData);
    })

  });
});