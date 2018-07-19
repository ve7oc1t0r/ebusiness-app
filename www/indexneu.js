var app;
var koordinaten = [];
var trackname;
app = {

    map: null,
    k: null,


    // Application Constructor
    initialize: function () {
        this.bindEvents();

    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },

    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function () {
        $("#kamera").bind("tap", app.starteKamera);
        $("#start").bind("click", app.startTracking);
        $("#stop").bind("click", app.stopTracking);
        app.bestimmePosition();
        app.ladeGoogleMap();
        if(window.localStorage.getitem("tracks")==null){
            var trackarray = null;
            window.localStorage.setItem("tracks", JSON.stringify(trackarray));
        }


    },

    startTracking: function () {
        $("#start").hide();
        $("#stop").show();
        trackname = $("#trackname").val();
        alert("BUTTONpress");


        app.k = navigator.geolocation.watchPosition(
            function (position) {
                koordinaten.push(position);
                alert("Tracking now");

            },

            function () {
                alert("GPS Fehler!!!!!!!!!!!!!!!!!!!!!!!!");
            }
        );

    },

    stopTracking: function () {
        $("#stop").hide();
        $("#start").show();
        //app.starteKamera();
        navigator.geolocation.clearWatch(app.k);
        app.displayTrack();

        window.localStorage.setItem("koordinaten" + trackname, JSON.stringify(koordinaten));

        var tracks = JSON.parse(window.localStorage.getItem("tracks"));
        tracks.push(trackname);
        window.localStorage.setItem("tracks",JSON.stringify(tracks));

        koordinaten = null;


    },

    loadTrack: function(){

        var tracks = JSON.parse(window.localStorage.getItem("tracks"));
        for(var i = 0; i< tracks.length; i++){
            
        }

    },

    displayTrack: function () {
        var markerkoordinaten = [];

        for (var i = 0; i < koordinaten.length; i++) {
            markerkoordinaten[i] = {lat: koordinaten[i].coords.latitude, lng: koordinaten[i].coords.longitude};
            alert(markerkoordinaten[0].lat);

            if (i == 0) {
                alert("marker gesetzt mit : " + markerkoordinaten[0].lat);
                var startmarker = new google.maps.Marker({
                    position: markerkoordinaten[0],
                    title: 'Start'
                });

            }

        }

        var waypoints = new google.maps.Polyline({
            path: markerkoordinaten,
            geodesic: true,
            strokeColor: 'FFFFFF',
            strokeOpacity: 1.0,
            strokeWeight: 2
        });
        startmarker.setMap(app.map);
        waypoints.setMap(app.map);


        markerkoordinaten = null;
        var distance;
        for (var i = 0; i < markerkoordinaten.length - 1; i++) {
            distance += distance(markerkoordinaten[i].lat, markerkoordinaten[i].lng, markerkoordinaten[i + 1].lat, markerkoordinaten[i + 1].lng, "K");

        }

    },

    distance: function (lat1, lon1, lat2, lon2, unit) {
        var radlat1 = Math.PI * lat1 / 180
        var radlat2 = Math.PI * lat2 / 180
        var theta = lon1 - lon2
        var radtheta = Math.PI * theta / 180
        var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        if (dist > 1) {
            dist = 1;
        }
        dist = Math.acos(dist)
        dist = dist * 180 / Math.PI
        dist = dist * 60 * 1.1515
        if (unit == "K") {
            dist = dist * 1.609344
        }
        if (unit == "N") {
            dist = dist * 0.8684
        }
        return dist;
    },

    bestimmePosition: function () {
        navigator.geolocation.getCurrentPosition(app.onSuccessGPS, app.onErrorGPS);
    },

    onSuccessGPS: function (position) {
        var latitude = position.coords.latitude;
        var longitude = position.coords.longitude;
        app.map.setCenter(
            {lat: latitude, lng: longitude}
        );

    },

    onErrorGPS: function (error) {
        alert("GPS nicht verfügbar!");
    },

    ladeGoogleMap: function () {

        app.map = new google.maps.Map(document.getElementById('mapContainer'), {
            center: {
                lat: 46,
                lng: 7
            },
            zoom: 8
        });

    },

    starteKamera: function () {
        var options = {
            destinationType: 1
        };
        navigator.camera.getPicture(app.onSuccess, app.OnFail, options);
    },

    onSuccess: function (imageData) {

        var image = $("#myImage");
        image.attr("src", imageData);
        image.css("display", "block");
    },

    onFail: function () {
        alert("Fehler");
    }

};


