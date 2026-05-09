/**
 * UI & Core Logic - SoundWave
 * Chứa các hàm quản lý giao diện, thông báo, yêu thích và tìm kiếm.
 */

// ========== KIỂM TRA ĐĂNG NHẬP ==========
function checkLoginStatus() {
  const username = localStorage.getItem('username');
  const userSection = document.getElementById('userSection');
  
  if (username && username !== 'Người dùng') {
    userSection.innerHTML = `
      <div class="user-info-header">
        <span class="username-display">👋 ${username}</span>
        <button class="logout-simple-btn" id="logoutBtn">Đăng xuất</button>
      </div>
    `;
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        if (confirm('Đăng xuất?')) {
          localStorage.removeItem('username');
          localStorage.removeItem('rememberedUser');
          window.location.href = 'login.html';
        }
      });
    }
  } else {
    userSection.innerHTML = `<button class="login-btn-header" id="loginHeaderBtn">🔑 Đăng nhập</button>`;
    const loginBtn = document.getElementById('loginHeaderBtn');
    if (loginBtn) {
      loginBtn.addEventListener('click', () => {
        window.location.href = 'login.html';
      });
    }
  }
}

// ========== HÀM TẢI NỘI DUNG ==========
function loadContent(page) {
  const mainContent = document.getElementById('mainContent');
  if (!mainContent) return;
  
  mainContent.innerHTML = '<div class="loading" style="text-align:center;padding:2rem">Đang tải...</div>';
  
  fetch(`pages/${page}.html`)
    .then(response => {
      if (!response.ok) throw new Error('Không tìm thấy trang');
      return response.text();
    })
    .then(html => {
      mainContent.innerHTML = html;

      const scriptTags = mainContent.querySelectorAll('script');
      scriptTags.forEach(script => {
        const newScript = document.createElement('script');
        newScript.textContent = script.textContent;
        newScript.type = 'text/javascript';
        mainContent.appendChild(newScript);
      });
    })
    .catch(error => {
      mainContent.innerHTML = `<div style="text-align:center;padding:2rem;color:red">Lỗi tải trang: ${error.message}</div>`;
    });
}

// ========== TOAST NOTIFICATION ==========
function showToast(msg, type = 'success') {
  const existing = document.querySelector('.sw-toast');
  if (existing) existing.remove();
  const t = document.createElement('div');
  t.className = 'sw-toast sw-toast-' + type;
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.classList.add('show'), 10);
  setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 300); }, 2800);
}

// ========== LỊCH SỬ NGHE ==========
function saveHistory(song) {
  let hist = JSON.parse(localStorage.getItem('listenHistory')) || [];
  hist = hist.filter(h => h.name !== song.name || h.artist !== song.artist);
  hist.unshift({ name: song.name, artist: song.artist, emoji: song.emoji || '🎵', bg: song.bg || '#1a0a2e', soundCloudUrl: song.soundCloudUrl, time: Date.now() });
  if (hist.length > 30) hist = hist.slice(0, 30);
  localStorage.setItem('listenHistory', JSON.stringify(hist));
}

// ========== LIKE / UNLIKE ==========
let likedSongs = JSON.parse(localStorage.getItem('likedSongs')) || [];

function toggleLike(song) {
  const idx = likedSongs.findIndex(s => s.name === song.name && s.artist === song.artist);
  if (idx === -1) {
    likedSongs.unshift({ name: song.name, artist: song.artist, emoji: song.emoji || '🎵', bg: song.bg || '#1a0a2e', soundCloudUrl: song.soundCloudUrl, dur: song.dur || '0:00' });
    showToast('❤️ Đã thêm vào yêu thích!');
  } else {
    likedSongs.splice(idx, 1);
    showToast('💔 Đã xóa khỏi yêu thích');
  }
  localStorage.setItem('likedSongs', JSON.stringify(likedSongs));
  updateLikeBtn();
}

function isLiked(song) {
  return likedSongs.some(s => s.name === song.name && s.artist === song.artist);
}

function updateLikeBtn() {
  const btn = document.getElementById('likeCurrentBtn');
  if (btn && window.currentSongObj) btn.textContent = isLiked(window.currentSongObj) ? '❤️' : '🤍';
}

