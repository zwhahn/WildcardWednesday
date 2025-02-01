var map;
var service;
var infoWindow;
var request;
var searchCircle;
var centerCircle;
var marker;
const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

const averageWalkingSpeedMeterPerSecond = 1.42; //[m/s] source: https://en.wikipedia.org/wiki/Preferred_walking_speed
const averageWalkingSpeedMeterPerMinute = 1.42 * 60; //[m/min]
const rangeFillColor = '#89CFF0'

const placeListContainer = document.getElementById('place-list-container');
const searchButton = document.getElementById('search');
const rangeInput = document.getElementById("distance");
rangeInput.oninput = function () {
    getRangeValue();
    updateWalkingTime();
};
const walkingTime = document.getElementById("walking-time");
const restaurantChoice = document.getElementById("restaurant-choice");

updateWalkingTime(); //Set initial value

function initialize() {
    var work_place = new google.maps.LatLng(37.762695, -122.408930);
    infoWindow = new google.maps.InfoWindow();
    
    map = new google.maps.Map(document.getElementById('mapContainer'), {
        center: work_place,
        zoom: 14,
        mapId: "DEMO_MAP_ID",
    });
    
    
    var distance = rangeInput.value;
    console.log(`Distance: ${distance}`);
    
    request = {
        location: work_place,
        radius: distance,
        type: "restaurant",
        // rankBy: google.maps.places.RankBy.DISTANCE, 
    };
    
    drawSearchRadius(work_place);
    drawCenterCircle(work_place);
    
    searchButton.addEventListener("click", function() {
        searchNearby(request);
    });
}

function drawSearchRadius(centerLoc) {
    searchCircle = new google.maps.Circle({
        map: map,
        radius: 1100,
        fillColor: rangeFillColor,
        center: centerLoc,
        strokeColor: `#6495ED`
    });
    return;
}

function drawCenterCircle(centerLoc) {
    centerCircle = new google.maps.Circle({
        map: map,
        center: centerLoc,
        radius: 20,
        fillColor: 'blue',
        fillOpacity: 1
    });
    return;
}

function searchNearby(request) {
    console.log("searched");
    console.log(`Searched distance: ${request.radius}`)
    service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, randomSelection);
    console.log("After nearbySearch call");
}

function getRandomIndex(max) {
    return Math.floor(Math.random() * max);
}

function randomSelection(results, status) {
    console.log("Random Selection started");
    if (status == google.maps.places.PlacesServiceStatus.OK) {
        var resultsLength = results.length;
        var randomIndex = getRandomIndex(resultsLength);
        var randomRestaurant = results[randomIndex];
        hackerEffect(randomRestaurant.name);
        createMarker(randomRestaurant);
        console.log('random selection');
        hackerEffect(randomRestaurant.name);
        restaurantChoice.textContent = `${randomRestaurant.name}`;
    } else {
        console.error("PlacesServiceStatus Error:", status);
    }
}

function callback(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
        // console.log('Results:');
        for (var i = 0; i < results.length; i++) {
            console.log(`Results: ${results[i]}`);
            restaurantName = results[i].name;
            console.log(`prehacler effect`)
            hackerEffect(restaurantName);
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
    removeMarker();
    marker = new google.maps.marker.AdvancedMarkerElement({
        map: map,
        position: place.geometry.location,
        title: place.name,
    });
}


function removeMarker() {
    if (marker) {
        marker.map = null; // Removes the marker from the map
        marker = null; // Optionally clear the reference
    } else {
        console.warn("No marker to remove!");
    }
}


function getRangeValue() {
    var distance = rangeInput.value;
    searchCircle.setRadius(parseInt(distance, 10));
    request.radius = distance;
    return distance;
}

function updateWalkingTime() {
    var calcWalkTime = Math.round(distance.value / averageWalkingSpeedMeterPerMinute);
    walkingTime.textContent = `${calcWalkTime}min walk`;
}

function hackerEffect(restaurantName) {
    console.log(`restaurant name: ${restaurantName}`);
    var restaurantNameSplit = restaurantName.split("");
    let iterations = 0;

    const interval = setInterval(() => {
        restaurantChoice.textContent = restaurantNameSplit
          .map((letter, index) => {
            
            if (index < iterations) {
                return restaurantName[index];
            }
            
            return letters[Math.floor(Math.random() * 26)]
        })
        .join("");

        if (iterations >= restaurantName.length) clearInterval(interval);

        iterations += 1/3;
    }, 30)
}