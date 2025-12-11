<template>
  <footer class="main-footer">
    <div class="footer-content">
      
      <!-- COLUMN 1: Brand Identity -->
      <div class="footer-col brand-col">
        <div class="brand-header">
          <img :src="logoImg" alt="EcoMotive Logo" class="brand-logo" />
          <span class="brand-name">EcoMotive</span>
        </div>
        <p class="mission-text">
          Empowering environmental and urban insights through advanced segmentation and real-time monitoring.
        </p>
      </div>

      <!-- COLUMN 2: Platform (Navigation) -->
      <div class="footer-col links-col">
        <h4 class="col-header">Platform</h4>
        <nav class="footer-nav">
          <router-link to="/about-us">About Us</router-link>
          <router-link to="/live-camera">Live Camera</router-link>
          <router-link to="/model-info">Model Info</router-link>
          <router-link to="/history">History</router-link>
          <router-link to="/signup">Get Started</router-link>
        </nav>
      </div>

      <!-- COLUMN 3: Connect -->
      <div class="footer-col connect-col">
        <h4 class="col-header">Connect</h4>
        <div class="social-icons">
          <!-- GitHub -->
          <a href="https://github.com/codexkyll/ecomotive" target="_blank" aria-label="GitHub" title="GitHub">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
          </a>
          <!-- Instagram -->
          <a href="https://www.instagram.com/kayedee_jd/" target="_blank" aria-label="Instagram" title="Instagram">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
          </a>
          <!-- Email -->
          <a href="mailto:jvadee29@gmail.com" aria-label="Email" title="Email">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
          </a>
        </div>
      </div>
    </div>

    <!-- UPDATED: Centered Bottom Bar -->
    <div class="footer-bottom">
      <div class="bottom-content">
        <p class="copyright">© 2025 EcoMotive. All rights reserved.</p>
        <span class="divider-dot">•</span>
        <p class="credits">Powered by Roboflow</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import logoImg from '../assets/img/ecomotive logo.png';
</script>

<style lang="scss" scoped>
/* --- Variables --- */
$bg-color: #050b14;
$footer-bg: #0f172a;
$text-color: #e2e8f0;
$text-muted: #94a3b8;
$teal: #14b8a6;
$border-color: rgba(255, 255, 255, 0.08);

.main-footer {
  background-color: $footer-bg;
  border-top: 1px solid $border-color;
  color: $text-muted;
  padding: 60px 0 0;
  font-family: 'Inter', sans-serif;
  margin-top: auto;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 5%;
  display: grid;
  grid-template-columns: 2fr 1fr 1fr; 
  gap: 40px;
  margin-bottom: 50px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr 1fr;
    .brand-col { grid-column: 1 / -1; }
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 40px;
    text-align: center;
  }
}

/* --- Columns Styling --- */
.col-header {
  color: $text-color;
  font-size: 0.95rem; 
  font-weight: 600;
  margin-bottom: 20px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* 1. Brand Column */
.brand-col {
  .brand-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;
    color: $text-color;
    font-weight: 700;
    font-size: 1.4rem;
    
    @media (max-width: 600px) { justify-content: center; }

    .brand-logo { height: 35px; width: auto; }
  }

  .mission-text {
    line-height: 1.6;
    max-width: 320px;
    font-size: 0.9rem;
    @media (max-width: 600px) { margin: 0 auto; }
  }
}

/* 2. Platform Column */
.footer-nav {
  display: flex;
  flex-direction: column;
  gap: 10px;

  a {
    color: $text-muted;
    text-decoration: none;
    transition: color 0.2s ease;
    font-size: 0.9rem;

    &:hover, &.router-link-active { color: $teal; }
  }
}

/* 3. Connect Column */
.social-icons {
  display: flex;
  gap: 15px;
  
  @media (max-width: 600px) { justify-content: center; }

  a {
    color: $text-muted;
    transition: all 0.2s ease;
    display: flex; align-items: center; justify-content: center;
    background: rgba(255,255,255,0.03);
    padding: 8px;
    border-radius: 6px;
    border: 1px solid rgba(255,255,255,0.05);

    &:hover {
      color: $teal;
      border-color: $teal;
      transform: translateY(-2px);
    }
  }
}

/* --- UPDATED: Center Bottom Bar --- */
.footer-bottom {
  border-top: 1px solid $border-color;
  background-color: #0b111f; 
  padding: 25px 0;
  
  .bottom-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 5%;
    
    /* Flexbox Center Magic */
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    gap: 10px;
    
    font-size: 0.85rem;
    color: darken($text-muted, 10%);
    text-align: center;
  }

  .divider-dot {
    color: darken($text-muted, 20%);
    font-size: 1.2rem;
    line-height: 0;
    
    @media (max-width: 500px) { display: none; }
  }

  /* Stack vertically on small screens */
  @media (max-width: 500px) {
    .bottom-content {
      flex-direction: column;
      gap: 5px;
    }
  }
}
</style>