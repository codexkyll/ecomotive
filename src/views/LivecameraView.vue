<template>
  <div class="dashboard-container">
    
    <!-- ================= NAVBAR ================= -->
    <Navbar />

    <main class="main-content">
      
      <!-- ================= HEADER ================= -->
      <section class="page-header">
        <h1>Live Detection</h1>
        <p class="subtitle">Real-time object classification and segmentation for immediate insights into Plants, Animals, and Vehicles.</p>
      </section>

      <div class="content-grid">
        
        <!-- ================= LEFT COLUMN: CAMERA & CONTROLS ================= -->
        <div class="left-column">
          
          <!-- 1. Camera Feed Container -->
          <div ref="videoWrapperRef" class="video-wrapper">
            
            <!-- A. Camera OFF/Idle Overlay -->
            <div v-if="!isStreaming" class="camera-off-overlay">
              <div class="camera-off-icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M12 4.5H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h12A2.25 2.25 0 0018 18V9.75M12 4.5v7.5M12 4.5h3.75" />
                </svg>
                <div class="red-slash"></div>
              </div>
              <p class="title-text">Camera is off</p>
              <p class="instruction-text">Grant permissions and click "Start Camera" to begin detection.</p>
            </div>

            <!-- B. ANALYZING INDICATOR -->
            <div v-if="isStreaming && isProcessing" class="analyzing-badge">
              <div class="spinner"></div>
              <span>Analyzing...</span>
            </div>
            
            <!-- C. EXIT FULLSCREEN BUTTON (Middle Center Bottom - Only visible in Fullscreen) -->
            <button v-if="isFullscreen" @click="toggleFullscreen" class="exit-fullscreen-overlay-btn" title="Exit Fullscreen">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <!-- D. Live Video Element -->
            <video ref="videoRef" autoplay playsinline muted class="live-video" :class="{ 'hidden': !isStreaming }"></video>
            
            <!-- E. Canvas for Bounding Boxes -->
            <canvas ref="canvasRef" class="detection-canvas"></canvas>
          </div>

          <!-- 2. Controls -->
          <div class="controls-bar">
            <!-- Start/Stop -->
            <button @click="toggleCamera" class="btn-primary" :class="{ 'btn-stop': isStreaming }">
              <span v-if="!isStreaming">▷ Start Camera</span>
              <span v-else>■ Stop Camera</span>
            </button>
            
            <!-- Flip Camera -->
            <button v-if="isStreaming" @click="flipCamera" class="btn-secondary flip-btn" title="Flip Camera">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M7.5 7.5a4.5 4.5 0 119 0m-9 0a4.5 4.5 0 009 0M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 11.25H9M12 8.25V12M15 15l-3 3-3-3" /></svg>
              <span>Flip</span>
            </button>
            
            <!-- Clear -->
            <button @click="clearDetection" class="btn-secondary">
              ⟳ Clear
            </button>

            <!-- Fullscreen -->
            <button v-if="isStreaming" @click="toggleFullscreen" class="btn-secondary" title="Enter Fullscreen">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style="width:20px; height:20px;">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9M20.25 20.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
              </svg>
              <span>Fullscreen</span>
            </button>
          </div>

          <!-- 3. Live Stats Bar -->
          <div class="stats-panel">
            <div class="stat">
              <span class="label">Active Detections</span>
              <span class="value teal">{{ detectionCount }}</span>
            </div>
            <div class="stat">
              <span class="label">Avg Confidence</span>
              <span class="value">{{ avgConfidence }}%</span>
            </div>
            <div class="stat">
              <span class="label">Status</span>
              <span class="value text-gray">{{ statusText }}</span>
            </div>
            <div class="stat">
              <span class="label">FPS</span>
              <span class="value green">{{ currentFPS }}</span>
            </div>
          </div>

        </div>

        <!-- ================= RIGHT COLUMN ================= -->
        <aside class="right-column">
          <!-- Info cards -->
          <div class="info-card tips-card">
            <div class="card-header">
              <span class="icon-info">!</span>
              <h3>Tips for Best Results</h3>
            </div>
            <ul>
              <li>Ensure adequate lighting. Avoid heavy shadows which can lower confidence scores</li>
              <li>Keep the camera steady to prevent motion blur and misclassification</li>
              <li>The model is best with high resolution and minimal object occlusion</li>
            </ul>
          </div>

          <div class="info-card guide-card">
            <h3>How to Use</h3>
            <div class="step-list">
              <div class="step">
                <div class="step-num">1</div>
                <div class="step-text">
                  <strong>Authorize and Start</strong>
                  <p>Log in first, grant camera permissions, and click "Start Camera" to activate live feed</p>
                </div>
              </div>
              <div class="step">
                <div class="step-num">2</div>
                <div class="step-text">
                  <strong>Live Detection & Analysis</strong>
                  <p>Point the camera at an object. Watch as bounding boxes appear around detected objects</p>
                </div>
              </div>
              <div class="step">
                <div class="step-num">3</div>
                <div class="step-text">
                  <strong>Save Performance Data</strong>
                  <p>Detections are automatically logged to the backend</p>
                </div>
              </div>
            </div>
          </div>

          <div class="info-card system-card">
            <div class="system-header">
              <span class="status-dot" :class="{'active': isStreaming}"></span> System Ready
            </div>
            <div class="system-details">
              <p>Model: <span>v11</span></p>
              <p>Account: <span class="green">Logged In</span></p>
              <p>Type: <span>Instance Seg</span></p>
            </div>
          </div>
        </aside>
      </div>
    </main>

    <!-- Auth Modal -->
    <div v-if="showAuthModal" class="modal-overlay" @click.self="closeAuthModal">
      <div class="modal-content">
        <div class="modal-icon">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
          </svg>
        </div>
        <h2>Authentication Required</h2>
        <p>You need to be logged in to access the Live Camera features and save your detection history.</p>
        
        <div class="modal-actions">
          <button @click="goToLogin" class="btn-primary full-width">Login</button>
          <button @click="goToSignup" class="btn-outline full-width">Create Account</button>
        </div>
        
        <button @click="closeAuthModal" class="btn-text">Cancel</button>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onUnmounted, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import Navbar from '../components/navbar.vue'; 