// ========== SEARCH ==========
let searchDebounce = null;
function handleSearch(query) {
  if (!query.trim()) { loadContent('home'); return; }
  const songs = (window.SONGS_DATA || []).filter(s =>
    s.name.toLowerCase().includes(query.toLowerCase()) ||
    s.artist.toLowerCase().includes(query.toLowerCase())
  );
  const mc = document.getElementById('mainContent');
  if (!mc) return;
  if (songs.length === 0) {
    mc.innerHTML = `<div style="text-align:center;padding:3rem;color:var(--text2)"><div style="font-size:3rem">🔍</div><p>Không tìm thấy kết quả cho "${query}"</p></div>`;
    return;
  }
  mc.innerHTML = `<div class="section-header"><div class="section-title">🔍 Kết quả cho "${query}"</div></div><div class="top-songs" id="searchResults"></div>`;
  const el = document.getElementById('searchResults');
  el.innerHTML = songs.map((s, i) => `
    <div class="song-item" data-song='${JSON.stringify(s)}'>
      <div class="song-rank">#${i + 1}</div>
      <div class="song-thumb" style="background:${s.bg}">${s.emoji}<div class="song-play-overlay">▶</div></div>
      <div class="song-info"><div class="song-name">${s.name}</div><div class="song-artist">${s.artist}</div></div>
      <div class="song-meta"><span class="song-plays">${s.plays}</span><span class="song-duration">${s.dur}</span></div>
    </div>`).join('');
  el.querySelectorAll('.song-item').forEach(item => {
    item.addEventListener('click', () => { const s = JSON.parse(item.dataset.song); window.playSongFromMain(s); });
  });
}

// ========== THỂ LOẠI MỞ RỘNG ==========
const ALL_GENRES = [
  { id: 'pop', name: 'Pop', emoji: '🎸' },
  { id: 'chill', name: 'Chill', emoji: '🌿' },
  { id: 'vpop', name: 'V-Pop', emoji: '🎤' },
  { id: 'rock', name: 'Rock', emoji: '🤘' },
  { id: 'edm', name: 'EDM', emoji: '⚡' },
  { id: 'ballad', name: 'Ballad', emoji: '💙' },
  { id: 'hiphop', name: 'Hip-hop', emoji: '🎙️' },
  { id: 'jazz', name: 'Jazz', emoji: '🎺' },
  { id: 'lofi', name: 'Lofi', emoji: '☕' },
  { id: 'indie', name: 'Indie', emoji: '🌻' },
  { id: 'country', name: 'Country', emoji: '🤠' },
  { id: 'dance', name: 'Dance', emoji: '💃' },
  { id: 'rnb', name: 'R&B', emoji: '🍷' },
  { id: 'acoustic', name: 'Acoustic', emoji: '🎻' },
  { id: 'classical', name: 'Classical', emoji: '🎹' },
  { id: 'soul', name: 'Soul', emoji: '🕯️' }
];

function openGenreModal() {
  const modal = document.getElementById('genreModal');
  const overlay = document.getElementById('modalOverlay');
  const list = document.getElementById('fullGenreList');
  if (!modal || !list) return;

  list.innerHTML = ALL_GENRES.map(g => `
    <div class="genre-modal-item" data-genre="${g.id}">
      <span class="genre-modal-emoji">${g.emoji}</span>
      <span>${g.name}</span>
    </div>
  `).join('');

  list.querySelectorAll('.genre-modal-item').forEach(item => {
    item.addEventListener('click', () => {
      const g = item.dataset.genre;
      const tag = document.querySelector(`.genre-tag[data-genre="${g}"]`);
      if (tag) {
        tag.click();
      } else {
        window._genreFilter = g;
        document.querySelectorAll('.genre-tag').forEach(t => t.classList.remove('active'));
        loadContent('home');
      }
      closeGenreModal();
    });
  });

  modal.classList.add('show');
  if (overlay) overlay.classList.add('show');
}

function closeGenreModal() {
  document.getElementById('genreModal')?.classList.remove('show');
  document.getElementById('modalOverlay')?.classList.remove('show');
}

// ========== HÀM PHỤ TRỢ ==========
function formatTime(seconds) {
  if (!seconds || isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' + secs : secs}`;
}

function escapeHtml(str) {
  return str.replace(/[&<>]/g, function(m) {
    if (m === '&') return '&amp;';
    if (m === '<') return '&lt;';
    if (m === '>') return '&gt;';
    return m;
  });
}

function setActiveNav(btn) {
  // Xóa active ở cả sidebar và mobile nav
  document.querySelectorAll('.nav-item, .mobile-nav-item').forEach(i => i.classList.remove('active'));
  
  if (btn) {
    btn.classList.add('active');
    // Nếu click ở mobile nav, tìm nút tương ứng ở sidebar để đồng bộ (và ngược lại)
    const tab = btn.dataset.tab;
    if (tab) {
      document.querySelectorAll(`[data-tab="${tab}"]`).forEach(i => i.classList.add('active'));
    }
  }
}

function initMenu() {
  document.querySelectorAll('[data-tab]').forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      loadContent(tab);
      setActiveNav(btn);
    });
  });
}

// Export ra window
window.checkLoginStatus = checkLoginStatus;
window.loadContent = loadContent;
window.showToast = showToast;
window.saveHistory = saveHistory;
window.toggleLike = toggleLike;
window.isLiked = isLiked;
window.updateLikeBtn = updateLikeBtn;
window.handleSearch = handleSearch;
window.formatTime = formatTime;
window.escapeHtml = escapeHtml;
window.initMenu = initMenu;
window.openGenreModal = openGenreModal;
window.closeGenreModal = closeGenreModal;
