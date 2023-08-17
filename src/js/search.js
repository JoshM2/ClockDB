let gridItems = document.querySelectorAll(".grid-item");
let searchElement = document.querySelector("#search");
let badSearchElement = document.querySelector("#badSearch");
let officialHeader = document.querySelector("#official");
let unofficialHeader = document.querySelector("#unofficial");

function updateSearch() {
    let searchParts = searchElement.value.split(" ")
    for (let g=0; g < gridItems.length; g++) {
        gridItems[g].style.display = "block";
        for (let i=0; i < searchParts.length; i++) {
            if (!gridItems[g].text.toLowerCase().includes(searchParts[i].toLowerCase())) {
                gridItems[g].style.display = "none";
            }
        }
        if (document.querySelector("#officialBox").checked && !document.querySelector("#unofficialBox").checked) {
            if (!gridItems[g].text.includes("Official")) {
                gridItems[g].style.display = "none";
            }
        }
        else if (!document.querySelector("#officialBox").checked && document.querySelector("#unofficialBox").checked) {
            if (gridItems[g].text.includes("Official")) {
                gridItems[g].style.display = "none";
            }
        }
        if (document.querySelector("#singleBox").checked && !document.querySelector("#averageBox").checked) {
            if (!gridItems[g].text.includes("Single")) {
                gridItems[g].style.display = "none";
            }
        }
        if (!document.querySelector("#singleBox").checked && document.querySelector("#averageBox").checked) {
            if (gridItems[g].text.includes("Single")) {
                gridItems[g].style.display = "none";
            }
        }
        if (document.querySelector("#nrBox").checked || document.querySelector("#crBox").checked || document.querySelector("#wrBox").checked) {
            if (!gridItems[g].text.includes("NROfficial") && !gridItems[g].text.includes("CROfficial") && !gridItems[g].text.includes("WROfficial")) {
                gridItems[g].style.display = "none";
            }
            else if (gridItems[g].text.includes("NROfficial") && !document.querySelector("#nrBox").checked) {
                gridItems[g].style.display = "none";
            }
            else if (gridItems[g].text.includes("CROfficial") && !document.querySelector("#crBox").checked) {
                gridItems[g].style.display = "none";
            }
            else if (gridItems[g].text.includes("WROfficial") && !document.querySelector("#wrBox").checked) {
                gridItems[g].style.display = "none";
            }
        }
        if (document.querySelector("#flipBox").checked || document.querySelector("#simulBox").checked || document.querySelector("#sheerinBox").checked) {
            if (gridItems[g].text.includes("Flip") && !document.querySelector("#flipBox").checked) {
                gridItems[g].style.display = "none";
            }
            else if (gridItems[g].text.includes("7-Simul") && !document.querySelector("#simulBox").checked) {
                gridItems[g].style.display = "none";
            }
            else if (gridItems[g].text.includes("Sheerin") && !document.querySelector("#sheerinBox").checked) {
                gridItems[g].style.display = "none";
            }
        }
    }
    if (Array.from(gridItems).filter(element => element.style.display !== "none" && element.text.includes("Official")).length !== 0) {
        officialHeader.style.display = "block";
    }
    else {
        officialHeader.style.display = "none";
    }
    if (Array.from(gridItems).filter(element => element.style.display !== "none" && !element.text.includes("Official")).length !== 0) {
        unofficialHeader.style.display = "block";
    }
    else {
        unofficialHeader.style.display = "none";
    }
    if (Array.from(gridItems).filter(element => element.style.display !== "none").length == 0) {
        badSearchElement.style.display = "block";
    }
    else {
        badSearchElement.style.display = "none";
    }
}

searchElement.addEventListener("input", function() {
    updateSearch()
})

const checkboxes = document.querySelectorAll('input[type="checkbox"]');
checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', function() {
        const label = this.parentNode;
        label.style.opacity = this.checked ? '1' : '0.5';
        updateSearch();
    });
});
