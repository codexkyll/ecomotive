<template>
  <div class="dashboard-container">
    
    <!-- ============================================ -->
    <!--                 1. NAVBAR                    -->
    <!-- ============================================ -->
    <Navbar />

    <!-- ============================================ -->
    <!--           2. HERO SECTION                    -->
    <!-- ============================================ -->
    <header class="hero">
      <div class="hero-content">
        <h3 class="subtitle">Roboflow Powered Detection</h3>
        <h1>
          Detect Plants, <br />
          <span class="highlight-blue">Animals</span> <br />
          <span class="highlight-orange">& Vehicles</span>
        </h1>
        <p class="description">
          Advanced instance segmentation, powered by a meticulously fine-tuned model and precise segmentation masks. 
          Experience robust, high-confidence detection of plants, animals, and vehicles, validated across the most
          challenging real-world scenarios.
        </p>
        
        <div class="cta-group">
          <router-link to="/model-info" class="primary-btn" style="text-decoration: none; ">Learn About Model</router-link>
          <router-link to="/live-camera" class="secondary-btn" style="text-decoration: none; ">Start Detection</router-link>
        </div>
      </div>

      <div class="hero-image-container">
        <div class="glass-card">
          <div class="inner-circle"></div>
          <div class="card-inner-content">
            <div class="icons-row">
              <div class="icon-box plant">
                 <img src="../assets/img/plant.png" alt="plant">
              </div>
              <div class="icon-box animal">
                <img src="../assets/img/animal.png" alt="animal">
              </div>
              <div class="icon-box vehicle">
                <img src="../assets/img/vehicle.png" alt="vehicle">
              </div>
            </div>
            <div class="stats-text">
              <h2>96.4%</h2>
              <p>mAP@50 Accuracy</p>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- ============================================ -->
    <!--      3. DETAILS SECTION (UPDATED GRID)       -->
    <!-- ============================================ -->
    <section class="details-section">
      <div class="text-block">
        <h2>Making Sense of the Real World</h2>
        <p>
          Our segmentation model offers intelligent data for various applications, turning raw visual input into actionable insights for Plant, Animal, and Vehicle recognition.
        </p>
      </div>

      <!-- Capabilities Cards Grid -->
      <div class="cards-grid">
        <div 
          v-for="item in capabilities" 
          :key="item.title" 
          class="card"
        >
          <!-- UPDATED: Displays the specific imported image -->
          <div class="card-visual" :class="item.colorClass">
            <img :src="item.image" :alt="item.title" />
          </div>

          <div class="card-content">
            <h3>{{ item.title }}</h3>
            <p>{{ item.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ============================================ -->
    <!--             4. CTA SECTION                   -->
    <!-- ============================================ -->
    <section class="cta-section">
      <div class="cta-card">
        <h2 class="cta-title">Ready to get started?</h2>
        <p class="cta-text">
          Sign up today and start detecting plants, animals, and vehicles in real-time with our advanced Roboflow model.
        </p>
        <router-link to="/signup" class="primary-btn cta-btn" style="text-decoration: none;">Get Started Free</router-link>

      </div>
    </section>
    <Footer />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Navbar from '../components/navbar.vue'; 
import Footer from '../components/footer.vue';

// --- UPDATED IMPORTS: Importing specific images from your screenshot ---
import ecoImg from '../assets/img/ecological monitoring.jpg';
import wildlifeImg from '../assets/img/wildlife conservation.jpg';
import trafficImg from '../assets/img/vehicle management.png';
import intrusionImg from '../assets/img/intrusion detection.jpg';

const capabilities = ref([
  {
    title: 'Ecological Monitoring',
    description: 'Empower agricultural drones and environmental systems with precise monitoring of crop health, species population, and ecological changes.',
    image: ecoImg, // mapped variable
    colorClass: 'green'
  },
  {
    title: 'Wildlife Conservation',
    description: 'Facilitate critical wildlife and habitat monitoring for conservation efforts, enabling real-time counting and tracking of endangered species.',
    image: wildlifeImg, // mapped variable
    colorClass: 'blue'
  },
  {
    title: 'Smart Traffic & Vehicle Management',
    description: 'Provide real-time insights on vehicle counts, traffic flow, and congestion patterns to optimize urban planning and incident management.',
    image: trafficImg, // mapped variable
    colorClass: 'orange' 
  },
  {
    title: 'Intrusion Detection System',
    description: 'Detect unauthorized objects, animals, or vehicles in restricted areas with rapid, precise object segmentation for enhanced security and automated alerts.',
    image: intrusionImg, // mapped variable
    colorClass: 'teal'
  }
]);

const handleStartDetection = () => {
  console.log("Navigating to Live Camera...");
};
</script>

<style lang="scss" scoped>
/* --- 1. Variables --- */
$bg-color: #050b14;
$text-color: #e2e8f0;
$card-bg: #0f172a;

$teal: #14b8a6;
$teal-hover: #2dd4bf;
$green: #22c55e;
$blue: #3b82f6;
$orange: #f59e0b;

.dashboard-container {
  background-color: $bg-color;
  color: $text-color;
  min-height: 100vh;
  font-family: 'Inter', sans-serif;
  padding: 0 5%;
  overflow-x: hidden;
}

/* --- 2. Hero Section --- */
.hero {
  display: flex; align-items: center; justify-content: space-between; gap: 40px; padding: 80px 0 60px; max-width: 1200px; margin: 0 auto;
  .hero-content { flex: 1; max-width: 600px; .subtitle { font-size: 0.9rem; color: $teal; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 15px; } h1 { font-size: 3.5rem; font-weight: 800; line-height: 1.1; margin-bottom: 20px; .highlight-blue { color: $blue; } .highlight-orange { color: $orange; } } .description { font-size: 1.1rem; color: #94a3b8; line-height: 1.6; margin-bottom: 40px; } .cta-group { display: flex; gap: 15px; .primary-btn { background-color: $teal; color: black; border: none; padding: 12px 30px; border-radius: 6px; font-size: 1rem; font-weight: 600; cursor: pointer; transition: transform 0.2s; &:hover { transform: translateY(-2px); } } .secondary-btn { background-color: transparent; color: $text-color; border: 1px solid #334155; padding: 12px 30px; border-radius: 6px; font-size: 1rem; cursor: pointer; &:hover { border-color: $teal; color: $teal; } } } }
  
  .hero-image-container { 
    flex: 1; display: flex; justify-content: center; align-items: center; animation: float 6s ease-in-out infinite;
    .glass-card { 
      width: 100%; max-width: 450px; aspect-ratio: 1/1; background: linear-gradient(135deg, #0f172a 0%, #020617 100%); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 2rem; padding: 2rem; position: relative; display: flex; flex-direction: column; align-items: center; justify-content: center; box-shadow: 0 0 30px rgba($teal, 0.1);
      .inner-circle { position: absolute; width: 70%; height: 70%; border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 50%; }
      .card-inner-content { 
        z-index: 10; text-align: center;
        .icons-row { 
          display: flex; gap: 15px; margin-bottom: 30px; justify-content: center; 
          .icon-box { 
            width: 70px; height: 70px; border-radius: 12px; display: flex; align-items: center; justify-content: center; border: 1px solid rgba(255,255,255,0.1); 
            
            svg, img { width: 80px; height: auto; }

            &.plant { background: rgba($green, 0.15); color: $green; }
            
            &.animal { 
              background: rgba($blue, 0.15); 
              color: $blue; 
              img { filter: brightness(0) invert(1); }
            }
            
            &.vehicle { background: rgba($orange, 0.15); color: $orange; } 
          } 
        }
        .stats-text { h2 { font-size: 2.5rem; margin: 0; color: white; } p { color: $text-color; font-size: 0.9rem; text-transform: uppercase; } }
      }
    }
  }
}
@keyframes float { 0% { transform: translateY(0px); } 50% { transform: translateY(-15px); } 100% { transform: translateY(0px); } }

/* --- 3. Details Section --- */
.details-section {
  padding: 40px 0 80px; max-width: 1200px; margin: 0 auto;
  .text-block { 
    margin-bottom: 50px; 
    text-align: center;
    h2 { font-size: 2.5rem; color: $text-color; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 20px; } 
    p { font-size: 1.1rem; color: #94a3b8; max-width: 800px; margin: 0 auto 20px; } 
  }

  .cards-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr); 
    gap: 30px;
    
    @media (max-width: 768px) { grid-template-columns: 1fr; }
    
    .card {
      background-color: $card-bg; border-radius: 12px; overflow: hidden; border: 1px solid #1e293b; transition: transform 0.3s ease, box-shadow 0.3s ease;
      &:hover { transform: translateY(-5px); box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5); border-color: $teal; }

      /* UPDATED CSS FOR FULL IMAGES */
      .card-visual {
        height: 200px; /* Increased height slightly for better visibility */
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden; 
        
        /* Background colors kept as fallbacks/tints */
        &.green { background-color: rgba($green, 0.1); }
        &.blue { background-color: rgba($blue, 0.1); }
        &.orange { background-color: rgba($orange, 0.1); }
        &.teal { background-color: rgba($teal, 0.1); }

        img {
          width: 100%;
          height: 100%;
          object-fit: cover; /* Ensures image fills the area */
          transition: transform 0.5s ease;
          filter: none; /* Removed icon filters */
        }

        &:hover img {
          transform: scale(1.1); /* Slight zoom on hover */
        }
      }

      .card-content {
        padding: 25px;
        h3 { font-size: 1.2rem; margin-bottom: 10px; color: white; }
        p { font-size: 0.9rem; color: #94a3b8; line-height: 1.5; }
      }
    }
  }
}

/* --- 4. CTA Section --- */
.cta-section {
  padding: 40px 0 80px; max-width: 1200px; margin: 0 auto;
  .cta-card { background: linear-gradient(145deg, #0f172a 0%, #020617 100%); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 1.5rem; padding: 4rem 2rem; text-align: center; box-shadow: 0 0 50px rgba(0, 0, 0, 0.5); .cta-title { font-size: 2.5rem; margin-bottom: 1rem; color: #fff; } .cta-text { color: #94a3b8; max-width: 600px; margin: 0 auto 2rem; } .cta-btn { background-color: $teal; color: black; border: none; padding: 1rem 3rem; font-weight: 600; border-radius: 6px; cursor: pointer; &:hover { background-color: $teal-hover; } } }
}

@media (max-width: 900px) { .hero { flex-direction: column; text-align: center; .hero-content { margin-bottom: 40px; .cta-group { justify-content: center; } } .hero-image-container { width: 100%; } } }
</style>