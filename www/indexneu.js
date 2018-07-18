var app;
app = {

    map: null,

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


    },

    startTracking: function () {
        $("#start").hide();
        $("#stop").show();
        var trackname = $("#trackname").val();
        var koordinaten = [];

        while(true){
        var k = new google.maps.LatLng(position.coords.latitude, position.watchPosition(
            function(){

            },

            function(){

            }
            )
        );







        }
    },

    stopTracking: function () {
        $("#stop").hide();
        $("#start").show();
        app.starteKamera();

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
        alert(app.latitude);
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
        alert(imageData);
        var image = $("#myImage");
        image.attr("src", imageData);
        image.css("display", "block");
    },

    onFail: function () {
        alert("Fehler");
    }

};


