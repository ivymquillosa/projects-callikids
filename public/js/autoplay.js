var vid1 = document.getElementById("video1");
var vid2 = document.getElementById("video2");
var vid3 = document.getElementById("video3");
var vid4 = document.getElementById("video4");

async function playVid() { 
    try {
        await vid1.play();
        await vid2.play();
        await vid3.play();
        await vid4.play();
    } catch (error) {
        console.log(error)
    }
} 

window.onload = () => {
    playVid();
}
