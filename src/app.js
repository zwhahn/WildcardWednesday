// Initialize global variables
var map;
var service;
var infoWindow;
var request;
var prevRadius;
var searchCircle;
var centerCircle;
var marker;
var prevResults;

// Initialize global constants
const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";  // Used during 'hacker effect

const averageWalkingSpeedMeterPerSecond = 1.42; //[m/s] source: https://en.wikipedia.org/wiki/Preferred_walking_speed
const averageWalkingSpeedMeterPerMinute = 1.42 * 60; //[m/min]

const rangeFillColor = '#89CFF0'

// HTML Elements
const placeListContainer = document.getElementById('place-list-container');
const searchButton = document.getElementById('search');
const rangeInput = document.getElementById("distance");
rangeInput.oninput = function () {
    getRangeValue();
    updateWalkingTime();
};
const walkingTime = document.getElementById("walking-time");
const restaurantChoice = document.getElementById("restaurant-choice");

updateWalkingTime(); //Display initial value

function initialize() {
    // Establish center of map location and create the map
    var work_place = new google.maps.LatLng(37.762695, -122.408930);
    map = new google.maps.Map(document.getElementById('mapContainer'), {
        center: work_place,
        zoom: 14,
        mapId: "DEMO_MAP_ID",
    });
    
    // Create initial request
    var distance = rangeInput.value;
    request = {
        location: work_place,
        radius: distance,
        type: "restaurant"
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
    if (request.radius == prevRadius) {  // use same results if search radius hasn't changed
        randomSelection(prevResults);
        console.log("radius has not changed");
    }
    else {
        var prevRadius = request.radius;  // save search radius
        service = new google.maps.places.PlacesService(map); // Class that provides methods for search
        service.nearbySearch(request, randomSelection); // Use randomSelection as the callback function
    }
}

// Handle results from nearbySearch
function randomSelection(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
        prevResults = results;
        // Get length of results list, choose a random number in that range and then use that as the index
        var resultsLength = results.length;
        var randomIndex = getRandomIndex(resultsLength);
        var randomRestaurant = results[randomIndex];
        hackerEffect(randomRestaurant.name);
        createMarker(randomRestaurant);
    } else {
        console.error("PlacesServiceStatus Error:", status);
    }
}

function getRandomIndex(max) {
    return Math.floor(Math.random() * max);
}

// Add mark on map showing place location
// Remove a previous marker if it exists (only one location displayed at a time)
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
    } else {
        console.log("No marker to remove!");
    }
}

// Get distance from slider input
// Update radius visually on map and in request
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

// Inspired by Hyperplexed: https://youtu.be/W5oawMJaXbU?si=u1Bb4zosXCgWhaXS
function hackerEffect(restaurantName) {
    // Split restaurant name into an array of characters
    var restaurantNameSplit = restaurantName.split("");
    let iterations = 0; // Tracks progress of revealed letters

    const interval = setInterval(() => {
        // Modify restaurantChoice text by replacing letters with random characters
        restaurantChoice.textContent = restaurantNameSplit
          .map((letter, index) => {
            
            // If this index has already been reached, show the actual letter
            if (index < iterations) {
                return restaurantName[index];
            }
            // Otherwise, replace with a random letter from the alphabet
            return letters[Math.floor(Math.random() * 26)]
        })
        .join(""); // Convert array back into a string

        // Stop the effect when all letters are revealed
        if (iterations >= restaurantName.length) clearInterval(interval);

        // Increment iterations to gradually reveal letters
        iterations += 1/4;
    }, 15) // Repeat every 15ms
}