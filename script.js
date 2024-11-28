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

// State variables
let isPlaying = false;
let isLooping = false;
const tracks = ["assets/audio/track1.mp3", "assets/audio/track2.mp3", "assets/audio/track3.mp3"];
let currentTrackIndex = 0;
let ambientAudio = null; // Variable to store the ambient audio instance

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

// Ambient Sounds
ambientSoundButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const sound = button.getAttribute("data-sound");

    // Stop currently playing ambient audio
    if (ambientAudio && !ambientAudio.paused) {
      ambientAudio.pause();
      ambientAudio.currentTime = 0;
    }

    // Play new ambient sound
    ambientAudio = new Audio(`assets/audio/${sound}.mp3`);
    ambientAudio.loop = true;

    ambientAudio.play().catch((err) => {
      console.error(`Error playing ambient sound (${sound}):`, err);
    });
  });
});

// Debugging for errors
audioPlayer.addEventListener("error", (e) => {
  console.error("Audio playback error:", e);
});

backgroundVideo.addEventListener("error", (e) => {
  console.error("Video playback error:", e);
});

ambientSoundButtons.forEach((button) => {
  const sound = button.getAttribute("data-sound");
  button.addEventListener("click", () => {
    if (!ambientAudio) {
      console.error(`Error: Ambient sound file (${sound}.mp3) not found.`);
    }
  });
});