// --- Configuration ---
const API_KEY = import.meta.env.VITE_ROBOFLOW_PRIVATE_API_KEY;
const MODEL_ID = import.meta.env.VITE_ROBOFLOW_MODEL_ID;
const VERSION = import.meta.env.VITE_ROBOFLOW_VERSION;
const BACKEND_URL = import.meta.env.PROD ? '/api/detections' : 'http://localhost:5000/api/detections';

const MODEL_ENDPOINT = `https://detect.roboflow.com/${MODEL_ID}/${VERSION}`;

const router = useRouter();

// --- State ---
const videoRef = ref(null);
const videoWrapperRef = ref(null);
const canvasRef = ref(null);
const isStreaming = ref(false);
const detectionCount = ref(0);
const avgConfidence = ref(0);
const statusText = ref('Ready');
const currentFPS = ref(0);
const isProcessing = ref(false);
const showAuthModal = ref(false); 
const isFullscreen = ref(false);
const facingMode = ref('environment'); // 'environment' (back) or 'user' (front)
const isMobileDevice = ref(false);

// Internal variables
let stream = null;
let intervalId = null;
let lastFrameTime = 0;
let lastSaveTime = 0;
const SAVE_COOLDOWN = 3000;

// --- Lifecycle & Fullscreen Handlers ---
onMounted(() => {
  isMobileDevice.value = /Mobi|Android/i.test(navigator.userAgent);

  document.addEventListener('fullscreenchange', handleFullscreenChange);
  document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
  document.addEventListener('mozfullscreenchange', handleFullscreenChange);
  document.addEventListener('msfullscreenchange', handleFullscreenChange);
});

onUnmounted(() => {
  stopCamera();
  document.removeEventListener('fullscreenchange', handleFullscreenChange);
  document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
  document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
  document.removeEventListener('msfullscreenchange', handleFullscreenChange);
});

const handleFullscreenChange = () => {
  isFullscreen.value = !!document.fullscreenElement;
};

// --- Auth Navigation Handlers (FIXED) ---
const closeAuthModal = () => {
  showAuthModal.value = false;
};

const goToLogin = () => {
  showAuthModal.value = false;
  router.push('/login');
};

const goToSignup = () => {
  showAuthModal.value = false;
  router.push('/signup');
};

// --- Camera Methods ---

