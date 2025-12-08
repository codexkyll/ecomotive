<template>
  <div class="auth-container">
    
    <!-- Navbar sits inside the container, inheriting the 5% padding -->
    <Navbar />

    <div class="split-screen">
      
      <!-- Left: Marketing / Value Prop -->
      <div class="left-panel animate-fade-in">
        <div class="brand-box">
          <div class="leaf-icon">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.854 1.566-2.126a4.854 4.854 0 00-1.481-4.498 8.458 8.458 0 014.654 9.773l-1.009 2.595a.75.75 0 01-1.393-.114 9.876 9.876 0 00-1.652-3.693 1.168 1.168 0 01-.685-1.74zM9.75 18v-.192c0-.983-.658-1.854-1.566-2.126a4.854 4.854 0 011.481-4.498 8.458 8.458 0 00-4.654 9.773l1.009 2.595a.75.75 0 001.393-.114 9.876 9.876 0 011.652-3.693 1.168 1.168 0 00.685-1.74z" /></svg>
          </div>
          <h1>Join <br>EcoMotive</h1>
          <p class="description">
            Get started with advanced plant, animal, and vehicle detection using our Roboflow-powered segmentation model.
          </p>
          <div class="features">
            <p class="features-title">What you get:</p>
            <ul>
              <li>Real-time detection dashboard</li>
              <li>Complete segmentation history</li>
              <li>96.4% accurate Roboflow model</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Right: Signup Form -->
      <div class="right-panel">
        <div class="auth-card">
          <h2>Create Account</h2>
          <p class="subtitle">Sign up to start detecting with AI</p>

          <form @submit.prevent="handleSignup">
             <div class="form-group">
              <label>Full Name</label>
              <div class="input-wrapper">
                <span class="input-icon">👤</span>
                <input type="text" v-model="fullName" placeholder="John Doe" required />
              </div>
            </div>

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

            <div class="form-group">
              <label>Confirm Password</label>
              <div class="input-wrapper">
                <span class="input-icon">🛡️</span>
                <input type="password" v-model="confirmPassword" placeholder="••••••••" required />
              </div>
            </div>

            <button type="submit" class="btn-primary">Create Account</button>
            
            <button type="button" class="btn-google">
              <svg class="google-icon" viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg"><g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)"><path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/><path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/><path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.734 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/><path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/></g></svg>
              Sign up with Google
            </button>

            <div class="divider">
              <span>Already have an account?</span>
            </div>

            <router-link to="/login" class="btn-outline">
              Sign in here
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
const fullName = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');

// Logic: If on Vercel (Production), use relative path. If local, use localhost:5000.
const API_URL = import.meta.env.PROD 
  ? '/api/auth/signup' 
  : 'http://localhost:5000/api/auth/signup';

const handleSignup = async () => {
  if (password.value !== confirmPassword.value) {
    alert("Passwords do not match!");
    return;
  }

  try {
    const response = await axios.post(API_URL, {
      fullName: fullName.value,
      email: email.value,
      password: password.value
    });

    if(response.data && response.data.token) {
        localStorage.setItem('userToken', response.data.token);
        localStorage.setItem('userName', fullName.value);
        alert('Account Created Successfully!');
        router.push('/live-camera'); // Or wherever you want to redirect
    }
  } catch (error) {
    console.error(error);
    const msg = error.response?.data?.error || 'Signup failed';
    alert(msg);
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

/* --- Main Container --- */
.auth-container {
  background-color: $bg-color;
  color: $text-color;
  min-height: 100vh;
  font-family: 'Inter', sans-serif;
  
  /* THIS MATCHES ABOUT VIEW EXACTLY */
  padding: 0 5%; 
  overflow-x: hidden;
}

/* --- Split Layout --- */
.split-screen {
  display: grid;
  grid-template-columns: 1fr 1fr;
  max-width: 1200px;
  margin: 20px auto 60px;
  /* Removed side padding here because container handles it now */
  gap: 60px;
  align-items: center;
  min-height: calc(100vh - 160px);

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 40px;
    text-align: center;
    .left-panel { display: flex; flex-direction: column; align-items: center; }
    .features ul { text-align: left; }
  }
}

/* --- Left Panel (Marketing) --- */
.left-panel {
  .brand-box { max-width: 500px; }
  
  .leaf-icon {
    width: 64px; height: 64px; 
    background: rgba($teal, 0.1); 
    color: $teal;
    border: 1px solid rgba($teal, 0.2);
    border-radius: 16px; 
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 30px;
    svg { width: 32px; height: 32px; }
  }

  h1 { font-size: 3.5rem; font-weight: 800; line-height: 1.1; margin-bottom: 20px; color: white; }
  .description { color: #94a3b8; font-size: 1.1rem; line-height: 1.6; margin-bottom: 40px; }
  
  .features {
    .features-title { font-weight: 700; color: white; margin-bottom: 15px; text-transform: uppercase; font-size: 0.85rem; letter-spacing: 1px; }
    ul { 
      list-style: none; padding: 0; 
      li { 
        position: relative; padding-left: 25px; margin-bottom: 12px; color: #cbd5e1; font-size: 1rem;
        &::before { content: '✓'; color: $teal; position: absolute; left: 0; font-weight: bold; }
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
  max-width: 480px;
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
  }
  
  .btn-primary {
    background-color: $teal; color: black; border: none; margin-bottom: 15px;
    &:hover { background-color: $teal-hover; }
  }
  
  .btn-google {
    background: transparent; color: white; border: 1px solid #334155; display: flex; align-items: center; justify-content: center; gap: 10px;
    &:hover { background: rgba(255,255,255,0.05); border-color: #cbd5e1; }
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