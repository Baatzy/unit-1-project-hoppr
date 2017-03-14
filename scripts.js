// Get users geolocation via zip code
var lat = '';
var lng = '';
var address = 98115
geocoder.geocode( { 'address': address}, function(results, status) {
  if (status == google.maps.GeocoderStatus.OK) {
     lat = results[0].geometry.location.lat();
     lng = results[0].geometry.location.lng();
  } else {
    alert("Geocode was not successful for the following reason: " + status);
  }
});
alert('Latitude: ' + lat + ' Logitude: ' + lng);


navigator.geolocation.getCurrentPosition(function (position) {
  position.coords.latitude
  position.coords.longitude


  let userLocation = "";

  // Scripts

  $.ajax({
    url: "http://galvanize-cors-proxy.herokuapp.com/http://api.brewerydb.com/v2/search/geo/point?lat=47.681436&lng=-122.326540&key=c97314af1e304cd0ad2f0d5e2cff7c18",
    method: "GET"
  }).then(function (results) {
    let breweryNames = [];

    for (var i = 0; i < results.data.length; i++) {
      if (results.data[i].isClosed === "N") {
        breweryNames.push(results.data[i].brewery.name);
        console.log(breweryNames);
        $('.landing').append(`<li>${breweryNames[i], i}</li>`);
      }
    }
  });

});
