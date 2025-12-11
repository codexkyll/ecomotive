<template>
  <div class="auth-container">
    
    <Navbar />

    <div class="split-screen">
      
      <!-- Left Column: Branding & Info -->
      <div class="left-panel animate-fade-in">
        <div class="brand-box">
          
          <!-- REMOVED LOGO -->
          <h1>Welcome to <br>EcoMotive</h1>
          <p class="description">
            Access your detection dashboard and continue monitoring plants, animals, and vehicles with our advanced segmentation model.
          </p>

          <div class="features">
            <p class="features-title">Quick access to:</p>
            <ul>
              <li>Real-time plant, animal & vehicle detection</li>
              <li>Complete segmentation history</li>
              <li>Advanced analytics dashboard</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Right Column: Login Form -->
      <div class="right-panel">
        <div class="auth-card">
          <h2>Sign In</h2>
          <p class="subtitle">Enter your credentials to access EcoMotive</p>

          <form @submit.prevent="handleLogin">
            <div class="form-group">
              <label>Email Address</label>
              <div class="input-wrapper">
                <span class="input-icon">✉️</span>
                <input type="email" v-model="email" placeholder="you@example.com" required />
              </div>
            </div>

            <div class="form-group">
              <label>Password</label>
              <div class="input-wrapper">
                <span class="input-icon">🔒</span>
                <input type="password" v-model="password" placeholder="••••••••" required />
              </div>
            </div>

            <button type="submit" class="btn-primary" :disabled="isLoading">
              {{ isLoading ? 'Signing In...' : 'Sign In' }}
            </button>
            
            <!-- REMOVED SIGN IN WITH GOOGLE BUTTON -->

            <div class="divider">
              <span>Don't have an account?</span>
            </div>

            <router-link to="/signup" class="btn-outline">
              Create an account
            </router-link>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import Navbar from '../components/navbar.vue';

const router = useRouter();
const email = ref('');
const password = ref('');
const isLoading = ref(false);

// Logic: If on Vercel (Production), use relative path. If local, use localhost:5000.
const API_URL = import.meta.env.PROD 
  ? '/api/auth/login' 
  : 'http://localhost:5000/api/auth/login';

const handleLogin = async () => {
  isLoading.value = true;
  
  try {
    const response = await axios.post(API_URL, {
      email: email.value,
      password: password.value
    });

    const { token, user } = response.data;
    
    localStorage.setItem('userToken', token);
    localStorage.setItem('userEmail', user.email);

    window.dispatchEvent(new Event('storage')); 
    router.push('/');
    
  } catch (error) {
    console.error("Login Error:", error);
    // Fix for [object Object] alert
    const msg = error.response?.data?.error || 'Login failed. Please check your credentials.';
    alert(msg);
  } finally {
    isLoading.value = false;
  }
};
</script>

<style lang="scss" scoped>
/* --- Variables --- */
$bg-color: #050b14;
$card-bg: #0f172a;
$text-color: #e2e8f0;
$border-color: #1e293b;

$teal: #14b8a6;
$teal-hover: #2dd4bf;
$green: #22c55e;

/* --- Main Container --- */
.auth-container {
  background-color: $bg-color;
  color: $text-color;
  min-height: 100vh;
  font-family: 'Inter', sans-serif;
  padding: 0 5%;
  overflow-x: hidden;
}

/* --- Split Layout --- */
.split-screen {
  display: grid;
  grid-template-columns: 1fr 1fr;
  max-width: 1200px;
  margin: 20px auto 60px;
  gap: 60px;
  align-items: center;
  min-height: calc(100vh - 160px); 

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 40px;
    margin-top: 20px;
    text-align: center;
    .left-panel {
        display: flex; flex-direction: column; align-items: center;
        .features ul { text-align: left; }
    }
  }
}

/* --- Left Panel (Marketing) --- */
.left-panel {

  padding: 0; // Removed extra padding from gradient change
  border-radius: 0; // Removed border-radius from gradient change
  box-shadow: none; // Removed box-shadow from gradient change
  color: $text-color; // Restored text color for dark background

  .brand-box { max-width: 500px; }
  
  /* REMOVED .leaf-icon CSS */

  h1 { font-size: 3.5rem; font-weight: 800; line-height: 1.1; margin-bottom: 20px; color: white; } // Restored color
  .description { color: #94a3b8; font-size: 1.1rem; line-height: 1.6; margin-bottom: 40px; } // Restored color
  
  .features {
    .features-title { font-weight: 700; color: white; margin-bottom: 15px; text-transform: uppercase; font-size: 0.85rem; letter-spacing: 1px; } // Restored color
    ul { 
      list-style: none; padding: 0; 
      li { 
        position: relative; padding-left: 25px; margin-bottom: 12px; color: #cbd5e1; font-size: 1rem; // Restored color
        &::before { content: '✓'; color: $teal; position: absolute; left: 0; font-weight: bold; } // Restored checkmark color
      }
    }
  }
}

/* --- Right Panel (Form) --- */
.right-panel {
  display: flex; justify-content: center; width: 100%;
}

.auth-card {
  background-color: $card-bg;
  padding: 40px;
  border-radius: 20px;
  width: 100%;
  max-width: 450px;
  border: 1px solid $border-color;
  box-shadow: 0 20px 40px rgba(0,0,0,0.4);

  h2 { font-size: 2rem; color: white; margin-bottom: 8px; font-weight: 700; }
  .subtitle { color: #94a3b8; margin-bottom: 30px; font-size: 0.95rem; }

  .form-group {
    margin-bottom: 20px;
    label { display: block; margin-bottom: 8px; font-weight: 500; font-size: 0.9rem; color: #cbd5e1; }
    .input-wrapper {
      position: relative;
      .input-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); font-size: 1.1rem; filter: grayscale(1); opacity: 0.7; }
      input {
        width: 100%; 
        background: #020617; 
        border: 1px solid #334155;
        padding: 12px 12px 12px 45px; 
        border-radius: 8px; 
        color: white; 
        font-size: 1rem;
        outline: none;
        transition: all 0.3s;
        
        &:focus { border-color: $teal; box-shadow: 0 0 0 2px rgba($teal, 0.2); }
        &::placeholder { color: #475569; }
      }
    }
  }

  button { 
    width: 100%; padding: 12px; border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.2s; font-size: 1rem; 
    &:active { transform: translateY(1px); }
    &:disabled { opacity: 0.7; cursor: not-allowed; }
  }
  
  .btn-primary {
    background-color: $teal; color: black; border: none; margin-bottom: 15px;
    &:hover:not(:disabled) { background-color: $teal-hover; }
  }
  

  .divider {
    text-align: center; margin: 25px 0; border-top: 1px solid #334155; position: relative;
    span { background: $card-bg; padding: 0 10px; color: #64748b; position: relative; top: -10px; font-size: 0.85rem; }
  }

  .btn-outline {
    display: block; width: 100%; text-align: center; padding: 12px;
    background: transparent; border: 1px solid #334155; color: white; border-radius: 8px; text-decoration: none; font-weight: 600; transition: border-color 0.3s;
    &:hover { border-color: $teal; color: $teal; }
  }
}

.animate-fade-in { animation: fadeIn 0.8s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
</style>