const startCamera = async () => {
  const token = localStorage.getItem('userToken');
  if (!token) {
    showAuthModal.value = true;
    return;
  }

  try {
    statusText.value = 'Initializing...';
    
    const constraints = isMobileDevice.value 
      ? { 
          facingMode: facingMode.value, 
          width: { ideal: 720 }, 
          height: { ideal: 1280 } 
        }
      : { 
          facingMode: facingMode.value, 
          width: { ideal: 1280 }, 
          height: { ideal: 720 } 
        };

    stream = await navigator.mediaDevices.getUserMedia({ video: constraints, audio: false });
    
    if (videoRef.value) {
      videoRef.value.srcObject = stream;
      videoRef.value.onloadedmetadata = () => {
        canvasRef.value.width = videoRef.value.videoWidth;
        canvasRef.value.height = videoRef.value.videoHeight;
        isStreaming.value = true;
        statusText.value = 'Active';
        intervalId = setInterval(captureAndDetect, 300);
      };
    }
  } catch (error) {
    console.error("Error accessing webcam:", error);
    
    // Fallback logic
    if (error.name === "OverconstrainedError" && facingMode.value === 'environment') {
        console.log("Environment camera failed, attempting 'user' (front) camera fallback.");
        facingMode.value = 'user'; 
        startCamera(); 
        return;
    }

    alert("Could not access camera. Please allow permissions. Error: " + error.name);
    statusText.value = 'Error';
  }
};

const stopCamera = () => {
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
    stream = null;
  }
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
  isStreaming.value = false;
  isProcessing.value = false;
  statusText.value = 'Idle';
  currentFPS.value = 0;
  
  const ctx = canvasRef.value?.getContext('2d');
  if (ctx) ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height);

  if (isFullscreen.value) {
    toggleFullscreen();
  }
};

const toggleCamera = () => {
  if (isStreaming.value) stopCamera();
  else startCamera();
};

const flipCamera = () => {
  stopCamera(); 
  facingMode.value = facingMode.value === 'environment' ? 'user' : 'environment';
  startCamera(); 
};

const toggleFullscreen = () => {
  const wrapper = videoWrapperRef.value;
  
  if (!document.fullscreenElement) {
    // Enter Fullscreen
    if (wrapper.requestFullscreen) wrapper.requestFullscreen();
    else if (wrapper.mozRequestFullScreen) wrapper.mozRequestFullScreen();
    else if (wrapper.webkitRequestFullscreen) wrapper.webkitRequestFullscreen();
    else if (wrapper.msRequestFullscreen) wrapper.msRequestFullscreen();
  } else {
    // Exit Fullscreen
    if (document.exitFullscreen) document.exitFullscreen();
    else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
    else if (document.webkitExitFullscreen) document.webkitExitFullScreen();
    else if (document.msExitFullscreen) document.msExitFullscreen();
  }
};

// --- Detection Loop and Render Functions ---
const clearDetection = () => {
  detectionCount.value = 0;
  avgConfidence.value = 0;
  const ctx = canvasRef.value?.getContext('2d');
  if (ctx) ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height);
};

const captureAndDetect = async () => {
  if (!isStreaming.value || !videoRef.value || !canvasRef.value || isProcessing.value) return;

  isProcessing.value = true;

  const now = performance.now();
  if (lastFrameTime > 0) {
    const delta = now - lastFrameTime;
    currentFPS.value = Math.round(1000 / delta);
  }
  lastFrameTime = now;

  try {
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = videoRef.value.videoWidth;
    tempCanvas.height = videoRef.value.videoHeight;
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.drawImage(videoRef.value, 0, 0);

    const imageBase64 = tempCanvas.toDataURL('image/jpeg', 0.7).split(',')[1];

    const response = await axios({
      method: "POST",
      url: MODEL_ENDPOINT,
      params: { api_key: API_KEY, format: "json" },
      data: imageBase64,
      headers: { "Content-Type": "application/x-www-form-urlencoded" }
    });

    const predictions = response.data.predictions;

    detectionCount.value = predictions.length;
    if (predictions.length > 0) {
      const totalConf = predictions.reduce((sum, p) => sum + p.confidence, 0);
      avgConfidence.value = Math.round((totalConf / predictions.length) * 100);
    } else {
      avgConfidence.value = 0;
    }

    renderPredictions(predictions);

    const currentTime = Date.now();
    if (predictions.length > 0 && (currentTime - lastSaveTime > SAVE_COOLDOWN)) {
      const bestPrediction = predictions.reduce((prev, current) => 
        (prev.confidence > current.confidence) ? prev : current
      );
      await saveToHistory(bestPrediction);
      lastSaveTime = currentTime;
    }

  } catch (error) {
    console.warn("API Error:", error);
  } finally {
    isProcessing.value = false;
  }
};

