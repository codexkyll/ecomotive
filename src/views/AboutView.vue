<template>
  <div class="dashboard-container">
    
    <!-- ================= NAVBAR ================= -->
    <Navbar />

    <main class="main-content">
      
      <!-- ================= 1. ABOUT HEADER ================= -->
      <!-- ADDED center-text CLASS FOR CENTERING -->
      <section class="page-header animate-fade-in center-text">
        <h1>About EcoMotive</h1>
        <!-- SUBTITLE NOW CENTERS BECAUSE OF PARENT CLASS -->
        <p class="subtitle">
          Delivering the next generation of real-time computer vision to accurately identify, track, and analyze Plants, Animals, and Vehicles.
        </p>
      </section>

      <!-- ================= 2. MISSION / VISION / VALUES ================= -->
      <section class="section-block">
        <div class="grid-3">
          <div class="card mission-card">
            <h3>Our Mission</h3>
            <p>To democratize advanced computer vision technology, making powerful, real-time object detection accessible for meticulous environmental and urban monitoring.</p>
          </div>
          <div class="card mission-card">
            <h3>Our Vision</h3>
            <p>Creating a world where high-precision visual intelligence drives smarter decisions, enables critical ecological conservation, and builds safer, more efficient communities.</p>
          </div>
          <div class="card mission-card">
            <h3>Our Values</h3>
            <p>Innovation, Exceptional Accuracy, Data Transparency, and a commitment to continuous learning through a Real-World Feedback Loop for evolving technology.</p>
          </div>
        </div>
      </section>

      <!-- ================= 3. TEAM SECTION ================= -->
      <section class="section-block">
        <!-- ALREADY CENTERED -->
        <h2 class="section-heading center">Meet Our Team</h2>
        <!-- ALREADY CENTERED -->
        <p class="section-sub center">A dedicated and interdisciplinary group of student developers, focused on full-stack engineering, model training, and meticulous data analysis, all committed to the continuous development of the EcoMotive vision solution.</p>
        
        <div class="grid-3">
          <div v-for="member in teamMembers" :key="member.name" class="card team-card">
            <!-- IMAGE ALIGNS CENTER VIA .team-card CSS -->
            <div class="member-icon photo-icon">
              <!-- Replaced SVG with Image tag -->
              <img :src="member.image" :alt="member.name" class="member-photo">
            </div>
            
            <!-- TEXT ALIGNS CENTER VIA .team-card CSS -->
            <h3 class="member-name">{{ member.name }}</h3>
            <span class="member-role">{{ member.role }}</span>
            
            <p class="member-desc">{{ member.description }}</p>
            
            <div class="member-tags">
              <span v-for="skill in member.skills" :key="skill" class="tag">{{ skill }}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- ================= 4. STATS SECTION ================= -->
      <section class="section-block">
        <h2 class="section-heading center">By The Numbers</h2>
        <p class="section-sub center">Our impact and growth</p>
        
        <div class="grid-4">
          <div v-for="stat in stats" :key="stat.label" class="card stat-card">
            <h2 class="stat-val">{{ stat.value }}</h2>
            <p class="stat-lbl">{{ stat.label }}</p>
          </div>
        </div>
      </section>

    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Navbar from '../components/navbar.vue'; // IMPORT NAVBAR

// 1. IMPORT IMAGES
import jedImage from '../assets/img/jed.jpg';
import leoImage from '../assets/img/leo.jpg';
import kimImage from '../assets/img/kim.png';

// --- Team Members and their Roles (UPDATED CONTENT) ---
const teamMembers = ref([
  {
    name: 'Tecson, Jade Kyll M.',
    role: 'Lead Developer & Front-End Architect',
    description: 'The core conceptual mind and primary developer. Responsible for translating project requirements into the highly functional web application, mastering the API connection logic, and designing the intuitive User Interface (UI) and user experience (UX).',
    skills: ['Web Application Logic', 'UI/UX Conceptualization', 'Vue.js Framework', 'API Integration'],
    image: jedImage // ADDED IMAGE PATH
  },
  {
    name: 'Antipuesto, Leo Alfier S.',
    role: 'Model Training Specialist & Design Contributor',
    description: 'Specialized in the Machine Learning Operations (ML Ops) process, leading the YOLO model training, optimization, and dataset refinement efforts. Provided essential support in web design, particularly focusing on optimal application flow and model integration.',
    skills: ['YOLO Model Training', 'Dataset Optimization', 'Web Design Flow', 'Model Integration'],
    image: leoImage // ADDED IMAGE PATH
  },
  {
    name: 'Carin, Kimberly O.',
    role: 'Documentation and Process Analyst',
    description: 'Crucial for project governance. Assigned to manage all official project documentation, track process progress, and ensure data quality through meticulous performance validation and reporting on model failure metrics.',
    skills: ['Project Documentation', 'Performance Metrics', 'Quality Assurance', 'Process Methodology'],
    image: kimImage // ADDED IMAGE PATH
  }
]);

