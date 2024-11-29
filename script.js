// Select DOM elements
const audioPlayer = document.getElementById("audio-player");
const playPauseButton = document.getElementById("play-pause");
const nextTrackButton = document.getElementById("next-track");
const backgroundVideo = document.getElementById("background-video");
const visualThemeButtons = document.querySelectorAll("#visual-theme button");
const ambientSoundButtons = document.querySelectorAll("#ambient-sounds button");
const volumeControl = document.getElementById("volume-control");
const pitchControl = document.getElementById("pitch-control");
const speedControl = document.getElementById("speed-control");
const playSampleButton = document.getElementById("play-sample");
const loopSampleButton = document.getElementById("loop-sample");
const backgroundDiv = document.querySelector('.background-image'); // Background Div

// State variables
let isPlaying = false;
let isLooping = false;
const tracks = ["assets/audio/track1.mp3", "assets/audio/track2.mp3", "assets/audio/track3.mp3"];
let currentTrackIndex = 0;
let ambientSounds = {}; // Store active ambient sound instances

// Play/Pause functionality
playPauseButton.addEventListener("click", () => {
  if (isPlaying) {
    audioPlayer.pause();
    playPauseButton.textContent = "Play";
  } else {
    audioPlayer.play();
    playPauseButton.textContent = "Pause";
  }
  isPlaying = !isPlaying;
});

// Next Track functionality
nextTrackButton.addEventListener("click", () => {
  currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
  audioPlayer.src = tracks[currentTrackIndex];
  audioPlayer.play();
  playPauseButton.textContent = "Pause";
  isPlaying = true;
});

// Volume Control
volumeControl.addEventListener("input", (event) => {
  audioPlayer.volume = event.target.value;
});

// Pitch Control
pitchControl.addEventListener("input", (event) => {
  audioPlayer.playbackRate = event.target.value;
});

// Playback Speed Control
speedControl.addEventListener("input", (event) => {
  audioPlayer.playbackRate = event.target.value;
});

// Loop Sample
loopSampleButton.addEventListener("click", () => {
  isLooping = !isLooping;
  audioPlayer.loop = isLooping;
  loopSampleButton.textContent = isLooping ? "Disable Loop" : "Enable Loop";
});

// Play Sample
playSampleButton.addEventListener("click", () => {
  if (audioPlayer.paused) {
    audioPlayer.play();
    playSampleButton.textContent = "Pause Sample";
  } else {
    audioPlayer.pause();
    playSampleButton.textContent = "Play Sample";
  }
});

// Theme Switching
visualThemeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const theme = button.getAttribute("data-theme");
    if (theme === "day") {
      backgroundVideo.src = "assets/videos/lofi-day.mp4";
    } else if (theme === "night") {
      backgroundVideo.src = "assets/videos/lofi-night.mp4";
    }
    backgroundVideo.play();
  });
});

// Ambient Sounds Logic
ambientSoundButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const sound = button.getAttribute("data-sound");
    const soundPath = `assets/audio/${sound}.mp3`;

    // Initialize sound if it doesn't exist
    if (!ambientSounds[sound]) {
      ambientSounds[sound] = new Audio(soundPath);
      ambientSounds[sound].loop = true; // Enable looping
    }

    // Toggle play/pause for the specific sound
    if (ambientSounds[sound].paused) {
      ambientSounds[sound].play()
        .then(() => {
          button.textContent = `Pause ${sound.charAt(0).toUpperCase() + sound.slice(1)}`;
        })
        .catch((err) => console.error(`Error playing ${sound} sound:`, err));
    } else {
      ambientSounds[sound].pause();
      button.textContent = `Play ${sound.charAt(0).toUpperCase() + sound.slice(1)}`;
    }

    // Change background image based on the sound
    if (sound === "rain") {
      changeBackground('assets/images/rainy-background.jpg');
    } else if (sound === "birds") {
      changeBackground('assets/images/sunny-background.jpg');
    }
  });
});

// Change Background Image Dynamically
function changeBackground(imagePath) {
  backgroundDiv.style.backgroundImage = `url(${imagePath})`;
}

// Debugging for errors
audioPlayer.addEventListener("error", (e) => {
  console.error("Audio playback error:", e);
});

backgroundVideo.addEventListener("error", (e) => {
  console.error("Video playback error:", e);
});

