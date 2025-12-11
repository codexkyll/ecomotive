<template>
  <div class="dashboard-container">
    <Navbar />

    <main class="main-content">
      <section class="page-header">
        <h1>Detection History</h1>
        <p class="subtitle">Access and review your detection history.</p>
      </section>

      <!-- ================= STATS CARDS (Always Visible) ================= -->
      <section class="stats-grid">
        <div class="stat-card">
          <div class="stat-info">
            <span class="label">Total Detections</span>
            <span class="value teal">{{ totalDetections }}</span>
          </div>
          <div class="stat-icon-box teal-bg">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /></svg>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-info">
            <span class="label">Avg Accuracy</span>
            <span class="value green">{{ avgAccuracy }}%</span>
          </div>
          <div class="stat-icon-box green-bg">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" /></svg>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-info">
            <span class="label">Avg Confidence</span>
            <span class="value orange">{{ avgConfidence }}%</span>
          </div>
          <div class="stat-icon-box orange-bg">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-info">
            <span class="label">Total Logs</span>
            <span class="value blue">{{ totalDetections }}</span>
          </div>
          <div class="stat-icon-box blue-bg">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>
          </div>
        </div>
      </section>

      <!-- ================= CONTROLS: SEARCH & FILTER (NEW) ================= -->
      <section class="controls-section">
        <!-- Search Bar -->
        <div class="search-wrapper">
          <svg xmlns="http://www.w3.org/2000/svg" class="search-icon" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clip-rule="evenodd" />
          </svg>
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Search timestamp, class or confidence..." 
            class="search-input"
          />
        </div>

        <!-- Quick Filters -->
        <div class="filter-tabs">
          <button 
            v-for="filter in filters" 
            :key="filter"
            @click="activeFilter = filter"
            class="filter-btn"
            :class="{ active: activeFilter === filter }"
          >
            {{ filter }}
          </button>
        </div>
      </section>

      <!-- ================= TABLE ================= -->
      <div class="table-container">
        
        <div v-if="isLoading" class="state-msg">
          <div class="spinner"></div> Loading history...
        </div>

        <!-- Show if data is empty OR if search yields no results -->
        <div v-else-if="filteredData.length === 0" class="state-msg">
          <span v-if="historyData.length === 0">No detections found. Log in or go to Live Camera to start!</span>
          <span v-else>No results matching "{{ searchQuery }}" with filter "{{ activeFilter }}".</span>
        </div>

        <div v-else>
          <table class="responsive-table">
            <thead>
              <tr>
                <th>Timestamp</th><th>Image</th><th>Class</th><th>Accuracy</th><th>Precision</th><th>Confidence</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in paginatedData" :key="row._id">
                <td data-label="Timestamp" class="col-time">{{ row.timestamp }}</td>
                <td data-label="Image" class="col-img">{{ row.image }}</td>
                <td data-label="Class"><span class="badge" :class="getClassColor(row.class)">{{ row.class }}</span></td>
                
                <td data-label="Accuracy" class="col-metric">
                  <div class="progress-wrap">
                    <div class="progress-track"><div class="progress-fill green" :style="{ width: row.accuracy + '%' }"></div></div>
                    <span class="metric-val">{{ row.accuracy }}%</span>
                  </div>
                </td>
                
                <td data-label="Precision" class="col-metric">
                  <div class="progress-wrap">
                    <div class="progress-track"><div class="progress-fill blue" :style="{ width: row.precision + '%' }"></div></div>
                    <span class="metric-val">{{ row.precision }}%</span>
                  </div>
                </td>
                
                <td data-label="Confidence" class="col-metric">
                  <div class="progress-wrap">
                    <div class="progress-track"><div class="progress-fill orange" :style="{ width: row.confidence + '%' }"></div></div>
                    <span class="metric-val">{{ row.confidence }}%</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- Pagination -->
          <div class="pagination">
            <span class="page-info">Showing {{ pageStart + 1 }} to {{ Math.min(pageEnd, filteredData.length) }} of {{ filteredData.length }} results</span>
            <div class="page-btns">
              <button @click="prevPage" :disabled="currentPage === 1" class="btn-page">Previous</button>
              <button @click="nextPage" :disabled="currentPage === totalPages" class="btn-page">Next</button>
            </div>
          </div>
        </div>
      </div>

    </main>
    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router'; 
import Navbar from '../components/navbar.vue';
import Footer from '../components/footer.vue';

const router = useRouter();

// URL Configuration
const API_URL = import.meta.env.PROD 
  ? '/api/detections' 
  : 'http://localhost:5000/api/detections';

// State
const historyData = ref([]);
const isLoading = ref(true);

// Search & Filter State
const searchQuery = ref('');
const activeFilter = ref('All');
const filters = ['All', 'Plants', 'Animals', 'Vehicles'];

