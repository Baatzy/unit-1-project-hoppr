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
    $("#div1").fadeIn(200).delay(3000).fadeOut(200);
  }
});

function getBreweries () {

  // Get users geolocation via zip code
  let googleAPI = 'http://maps.googleapis.com/maps/api/geocode/json?address=';
  let urlZipCode = `${googleAPI}${userZip}`

  $.get(urlZipCode).then(function (mapsResult) {
    userLat = mapsResult.results[0].geometry.location.lat;
    userLong = mapsResult.results[0].geometry.location.lng;

  // BreweryDB API lookup for breweries in 10mile radius
    let proxie = 'http://galvanize-cors-proxy.herokuapp.com/';
    let breweryAPI = 'http://api.brewerydb.com/v2/search/geo/point';
    let apiKey = 'c97314af1e304cd0ad2f0d5e2cff7c18';
    let urlLatLng = `${proxie}${breweryAPI}?lat=${userLat}&lng=${userLong}&key=${apiKey}`

    $.get(urlLatLng).then(function (breweryResults) {
      console.log('All reported breweries: ' + breweryResults.data.length);

      // Filter out closed breweries
      let numOpenBreweries = 0;
      for (var i = 0; i < breweryResults.data.length; i++) {
        if (breweryResults.data[i].isClosed === "N") {
          numOpenBreweries ++;
        }
      };

      console.log('Breweries still in business: ' + numOpenBreweries);

      // Randomly select maxiumum 5 breweries and appends to DOM
      function randomSize() {

        if (numOpenBreweries < 1) {
          $("#div2").fadeIn(200).delay(3000).fadeOut(200);
          return;
        } else if (numOpenBreweries < 5) {
          return numOpenBreweries;
        } else {
          return 5;
        }
      };

      let randomLimit = randomSize();

      // Picks unique breweries equivelent to the amount determined by randomSize() and puts them into breweryIndexes[]. Thanks stack overflow for this elegant code.
      let breweryIndexes = [];

      function indexPicker () {

        while (breweryIndexes.length < randomLimit) {
          let num = Math.ceil(Math.random() * numOpenBreweries);

          if (breweryIndexes.indexOf(num) > -1) continue;
          breweryIndexes[breweryIndexes.length] = num;
        }
      };

      indexPicker();

      // Appending brewery info to the DOM
      function appendBreweries () {
        $('.landing').empty();

        for (var i = 0; i < randomLimit; i++) {
          console.log(breweryResults.data[breweryIndexes[i]]);
          $(".landing").append(`<li id="brew-box">${breweryResults.data[breweryIndexes[i]].brewery.name}</li>`);
        }
      };

      appendBreweries();




    });
  });
};
