///LOAD ESRI MODULES, SET THEM WITHIN THE FUNCTION
require([
      "esri/Map",
      "esri/views/MapView",
      "esri/layers/MapImageLayer",
      "esri/widgets/Legend",
      "esri/widgets/Expand",
      "esri/layers/GeoJSONLayer",
      "esri/widgets/Search",
    ], function(Map, MapView, MapImageLayer, Legend, Expand, GeoJSONLayer, Search) {

//GRAY VECTOR BASEMAP
var map = new Map({
    basemap: "gray-vector",
});

//SETTING UP THE MAPVIEW
var view = new MapView({
    container: "SkiMap",
    map: map,
    center: [-120.060775, 38.977779],
    zoom: 8,
});
//RESTRICT USERS ZOOM CONTROL
view.constraints = {
    minZoom: 9,
    maxZoom: 6,
};
  
//LOAD SNOW DEPTH MAPSERVER, ADD TO MAP
var NOAA = new MapImageLayer({
    opacity: .80,            
    url:"https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Observations/NOHRSC_Snow_Analysis/MapServer",
    sublayers: [{
    id: 3,
    visible: true},
     ]
});
map.add(NOAA);

//ADD A LEGEND
var legend = new Expand({
  content: new Legend({
    view: view,
    layerInfos: [{
      layer: NOAA,
      title: "Snow Depth (Inches)",
      }],
     }),
    expanded: false
});
view.ui.add(legend, "bottom-left");

//SET UP A RENDERER TO ADD AN IMAGE TO THE POINT FILE, INCLUDE SIZE
var SkiResortStyle = {
    type: "simple",
    symbol: {
      type: "picture-marker",
      url: "https://image.flaticon.com/icons/svg/555/555689.svg",
      width: "22px",
      height: "22px",
            }
}

//CREATE POP-UP USING THE TABLE'S "NAME" FIELD
var Ski_Template = {
    title: '{Name}',
    highlight: false,
};

//LOAD IN THE GEOJSON, INCLUDE THE POPUP TEMPLATE AND THE RENDERER
var SkiMTN_Points = new GeoJSONLayer({
   url: "https://gist.githubusercontent.com/EricSamsonCarto/546b5916196ac44c645af96dbbbd66de/raw/4e89cdecb0641c6804b27460d4f8c38e732e800e/UnitedStates_SkiResorts.geojson",
   popupTemplate: Ski_Template,
   renderer: SkiResortStyle,
});
map.add(SkiMTN_Points); 
  
//BACKGROUND STYLE
var background_style = {
  type: "simple",
  symbol: {
    type: "simple-fill", 
    color: [207, 211, 212],
    outline: {
      color: "black",
      width: 0.2,
    }
  }
};
//BACKGROUND GEOJSON
var background = new GeoJSONLayer({
   url: "https://gist.githubusercontent.com/EricSamsonCarto/d662ea1a4b6e189d9c6a34dd5c4b9feb/raw/3911ae3cf9d3e58d6fc2a2a40d3c00a4c743095d/Background_UnitedStates.geojson",
   renderer: background_style,
   opacity: 0.90,
});
map.add(background);

//SEARCH WIDGET WITH DEFAULT SOURCES REMOVED, SET THE SEARCH FIELDS TO "Name" AND EXACT MATCH TO "FALSE"
var searchWidget = new Search({
    view: view,
    includeDefaultSources: false,
    allPlaceholder: "Ski Resort Name",
    sources: [
        {
      layer: SkiMTN_Points,
      searchFields: ["Name"],
      displayField: "Name",
      exactMatch: false,
      outFields: [ "NAME"],
      name: "Ski Resort Name",
      placeholder: "Example: Sugarloaf"
        },
           ]
});
view.ui.add(searchWidget, {
  position: "top-right"
});
    

  });