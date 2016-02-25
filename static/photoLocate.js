var mapMarkers = new Array();
var nbP=0;
var imageMarkers = new Array();
var nbI=0;
var nbL=0;
var doneIcon = L.icon({
    iconUrl: 'static/dist/images/marker-icon-red.png',
    iconSize: [25, 41],
    iconAnchor: [12, 42],
    shadowUrl: 'static/dist/images/marker-shadow.png',
    shadowSize: [41, 41],
    
});



var image = new L.Map('image');
image.attributionControl.setPrefix('');
image.on('click', onImageClick);

function delImageMarker(i){
    if (imageMarkers[i].isLinked != null){
	mapMarker[imageMarkers[i].isLinked]=null;
    }
    image.removeLayer(imageMarkers[i]);
    imageMarkers[i]=null;
}

function delMapMarker(i){
    if (mapMarkers[i].isLinked != null){
	imageMarker[mapMarkers[i].isLinked]=null;
    }
    mapMarkers[i].closePopup();
    map.removeLayer(mapMarkers[i]);
    mapMarkers[i]=null;

}

function onImageClick(e) {
    var latlngStr = '(' + e.latlng.lat.toFixed(3) + ', ' + e.latlng.lng.toFixed(3) + ')';
    var marker = new L.Marker(e.latlng,{draggable:true});
    marker.isLinked=null;
    //alert(latlngStr);
    image.addLayer(marker);
    imageMarkers[nbI]=marker;
    var popupMsg = '<p>Point number '+nbI + '<br/><input type="button" value="Delete" onclick="delImageMarker('+ nbI+')"/></p>';
    displayMessage(latlngStr);
    marker.bindPopup(popupMsg);
    nbI=nbI+1;
}

var map = new L.Map('map');
map.attributionControl.setPrefix('');     
var cloudmadeUrl = 'http://{s}.tile.cloudmade.com/'+cloudMadeKey+'/997/256/{z}/{x}/{y}.png',
cloudmadeAttribution = 'Map data &copy; 2011 OpenStreetMap contributors, Imagery &copy; 2011 CloudMade',
cloudmade = new L.TileLayer(cloudmadeUrl, {maxZoom: 18, attribution: cloudmadeAttribution});

var osmUrl = 'http://otile1.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png',
osmAttribution = '&copy; 2011 OpenStreetMap',
osm = new L.TileLayer(osmUrl, {maxZoom: 18, attribution: osmAttribution});

var bingMap =  new L.TileLayer.Bing(bingKey,'Aerial');
var bingRoad =  new L.TileLayer.Bing(bingKey,'Road');

var opentopoUrl = 'http://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
opentopoAttribution = 'OpenTopoMap &copy;(CC-BY-SA)',
opentopo = new L.TileLayer(opentopoUrl, {maxZoom: 18, attribution: opentopoAttribution});


var scanWmtsUrl	= "http://gpp3-wxs.ign.fr/"+IGNKEY + "/wmts?LAYER=GEOGRAPHICALGRIDSYSTEMS.MAPS.SCAN-EXPRESS.STANDARD&EXCEPTIONS=text/xml&FORMAT=image/jpeg&SERVICE=WMTS&VERSION=1.0.0&REQUEST=GetTile&STYLE=normal&TILEMATRIXSET=PM&&TILEMATRIX={z}&TILECOL={x}&TILEROW={y}" ;
SCAN25 = new L.TileLayer(scanWmtsUrl, {attribution: '&copy; <a href="http://www.ign.fr/">IGN</a>'});
 

var baseMaps = {
    "OSM": osm,
    //"Cloudmade": cloudmade,
    //"Bing aerial":bingMap,
    //"Bing road":bingRoad,
    "Ign Topo Express":SCAN25,
    "openTopo": opentopo,
};

//map.addLayer(cloudmade);
map.addLayer(osm);
//map.addLayer(bingMap);
//map.addLayer(bingRoad);
map.addLayer(SCAN25);
map.setView(new L.LatLng(45.832, 6.864), 13);
var layersControl = new L.Control.Layers(baseMaps);
map.addControl(layersControl);

map.on('click', onMapClick);


function getElevation(e){
    var elevationUrl = "http://api.geonames.org/srtm3JSON?lat="+e.lat.toFixed(3)+"&lng="+e.lng.toFixed(3)+"&username="+geonameUser;
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
    marker.isLinked=null;
    
    nbP=nbP+1;
    var latlngStr = setMapPopup(marker);//'(' + e.latlng.lat.toFixed(3) + ', ' + e.latlng.lng.toFixed(3) + '):'+marker.elevation+'m asl';
    marker.bindPopup(latlngStr);
    map.addLayer(marker);
    //marker.on('click', resetPopup);
    marker.on('dragend', resetElevation);
}


function resetPopup (e) {    
    var latlngStr = setMapPopup(e.target);
    e.target.bindPopup(latlngStr);
    e.target.openpopup()
    //e.target.bindPopup(latlngStr);
    //alert("azzaza "+e.type);
}


function resetElevation (e) {    
    var elevation = getElevation(e.target.getLatLng());
    e.target.elevation=elevation;
    var latlngStr = setMapPopup(e.target);
    e.target.bindPopup(latlngStr);
}

function setMapPopup(marker){
    var popupStr= '(' + marker.getLatLng().lat.toFixed(3) + ', ' + marker.getLatLng().lng.toFixed(3) + '):'+marker.elevation+'m asl' + '<br/><input type="button" value="Delete" onclick="delMapMarker('+ marker.id +')"/></p><br/>'+getImageMarks( marker.id);
    return popupStr;
}

function getImageMarks(ii){
    var retStr = 'Link with:<br/><select id="Map_'+ii+'">';
    for(i=0;i<imageMarkers.length;i++){
	if (imageMarkers[i] != null && imageMarkers[i].isLinked==null){
	    retStr+='<option value="'+i+'">'+i+'</option>';
	}
	else if (imageMarkers[i] != null && imageMarkers[i].isLinked==ii){
	    retStr+='<option selected value="'+i+'">'+i+'</option>';
	}
    }
    retStr+='<select><input type="button" value="select" onClick="linkMarker('+ii+')"></>';
    return retStr;
}

function linkMarker(ii){
    var o = document.getElementById('Map_'+ii).value;
    imageMarkers[o].isLinked=ii;
    mapMarkers[ii].isLinked=o;
    mapMarkers[ii].setIcon(doneIcon);
    imageMarkers[o].setIcon(doneIcon);
    //mapMarkers[ii]._popup.setContent('ploppp');
    //imageMarkers[o]._popup.setContent('ploppp');
    //alert("vala!!"+ii+o);
    nbL=nbL+1;
    if (nbL>=2){
	document.getElementById('launchButton').disabled=false;
    }
    else{
	document.getElementById('launchButton').disabled=true;
    }
}

function loadImage() {
    var url = document.getElementById('url').value;
    var img = new Image();
    img.src = url;
    var width = parseFloat(img.width);
    var height = parseFloat(img.height);
    var ratio = width/height;
    var imageBounds = new L.LatLngBounds(
	new L.LatLng(0.0,0.0),
	new L.LatLng(10.0,10*ratio));
    var imageL = new L.ImageOverlay(url, imageBounds);  
    image.setView(new L.LatLng(5.0, 5.0*ratio), 6).addLayer(imageL);
    var imageAttribution = "&copy; "+url+", all rights reserved."
    image.attributionControl.addAttribution(imageAttribution);
}


function displayMessage(text) {
    // display the message in the message div
    var message = document.getElementById('message');
    message.innerHTML=text;
}


function startCompute() {
   displayMessage("lets go");
}

