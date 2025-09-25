let gridItems = document.querySelectorAll(".grid-item");
let searchElement = document.querySelector("#search");
let badSearchElement = document.querySelector("#badSearch");
let officialHeader = document.querySelector("#official");
let unofficialHeader = document.querySelector("#unofficial");

function updateSearch() {
    let searchParts = searchElement.value.split(" ")
    for (let g=0; g < gridItems.length; g++) {
        // shows all tiles
        gridItems[g].style.display = "block";
        // hides tiles that don't match search
        for (let i=0; i < searchParts.length; i++) {
            if (!gridItems[g].text.toLowerCase().includes(searchParts[i].toLowerCase())) {
                gridItems[g].style.display = "none";
            }
        }
        // official/unofficial selectors
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
        // single/average selectors
        if (document.querySelector("#singleBox").checked && !document.querySelector("#averageBox").checked) {
            if (!gridItems[g].text.includes("Single")) {
                gridItems[g].style.display = "none";
            }
        }
        else if (!document.querySelector("#singleBox").checked && document.querySelector("#averageBox").checked) {
            if (gridItems[g].text.includes("Single")) {
                gridItems[g].style.display = "none";
            }
        }
        // nr/cr/wr selectors
        if (document.querySelector("#nrBox").checked || document.querySelector("#crBox").checked || document.querySelector("#wrBox").checked) {
            if (!gridItems[g].text.includes("NR Official") && !gridItems[g].text.includes("CR Official") && !gridItems[g].text.includes("WR Official")) {
                gridItems[g].style.display = "none";
            }
            else if (gridItems[g].text.includes("NR Official") && !document.querySelector("#nrBox").checked) {
                gridItems[g].style.display = "none";
            }
            else if (gridItems[g].text.includes("CR Official") && !document.querySelector("#crBox").checked) {
                gridItems[g].style.display = "none";
            }
            else if (gridItems[g].text.includes("WR Official") && !document.querySelector("#wrBox").checked) {
                gridItems[g].style.display = "none";
            }
        }
        // flip/7-simul/sheerin selectors
        if (document.querySelector("#flipBox").checked || document.querySelector("#simulBox").checked || document.querySelector("#sheerinBox").checked || document.querySelector("#sfBox").checked) {
            if (gridItems[g].text.includes("Flip") && !document.querySelector("#flipBox").checked) {
                gridItems[g].style.display = "none";
            }
            else if (gridItems[g].text.includes("7-Simul") && !document.querySelector("#simulBox").checked) {
                gridItems[g].style.display = "none";
            }
            else if (gridItems[g].text.includes("Sheerin") && !document.querySelector("#sheerinBox").checked) {
                gridItems[g].style.display = "none";
            }
            else if (gridItems[g].text.includes("7sfndmw4lm") && !document.querySelector("#sfBox").checked) {
                gridItems[g].style.display = "none";
            }
            else if (gridItems[g].text.includes("10mm") || gridItems[g].text.includes("p7s")) {
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
        label.style.opacity = this.checked ? '1' : '0.3';
        updateSearch();
    });
});



// FOOTER SCROLLING THING FOR HOME PAGE
const footer = document.querySelector('footer');
window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const documentHeight = document.documentElement.scrollHeight;
    const windowHeight = window.innerHeight;
    // Show footer only at the top or bottom of the page
    if (scrollTop <= 0 || scrollTop + windowHeight >= documentHeight) {
        footer.classList.remove('hidden');
    } else {
        footer.classList.add('hidden');
    }
});