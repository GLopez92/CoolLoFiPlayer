// Select DOM elements
const audioPlayer = document.getElementById("audio-player");
const playPauseButton = document.getElementById("play-pause");
const nextTrackButton = document.getElementById("next-track");
const backgroundVideo = document.getElementById("background-video");
const ambientSoundButtons = document.querySelectorAll("#ambient-sounds button");
const visualThemeButtons = document.querySelectorAll("#visual-theme button");
const volumeControl = document.getElementById("volume-control");
const pitchControl = document.getElementById("pitch-control");
const speedControl = document.getElementById("speed-control");
const playSampleButton = document.getElementById("play-sample");
const loopSampleButton = document.getElementById("loop-sample");

// State variables
let isPlaying = false;
let isLooping = false;
const tracks = ["assets/audio/track1.mp3", "assets/audio/track2.mp3", "assets/audio/track3.mp3"];
let currentTrackIndex = 0;
const ambientSounds = {};
const backgroundDiv = document.querySelector(".background-image");

// Initialize Magenta.js Models
const melodyRNN = new mm.MusicRNN("https://storage.googleapis.com/magentadata/js/checkpoints/music_rnn/basic_rnn");
const drumRNN = new mm.MusicRNN("https://storage.googleapis.com/magentadata/js/checkpoints/music_rnn/drum_kit_rnn");

Promise.all([melodyRNN.initialize(), drumRNN.initialize()])
  .then(() => console.log("Magenta.js models loaded"))
  .catch((err) => console.error("Error loading Magenta.js models:", err));

// Play/Pause Main Audio Player
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

// Next Track Functionality
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

// Ambient Sounds Logic
ambientSoundButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const sound = button.getAttribute("data-sound");
    const soundPath = `assets/audio/${sound}.mp3`;

    if (!ambientSounds[sound]) {
      ambientSounds[sound] = new Audio(soundPath);
      ambientSounds[sound].loop = true;
    }

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
  });
});

// Theme Switching Logic
visualThemeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const theme = button.getAttribute("data-theme");
    if (theme === "day") {
      changeBackground("assets/images/sunny-background.jpg");
    } else if (theme === "night") {
      changeBackground("assets/images/night-background.jpg");
    }
  });
});

function changeBackground(imagePath) {
  backgroundDiv.style.backgroundImage = `url(${imagePath})`;
}

// Generate Melody with Magenta.js
document.getElementById("generate-melody").addEventListener("click", async () => {
  const seed = {
    notes: [{ pitch: 60, startTime: 0.0, endTime: 0.5 }],
    totalTime: 0.5,
  };
  const steps = 32;
  const temperature = 1.0;
  const melody = await melodyRNN.continueSequence(seed, steps, temperature);
  console.log("Generated Melody:", melody);
});

// Generate Drums with Magenta.js
document.getElementById("generate-drums").addEventListener("click", async () => {
  const seed = {
    notes: [{ pitch: 36, startTime: 0.0, endTime: 0.5 }],
    totalTime: 0.5,
  };
  const steps = 32;
  const temperature = 1.0;
  const drums = await drumRNN.continueSequence(seed, steps, temperature);
  console.log("Generated Drums:", drums);
});

// Debugging for Errors
audioPlayer.addEventListener("error", (e) => {
  console.error("Audio playback error:", e);
});

backgroundVideo.addEventListener("error", (e) => {
  console.error("Video playback error:", e);
});

