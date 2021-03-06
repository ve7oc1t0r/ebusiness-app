var app;
var tracks = ["Beispieltrack"];
var koordinaten = [];
var starttime = 0;
var time=0;
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
        //$("#load").bind("click", app.loadSavedTrack());
        app.ladeGoogleMap();
        app.bestimmePosition();

        app.loadTrack();


        var trackarray = ["Beispieltrack"];
        localStorage.setItem("tracks", JSON.stringify(trackarray));
        var beispieltrackkoord = ["{lat: 46, lng : 7}"];
        window.localStorage.setItem("Beispieltrackkoordinaten",JSON.stringify(beispieltrackkoord));



    },

    loadSavedTrack: function(){
        app.displayTrack($("#tracktoload").val());
    },

    startTracking: function () {
        $("#start").hide();
        $("#stop").show();
        var trackname = $("#trackname").val();


        app.k = navigator.geolocation.watchPosition(
            function (position) {
                koordinaten.push({lat: position.coords.latitude, lng: position.coords.longitude});



            },

            function () {
                alert("GPS Fehler!!!!!!!!!!!!!!!!!!!!!!!!");
            }
        );
        starttime = Math.round((new Date()).getTime() / 1000);


    },


    stopTracking: function () {
        $("#stop").hide();
        $("#start").show();
        //app.starteKamera();
        navigator.geolocation.clearWatch(app.k);
        var trackname = $("#trackname").val();

        app.saveData(trackname);
        app.starteKamera(trackname);
        app.displayTrack(trackname);

        app.loadTrack(trackname);

        window.location.href="#mappage";

        koordinaten = [];
        time = starttime -  Math.round((new Date()).getTime() / 1000);




    },



    saveData: function (trackname) {



        localStorage.setItem("koordinaten" + trackname, JSON.stringify(koordinaten));

        tracks = JSON.parse(localStorage.getItem("tracks"));

        tracks.push(trackname);

        localStorage.setItem("tracks", JSON.stringify(tracks));
        alert("Daten gespeichert");
        koordinaten = [];
    },

    loadTrack: function () {
        $('#trackdiv').empty();
        var loadedtracks = JSON.parse(window.localStorage.getItem("tracks"));

        for (var i = 0; i < loadedtracks.length; i++) {
            $('#trackdiv').append('<div id="' + i + '" class="'+trackname+'"><a href="index.html#mappage" onclick="app.displayTrack("' + trackname + ')">' + loadedtracks[i] + '</a></div>');
        }
        koordinaten = [];


    },

    displayTrack: function (trackname) {


        koordinaten = JSON.parse(window.localStorage.getItem("koordinaten"+trackname));

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


        var distance = 0;
        for (var i = 0; i < koordinaten.length - 1; i++) {
            distance += app.distanceCalc(koordinaten[i].lat, koordinaten[i].lng, koordinaten[i + 1].lat, koordinaten[i + 1].lng, "K");

        }
        time /=60;
        $('#timedistance').append('<p>Dauer: '+time/60+':'+time%60+'</p><<p>Distanz:'+distance+'</p>');
        koordinaten = [];

    },

    distanceCalc: function (lat1, lon1, lat2, lon2, unit) {
        var radlat1 = Math.PI * lat1 / 180;
        var radlat2 = Math.PI * lat2 / 180;
        var theta = lon1 - lon2;
        var radtheta = Math.PI * theta / 180;
        var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        if (dist > 1) {
            dist = 1;
        }
        dist = Math.acos(dist);
        dist = dist * 180 / Math.PI;
        dist = dist * 60 * 1.1515;
        if (unit == "K") {
            dist = dist * 1.609344;
        }
        if (unit == "N") {
            dist = dist * 0.8684;
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

    starteKamera: function (trackname) {
        var options =
            {   quality: 50,
                destination: 1
            };
        navigator.camera.getPicture(function (imageData) {

            window.localStorage.setItem("bild"+trackname,imageData);
            var finishmarker = new google.maps.Marker(
                {
                    position: koordinaten[koordinaten.length-1],
                    title: 'finish',
                    icon :
                        {
                            url: imageURI,
                            scaledSize: new google.maps.Size(40, 40)
                        }
                }
            )
            finishmarker.setMap(app.map);

        }, app.onFail, options);
    },



    onFail: function () {
        alert("Fehler");
    }

};


