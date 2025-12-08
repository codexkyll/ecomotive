<template>
  <nav class="navbar">
    <!-- 1. Logo -->
    <div class="logo" @click="router.push('/')">
      <div class="logo-icon">E</div>
      <span>EcoMotive</span>
    </div>

    <!-- 2. Desktop Navigation -->
    <div class="nav-links desktop-only">
      <router-link 
        v-for="link in navLinks" 
        :key="link.name" 
        :to="link.href"
        active-class="router-link-active"
      >
        {{ link.name }}
      </router-link>
    </div>

    <!-- 3. Desktop Auth Group -->
    <div class="auth-group desktop-only">
      <template v-if="!isLoggedIn">
        <button class="login-btn" @click="router.push('/login')">Login</button>
        <button class="signup-btn" @click="router.push('/signup')">Sign Up</button>
      </template>

      <!-- Profile Dropdown -->
      <div v-else class="profile-menu" ref="menuRef">
        <button class="profile-btn" @click="toggleDropdown">
          <div class="avatar">{{ userInitial }}</div>
        </button>

        <transition name="fade">
          <div v-if="showDropdown" class="dropdown">
            <div class="user-info">
              <span class="label">Signed in as</span>
              <span class="email" :title="userEmail">{{ userEmail }}</span>
            </div>
            <div class="divider"></div>
            <button @click="handleLogout" class="logout-btn">
              Logout
            </button>
          </div>
        </transition>
      </div>
    </div>

    <!-- 4. Hamburger Button -->
    <button class="hamburger-btn mobile-only" @click="toggleMobileMenu" :class="{ 'active': isMobileMenuOpen }">
      <span class="bar"></span>
      <span class="bar"></span>
      <span class="bar"></span>
    </button>

    <!-- 5. Mobile Menu Overlay -->
    <transition name="slide-fade">
      <div v-if="isMobileMenuOpen" class="mobile-menu mobile-only">
        <div v-if="isLoggedIn" class="mobile-user-section">
          <div class="avatar">{{ userInitial }}</div>
          <div class="info">
            <span class="label">Signed in as</span>
            <span class="email">{{ userEmail }}</span>
          </div>
        </div>

        <div class="mobile-links">
          <router-link 
            v-for="link in navLinks" 
            :key="link.name" 
            :to="link.href"
            active-class="router-link-active"
            @click="isMobileMenuOpen = false"
          >
            {{ link.name }}
          </router-link>
        </div>

        <div class="mobile-auth">
          <template v-if="!isLoggedIn">
            <button class="login-btn full-width" @click="goToAndClose('/login')">Login</button>
            <button class="signup-btn full-width" @click="goToAndClose('/signup')">Sign Up</button>
          </template>
          <template v-else>
            <button class="logout-btn full-width" @click="handleLogout">
              Logout
            </button>
          </template>
        </div>
      </div>
    </transition>

  </nav>
</template>

<script setup>
import { ref, onMounted, computed, onUnmounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const route = useRoute();

// --- FIX 1: Dynamic URL Handling ---
const AUTH_ME_URL = import.meta.env.PROD 
  ? '/api/auth/me' 
  : 'http://localhost:5000/api/auth/me';

const navLinks = ref([
  { name: 'Home', href: '/' },
  { name: 'Model Info', href: '/model-info' },
  { name: 'Live Camera', href: '/live-camera' },
  { name: 'History', href: '/history' },
  { name: 'About Us', href: '/about-us' },
]);

const isLoggedIn = ref(!!localStorage.getItem('userToken'));
const userEmail = ref(localStorage.getItem('userEmail') || '');
const showDropdown = ref(false); 
const isMobileMenuOpen = ref(false);
const menuRef = ref(null);

const userInitial = computed(() => {
  return userEmail.value ? userEmail.value.charAt(0).toUpperCase() : 'U';
});

const checkAuthStatus = async () => {
  const token = localStorage.getItem('userToken');
  
  if (token) {
    isLoggedIn.value = true;
    
    // Only fetch if we don't have the email yet
    if (!userEmail.value) {
      try {
        const response = await axios.get(AUTH_ME_URL, {
          headers: { Authorization: `Bearer ${token}` }
        });
        userEmail.value = response.data.email;
        localStorage.setItem('userEmail', response.data.email);
      } catch (error) {
        console.error("Auth check failed:", error);
        
        // --- FIX 2: PREVENT FALSE LOGOUTS ---
        // Only logout if the server EXPLICITLY says the token is wrong (401 or 403)
        // Do NOT logout on 404 or Network Error
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          handleLogout();
        }
      }
    }
  } else {
    isLoggedIn.value = false;
    userEmail.value = '';
  }
};

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value;
};

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

const goToAndClose = (path) => {
  isMobileMenuOpen.value = false;
  router.push(path);
};

const handleLogout = () => {
  localStorage.removeItem('userToken');
  localStorage.removeItem('userEmail');
  isLoggedIn.value = false;
  showDropdown.value = false;
  isMobileMenuOpen.value = false; 
  userEmail.value = '';
  router.push('/login');
};

const handleClickOutside = (event) => {
  if (menuRef.value && !menuRef.value.contains(event.target)) {
    showDropdown.value = false;
  }
};

watch(() => route.path, () => {
  checkAuthStatus();
  showDropdown.value = false;
  isMobileMenuOpen.value = false;
});

