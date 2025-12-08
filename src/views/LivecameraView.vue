<template>
  <div class="dashboard-container">
    
    <!-- ================= NAVBAR ================= -->
    <Navbar />

    <main class="main-content">
      
      <!-- ================= HEADER ================= -->
      <section class="page-header">
        <h1>Live Detection</h1>
        <p class="subtitle">Real-time object detection with AI-powered analysis</p>
      </section>

      <div class="content-grid">
        
        <!-- ================= LEFT COLUMN: CAMERA & CONTROLS ================= -->
        <div class="left-column">
          
          <!-- 1. Camera Feed Container -->
          <div class="video-wrapper">
            
            <!-- A. Loading / Idle Overlay -->
            <div v-if="!isStreaming" class="video-overlay" @click="startCamera">
              <div class="play-btn">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" /></svg>
              </div>
              <p>Click start to begin detection</p>
            </div>

            <!-- B. ANALYZING INDICATOR -->
            <div v-if="isStreaming && isProcessing" class="analyzing-badge">
              <div class="spinner"></div>
              <span>Analyzing...</span>
            </div>

            <!-- C. Live Video Element -->
            <video ref="videoRef" autoplay playsinline muted class="live-video" :class="{ 'hidden': !isStreaming }"></video>
            
            <!-- D. Canvas for Bounding Boxes -->
            <canvas ref="canvasRef" class="detection-canvas"></canvas>
          </div>

          <!-- 2. Controls -->
          <div class="controls-bar">
            <button @click="toggleCamera" class="btn-primary" :class="{ 'btn-stop': isStreaming }">
              <span v-if="!isStreaming">▷ Start Camera</span>
              <span v-else>■ Stop Camera</span>
            </button>
            <button @click="clearDetection" class="btn-secondary">
              ⟳ Clear
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
          <div class="info-card tips-card">
            <div class="card-header">
              <span class="icon-info">!</span>
              <h3>Tips for Best Results</h3>
            </div>
            <ul>
              <li>Ensure adequate lighting</li>
              <li>Keep objects in view for 2+ seconds</li>
              <li>Position camera perpendicular to objects</li>
            </ul>
          </div>

          <div class="info-card guide-card">
            <h3>How to Use</h3>
            <div class="step-list">
              <div class="step">
                <div class="step-num">1</div>
                <div class="step-text">
                  <strong>Start Camera</strong>
                  <p>Click the "Start Camera" button to begin live detection</p>
                </div>
              </div>
              <div class="step">
                <div class="step-num">2</div>
                <div class="step-text">
                  <strong>View Detection</strong>
                  <p>Watch as bounding boxes appear around detected objects</p>
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

    <!-- ================= AUTH MODAL ================= -->
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
import { ref, onUnmounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import Navbar from '../components/navbar.vue'; 

// --- Configuration ---
const API_KEY = import.meta.env.VITE_ROBOFLOW_PRIVATE_API_KEY;
const MODEL_ID = import.meta.env.VITE_ROBOFLOW_MODEL_ID;
const VERSION = import.meta.env.VITE_ROBOFLOW_VERSION;
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const MODEL_ENDPOINT = `https://detect.roboflow.com/${MODEL_ID}/${VERSION}`;

const router = useRouter();

// --- State ---
const videoRef = ref(null);
const canvasRef = ref(null);
const isStreaming = ref(false);
const detectionCount = ref(0);
const avgConfidence = ref(0);
const statusText = ref('Ready');
const currentFPS = ref(0);
const isProcessing = ref(false);
const showAuthModal = ref(false); // NEW: Controls the modal

// Internal variables
let stream = null;
let intervalId = null;
let lastFrameTime = 0;
let lastSaveTime = 0;
const SAVE_COOLDOWN = 3000;

// --- Modal Methods ---
const closeAuthModal = () => {
  showAuthModal.value = false;
};

const goToLogin = () => {
  router.push('/login');
};

const goToSignup = () => {
  router.push('/signup');
};

// --- Camera Methods ---

const startCamera = async () => {
  // === UPDATED AUTH CHECK ===
  const token = localStorage.getItem('userToken');
  if (!token) {
    // Show Modal instead of Alert
    showAuthModal.value = true;
    return;
  }

  try {
    statusText.value = 'Initializing...';
    stream = await navigator.mediaDevices.getUserMedia({ 
      video: { facingMode: 'environment', width: { ideal: 640 }, height: { ideal: 480 } },
      audio: false
    });
    
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
    alert("Could not access camera. Please allow permissions.");
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
};

const toggleCamera = () => {
  if (isStreaming.value) stopCamera();
  else startCamera();
};

const clearDetection = () => {
  detectionCount.value = 0;
  avgConfidence.value = 0;
  const ctx = canvasRef.value?.getContext('2d');
  if (ctx) ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height);
};

// --- Detection Loop ---
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
        showAuthModal.value = true; // Show modal if token expires mid-stream
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

// ============================================
//  RENDER FUNCTION
// ============================================
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
    const mirroredTopLeftX = w - (originalTopLeftX + width);

    // Segmentation
    if (prediction.points && prediction.points.length > 0) {
      ctx.beginPath();
      ctx.moveTo(w - prediction.points[0].x, prediction.points[0].y);
      for (let i = 1; i < prediction.points.length; i++) {
        ctx.lineTo(w - prediction.points[i].x, prediction.points[i].y);
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

onUnmounted(() => {
  stopCamera();
});
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

.main-content { max-width: 1400px; margin: 0 auto; padding: 40px 0; }
.page-header { margin-bottom: 30px; h1 { font-size: 2.5rem; font-weight: 700; margin-bottom: 10px; color: white; } .subtitle { color: #94a3b8; font-size: 1.1rem; } }
.content-grid { display: grid; grid-template-columns: 3fr 1fr; gap: 30px; @media (max-width: 1024px) { grid-template-columns: 1fr; } }

.left-column { display: flex; flex-direction: column; gap: 20px; }
.video-wrapper {
  position: relative; width: 100%; aspect-ratio: 16/9; background-color: #000; border-radius: 16px; overflow: hidden; border: 1px solid #1e293b; box-shadow: 0 0 40px rgba(0,0,0,0.5);
  .analyzing-badge { position: absolute; top: 20px; right: 20px; background: rgba(0, 0, 0, 0.7); color: #fff; padding: 8px 16px; border-radius: 20px; display: flex; align-items: center; gap: 10px; font-size: 0.9rem; font-weight: 600; z-index: 20; border: 1px solid rgba(255, 255, 255, 0.1); .spinner { width: 14px; height: 14px; border: 2px solid #fff; border-top-color: transparent; border-radius: 50%; animation: spin 1s linear infinite; } }
  .video-overlay { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; background: rgba(0,0,0,0.7); z-index: 10; cursor: pointer; .play-btn { width: 80px; height: 80px; border: 2px solid $teal; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-bottom: 15px; color: $teal; transition: all 0.3s; svg { width: 40px; height: 40px; } } p { color: #cbd5e1; } &:hover .play-btn { background: rgba($teal, 0.1); transform: scale(1.1); } }
  .live-video { width: 100%; height: 100%; object-fit: cover; transform: scaleX(-1); &.hidden { display: none; } }
  .detection-canvas { position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; }
}

.controls-bar { display: flex; gap: 15px; button { padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 8px; font-size: 1rem; } .btn-primary { background-color: $teal; color: black; border: none; &:hover { background-color: $teal-hover; } } .btn-stop { background-color: #ef4444; color: white; &:hover { background-color: #dc2626; } } .btn-secondary { background: transparent; border: 1px solid #334155; color: white; &:hover { border-color: $teal; } } }
.stats-panel { display: grid; grid-template-columns: repeat(4, 1fr); background-color: #0a0a0a; padding: 20px; border-radius: 12px; border: 1px solid #1e293b; .stat { display: flex; flex-direction: column; gap: 5px; border-right: 1px solid #1e293b; padding-left: 20px; &:last-child { border-right: none; } &:first-child { padding-left: 0; } .label { color: #94a3b8; font-size: 0.9rem; } .value { font-size: 1.5rem; font-weight: 700; color: white; } .value.teal { color: $teal; } .value.green { color: $green; } .value.text-gray { color: #64748b; font-size: 1.2rem; } } @media (max-width: 768px) { grid-template-columns: 1fr 1fr; gap: 20px; .stat { border-right: none; padding-left: 0; } } }
.right-column { display: flex; flex-direction: column; gap: 20px; }
.info-card { background-color: $card-bg; border-radius: 12px; padding: 20px; border: 1px solid #1e293b; }
.tips-card { border: 1px solid rgba($teal, 0.3); background: linear-gradient(180deg, rgba($teal, 0.05) 0%, $card-bg 100%); .card-header { display: flex; align-items: center; gap: 10px; margin-bottom: 15px; .icon-info { color: $teal; font-weight: bold; border: 1px solid $teal; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-size: 0.9rem; } h3 { font-size: 1.1rem; color: white; margin: 0; } } ul { padding-left: 20px; color: #cbd5e1; li { margin-bottom: 8px; font-size: 0.9rem; } } }
.guide-card { h3 { font-size: 1.2rem; color: white; margin-bottom: 20px; } .step-list { display: flex; flex-direction: column; gap: 20px; .step { display: flex; gap: 15px; .step-num { width: 28px; height: 28px; background: rgba($teal, 0.1); color: $teal; font-weight: bold; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; } .step-text { strong { display: block; color: white; margin-bottom: 4px; font-size: 0.95rem; } p { color: #94a3b8; font-size: 0.85rem; margin: 0; line-height: 1.4; } } } } }
.system-card { border-left: 3px solid $green; .system-header { display: flex; align-items: center; gap: 10px; color: white; font-weight: 700; margin-bottom: 15px; .status-dot { width: 10px; height: 10px; background-color: #64748b; border-radius: 50%; &.active { background-color: $green; box-shadow: 0 0 10px $green; } } } .system-details p { color: #94a3b8; font-size: 0.9rem; margin-bottom: 5px; span { color: white; float: right; font-weight: 500; } } }
@keyframes spin { to { transform: rotate(360deg); } }

/* --- MODAL STYLES --- */
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
    display: flex; 
    flex-direction: column; 
    gap: 12px; 
    margin-bottom: 15px;
    
    .full-width { width: 100%; justify-content: center; }
    
    // === NEW STYLING FOR LOGIN BUTTON ===
    .btn-primary {
      background-color: $teal;  /* Teal Background */
      color: #000000;           /* Black Text */
      border: none;
      padding: 12px;
      border-radius: 8px;
      font-weight: 700;         /* Bolder text */
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.2s ease;
      
      &:hover { 
        background-color: $teal-hover; 
        transform: translateY(-1px); /* Slight lift effect */
        box-shadow: 0 4px 12px rgba($teal, 0.3); /* Glow effect */
      }
    }

    .btn-outline {
      background: transparent; 
      border: 1px solid #334155; 
      color: white;
      padding: 12px; 
      border-radius: 8px; 
      font-weight: 600; 
      cursor: pointer; 
      transition: all 0.2s;
      
      &:hover { 
        border-color: $teal; 
        color: $teal; 
        background: rgba($teal, 0.05);
      }
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