const saveToHistory = async (prediction) => {
  try {
    const token = localStorage.getItem('userToken');
    if (!token) {
        stopCamera();
        showAuthModal.value = true;
        return;
    }

    await axios.post(
      BACKEND_URL, 
      {
        className: prediction.class,
        confidence: (prediction.confidence * 100).toFixed(1)
      },
      {
        headers: { 'Authorization': `Bearer ${token}` }
      }
    );
  } catch (err) {
    console.error("Backend Error:", err);
    if (err.response && err.response.status === 401) {
        stopCamera();
        localStorage.removeItem('userToken');
        showAuthModal.value = true;
    }
  }
};

const renderPredictions = (predictions) => {
  const ctx = canvasRef.value.getContext('2d');
  const w = canvasRef.value.width;
  const h = canvasRef.value.height;

  ctx.clearRect(0, 0, w, h);

  predictions.forEach(prediction => {
    const { x, y, width, height, class: className, confidence } = prediction;
    
    let color = '#ef4444'; 
    const c = className.toLowerCase();
    if (c.includes('plant')) color = '#22c55e'; 
    if (c.includes('animal')) color = '#3b82f6'; 
    if (c.includes('vehicle')) color = '#f59e0b'; 

    const originalTopLeftX = x - (width / 2);
    const originalTopLeftY = y - (height / 2);

    const applyFlip = facingMode.value === 'environment' || !facingMode.value; 
    const mirroredTopLeftX = applyFlip
      ? w - (originalTopLeftX + width) 
      : originalTopLeftX;

    // Segmentation
    if (prediction.points && prediction.points.length > 0) {
      ctx.beginPath();
      
      const firstX = applyFlip
        ? w - prediction.points[0].x 
        : prediction.points[0].x;

      ctx.moveTo(firstX, prediction.points[0].y);

      for (let i = 1; i < prediction.points.length; i++) {
        const pointX = applyFlip
          ? w - prediction.points[i].x 
          : prediction.points[i].x;
        ctx.lineTo(pointX, prediction.points[i].y);
      }
      ctx.closePath();
      ctx.globalAlpha = 0.4; 
      ctx.fillStyle = color;
      ctx.fill();
      ctx.globalAlpha = 1.0; 
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // Box
    ctx.globalAlpha = 1.0; 
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.strokeRect(mirroredTopLeftX, originalTopLeftY, width, height);

    // Label
    ctx.fillStyle = color;
    const text = `${className} ${Math.round(confidence * 100)}%`;
    const textWidth = ctx.measureText(text).width;
    ctx.fillRect(mirroredTopLeftX, originalTopLeftY - 25, textWidth + 10, 25);
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 14px Inter';
    ctx.fillText(text, mirroredTopLeftX + 5, originalTopLeftY - 7);
  });
};
</script>

<style lang="scss" scoped>
// --- Variables ---
$bg-color: #050b14;
$text-color: #e2e8f0;
$card-bg: #0f172a;
$teal: #14b8a6;
$teal-hover: #2dd4bf;
$green: #22c55e;
$blue: #3b82f6;
$orange: #f59e0b;
$nav-height: 80px;

.dashboard-container {
  background-color: $bg-color;
  color: $text-color;
  min-height: 100vh;
  font-family: 'Inter', sans-serif;
  padding: 0 5%;
}

// ===================================
// GENERAL LAYOUT
// ===================================

.main-content { max-width: 1400px; margin: 0 auto; padding: 40px 0; }
.page-header { 
  margin-bottom: 30px; 
  h1 { font-size: 2.5rem; font-weight: 700; margin-bottom: 10px; color: white; } 
  .subtitle { color: #94a3b8; font-size: 1.1rem; } 
  @media (max-width: 600px) { h1 { font-size: 2rem; } .subtitle { font-size: 1rem; } }
}
.content-grid { 
  display: grid; 
  grid-template-columns: 3fr 1fr; 
  gap: 30px; 
  @media (max-width: 1024px) { grid-template-columns: 1fr; } 
}

.left-column { display: flex; flex-direction: column; gap: 20px; }

// ===================================
// VIDEO WRAPPER & OVERLAYS
// ===================================

.video-wrapper {
  position: relative; 
  width: 100%; 
  aspect-ratio: 16/9; 
  background-color: #000; 
  border-radius: 16px; 
  overflow: hidden; 
  border: 1px solid #1e293b; 
  box-shadow: 0 0 40px rgba(0,0,0,0.5);
  
  @media (max-width: 600px) {
    aspect-ratio: 4/3; // Taller for mobile
    border-radius: 10px;
  }

  .camera-off-overlay { 
    position: absolute; inset: 0; 
    display: flex; flex-direction: column; 
    align-items: center; justify-content: center; 
    background: #0d121c; 
    z-index: 10; 
    text-align: center;
    .camera-off-icon { position: relative; width: 100px; height: 100px; color: #718096; margin-bottom: 20px; svg { width: 100px; height: 100px; stroke-width: 1.5; } .red-slash { position: absolute; top: 50%; left: 0; right: 0; height: 8px; background-color: #ef4444; transform: rotate(45deg); border-radius: 4px; z-index: 1; box-shadow: 0 0 10px rgba(#ef4444, 0.5); } }
    .title-text { color: white; font-size: 1.8rem; font-weight: 700; margin-bottom: 10px; }
    .instruction-text { color: #94a3b8; max-width: 300px; line-height: 1.5; }
    @media (max-width: 600px) { .title-text { font-size: 1.5rem; } .instruction-text { font-size: 0.9rem; } }
  }

  // Analyzing badge
  .analyzing-badge { position: absolute; top: 20px; right: 20px; background: rgba(0, 0, 0, 0.7); color: #fff; padding: 8px 16px; border-radius: 20px; display: flex; align-items: center; gap: 10px; font-size: 0.9rem; font-weight: 600; z-index: 20; border: 1px solid rgba(255, 255, 255, 0.1); .spinner { width: 14px; height: 14px; border: 2px solid #fff; border-top-color: transparent; border-radius: 50%; animation: spin 1s linear infinite; } }
  
  // Exit Fullscreen Button (Center Bottom)
  .exit-fullscreen-overlay-btn {
    position: absolute;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.6);
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.2);
    width: 50px;
    height: 50px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 1000;
    transition: all 0.2s;

    &:hover { background: rgba(239, 68, 68, 0.8); border-color: transparent; }
    svg { width: 24px; height: 24px; }
  }

  .live-video { 
    width: 100%; height: 100%; 
    object-fit: cover; 
    transform: scaleX(-1); // Mirror
    &.hidden { display: none; } 
  }

  .detection-canvas { 
    position: absolute; top: 0; left: 0; 
    width: 100%; height: 100%; 
    pointer-events: none; 
  }
}

// ===================================
// FULLSCREEN STYLES (Portrait / Mobile)
// ===================================
.video-wrapper:fullscreen {
  width: 100vw;
  height: 100vh;
  aspect-ratio: unset;
  border-radius: 0;
  background: black;
  
  .live-video, .detection-canvas {
    width: 100%;
    height: 100%;
    object-fit: cover; // Crucial for "Portrait" feel on mobile
  }

  // Ensure button stays at bottom even if video is tall
  .exit-fullscreen-overlay-btn {
    position: fixed; 
    bottom: 40px;
  }
}

// Vendor prefixes
:-webkit-full-screen .video-wrapper { width: 100vw; height: 100vh; aspect-ratio: unset; }
:-moz-full-screen .video-wrapper { width: 100vw; height: 100vh; aspect-ratio: unset; }


// ===================================
// CONTROLS BAR
// ===================================

.controls-bar { 
  display: flex; 
  gap: 15px; 
  
  @media (max-width: 600px) {
    flex-wrap: wrap; 
    .btn-primary, .btn-secondary {
        flex: 1 1 auto; 
        min-width: 40%; 
    }
  }

  button { 
    padding: 12px 24px; 
    border-radius: 8px; 
    font-weight: 600; 
    cursor: pointer; 
    display: flex; 
    align-items: center; 
    justify-content: center; 
    gap: 8px; 
    font-size: 1rem; 
  } 
  
  .btn-primary { background-color: #ef4444; color: white; border: none; } 
  .btn-stop { background-color: #ef4444; color: white; &:hover { background-color: #dc2626; } } 
  
  .btn-secondary { 
    background: transparent; 
    border: 1px solid #334155; 
    color: white; 
    &:hover { border-color: $teal; } 
    
    &.flip-btn svg { width: 20px; height: 20px; }
  } 

  @media (max-width: 600px) {
    .btn-secondary {
      padding: 10px 15px; 
      font-size: 0.9rem;
      flex-direction: column; 
      gap: 2px;
    }
    .btn-primary {
      padding: 12px 15px;
      font-size: 0.9rem;
    }
  }
}

// ===================================
// STATS PANEL
// ===================================

.stats-panel { 
  display: grid; 
  grid-template-columns: repeat(4, 1fr); 
  background-color: #0a0a0a; 
  padding: 20px; 
  border-radius: 12px; 
  border: 1px solid #1e293b; 
  
  .stat { 
    display: flex; flex-direction: column; gap: 5px; 
    border-right: 1px solid #1e293b; padding-left: 20px; 
    &:last-child { border-right: none; } 
    &:first-child { padding-left: 0; } 
    .label { color: #94a3b8; font-size: 0.9rem; } 
    .value { font-size: 1.5rem; font-weight: 700; color: white; } 
    .value.teal { color: $teal; } 
    .value.green { color: $green; } 
    .value.text-gray { color: #64748b; font-size: 1.2rem; } 
  } 
  
  @media (max-width: 768px) { 
    grid-template-columns: 1fr 1fr; 
    gap: 20px; 
    padding: 15px;
    .stat { 
      border-right: none; padding-left: 0; 
      .value { font-size: 1.3rem; }
    } 
  } 
}

// ... (Rest of CSS: right column, modal, tips, etc. is preserved) ...
.right-column { display: flex; flex-direction: column; gap: 20px; }
.info-card { background-color: $card-bg; border-radius: 12px; padding: 20px; border: 1px solid #1e293b; }
.tips-card { border: 1px solid rgba($teal, 0.3); background: linear-gradient(180deg, rgba($teal, 0.05) 0%, $card-bg 100%); .card-header { display: flex; align-items: center; gap: 10px; margin-bottom: 15px; .icon-info { color: $teal; font-weight: bold; border: 1px solid $teal; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-size: 0.9rem; } h3 { font-size: 1.1rem; color: white; margin: 0; } } ul { padding-left: 20px; color: #cbd5e1; li { margin-bottom: 8px; font-size: 0.9rem; } } }
.guide-card { h3 { font-size: 1.2rem; color: white; margin-bottom: 20px; } .step-list { display: flex; flex-direction: column; gap: 20px; .step { display: flex; gap: 15px; .step-num { width: 28px; height: 28px; background: rgba($teal, 0.1); color: $teal; font-weight: bold; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; } .step-text { strong { display: block; color: white; margin-bottom: 4px; font-size: 0.95rem; } p { color: #94a3b8; font-size: 0.85rem; margin: 0; line-height: 1.4; } } } } }
.system-card { border-left: 3px solid $green; .system-header { display: flex; align-items: center; gap: 10px; color: white; font-weight: 700; margin-bottom: 15px; .status-dot { width: 10px; height: 10px; background-color: #64748b; border-radius: 50%; &.active { background-color: $green; box-shadow: 0 0 10px $green; } } } .system-details p { color: #94a3b8; font-size: 0.9rem; margin-bottom: 5px; span { color: white; float: right; font-weight: 500; } } }
@keyframes spin { to { transform: rotate(360deg); } }

.modal-overlay {
  position: fixed; inset: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex; align-items: center; justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
}

.modal-content {
  background: $card-bg;
  border: 1px solid #1e293b;
  border-radius: 16px;
  padding: 30px;
  width: 90%;
  max-width: 400px;
  text-align: center;
  box-shadow: 0 20px 50px rgba(0,0,0,0.5);
  animation: modalPop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);

  .modal-icon {
    width: 60px; height: 60px;
    background: rgba($teal, 0.1);
    color: $teal;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 20px;
    svg { width: 30px; height: 30px; }
  }

  h2 { font-size: 1.5rem; color: white; margin-bottom: 10px; }
  p { color: #94a3b8; font-size: 0.95rem; margin-bottom: 25px; line-height: 1.5; }

  .modal-actions {
    display: flex; flex-direction: column; gap: 12px; margin-bottom: 15px;
    .full-width { width: 100%; justify-content: center; }
    .btn-primary {
      background-color: $teal; color: #000000; border: none; padding: 12px; border-radius: 8px; font-weight: 700; font-size: 1rem; cursor: pointer; transition: all 0.2s ease;
      &:hover { background-color: $teal-hover; transform: translateY(-1px); box-shadow: 0 4px 12px rgba($teal, 0.3); }
    }
    .btn-outline {
      background: transparent; border: 1px solid #334155; color: white; padding: 12px; border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.2s;
      &:hover { border-color: $teal; color: $teal; background: rgba($teal, 0.05); }
    }
  }

  .btn-text {
    background: none; border: none; color: #64748b; cursor: pointer; font-size: 0.9rem; text-decoration: underline;
    &:hover { color: white; }
  }
}

@keyframes modalPop {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
}
</style>