var map;
var service;
var infoWindow;


function initialize() {
    var work_place = new google.maps.LatLng(37.762695, -122.408930);
    infoWindow = new google.maps.InfoWindow();

    map = new google.maps.Map(document.getElementById('map'), {
        center: work_place,
        zoom: 15
    });

    var request = {
        location: work_place,
        // radius: '500',
        type: ["restaurant"],
        rankBy: google.maps.places.RankBy.DISTANCE, 
    };

    service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, callback);
}

function callback(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
        console.log('Results:');
        for (var i = 0; i < results.length; i++) {
            restaurantName = results[i].name;
            createMarker(results[i]);
            console.log(restaurantName);
        }
    } else {
        console.error("PlacesServiceStatus Error:", status);
    }
}