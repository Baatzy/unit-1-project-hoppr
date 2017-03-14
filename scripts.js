let userZip = 0;
let userLat = 0;
let userLong = 0;

// Get user's zip code
$('form').on('submit', function(e) {
  e.preventDefault();
  numZip = $('#zip').val();
  stringZip = numZip.toString();

  if (stringZip.length === 5) {
    userZip = numZip;
    getBreweries();
  } else {
  $("#div1").fadeIn(200).delay(2000).fadeOut(200);
  }
});

function getBreweries () {

  // Get users geolocation via zip code
  $.ajax({
    url: `http://maps.googleapis.com/maps/api/geocode/json?address=${userZip}`,
    method: "GET"
  }).then(function (mapsResult) {
    userLat = mapsResult.results[0].geometry.location.lat;
    userLong = mapsResult.results[0].geometry.location.lng;

  // BreweryDB API lookup for breweries in 10mile radius
    $.ajax({
      url: `http://galvanize-cors-proxy.herokuapp.com/http://api.brewerydb.com/v2/search/geo/point?lat=${userLat}&lng=${userLong}&key=c97314af1e304cd0ad2f0d5e2cff7c18`,
      method: "GET"
    }).then(function (breweryResults) {
      console.log('all reported breweries: ' + breweryResults.data.length);

      // Filter out closed breweries
      let numOpenBreweries = 0;

      for (var i = 0; i < breweryResults.data.length; i++) {
        if (breweryResults.data[i].isClosed === "N") {
          numOpenBreweries ++;
        }
      }
      console.log('open breweries is: ' + numOpenBreweries);

      // Randomly select 10 breweries



      // for (var i = 0; i < breweryResults.data.length; i++) {
      //   if (breweryResults.data[i].isClosed === "N") {
      //     breweryNames.push(breweryResults.data[i].brewery.name);
      //     $('.landing').append(`<li>${breweryNames[i]}, ${i}</li>`);
      //   }
      // }

      let breweryNames = [];
      // Separate loop for appending
    });
  });
}