// Pagination
const currentPage = ref(1);
const itemsPerPage = 5; 

// --- Fetch Data ---
const fetchHistory = async () => {
  const token = localStorage.getItem('userToken');

  if (!token) {
    isLoading.value = false;
    return;
  }

  try {
    const response = await axios.get(API_URL, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    // Map response
    historyData.value = response.data.map(item => ({
      ...item,
      timestamp: new Date(item.timestamp).toLocaleString('en-US', { 
        year: 'numeric', month: 'short', day: '2-digit', 
        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true 
      }),
      image: item.imageName
    }));

  } catch (error) {
    console.error("Error fetching history:", error);
    historyData.value = [];
  } finally {
    isLoading.value = false;
  }
};

// --- Filtering Logic ---
const filteredData = computed(() => {
  let data = historyData.value;

  // 1. Filter by Quick Tabs (Plants, Animals, etc)
  if (activeFilter.value !== 'All') {
    // Remove 's' to match singular class names (e.g., 'Plants' -> 'plant')
    const keyword = activeFilter.value.toLowerCase().replace(/s$/, '');
    data = data.filter(item => item.class.toLowerCase().includes(keyword));
  }

  // 2. Filter by Search Query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    data = data.filter(item => 
      item.class.toLowerCase().includes(query) || 
      item.timestamp.toLowerCase().includes(query) ||
      (item.image && item.image.toLowerCase().includes(query)) ||
      String(item.confidence).includes(query)
    );
  }

  return data;
});

// Reset pagination when filters change
watch([searchQuery, activeFilter], () => {
  currentPage.value = 1;
});

// --- Computed Stats ---
const totalDetections = computed(() => historyData.value.length);
const avgAccuracy = computed(() => {
  if (historyData.value.length === 0) return 0;
  const sum = historyData.value.reduce((acc, curr) => acc + (curr.accuracy || 0), 0);
  return (sum / historyData.value.length).toFixed(1);
});
const avgConfidence = computed(() => {
  if (historyData.value.length === 0) return 0;
  const sum = historyData.value.reduce((acc, curr) => acc + (curr.confidence || 0), 0);
  return (sum / historyData.value.length).toFixed(1);
});

// --- Pagination (Based on Filtered Data) ---
const totalPages = computed(() => Math.ceil(filteredData.value.length / itemsPerPage));
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredData.value.slice(start, end);
});
const pageStart = computed(() => (currentPage.value - 1) * itemsPerPage);
const pageEnd = computed(() => currentPage.value * itemsPerPage);

// --- Methods ---
const nextPage = () => { if (currentPage.value < totalPages.value) currentPage.value++; };
const prevPage = () => { if (currentPage.value > 1) currentPage.value--; };
const getClassColor = (cls) => {
  if (!cls) return '';
  const c = cls.toLowerCase();
  if (c.includes('plant')) return 'badge-plant';
  if (c.includes('animal')) return 'badge-animal';
  if (c.includes('vehicle')) return 'badge-vehicle';
  return '';
};

onMounted(() => {
  fetchHistory();
});
</script>

<style lang="scss" scoped>
// --- Variables ---
$bg-color: #050b14;
$text-color: #e2e8f0;
$card-bg: #0f172a; 
$border-color: #1e293b;
$teal: #14b8a6;
$green: #22c55e;
$blue: #3b82f6;
$orange: #f59e0b;