onMounted(() => {
  checkAuthStatus();
  window.addEventListener('storage', checkAuthStatus);
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  window.removeEventListener('storage', checkAuthStatus);
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style lang="scss" scoped>
/* --- Variables --- */
$text-color: #e2e8f0;
$nav-height: 80px;
$teal: #14b8a6;
$teal-hover: #2dd4bf;
$green: #22c55e;
$card-bg: #0f172a; 
$bg-color: #050b14;

/* --- Navbar Container --- */
.navbar {
  display: flex; justify-content: space-between; align-items: center; 
  height: $nav-height; border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  position: relative; 
  z-index: 100;
  background-color: $bg-color;
  
  .logo { 
    display: flex; align-items: center; gap: 10px; font-weight: 700; font-size: 1.2rem; color: #fff; cursor: pointer; z-index: 102;
    .logo-icon { width: 2rem; height: 2rem; background-color: $green; color: #000; border-radius: 6px; display: flex; align-items: center; justify-content: center; } 
  }
}

/* =========================================
   DESKTOP STYLES (Default > 920px)
   ========================================= */

/* 1. Links */
.desktop-only { display: flex; } 
.mobile-only { display: none; } 

.nav-links a { 
  color: $text-color; text-decoration: none; margin: 0 20px; font-size: 0.9rem; transition: color 0.3s; 
  &:hover, &.router-link-active { color: $teal; font-weight: 600; } 
}

/* 2. Auth Group */
.auth-group { display: flex; gap: 10px; align-items: center; }

/* 3. Buttons (Reused) */
.login-btn { background: transparent; color: $text-color; border: 1px solid #334155; padding: 8px 16px; border-radius: 4px; cursor: pointer; &:hover { border-color: $teal; color: $teal; } }
.signup-btn { background-color: $teal; color: black; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-weight: 600; &:hover { background-color: $teal-hover; } }
.full-width { width: 100%; margin-bottom: 10px; padding: 12px; }

/* 4. Desktop Profile Menu */
.profile-menu {
  position: relative;
  .profile-btn {
    background: none; border: none; cursor: pointer; padding: 0;
    .avatar {
      width: 40px; height: 40px; background-color: $teal; color: #000; font-weight: 700; border-radius: 50%; 
      display: flex; align-items: center; justify-content: center; font-size: 1.1rem; transition: all 0.2s;
      &:hover { transform: scale(1.05); box-shadow: 0 0 10px rgba($teal, 0.4); }
    }
  }
  .dropdown {
    position: absolute; top: 55px; right: 0; width: 220px; background-color: $card-bg; border: 1px solid #1e293b; 
    border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); z-index: 1000; padding: 5px;
    .user-info { padding: 15px; display: flex; flex-direction: column; .label { font-size: 0.75rem; color: #94a3b8; } .email { color: white; font-weight: 600; font-size: 0.9rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; } }
    .divider { height: 1px; background-color: #1e293b; margin: 0 5px 5px; }
    .logout-btn { 
      width: 100%; padding: 12px 15px; background: transparent; border: none; color: #ef4444; font-weight: 500; cursor: pointer; border-radius: 8px; text-align: left; 
      display: flex; align-items: center; gap: 10px;
      &:hover { background-color: rgba(239, 68, 68, 0.1); } 
    }
  }
}

/* =========================================
   RESPONSIVE STYLES (Max Width 920px)
   ========================================= */
@media (max-width: 920px) {
  .desktop-only { display: none !important; }
  .mobile-only { display: block !important; }

  /* 1. Hamburger Button */
  .hamburger-btn {
    background: none; border: none; cursor: pointer; z-index: 102; padding: 10px;
    .bar { display: block; width: 25px; height: 3px; margin: 5px auto; background-color: white; transition: all 0.3s ease-in-out; }
    &.active .bar:nth-child(2) { opacity: 0; }
    &.active .bar:nth-child(1) { transform: translateY(8px) rotate(45deg); }
    &.active .bar:nth-child(3) { transform: translateY(-8px) rotate(-45deg); }
  }

  /* 2. Mobile Menu Container */
  .mobile-menu {
    position: absolute;
    top: $nav-height; left: 0; width: 100%;
    background-color: $bg-color; 
    border-bottom: 1px solid #1e293b;
    padding: 20px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.8);
    z-index: 101;
    display: flex; flex-direction: column; gap: 20px;

    .mobile-user-section {
      display: flex; align-items: center; gap: 15px; padding-bottom: 15px; border-bottom: 1px solid #1e293b;
      .avatar { width: 50px; height: 50px; background-color: $teal; color: #000; font-weight: 700; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; }
      .info { display: flex; flex-direction: column; .label { font-size: 0.8rem; color: #94a3b8; } .email { color: white; font-weight: 600; font-size: 1rem; } }
    }

    .mobile-links {
      display: flex; flex-direction: column; gap: 15px;
      a { 
        color: $text-color; text-decoration: none; font-size: 1.1rem; padding: 10px; border-radius: 8px; transition: background 0.2s;
        &:hover, &.router-link-active { background-color: rgba(255,255,255,0.05); color: $teal; }
      }
    }

    .mobile-auth {
      padding-top: 10px; border-top: 1px solid #1e293b;
      .logout-btn { background-color: #ef4444; color: white; border: none; padding: 12px; border-radius: 6px; font-weight: 600; cursor: pointer; &:hover { background-color: #dc2626; } }
    }
  }
}

/* Animations */
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.slide-fade-enter-active, .slide-fade-leave-active { transition: all 0.3s ease-out; }
.slide-fade-enter-from, .slide-fade-leave-to { transform: translateY(-20px); opacity: 0; }
</style>