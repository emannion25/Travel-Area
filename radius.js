function RadiusControl(controlDiv, theCircle, myRadius) {
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
  });
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
    fillColor: "red",
    fillOpacity: 0.15,
    map: map,
    center: mycentre,
    radius: 5000,
  });

  const marker = new google.maps.Marker({
    position: mycentre,
    map: map,
    draggable: true
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
  RadiusControl(radiusControlDiv, myCircle, 5000);
  RadiusControl(radiusControlDiv, myCircle, 10000);
  RadiusControl(radiusControlDiv, myCircle, 20000);
  map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(radiusControlDiv);
}
