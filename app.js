var map;
var service;
var infoWindow;

placeListContainer = document.getElementById('place-list-container');
searchButton = document.getElementById('search');

function initialize() {
    var work_place = new google.maps.LatLng(37.762695, -122.408930);
    infoWindow = new google.maps.InfoWindow();

    map = new google.maps.Map(document.getElementById('map'), {
        center: work_place,
        zoom: 15,
        mapId: "DEMO_MAP_ID",
    });

    var request = {
        location: work_place,
        // radius: '500',
        type: ["restaurant"],
        rankBy: google.maps.places.RankBy.DISTANCE, 
    };

    searchButton.addEventListener("click", function() {
        searchNearby(request);
    });

    // service = new google.maps.places.PlacesService(map);
    // service.nearbySearch(request, callback);
}

function searchNearby(request) {
    console.log("searched")
    service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, randomSelection);
}

function getRandomIndex(max) {
    return Math.floor(Math.random() * max);
}

function randomSelection(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
        var resultsLength = results.length;
        var randomIndex = getRandomIndex(resultsLength);
        var randomRestaurant = results[randomIndex];
        createMarker(randomRestaurant);
        console.log("Random Selection:" + randomRestaurant.name);
    } else {
        console.error("PlacesServiceStatus Error:", status);
    }
}

function callback(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
        console.log('Results:');
        for (var i = 0; i < results.length; i++) {
            restaurantName = results[i].name;
            const place = document.createElement("div");
            place.classList.add("place");
            place.textContent = restaurantName;
            placeListContainer.appendChild(place);
            createMarker(results[i]);
            // console.log(restaurantName);
        }
    } else {
        console.error("PlacesServiceStatus Error:", status);
    }
}

function createMarker(place) {
    const marker = new google.maps.marker.AdvancedMarkerElement({
        map: map,
        position: place.geometry.location,
        title: place.name,
    });
}