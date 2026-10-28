export async function onRequest(context) {
    let map_data = await context.env.KV.get("map-data");
    // map_data = JSOLN.parse(map_data);

    const html = `<!DOCTYPE html>
    <html lang="en">
    <head>
        <script defer src="https://analytics.clockdb.net/script.js" data-website-id="c808d079-4a5b-4e4b-8f11-faed3445ceb3"></script>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width">
        <title>Map of Reconstructions - ClockDB</title>
        <link href="/css/style.css" rel="stylesheet" type="text/css"/>
        <link rel="icon" type="image/x-icon" href="/images/clock.ico">
        <!-- Leaflet CSS -->
        <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
        <style>
            /* Set the size of the map container */
            #map {
                height: 80vh;
                width: 90%;
                margin: auto; /* Center horizontally */
                display: block;
            }
        </style>
    </head>
    <body>
        <div id="nav">
            <a href="/" id="home"><img src="/images/clock.ico" width="23" height="23"> ClockDB</a>
        </div>
    
        <h1>Map of Reconstructed Official Solves</h1>

        <div id="map"></div>

        <br><br><br>    

        <footer>
            <a href="/contact">Contact</a>
            <a href="/reconstruct">Make Reconstruction</a>
            <a href="https://github.com/JoshM2/ClockDB" target="_blank">GitHub</a>
        </footer>
        <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
        <script>
            // Initialize the map, centered at a default location
            var map = L.map('map').setView([0, 0], 1)

            // Add OpenStreetMap tile layer
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);

            const map_data = ${map_data}
            // Loop through the comp data and add markers for each event
            for (const comp in map_data) {
                const { coordinates, recons, name } = map_data[comp];

                // Create a marker for each comp
                const marker = L.marker([coordinates.latitude, coordinates.longitude]).addTo(map);

                // Create the popup content with event name and formatted list of numbers
                let reconList = '';
                recons.forEach(recon => {
                    reconList += '<a href="https://clockdb.net/r/' + recon.num + '" target="_blank">' + recon.title + '</a><br>';
                });

                const popupContent = '<strong>' + name + '</strong><br>' + reconList;
                
                // Bind the popup to the marker
                marker.bindPopup(popupContent);
            }
            
        </script>
    </body>
    </html>`

    return new Response(html, {
        headers: {
            "content-type": "text/html;charset=UTF-8",
        },
    });
} 