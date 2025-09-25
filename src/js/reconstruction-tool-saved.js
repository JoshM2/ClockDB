// loads video if you are loading a saved reconstruction

var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);


// var recon = window.reconData;
console.log(recon);

var player;
window.onYouTubeIframeAPIReady = function() {
    player = new YT.Player('player', {
        height: '390',
        width: '640',
        videoId: window.vidId,
        playerVars: {
            'playsinline': 1,
            'modestbranding':1,
        },
        events: {
            'onReady': onPlayerReady
        }
    });
}