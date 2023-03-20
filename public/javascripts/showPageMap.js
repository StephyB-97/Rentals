/*Piece of code that displays the small map in each rental individual page*/
    mapboxgl.accessToken = mapToken;
    const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v12', // style URL
    center: rental.geometry.coordinates, // starting position [lng, lat]
    zoom: 7, // starting zoom
});

/*Functionalities of the map*/
map.addControl(new mapboxgl.NavigationControl());

    /*Code to mark a specific location in the map*/
new mapboxgl.Marker()
    .setLngLat(rental.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({offset: 25})
            .setHTML(
                `<h3>${rental.title}</h3><p>${rental.location}</p>`
            )
    )
    .addTo(map)