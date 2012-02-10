var mapMarkers = new Array();
var nbP=0;
var imageMarkers = new Array();
var nbI=0;

var image = new L.Map('image');

image.on('click', onImageClick);

function delImageMarker(i){
    image.removeLayer(imageMarkers[i]);
}

function delMapMarker(i){
    map.removeLayer(mapMarkers[i]);
}

function onImageClick(e) {
    var latlngStr = '(' + e.latlng.lat.toFixed(3) + ', ' + e.latlng.lng.toFixed(3) + ')';
    var marker = new L.Marker(e.latlng,{draggable:true});
    marker.isLinked=false;
    //alert(latlngStr);
    image.addLayer(marker);
    imageMarkers[nbI]=marker;
    var popupMsg = '<p>Point number '+nbI + '<br/><input type="button" value="Delete" onclick="delImageMarker('+ nbI+')"/></p>';

    marker.bindPopup(popupMsg);
    nbI=nbI+1;
}


var map = new L.Map('map');      
var cloudmadeUrl = 'http://{s}.tile.cloudmade.com/BC9A493B41014CAABB98F0471D759707/997/256/{z}/{x}/{y}.png',
cloudmadeAttribution = 'plop Map data &copy; 2011 OpenStreetMap contributors, Imagery &copy; 2011 CloudMade',
cloudmade = new L.TileLayer(cloudmadeUrl, {maxZoom: 18, attribution: cloudmadeAttribution});

map.setView(new L.LatLng(45.8789 , 6.887), 13).addLayer(cloudmade);
map.on('click', onMapClick);

function getElevation(e){
    var elevationUrl = "http://api.geonames.org/srtm3JSON?lat="+e.lat.toFixed(3)+"&lng="+e.lng.toFixed(3)+"&username=niavlys";
    var xhr_object = null;
    var elevation = 0;
    if(window.XMLHttpRequest) // Firefox
	xhr_object = new XMLHttpRequest();
    else if(window.ActiveXObject) // Internet Explorer
	xhr_object = new ActiveXObject("Microsoft.XMLHTTP");
    else { // XMLHttpRequest non supporté par le navigateur
	alert("Votre navigateur ne supporte pas les objets XMLHTTPRequest...");
	return elevation;
    }
    
    xhr_object.open("GET", elevationUrl, false);
    xhr_object.onreadystatechange = function() {
	if(xhr_object.readyState == 4) {
	    var resp = JSON.parse(xhr_object.responseText);
	    elevation=resp["srtm3"];	   
	}
    }
    
    xhr_object.send(null);
    return elevation;
}


function onMapClick(e) {  
    var elevation = getElevation(e.latlng);
    var marker = new L.Marker(e.latlng,{draggable:true});
   
    marker.elevation=elevation;
    mapMarkers[nbP]=marker;
    marker.id=nbP;
    nbP=nbP+1;
    var latlngStr = setMapPopup(marker);//'(' + e.latlng.lat.toFixed(3) + ', ' + e.latlng.lng.toFixed(3) + '):'+marker.elevation+'m asl';
    marker.bindPopup(latlngStr);
    map.addLayer(marker);
    
    marker.on('dragend', resetElevation);
}


function resetElevation (e) {    
    var elevation = getElevation(e.target.getLatLng());
    e.target.elevation=elevation;
    var latlngStr = setMapPopup(e.target);
    e.target.bindPopup(latlngStr);
}

function setMapPopup(marker){
    var popupStr= '(' + marker.getLatLng().lat.toFixed(3) + ', ' + marker.getLatLng().lng.toFixed(3) + '):'+marker.elevation+'m asl' + '<br/><input type="button" value="Delete" onclick="delMapMarker('+ marker.id +')"/></p>';
    return popupStr;
}

function loadImage() {
    var url = document.getElementById('url').value;
    var imageBounds = new L.LatLngBounds(
	new L.LatLng(-50.0,-50.0),
	new L.LatLng(50.0,50.0));
    var imageL = new L.ImageOverlay(url, imageBounds);  
    image.setView(new L.LatLng(0.0, 0.0), 1).addLayer(imageL);
    var imageAttribution = "&copy;"+url+", all rights reserved."
    image.attributionControl.addAttribution(imageAttribution);
    //alert("voila!"+url);
}