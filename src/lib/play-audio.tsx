export default function playAudio(a: string) {
    if (!a) return;
    console.log(`/audio/${a}.mp3`);
    let audio = new Audio(`/audio/${a}.mp3`);
    audio.addEventListener("ended", () => {
        audio.remove();
        audio.srcObject = null;
    });
    audio.play().catch((e) => {
        console.error(e);
        alert("Error playing audio - Connect to the internet and try again");
    });
}