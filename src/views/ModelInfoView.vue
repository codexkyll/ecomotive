<template>
  <div class="dashboard-container">
    
    <!-- ============================================ -->
    <!--                 1. NAVBAR                    -->
    <!-- ============================================ -->
    <Navbar />

    <main class="main-content">
      
      <!-- ============================================ -->
      <!--           2. HEADER & STATS BLOCK          -->
      <!-- ============================================ -->
      <section class="page-header animate-fade-in">
        <h1>Plant, Vehicle & Animal Segmentation Model</h1>
        <p class="subtitle">Powered by Roboflow Instance Segmentation - Advanced computer vision for real-world environments</p>

        <!-- Stats Container -->
        <div class="stats-container">
          <div class="stat-item">
            <span class="label">Architecture</span>
            <span class="value">YOLO v8</span>
            <span class="sub">You Only Look Once</span>
          </div>
          <div class="stat-separator"></div>
          <div class="stat-item">
            <span class="label">Task Type</span>
            <span class="value">Instance Segmentation</span>
            <span class="sub">Exact polygon outlines</span>
          </div>
          <div class="stat-separator"></div>
          <div class="stat-item">
            <span class="label">Accuracy</span>
            <span class="value highlight">96.4%</span>
            <span class="sub">mAP@50</span>
          </div>
        </div>
      </section>

      <!-- ============================================ -->
      <!--           3. DETECTION CLASSES             -->
      <!-- ============================================ -->
      <section class="section-block">
        <h2 class="section-title">Detection Classes</h2>
        <div class="grid-3">
          <div v-for="item in detectionClasses" :key="item.title" class="info-card">
            
            <div class="card-header">
              <!-- Icon Box -->
              <div class="icon-box" :class="item.color">
                <!-- Leaf Icon -->
                <img v-if="item.icon === 'plant'" src="../assets/img/plant.png" alt="Plant Detection" />
                <!-- Bear Icon -->
                <img v-if="item.icon === 'animal'" src="../assets/img/animal.png" alt="Animal Recognition" />
                <!-- Truck Icon -->
                <img v-if="item.icon === 'vehicle'" src="../assets/img/vehicle.png" alt="Vehicle Tracking" />
              </div>
              <h3>{{ item.title }}</h3>
            </div>

            <p class="description">{{ item.description }}</p>
            
            <ul class="checklist">
              <li v-for="sub in item.items" :key="sub">
                <span class="check">✓</span> {{ sub }}
              </li>
            </ul>
          </div>
        </div>
      </section>

      <!-- ============================================ -->
      <!--         4. OPERATIONAL CAPABILITIES        -->
      <!-- ============================================ -->
      <section class="section-block">
        <h2 class="section-title">Operational Capabilities</h2>
        <div class="grid-2">
          <div v-for="cap in capabilities" :key="cap.title" class="info-card capability-card">
            <h3 class="cap-header">
              <span v-if="cap.icon === 'bolt'" class="icon-yellow">⚡</span>
              <span v-if="cap.icon === 'shield'" class="icon-blue">🛡️</span>
              {{ cap.title }}
            </h3>
            
            <ul class="checklist spaced">
              <li v-for="item in cap.items" :key="item">
                <span class="check">✓</span> {{ item }}
              </li>
            </ul>
          </div>
        </div>
      </section>

      <!-- ============================================ -->
      <!--             5. MODEL LIMITATIONS           -->
      <!-- ============================================ -->
      <section class="section-block">
        <h2 class="section-title warning-title">
          <span class="warning-icon">!</span> Model Limitations
        </h2>
        <div class="grid-2">
          <div v-for="limit in limitations" :key="limit.title" class="info-card limit-card">
            <h4>{{ limit.title }}</h4>
            <p>{{ limit.text }}</p>
          </div>
        </div>
      </section>

    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Navbar from '../components/navbar.vue'; // IMPORT NAVBAR

// --- Data Content ---
const detectionClasses = ref([
  {
    title: 'Plant',
    description: 'Detects and segments leaves, flowers, bushes, and groups of plants in various environments.',
    items: ['Leaves and foliage', 'Flowers and blooms', 'Bushes and trees', 'Plant groups'],
    icon: 'plant',
    color: 'green'
  },
  {
    title: 'Animal',
    description: 'Recognizes various animal species with different shapes and textures from multiple angles.',
    items: ['Marine mammals', 'Land animals', 'Birds', 'Multiple angles'],
    icon: 'animal',
    color: 'blue'
  },
  {
    title: 'Vehicle',
    description: 'Detects and segments cars, motorcycles, buses, and other vehicles in real-world scenes.',
    items: ['Cars', 'Motorcycles', 'Buses', 'Various angles'],
    icon: 'vehicle',
    color: 'orange'
  }
]);

const capabilities = ref([
  {
    title: 'Lighting Tolerance',
    icon: 'bolt',
    items: ['Bright daylight conditions', 'Low-light environments', 'Nighttime scenarios', 'Shadowed areas']
  },
  {
    title: 'Robust Detection',
    icon: 'shield',
    items: ['Partial occlusion handling', 'Objects behind obstacles', 'Real-world messy environments', 'Multiple viewpoints']
  }
]);