// --- Stats Data (UPDATED LABELS) ---
const stats = ref([
  { value: '3', label: 'Core Segmentation Classes' },
  { value: '437+', label: 'Annotated Dataset Instances' },
  { value: '96.4%', label: 'Post-Refinement mAP Score' },
  { value: 'Real-time', label: 'Sub-Second Latency' }
]);
</script>

<style lang="scss" scoped>
// --- Variables ---
$bg-color: #050b14;
$text-color: #e2e8f0;
$card-bg: #0f172a;
$border-color: #1e293b;

// Accents
$teal: #14b8a6;
$teal-hover: #2dd4bf;
$green: #22c55e;

.dashboard-container {
  background-color: $bg-color;
  color: $text-color;
  min-height: 100vh;
  font-family: 'Inter', sans-serif;
  padding: 0 5%;
}

/* --- Navbar Styles Removed (Handled by Component) --- */

/* --- Main Layout --- */
.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 60px 0 100px;
}

/* --- Page Header --- */
.page-header {
  margin-bottom: 60px;
  h1 { font-size: 3.5rem; font-weight: 800; color: white; margin-bottom: 20px; letter-spacing: -1px; }
  .subtitle { color: #94a3b8; font-size: 1.2rem; line-height: 1.6; max-width: 800px; }
  
  // NEW RULE: Centering for page-header text
  &.center-text {
    text-align: center;
    .subtitle {
      margin-left: auto;
      margin-right: auto;
    }
  }
}

/* --- Section Utilities --- */
.section-block { margin-bottom: 80px; }
.section-heading { font-size: 2rem; font-weight: 700; color: white; margin-bottom: 10px; }
.section-sub { color: #94a3b8; margin-bottom: 40px; font-size: 1.1rem; }
.center { text-align: center; } 

/* --- Grids --- */
.grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; }
.grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 30px; }

/* --- Cards (General) --- */
.card {
  background-color: $card-bg;
  border: 1px solid $border-color;
  border-radius: 16px;
  padding: 30px;
  transition: transform 0.2s;
  &:hover { border-color: $teal; transform: translateY(-5px); }
}

/* --- Mission Cards --- */
.mission-card {
  h3 { color: white; margin-bottom: 15px; font-size: 1.25rem; font-weight: 700; }
  p { color: #94a3b8; line-height: 1.6; font-size: 0.95rem; }
}

/* --- Team Cards --- */
.team-card {
  // CHANGED FROM flex-start TO center to center the image and text blocks
  display: flex; 
  flex-direction: column; 
  align-items: center; 
  text-align: center; // Center text elements

  .member-icon {
    // OLD ICON STYLES:
    width: 60px; height: 60px;
    background: linear-gradient(135deg, rgba($teal, 0.1), rgba($teal, 0.05));
    border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 20px;
    color: $teal;
    svg { width: 30px; height: 30px; }
    
    // NEW PHOTO STYLES:
    &.photo-icon {
      width: 100px;
      height: 100px;
      border-radius: 50%; /* Makes it circular */
      overflow: hidden;
      padding: 0;
      border: 3px solid $teal; /* Accent border */
      background: $card-bg;
      
      .member-photo {
        width: 100%;
        height: 100%;
        object-fit: cover; /* Ensures the image fills the circle */
      }
    }
  }

  .member-name { color: white; font-size: 1.25rem; font-weight: 700; margin-bottom: 5px; }
  .member-role { color: $teal; font-size: 0.9rem; font-weight: 600; margin-bottom: 15px; display: block; }
  // Adjusted margin to allow space for centered text and align the tags at the bottom
  .member-desc { color: #94a3b8; font-size: 0.95rem; line-height: 1.5; margin-bottom: 25px; flex-grow: 1; }

  .member-tags {
    display: flex; flex-wrap: wrap; gap: 8px;
    justify-content: center; // Center the tags
    .tag {
      background: rgba($teal, 0.1); color: $teal;
      padding: 4px 12px; border-radius: 6px; font-size: 0.75rem; font-weight: 600;
    }
  }
}

/* --- Stats Cards --- */
.stat-card {
  text-align: center;
  padding: 40px 20px;
  .stat-val { font-size: 3rem; font-weight: 800; color: $teal; margin-bottom: 10px; }
  .stat-lbl { color: #94a3b8; font-size: 1rem; font-weight: 500; }
}

/* --- Responsive --- */
@media (max-width: 1024px) {
  .grid-3 { grid-template-columns: repeat(2, 1fr); }
  .grid-4 { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 768px) {
  .grid-3, .grid-4 { grid-template-columns: 1fr; }
  .page-header h1 { font-size: 2.5rem; }
}

.animate-fade-in { animation: fadeIn 0.8s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
</style>