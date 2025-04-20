const socket = io();

// Track user's real-time location
if (navigator.geolocation) {
    navigator.geolocation.watchPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            socket.emit("send-location", { latitude, longitude });

        //     // Set map view to user's location on first load
        //     map.setView([latitude, longitude], 13);

        //     // Optional: Add a marker with a custom size
        //     const customIcon = L.icon({
        //         iconUrl: 'path/to/your/icon.png', // Use a custom icon if you prefer
        //         iconSize: [40, 40],  // Adjust the size of the marker
        //         iconAnchor: [20, 40], // Adjust anchor point so marker is centered
        //     });

        //     L.marker([latitude, longitude], { icon: customIcon }).addTo(map)
        //         .bindPopup("<span style='font-size: 18px;'>You are here</span>") // Adjust font size in the popup
        //         .openPopup();
        // 
        },
        (error) => {
            console.log("Geolocation error:", error);
        },
        {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
        }
    );
} else {
    alert("Geolocation is not supported by your browser.");
}

// Initialize Leaflet map
const map = L.map("map").setView([0, 0], 16); // default view over India

// Fixed tile layer URL
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "Shahdol"
}).addTo(map);

const markers = {};

socket.on("receive-location", (data) => {
    const { id, latitude, longitude } = data;
    map.setView([latitude, longitude], 16);
    if (markers[id]) {
        markers[id].setLatLng([latitude, longitude]);
    } else {
        markers[id] = L.marker([latitude, longitude]).addTo(map);
    }
});

socket.on("user-disconnected", (id) => {
    if (markers[id]) {
        map.removeLayer(markers[id]);
        delete markers[id];
    }
});
