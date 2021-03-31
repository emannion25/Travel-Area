function RadiusControl(controlDiv, map, theCircle, myRadius) {
  // Set CSS for the control border.
  const controlUI = document.createElement("div");
  controlUI.style.backgroundColor = "#fff";
  controlUI.style.border = "2px solid #fff";
  controlUI.style.borderRadius = "3px";
  controlUI.style.boxShadow = "0 2px 6px rgba(0,0,0,.3)";
  controlUI.style.cursor = "pointer";
  controlUI.style.margin = "5px";
  controlUI.style.textAlign = "center";
  controlUI.title = "Click to adjust radius";
  controlDiv.appendChild(controlUI);
  // Set CSS for the control interior.
  const controlText = document.createElement("div");
  controlText.style.color = "rgb(25,25,25)";
  controlText.style.fontFamily = "Roboto,Arial,sans-serif";
  controlText.style.fontSize = "16px";
  controlText.style.lineHeight = "38px";
  controlText.style.paddingLeft = "5px";
  controlText.style.paddingRight = "5px";
  controlText.innerHTML = myRadius / 1000 + "km Radius";
  controlUI.appendChild(controlText);
  // Setup the click event listeners
  controlUI.addEventListener("click", () => {
    theCircle.setRadius(myRadius);
    map.fitBounds(theCircle.getBounds())
  });
}

function coordControl(controlDiv, map, marker, userCoords) {
  // Set CSS for the control border.
  const controlUI = document.createElement("div");
  controlUI.style.backgroundColor = "#fff";
  controlUI.style.border = "2px solid #fff";
  controlUI.style.borderRadius = "3px";
  controlUI.style.boxShadow = "0 2px 6px rgba(0,0,0,.3)";
  controlUI.style.cursor = "pointer";
  controlUI.style.marginLeft = "10px";
  controlUI.style.textAlign = "center";
  controlUI.title = "Click to change location";
  controlDiv.appendChild(controlUI);
  // Set CSS for the control interior.
  const controlText = document.createElement("div");
  controlText.style.color = "rgb(25,25,25)";
  controlText.style.fontFamily = "Roboto,Arial,sans-serif";
  controlText.style.fontSize = "12px";
  controlText.style.lineHeight = "20px";
  controlText.style.paddingLeft = "5px";
  controlText.style.paddingRight = "5px";
  controlText.innerHTML = "Find Coordinates";
  controlUI.appendChild(controlText);
  // Setup the click event listeners
  controlUI.addEventListener("click", () => {
    const location = userCoords.value.split(",", 2);  
    const myLat = parseFloat(location[0]);
    const myLng = parseFloat(location[1]);
    function inRange(number,min,max){
        if ( (number >= min) && (number <= max) ){
            return true;
        } else {
            return false;
        };
    }
    if ( inRange(myLat,-90,90) && inRange(myLng,-180,180) ){
        const newcentre = {
        lat: myLat,
        lng: myLng
        };
        map.setCenter(newcentre);
        marker.setPosition(newcentre);
    }  
  });
}

function myInfoBox(controlDiv) {
  // Set CSS for the control border.
  const controlUI = document.createElement("div");
  controlUI.style.backgroundColor = "#fff";
  controlUI.style.border = "2px solid #fff";
  controlUI.style.borderRadius = "3px";
  controlUI.style.boxShadow = "0 2px 6px rgba(0,0,0,.3)";
  controlUI.style.marginLeft = "15px";
  controlUI.style.width = "250px";
  controlUI.style.textAlign = "justify";
  //controlUI.title = "no title";
  controlDiv.appendChild(controlUI);
  // Set CSS for the control interior.
  const controlText = document.createElement("div");
  controlText.style.color = "rgb(25,25,25)";
  controlText.style.fontFamily = "Roboto,Arial,sans-serif";
  controlText.style.fontSize = "12px";
  controlText.style.lineHeight = "15px";
  controlText.style.paddingLeft = "5px";
  controlText.style.paddingRight = "5px";
  controlText.innerHTML = "<b>Note:</b> Some features are unavailable since the API key is not public. "
                           + "However most features still work such as finding your travel area for "
                           + "different radius lengths and moving the marker. "
                           + "You can set your location using Latitude, Longitude.";
  controlUI.appendChild(controlText);
}

function initMap() {
  const mycentre = {
    lat: 53.274,
    lng: -9.049
  };
  // Create the map.
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 12,
    center: mycentre,
    mapTypeId: "terrain",
  });
  const myCircle = new google.maps.Circle({
    strokeColor: "#FF0000",
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: "white",
    fillOpacity: 0.1,
    map: map,
    center: mycentre,
    radius: 5000,
  });

  const marker = new google.maps.Marker({
    position: mycentre,
    map: map,
    draggable: true
  });


  const contentString =
    '<div id="infowindow-content">' +

    "<p>Drag to move circle or" + "<br>" +
    "click elsewhere to change centre.</p>" +
    "<p>Use on screen buttons to set radius</p>" +

    "</div>";
  const infowindow = new google.maps.InfoWindow({
    content: contentString,
  });

  infowindow.open(map, marker);
  
  marker.addListener("click", () => {
    infowindow.open(map, marker);
  });

  map.addListener("click", (myevent) => {
    map.setCenter(myevent.latLng);
    marker.setMap(null);
    marker.setPosition(myevent.latLng);
    marker.setMap(map);
  });

  marker.addListener("position_changed", () => {
    myCircle.setMap(null);
    myCircle.setCenter(marker.position);
    myCircle.setMap(map);
  });


  // Create DIV to hold the control and call the radiusControl()
  // constructor passing in this DIV.
  const radiusControlDiv = document.createElement("div");
  RadiusControl(radiusControlDiv, map, myCircle, 5000);
  RadiusControl(radiusControlDiv, map, myCircle, 10000);
  RadiusControl(radiusControlDiv, map, myCircle, 20000);
  map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(radiusControlDiv);
  
  // Create the search box and link it to the UI element.
  const input = document.getElementById("pac-input");
  const searchBox = new google.maps.places.SearchBox(input);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
  // Bias the SearchBox results towards current map's viewport.
  map.addListener("bounds_changed", () => {
    searchBox.setBounds(map.getBounds());
  });

  searchBox.addListener("places_changed", () => {
    const places = searchBox.getPlaces();

    if (places.length == 0) {
      return;
    }

    // For each place, get the icon, name and location.
    const bounds = new google.maps.LatLngBounds();
    places.forEach((place) => {
      if (!place.geometry) {
        console.log("Returned place contains no geometry");
        return;
      }

      marker.setMap(null);
      marker.setPosition(place.geometry.location);
      marker.setMap(map);

      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });

    map.fitBounds(bounds);    
  });
  const myInfoDiv = document.createElement("div");
  myInfoBox(myInfoDiv);
  map.controls[google.maps.ControlPosition.LEFT_TOP].push(myInfoDiv);
  
  const coordInput = document.getElementById("coord-input");
  map.controls[google.maps.ControlPosition.LEFT_TOP].push(coordInput);
  
  const coordControlDiv = document.createElement("div");
  coordControl(coordControlDiv, map, marker, coordInput);
  map.controls[google.maps.ControlPosition.LEFT_TOP].push(coordControlDiv);
}
