let gridItems = document.querySelectorAll(".grid-item");
let searchElement = document.querySelector("#search");
let badSearchElement = document.querySelector("#badSearch")

searchElement.addEventListener("input", function() {
    let searchParts = searchElement.value.split(" ")
    badSearchElement.style.display = "block"
    for (let g=0; g < gridItems.length; g++) {
        gridItems[g].style.display = "block";
        for (let i=0; i < searchParts.length; i++) {
            if (!gridItems[g].text.toLowerCase().includes(searchParts[i].toLowerCase())) {
                gridItems[g].style.display = "none";
            }
            else {
                badSearchElement.style.display = "none"
            }
        }
    }
})