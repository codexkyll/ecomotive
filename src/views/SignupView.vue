<template>
  <div class="auth-container">
    
    <Navbar />

    <div class="split-screen">
      

      <div class="left-panel animate-fade-in">
        <div class="brand-box">
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
          <!-- REMOVED 'with AI' -->
          <p class="subtitle">Sign up to start detecting</p>

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
                <!-- CHANGED ICON from 🛡️ to 🔒 -->
                <span class="input-icon">🔒</span>
                <input type="password" v-model="confirmPassword" placeholder="••••••••" required />
              </div>
            </div>

            <button type="submit" class="btn-primary">Create Account</button>

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
  align-items: center; /* This keeps the form centered vertically */
  min-height: calc(100vh - 160px);

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 40px;
    text-align: center;
    .left-panel { 
      display: flex; 
      flex-direction: column; 
      align-items: center; 
      /* Reset the padding on mobile so there isn't a huge gap */
      padding-bottom: 0; 
    }
    .features ul { text-align: left; }
  }
}

/* --- Left Panel (Marketing) --- */
.left-panel {
  /* 
     Adding padding-bottom here creates invisible space below the text.
     Since the grid centers the element, this pushes the VISIBLE text upwards.
  */
  padding-bottom: 150px; 

  .brand-box { max-width: 500px; }

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
  max-width: 500px; 
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
        padding: 14px 12px 14px 45px; 
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