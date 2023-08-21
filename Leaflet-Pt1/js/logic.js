// Store our API endpoint as queryUrl.
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data) {
  // Once we get a response, send the data.features object to the createFeatures function.
  createFeatures(data.features);
});

// Create the base layers.
let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
})

let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
	attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});

// Create a baseMaps object.
let baseMaps = {
  "Street Map": street,
  "Topographic Map": topo
};

// Create an overlay object to hold our overlay.
let overlayMaps = {};

// Create our map, giving it the streetmap and earthquakes layers to display on load.
let map = L.map("map", {
  center: [37.09, -95.71],
  zoom: 5,
  layers: [street]
});

  // Create a layer control.
  // Pass it our baseMaps and overlayMaps.
  // Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps,{
    collapsed: false
  }).addTo(map);

function createFeatures(earthquakeData) {
  // Define the getColor function to assign color based on depth.
  for (let i = 0; i < earthquakeData.length; i++) {
    // Conditionals for depth 
    let color = "";
    if (earthquakeData[i].geometry.coordinates[2] > 90) {
      color = 'red';
    } else if (earthquakeData[i].geometry.coordinates[2] > 70) {
      color = 'orangered';
    } else if (earthquakeData[i].geometry.coordinates[2] > 50) {
      color = 'orange';
    } else if (earthquakeData[i].geometry.coordinates[2] > 30) {
      color = 'yellow';
    } else if (earthquakeData[i].geometry.coordinates[2] > 10) {
      color = 'greenyellow';
    } else {
      color = 'green';
    }

  // Define a function that we want to run once for each feature in the features array.
  // Give each feature a popup that describes the place, magnitude, and depth of the earthquake.
  function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>Magnitude: ${feature.properties.mag}</p><p>Depth: ${feature.geometry.coordinates[2]}</p>`);
  }

  // Create a GeoJSON layer that contains the features array on the earthquakeData object.
  // Run the onEachFeature function once for each piece of data in the array.
  L.circle([earthquakeData[i].geometry.coordinates[1], earthquakeData[i].geometry.coordinates[0]], {
    fillOpacity: 0.75,
    color: "black",
    fillColor: color,
    // Adjust the radius.
    radius: Math.sqrt(earthquakeData[i].properties.mag) * 50000
  }).bindPopup(`<h1>${earthquakeData[i].properties.place}</h1> <hr> <h3>Magnitude: ${earthquakeData[i].properties.mag} ML <br> Depth: ${earthquakeData[i].geometry.coordinates[2]} km </h3>`).addTo(map);
}
  //adding the earthquake layer
  let earthquakes= L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature
  });
  overlayMaps["Earthquakes"] = earthquakes;
}

function getColor(d) {
  return d > 90? 'red' :
  d > 70? 'orangered' :
  d > 50? 'orange' :
  d > 30? 'yellow' :
  d > 10? 'greenyellow' :
    'green';
  }


// Using function to add legend to the map

var legend = L.control({position: 'bottomright'});
legend.onAdd = function (map) {

  var div = L.DomUtil.create('div', 'info legend'),
  depth = [0, 10, 30, 50, 70, 90];

  // loop through our density intervals and generate a label with a colored square for each interval
  for (var i = 0; i < grades.length; i++) {
      div.innerHTML +='<i style="background:' + getColor(depth[i] + 1) + '"></i> ' +
        depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');

return div;
};

legend.addTo(map);
}


