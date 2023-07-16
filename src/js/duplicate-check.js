import {reconstructionData} from './data.js';

// this js file checks if videos entered into the reconstruction tool are already on the site.

const data = JSON.parse(JSON.stringify(reconstructionData));
document.querySelector("#submitVideo").addEventListener("click", function() {
    let vidId = document.querySelector("#videoLink").value.split("v=")[1]
    for (let i=0; i<data.length; i++) {
        if (data[i].id === vidId) {
            alert("WARNING! The following reconstruction was already made with this video: " + data[i].title)
            break
        }
    }
})