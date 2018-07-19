var app;
var koordinaten = [];
var trackname;
var tracks = ["Beispieltrack"];
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
        app.loadTrack();


        var trackarray = ["Beispieltrack"];
        localStorage.setItem("tracks", JSON.stringify(trackarray));
        alert(JSON.parse(localStorage.getItem("tracks")));


    },

    startTracking: function () {
        $("#start").hide();
        $("#stop").show();
        trackname = $("#trackname").val();

        app.k = navigator.geolocation.watchPosition(
            function (position) {
                koordinaten.push({lat: position.coords.latitude, lng: position.coords.longitude});
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
        app.saveData();
        app.loadTrack();

        koordinaten = [];


    },

    saveData: function () {
        alert("speichern0");
        trackname = $("#trackname").val();
        alert("Speichern1");
        localStorage.setItem("koordinaten" + trackname, JSON.stringify(koordinaten));
        alert("Speichern2");
        tracks = JSON.parse(localStorage.getItem("tracks"));
        alert("Speichern3");
        tracks.push(trackname);
        alert("Speichern4");
        localStorage.setItem("tracks", JSON.stringify(tracks));
        alert("Daten gespeichert");
    },

    loadTrack: function () {
        $('#trackdiv').empty();
        var loadedtracks = JSON.parse(window.localStorage.getItem("tracks"));

        for (var i = 0; i < loadedtracks.length; i++) {
            $('#trackdiv').append('<div id="' + i + '" class="trackdiv"><a href="index.html#mappage">' + loadedtracks[i]+ '</a></div>');
        }
        koordinaten=[];
        koordinaten = JSON.parse(window.localStorage("koordinaten"+trackname));
        app.displayTrack();


    },

    displayTrack: function () {

        alert("marker gesetzt mit : " + koordinaten[0].lat);
        var startmarker = new google.maps.Marker({
            position: koordinaten[0],
            title: 'Start'
        });


        var waypoints = new google.maps.Polyline({
            path: koordinaten,
            geodesic: true,
            strokeColor: 'FFFFFF',
            strokeOpacity: 1.0,
            strokeWeight: 2
        });
        startmarker.setMap(app.map);
        waypoints.setMap(app.map);


        var distance;
        for (var i = 0; i < koordinaten.length - 1; i++) {
            distance += distance(koordinaten[i].lat, koordinaten[i].lng, koordinaten[i + 1].lat, koordinaten[i + 1].lng, "K");

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