const limitations = ref([
  {
    title: 'Distance & Size',
    text: 'Objects must be close enough to the camera for accurate detection. Very distant subjects may result in misclassification or detection failure.'
  },
  {
    title: 'Animal Specificity',
    text: 'Model is trained primarily on aquatic mammals, seals, and penguins. Other animal types may have lower confidence scores.'
  },
  {
    title: 'Motion Blur',
    text: 'Fast camera movement causes motion blur, which can lead to mislabeling. Keep the camera relatively steady during detection.'
  },
  {
    title: 'Hardware Quality',
    text: 'Lower quality webcams (720p or grainy) produce visual noise that mimics failure cases. Use decent quality camera for best results.'
  }
]);
</script>

<style lang="scss" scoped>
/* --- 1. Variables --- */
$bg-color: #050b14;
$text-color: #e2e8f0;
$card-bg: #0f172a;

// Accents
$teal: #14b8a6;
$teal-hover: #2dd4bf;
$green: #22c55e;
$blue: #3b82f6;
$orange: #f59e0b;
$yellow: #facc15;

.dashboard-container {
  background-color: $bg-color;
  color: $text-color;
  min-height: 100vh;
  font-family: 'Inter', sans-serif;
  padding: 0 5%;
  overflow-x: hidden;
}

/* --- 2. Navbar Styles Removed (Handled by Component) --- */

/* --- 3. Layout Utilities --- */
.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 60px 0 100px;
}

.grid-3 { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px; }
.grid-2 { display: grid; grid-template-columns: repeat(auto-fit, minmax(450px, 1fr)); gap: 30px; }

/* --- 4. Page Header & Stats --- */
.page-header {
  margin-bottom: 80px;
  
  h1 { font-size: 3rem; font-weight: 800; line-height: 1.2; margin-bottom: 15px; }
  .subtitle { font-size: 1.1rem; color: #94a3b8; margin-bottom: 40px; }

  .stats-container {
    background-color: #0a0a0a; // Darker inner bg
    border: 1px solid #1e293b;
    border-radius: 16px;
    padding: 30px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    flex-wrap: wrap;
    gap: 20px;

    .stat-item {
      display: flex; flex-direction: column; gap: 5px;
      .label { color: #94a3b8; font-size: 0.9rem; font-weight: 500; }
      .value { font-size: 2rem; font-weight: 800; color: white; }
      .value.highlight { color: #fff; } 
      .sub { font-size: 0.85rem; color: #64748b; }
    }

    .stat-separator {
      width: 1px; height: 50px; background-color: #334155;
      display: none; @media (min-width: 768px) { display: block; }
    }
  }
}

/* --- 5. Sections & Cards --- */
.section-block { margin-bottom: 80px; }
.section-title { font-size: 2rem; font-weight: 700; margin-bottom: 30px; }

.info-card {
  background-color: $card-bg;
  border: 1px solid #1e293b;
  border-radius: 12px;
  padding: 30px;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    border-color: rgba($teal, 0.3);
  }
}

/* Detection Classes Styling */
.card-header {
  display: flex; align-items: center; gap: 15px; margin-bottom: 20px;
  
  .icon-box {
    width: 50px; height: 50px; border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    
    // Existing SVG sizing
    svg { width: 28px; height: 28px; }

    /* Image sizing */
    img { width: 60px; height: auto; }
    
    &.green { background: rgba($green, 0.15); color: $green; }
    
    /* Blue box makes image white */
    &.blue { 
      background: rgba($blue, 0.15); 
      color: $blue;
      img { filter: brightness(0) invert(1); }
    }
    
    &.orange { background: rgba($orange, 0.15); color: $orange; }
  }
  
  h3 { font-size: 1.4rem; font-weight: 700; color: white; margin: 0; }
}

.description { color: #94a3b8; font-size: 0.95rem; line-height: 1.6; margin-bottom: 25px; min-height: 50px; }

.checklist {
  list-style: none; padding: 0;
  li { 
    margin-bottom: 12px; color: #cbd5e1; font-size: 0.95rem; display: flex; gap: 10px;
    .check { color: #94a3b8; }
  }
  &.spaced li { margin-bottom: 15px; }
}

/* Capabilities Styling */
.capability-card {
  .cap-header { font-size: 1.3rem; margin-bottom: 20px; display: flex; align-items: center; gap: 10px; color: white;}
  .icon-yellow { color: $yellow; }
  .icon-blue { color: $blue; }
}

/* Limitations Styling */
.warning-title { display: flex; align-items: center; gap: 12px; }
.warning-icon {
  display: inline-flex; align-items: center; justify-content: center;
  width: 30px; height: 30px; border: 2px solid $orange; border-radius: 50%;
  color: $orange; font-weight: bold; font-size: 1.2rem;
}

.limit-card {
  h4 { font-size: 1.2rem; color: white; margin-bottom: 10px; }
  p { color: #94a3b8; line-height: 1.6; }
}

// Mobile Responsive
@media (max-width: 768px) {
  .stats-container { flex-direction: column; align-items: flex-start; }
  .stat-separator { display: none; }
  .grid-2 { grid-template-columns: 1fr; }
}

.animate-fade-in { animation: fadeIn 0.8s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
</style>