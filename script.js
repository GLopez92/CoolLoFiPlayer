// Main Audio Controls
const audioPlayer = document.getElementById("audio-player");
const playPauseButton = document.getElementById("play-pause");
const nextTrackButton = document.getElementById("next-track");
let isPlaying = false;

const tracks = [
  "assets/audio/track1.mp3",
  "assets/audio/track2.mp3",
  "assets/audio/track3.mp3",
];
let currentTrackIndex = 0;

// Ensure the audio player starts with a valid source
audioPlayer.src = tracks[currentTrackIndex];

// Play/Pause Main Track
playPauseButton.addEventListener("click", () => {
  if (!audioPlayer.src) {
    console.error("No audio source found.");
    return;
  }

  if (isPlaying) {
    audioPlayer.pause();
    playPauseButton.textContent = "Play";
    playPauseButton.setAttribute("aria-pressed", "false");
  } else {
    audioPlayer
      .play()
      .then(() => {
        playPauseButton.textContent = "Pause";
        playPauseButton.setAttribute("aria-pressed", "true");
      })
      .catch((error) => {
        console.error("Audio playback failed:", error);
      });
  }
  isPlaying = !isPlaying;
});

// Play Next Track
nextTrackButton.addEventListener("click", () => {
  currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
  audioPlayer.src = tracks[currentTrackIndex];

  audioPlayer
    .play()
    .then(() => {
      playPauseButton.textContent = "Pause";
      playPauseButton.setAttribute("aria-pressed", "true");
      isPlaying = true;
    })
    .catch((error) => {
      console.error("Audio playback failed:", error);
    });
});

// Audio Control Functions for Samples
function initializeSampleControls(sampleId) {
  const audioElement = document.getElementById(`${sampleId}-audio`);
  const volumeControl = document.querySelector(`#${sampleId}-volume`);
  const pitchControl = document.querySelector(`#${sampleId}-pitch`);
  const speedControl = document.querySelector(`#${sampleId}-speed`);
  const playButton = document.querySelector(`#${sampleId}-play`);
  const loopButton = document.querySelector(`#${sampleId}-loop`);

  // Play/Pause Button
  playButton.addEventListener("click", () => {
    if (audioElement.paused) {
      audioElement.play().catch((error) => {
        console.error(`Error playing ${sampleId}:`, error);
      });
      playButton.textContent = "Pause";
    } else {
      audioElement.pause();
      playButton.textContent = "Play";
    }
  });

  // Loop Toggle Button
  loopButton.addEventListener("click", () => {
    audioElement.loop = !audioElement.loop;
    loopButton.textContent = audioElement.loop ? "Loop On" : "Loop Off";
  });

  // Volume Control
  volumeControl.addEventListener("input", (e) => {
    audioElement.volume = e.target.value;
  });

  // Pitch Control
  pitchControl.addEventListener("input", (e) => {
    audioElement.playbackRate = e.target.value;
  });

  // Speed Control
  speedControl.addEventListener("input", (e) => {
    audioElement.playbackRate = e.target.value;
  });

  // Reset Button Text When Playback Ends
  audioElement.addEventListener("ended", () => {
    playButton.textContent = "Play";
  });
}

// Initialize Controls for Each Sample
["drums", "bass", "fx", "synth"].forEach((sampleId) => {
  initializeSampleControls(sampleId);
});

// Ambient Sound Controls
const ambientSounds = {
  rain: new Audio("assets/audio/rain.mp3"),
  birds: new Audio("assets/audio/birds.mp3"),
};

// Enable looping for all ambient sounds
Object.values(ambientSounds).forEach((sound) => (sound.loop = true));

// Add event listeners for each button
document.getElementById("rain-button").addEventListener("click", () => {
  toggleAmbientSound("rain");
});
document.getElementById("birds-button").addEventListener("click", () => {
  toggleAmbientSound("birds");
});

// Function to toggle individual ambient sounds
function toggleAmbientSound(soundKey) {
  const sound = ambientSounds[soundKey];
  const button = document.getElementById(`${soundKey}-button`);

  if (sound.paused) {
    sound.play().catch((error) => {
      console.error(`Error playing ${soundKey}:`, error);
    });
    button.textContent = `Pause ${capitalize(soundKey)}`;
  } else {
    sound.pause();
    button.textContent = `Play ${capitalize(soundKey)}`;
  }
}

// Stop all ambient sounds
document.getElementById("stop-all-ambient").addEventListener("click", () => {
  Object.keys(ambientSounds).forEach((key) => {
    ambientSounds[key].pause();
    ambientSounds[key].currentTime = 0;
    document.getElementById(`${key}-button`).textContent = `Play ${capitalize(key)}`;
  });
});

// Canvas Image Display
const canvas = document.getElementById("music-visualizer");
if (canvas) {
  const ctx = canvas.getContext("2d");
  const imagePath = "assets/images/background.png";

  function displayImageOnCanvas(imagePath) {
    const image = new Image();
    image.src = imagePath;

    image.onload = () => {
      const aspectRatio = image.naturalWidth / image.naturalHeight;
      canvas.width = canvas.parentElement.offsetWidth;
      canvas.height = canvas.width / aspectRatio;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    };

    image.onerror = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "red";
      ctx.font = "20px Arial";
      ctx.fillText("Image could not be loaded.", canvas.width / 2, canvas.height / 2);
    };
  }

  window.addEventListener("resize", () => {
    displayImageOnCanvas(imagePath);
  });

  displayImageOnCanvas(imagePath);
}

// Utility Function
function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

// Theme Switching Logic
const backgroundVideo = document.getElementById("background-video");
const visualizerVideo = document.getElementById("visualizer-video");
const themeButtons = document.querySelectorAll('#visual-theme .button');

themeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const theme = button.dataset.theme;
    if (theme === "day") {
      backgroundVideo.src = "assets/videos/lofi-day.mp4";
      visualizerVideo.src = "assets/videos/lofi-day.mp4";
    } else {
      backgroundVideo.src = "assets/videos/lofi-night.mp4";
      visualizerVideo.src = "assets/videos/lofi-night.mp4";
    }

    document.body.className = theme;
    themeButtons.forEach((btn) => btn.setAttribute("aria-pressed", "false"));
    button.setAttribute("aria-pressed", "true");
  });
});

