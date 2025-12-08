<template>
  <div class="dashboard-container">
    
    <!-- ================= NAVBAR ================= -->
    <Navbar />

    <main class="main-content">
      
      <!-- ================= 1. ABOUT HEADER ================= -->
      <section class="page-header animate-fade-in">
        <h1>About EcoMotive</h1>
        <p class="subtitle">
          We're building the next generation of AI-powered computer vision solutions to help 
          identify, track, and analyze plants, animals, and vehicles with unprecedented accuracy 
          and speed.
        </p>
      </section>

      <!-- ================= 2. MISSION / VISION / VALUES ================= -->
      <section class="section-block">
        <div class="grid-3">
          <div class="card mission-card">
            <h3>Our Mission</h3>
            <p>To democratize advanced computer vision technology and make real-time AI detection accessible for environmental and urban monitoring.</p>
          </div>
          <div class="card mission-card">
            <h3>Our Vision</h3>
            <p>Creating a world where AI-powered visual intelligence drives smarter decisions, safer communities, and better ecological awareness.</p>
          </div>
          <div class="card mission-card">
            <h3>Our Values</h3>
            <p>Innovation, accuracy, transparency, and a commitment to responsible AI development and deployment.</p>
          </div>
        </div>
      </section>

      <!-- ================= 3. TEAM SECTION ================= -->
      <section class="section-block">
        <h2 class="section-heading">Meet Our Team</h2>
        <p class="section-sub">A dedicated group of students and developers committed to advancing computer vision.</p>
        
        <div class="grid-3">
          <div v-for="member in teamMembers" :key="member.name" class="card team-card">
            <div class="member-icon">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
            </div>
            
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

// --- Team Members and their Roles ---
const teamMembers = ref([
  {
    name: 'Tecson, Jade Kyll M.',
    role: 'Lead AI Engineer',
    description: 'ML expert specializing in object detection, dataset curation, and model optimization using YOLO architecture.',
    skills: ['Machine Learning', 'Computer Vision', 'Python']
  },
  {
    name: 'Antipuesto, Leo Alfier S.',
    role: 'Full Stack Developer',
    description: 'Full stack engineer focused on building the scalable web application, API integration, and backend server logic.',
    skills: ['Vue.js', 'Node.js', 'System Design']
  },
  {
    name: 'Carin, Kimberly O.',
    role: 'Data Scientist',
    description: 'Data specialist responsible for dataset management, quality assurance, and analyzing model performance metrics.',
    skills: ['Data Analysis', 'Model Training', 'Roboflow']
  }
]);

// --- Stats Data ---
const stats = ref([
  { value: '3', label: 'Primary Classes' },
  { value: '437+', label: 'Training Images' },
  { value: '96.4%', label: 'Average Precision' },
  { value: 'Real-time', label: 'Detection Speed' }
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
  display: flex; flex-direction: column; align-items: flex-start;
  
  .member-icon {
    width: 60px; height: 60px;
    background: linear-gradient(135deg, rgba($teal, 0.1), rgba($teal, 0.05));
    border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 20px;
    color: $teal;
    svg { width: 30px; height: 30px; }
  }

  .member-name { color: white; font-size: 1.25rem; font-weight: 700; margin-bottom: 5px; }
  .member-role { color: $teal; font-size: 0.9rem; font-weight: 600; margin-bottom: 15px; display: block; }
  .member-desc { color: #94a3b8; font-size: 0.95rem; line-height: 1.5; margin-bottom: 25px; flex-grow: 1; }

  .member-tags {
    display: flex; flex-wrap: wrap; gap: 8px;
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