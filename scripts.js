// Calls GoogleMaps API on page via HTML script
let map;
let marker;

function initMap() {
  var defaultCenter = {
    lat: 38.7832469,
    lng: -100.0114442
  };
    map = new google.maps.Map(document.getElementById('map'), {
    zoom: 4,
    center: defaultCenter
  });
}


let userZip = 0;
let userLat = 0;
let userLong = 0;

// Get user's zip code
$('form').on('submit', function(e) {
  e.preventDefault();
  numZip = $('#zip').val();
  stringZip = numZip.toString();
  stringRadius = $('#radius').val();

  console.log(stringRadius + " mile radius selected");

  if (stringZip.length === 5) {
    userZip = numZip;
    getBreweries();
  } else {
    $("#div1").fadeIn(200).delay(3000).fadeOut(200);
  }
});

function getBreweries() {

  // Get users geolocation via zip code
  let googleAPI = 'http://maps.googleapis.com/maps/api/geocode/json?address=';
  let urlZipCode = `${googleAPI}${userZip}`

  $.get(urlZipCode).then(function(mapsResult) {
    userLat = mapsResult.results[0].geometry.location.lat;
    userLong = mapsResult.results[0].geometry.location.lng;

    // BreweryDB API lookup for breweries in 5 mile radius
    let proxie = 'http://galvanize-cors-proxy.herokuapp.com/';
    let breweryAPI = 'http://api.brewerydb.com/v2/search/geo/point';
    let apiKey = 'c97314af1e304cd0ad2f0d5e2cff7c18';
    let urlLatLng = `${proxie}${breweryAPI}?lat=${userLat}&lng=${userLong}&radius=${stringRadius}&key=${apiKey}`

    $.get(urlLatLng).then(function(breweryResults) {
      console.log('All reported breweries: ' + breweryResults.data.length);

      // Filter out closed breweries
      let numOpenBreweries = 0;
      for (var i = 0; i < breweryResults.data.length; i++) {
        if (breweryResults.data[i].isClosed === "N") {
          numOpenBreweries++;
        }
      };

      console.log(breweryResults);

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

      console.log(randomLimit + " breweries to show");

      // Picks unique breweries equivelent to the amount determined by randomSize() and puts them into breweryIndexes[]. Thanks stack overflow for this elegant code.
      let breweryIndexes = [];

      function indexPicker() {

        while (breweryIndexes.length < randomLimit) {
          let num = Math.floor(Math.random() * numOpenBreweries);

          if (breweryIndexes.indexOf(num) > -1) continue;
          breweryIndexes[breweryIndexes.length] = num;
        }
      };

      indexPicker();

      console.log(breweryIndexes, "indexes to append");

      // Appending brewery info to the DOM
      function appendBreweries() {
        $('#landing').empty();

        initMap();

        for (var i = 0; i < randomLimit; i++) {
          console.log(breweryResults.data[breweryIndexes[i]]);
          let breweryObj = breweryResults.data[breweryIndexes[i]];

          marker = new google.maps.Marker({
            position: {lat: breweryObj.latitude, lng: breweryObj.longitude},
            map: map,
            title: breweryObj.brewery.name
          });

          // To add the marker to the map, call setMap();
          marker.setMap(map);

          if (breweryObj.brewery.images == undefined) {
            $("#landing").append(`<div class="brew-container d-inline-block"><img class="col-xs-3 icon-margin" src="./assets/images/no-image-available-icon.jpg" alt="brewery icon" style="width:80px;height:80px;"><div class="col-xs-9"><h5 class="">${breweryObj.brewery.name}</h5><p>${breweryObj.streetAddress}</p><p>${breweryObj.phone}</p></div></div>`).hide().fadeIn(200);
          } else {
            $("#landing").append(`<div class="brew-container d-inline-block"><img class="col-xs-3 icon-margin" src=${breweryObj.brewery.images.squareMedium} alt="brewery icon" style="width:80px;height:80px;"><div class="col-xs-9"><h5 class="">${breweryObj.brewery.name}</h5><p>${breweryObj.streetAddress}</p><p>${breweryObj.phone}</p></div></div>`).hide().fadeIn(200);
          };
        };
      };

      appendBreweries();

      // $("#map").hide()

      // Call Google Maps again but with new brewery pins
      // function initMap() {
      //
      //   var myLatLng = {
      //     lat: userLat,
      //     lng: userLong
      //   };
      //
      //   var map = new google.maps.Map(document.getElementById('map'), {
      //     zoom: 4,
      //     center: myLatLng
      //   });
      //
      //   var marker = new google.maps.Marker({
      //     position: myLatLng,
      //     map: map,
      //     title: 'Hello World!'
      //   });
      // }


    });
  });
};
