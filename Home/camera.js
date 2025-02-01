
const video = document.getElementById('webcam');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const moodText = document.getElementById('mood');
const toggleCameraBtn = document.getElementById('toggleCamera');
const toggleMicBtn = document.getElementById('toggleMic');
const speechBox = document.getElementById('speechBox');

let mediaStream = null;
let audioTrack = null;
let videoTrack = null;
let recognition = null;
let micActive = true;

// List of moods
const moods = [
    { mood: "Happy", emoji: "😊" },
    { mood: "Sad", emoji: "😢" },
    { mood: "Angry", emoji: "😡" },
    { mood: "Neutral", emoji: "😐" },
    { mood: "Laughing", emoji: "😂" },
      
];

// Start Webcam & Mic
async function startWebcam() {
    try {
        mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        video.srcObject = mediaStream;
        videoTrack = mediaStream.getVideoTracks()[0];
        audioTrack = mediaStream.getAudioTracks()[0];

        // Start Speech Recognition
        startSpeechRecognition();

        // Start Mood Change Timer
        setInterval(changeMood, 20000); // Change mood every 20 seconds

    } catch (error) {
        console.error("Error accessing webcam:", error);
        moodText.innerText = "Webcam access denied!";
    }
}

// Toggle Camera
toggleCameraBtn.addEventListener('click', () => {
    if (videoTrack && videoTrack.enabled) {
        videoTrack.enabled = false;
        video.style.display = "none";
        canvas.style.display = "block";
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        toggleCameraBtn.innerText = "📹 Turn On Camera";
    } else {
        videoTrack.enabled = true;
        video.style.display = "block";
        canvas.style.display = "none";
        toggleCameraBtn.innerText = "📷 Turn Off Camera";
    }
});

// Toggle Microphone
toggleMicBtn.addEventListener('click', () => {
    if (audioTrack && audioTrack.enabled) {
        audioTrack.enabled = false;
        micActive = false;
        toggleMicBtn.innerText = "🔇 Turn On Mic";
    } else {
        audioTrack.enabled = true;
        micActive = true;
        toggleMicBtn.innerText = "🎤 Turn Off Mic";
    }
});

// Speech Recognition Setup
function startSpeechRecognition() {
    if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
        speechBox.innerText = "Speech Recognition Not Supported!";
        return;
    }

    recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
        let transcript = "";
        for (let i = 0; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
        }
        speechBox.innerText = transcript;
    };

    recognition.onerror = (event) => {
        speechBox.innerText = "Error in speech recognition: " + event.error;
    };

    recognition.onend = () => {
        if (micActive) recognition.start(); // Restart recognition if mic is still active
    };

    recognition.start();
}

// Change Mood with Animation
function changeMood() {
    const randomMood = moods[Math.floor(Math.random() * moods.length)];
    moodText.style.opacity = "0"; // Start fade-out
    setTimeout(() => {
        moodText.innerText = randomMood.emoji + " " + randomMood.mood;
        moodText.style.opacity = "1"; // Fade-in
    }, 1000);
}

startWebcam();

