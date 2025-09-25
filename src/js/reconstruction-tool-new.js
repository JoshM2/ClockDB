// loads video if you are making a new reconstruction

var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

let recon = [];



async function dulpicate_check(vid_id) {
    try {
        const response = await fetch('https://clockdb.net/reconstruct/duplicate-check/'+vid_id);
        const text = await response.text();

        if (text.trim() !== '') {
            const messageDiv = document.createElement('div');
            messageDiv.id = 'message';
            messageDiv.innerHTML = `
                <p>${text}</p>
                <button class="dismiss-button">Dismiss warning</button><br><br>
            `;

            document.getElementById('video').appendChild(messageDiv);

            const dismissButton = messageDiv.querySelector('.dismiss-button');
            dismissButton.addEventListener('click', () => {
                messageDiv.style.display = 'none';
            });
        }
    } catch (error) {
        console.error('Error fetching the text:', error);
    }
}




var player
var vidId
document.querySelector("#submitVideo").addEventListener("click", function() {
    vidId = document.querySelector("#videoLink").value.split("v=")[1]
    player = new YT.Player('player', {
        height: '390',
        width: '640',
        videoId: vidId,
        playerVars: {
            'playsinline': 1,
            'modestbranding':1,
        },
        events: {
            'onReady': onPlayerReady
        }
    });
    document.querySelector("#step1").style.display = "none";
    document.querySelector("#video").style.display = "block";
    document.querySelector("#step2").style.display = "block";



    // duplicate checker:
    dulpicate_check(vidId)
})