.dashboard-container { background-color: $bg-color; color: $text-color; min-height: 100vh; font-family: 'Inter', sans-serif; padding: 0 5%; }
.main-content { max-width: 1400px; margin: 0 auto; padding: 40px 0 80px; }
.page-header { margin-bottom: 40px; h1 { font-size: 2.5rem; font-weight: 700; color: white; margin-bottom: 10px; } .subtitle { color: #94a3b8; font-size: 1.1rem; } }

/* Stats & Table Styles */
.stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 40px; .stat-card { background-color: $card-bg; border: 1px solid $border-color; border-radius: 12px; padding: 25px; display: flex; justify-content: space-between; align-items: center; .stat-info { display: flex; flex-direction: column; gap: 8px; .label { color: #94a3b8; font-size: 0.9rem; } .value { font-size: 2rem; font-weight: 700; color: white; } .value.teal { color: $teal; } .value.green { color: $green; } .value.orange { color: $orange; } .value.blue { color: $blue; } } .stat-icon-box { width: 50px; height: 50px; border-radius: 10px; display: flex; align-items: center; justify-content: center; svg { width: 24px; height: 24px; } &.teal-bg { background: rgba($teal, 0.1); color: $teal; } &.green-bg { background: rgba($green, 0.1); color: $green; } &.orange-bg { background: rgba($orange, 0.1); color: $orange; } &.blue-bg { background: rgba($blue, 0.1); color: $blue; } } } }

/* ================= CONTROLS SECTION STYLES ================= */
.controls-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  gap: 20px;
  flex-wrap: wrap;

  .search-wrapper {
    position: relative;
    flex: 1;
    min-width: 250px;
    max-width: 400px;

    .search-icon {
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      width: 20px;
      height: 20px;
      color: #64748b;
    }

    .search-input {
      width: 100%;
      background: $card-bg;
      border: 1px solid $border-color;
      border-radius: 8px;
      padding: 10px 10px 10px 40px;
      color: white;
      font-size: 0.95rem;
      outline: none;
      transition: border-color 0.2s;

      &:focus {
        border-color: $teal;
      }
      &::placeholder {
        color: #64748b;
      }
    }
  }

  .filter-tabs {
    display: flex;
    gap: 10px;

    .filter-btn {
      background: transparent;
      border: 1px solid $border-color;
      color: #94a3b8;
      padding: 8px 16px;
      border-radius: 20px;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.2s;

      &:hover {
        border-color: $teal;
        color: white;
      }

      &.active {
        background: rgba($teal, 0.15);
        border-color: $teal;
        color: $teal;
      }
    }
  }
}

.table-container { background-color: $card-bg; border-radius: 12px; border: 1px solid $border-color; overflow: hidden; .state-msg { padding: 40px; text-align: center; color: #94a3b8; font-size: 1.1rem; display: flex; align-items: center; justify-content: center; gap: 10px; } .spinner { width: 20px; height: 20px; border: 2px solid $teal; border-top-color: transparent; border-radius: 50%; animation: spin 1s linear infinite; } }
table.responsive-table { width: 100%; border-collapse: collapse; min-width: 800px; thead th { text-align: left; padding: 20px; color: white; font-weight: 600; border-bottom: 1px solid $border-color; background: rgba(0,0,0,0.2); } tbody td { padding: 20px; border-bottom: 1px solid $border-color; color: #cbd5e1; font-size: 0.95rem; vertical-align: middle; } tbody tr:last-child td { border-bottom: none; } .col-time { font-family: monospace; color: #e2e8f0; } .col-img { color: $teal; cursor: pointer; max-width: 150px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; &:hover { text-decoration: underline; } } .badge { padding: 6px 12px; border-radius: 20px; font-size: 0.85rem; font-weight: 600; &.badge-plant { background: rgba($green, 0.15); color: $green; } &.badge-animal { background: rgba($blue, 0.15); color: $blue; } &.badge-vehicle { background: rgba($orange, 0.15); color: $orange; } } .progress-wrap { display: flex; align-items: center; gap: 15px; width: 100%; .progress-track { flex: 1; height: 6px; background-color: #334155; border-radius: 3px; overflow: hidden; .progress-fill { height: 100%; border-radius: 3px; &.green { background-color: $green; } &.blue { background-color: $blue; } &.orange { background-color: $orange; } } } .metric-val { min-width: 45px; text-align: right; color: #94a3b8; font-size: 0.9rem; } } }
.pagination { display: flex; justify-content: space-between; align-items: center; padding: 20px; border-top: 1px solid $border-color; .page-info { color: #94a3b8; font-size: 0.9rem; } .page-btns { display: flex; gap: 10px; .btn-page { background: transparent; border: 1px solid #334155; color: white; padding: 8px 16px; border-radius: 6px; cursor: pointer; transition: all 0.2s; &:hover:not(:disabled) { border-color: $teal; color: $teal; } &:disabled { opacity: 0.5; cursor: not-allowed; } } } }
@keyframes spin { to { transform: rotate(360deg); } }
@media (max-width: 768px) { 
  .controls-section { flex-direction: column-reverse; align-items: stretch; }
  .filter-tabs { justify-content: center; width: 100%; }
  .search-wrapper { max-width: 100%; }

  table.responsive-table, thead, tbody, th, td, tr { display: block; width: 100%; min-width: 0 !important; } thead { display: none; } tbody tr { margin-bottom: 20px; border-bottom: 1px solid $border-color; background-color: rgba(255, 255, 255, 0.02); border-radius: 8px; padding: 15px; } tbody td { display: flex; justify-content: space-between; align-items: center; text-align: right; padding: 12px 5px; border-bottom: 1px solid rgba(255, 255, 255, 0.05); &:last-child { border-bottom: none; } &::before { content: attr(data-label); font-weight: 700; color: #94a3b8; text-transform: uppercase; font-size: 0.8rem; margin-right: 20px; flex-shrink: 0; } } .col-img { max-width: 100% !important; white-space: normal !important; overflow: visible !important; text-overflow: unset !important; word-break: break-word; text-align: right; } .progress-wrap { width: 120px !important; } .pagination { flex-direction: column; gap: 15px; text-align: center; } 
}
</style>