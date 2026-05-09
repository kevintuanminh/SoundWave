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
        <span class="username-display" id="profileTrigger" style="cursor:pointer">👋 ${username}</span>
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
    const profileBtn = document.getElementById('profileTrigger');
    if (profileBtn) {
      profileBtn.addEventListener('click', () => {
        loadContent('profile');
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
      
      // Khởi tạo logic đặc thù cho từng trang
      if (page === 'home') renderHome();

      // Thực thi script trong trang (nếu có)
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

// ========== RENDER TRANG CHỦ ==========
function renderHome(genre = null) {
  const allSongs = window.SONGS_DATA || [];
  const el = document.getElementById('topSongsList');
  const title = document.getElementById('topSongsTitle');
  const heroTitle = document.getElementById('heroTitle');
  const heroDesc = document.getElementById('heroDesc');
  if (!el) return;

  let songs = [...allSongs];
  const activeGenre = genre || window._genreFilter || 'all';

  if (activeGenre !== 'all') {
    songs = songs.filter(s => s.genre === activeGenre);
    if (title) title.textContent = `🔥 Top ${activeGenre.toUpperCase()}`;
    if (heroTitle) heroTitle.textContent = `Top ${activeGenre.toUpperCase()} Tuần Này`;
  } else {
    songs = songs.sort((a, b) => (a.rank || 99) - (b.rank || 99)).slice(0, 10);
    if (title) title.textContent = '🔥 Top 10 Thịnh Hành';
    if (heroTitle) heroTitle.textContent = 'Top 10 Thịnh Hành';
  }

  if (heroDesc) heroDesc.textContent = `Khám phá ngay ${songs.length} bài hát đang dẫn đầu bảng xếp hạng trên SoundWave.`;

  // Gắn sự kiện cho các nút ở Banner
  const playBtn = document.getElementById('heroPlayBtn');
  const shuffleBtn = document.getElementById('heroShuffleBtn');
  const seeAllBtn = document.getElementById('seeAllBtn');

  // Thể loại cho Mobile
  document.querySelectorAll('.mobile-genres-row .genre-tag').forEach(tag => {
    const g = tag.dataset.genre;
    if (g === 'all' || tag.id === 'mobileMoreGenreBtn') {
        tag.onclick = () => window.openGenreModal();
        return;
    }
    tag.onclick = () => {
      const g = tag.dataset.genre;
      window._genreFilter = g;
      document.querySelectorAll('.mobile-genres-row .genre-tag').forEach(t => t.classList.remove('active'));
      tag.classList.add('active');
      renderHome(g);
    };
  });

  if (seeAllBtn) {
    seeAllBtn.onclick = (e) => {
      e.preventDefault();
      loadContent('trending');
    };
  }

  if (playBtn) {
    playBtn.onclick = () => {
      if (songs.length > 0) {
        if (window.updateTrendingSongs) window.updateTrendingSongs(songs);
        window.playSongFromMain(songs[0]);
      }
    };
  }
  
  if (shuffleBtn) {
    shuffleBtn.onclick = () => {
      if (songs.length > 0) {
        if (window.updateTrendingSongs) window.updateTrendingSongs(songs);
        const rand = Math.floor(Math.random() * songs.length);
        if (window.toggleShuffle && !window.shuffleMode) window.toggleShuffle();
        window.playSongFromMain(songs[rand]);
      }
    };
  }

  el.innerHTML = songs.map((s, i) => {
    const thumb = s.image ? `<img src="${s.image}" style="width:100%;height:100%;object-fit:cover;border-radius:inherit;">` : '🎵';
    return `
    <div class="song-item" data-song='${JSON.stringify(s).replace(/'/g, "&apos;")}'>
      <div class="song-rank${i<3?' top':''}">${i + 1}</div>
      <div class="song-thumb" style="background:${s.bg}">${thumb}<div class="song-play-overlay">▶</div></div>
      <div class="song-info"><div class="song-name">${s.name}</div><div class="song-artist">${s.artist}</div></div>
      <div class="song-meta">
        <span class="add-to-playlist-btn" data-song='${JSON.stringify(s).replace(/'/g, "&apos;")}' style="cursor:pointer;margin:0 8px">➕</span>
        <span class="like-song-btn ${isLiked(s)?'liked':''}" data-song='${JSON.stringify(s).replace(/'/g, "&apos;")}' style="cursor:pointer;margin:0 4px">${isLiked(s)?'❤️':'🤍'}</span>
      </div>
    </div>`;
  }).join('');

  // Gắn sự kiện cho danh sách nhạc
  el.querySelectorAll('.song-item').forEach(item => {
    item.addEventListener('click', e => {
      if (e.target.classList.contains('add-to-playlist-btn') || e.target.classList.contains('like-song-btn')) return;
      if (window.updateTrendingSongs) window.updateTrendingSongs(songs);
      window.playSongFromMain(JSON.parse(item.dataset.song));
    });
  });

  el.querySelectorAll('.add-to-playlist-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      if (window.showAddToPlaylistModal) window.showAddToPlaylistModal(JSON.parse(btn.dataset.song));
    });
  });

  el.querySelectorAll('.like-song-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      toggleLike(JSON.parse(btn.dataset.song));
      renderHome(genre);
    });
  });

  // Render Lịch sử
  const histList = document.getElementById('historyList');
  if (histList) {
    const hist = JSON.parse(localStorage.getItem('listenHistory')) || [];
    histList.innerHTML = hist.length === 0 ? '<div style="padding:1rem;color:var(--text3)">Chưa có lịch sử</div>' : hist.slice(0, 5).map(s => `
      <div class="history-item" onclick='window.playSongFromMain(${JSON.stringify(s).replace(/'/g, "&apos;")})'>
        <div class="history-thumb" style="background:${s.bg}">${s.image?`<img src="${s.image}" style="width:100%;height:100%;object-fit:cover;border-radius:inherit;">`:'🎵'}</div>
        <div class="history-info"><div class="history-name">${s.name}</div><div class="history-artist">${s.artist}</div></div>
      </div>`).join('');
  }

  // Render Album
  const albumGrid = document.getElementById('albumGrid');
  if (albumGrid) {
    const albums = window.ALBUMS_DATA || [];
    albumGrid.innerHTML = albums.map(a => `
      <div class="album-card">
        <div class="album-cover" style="background:${a.bg}">${a.image?`<img src="${a.image}" style="width:100%;height:100%;object-fit:cover;border-radius:inherit;">`:'💿'}</div>
        <div class="album-name">${a.name}</div>
        <div class="album-artist">${a.artist}</div>
      </div>`).join('');
  }
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
  hist.unshift({ ...song, time: Date.now() });
  if (hist.length > 30) hist = hist.slice(0, 30);
  localStorage.setItem('listenHistory', JSON.stringify(hist));
}

// ========== LIKE / UNLIKE ==========
let likedSongs = JSON.parse(localStorage.getItem('likedSongs')) || [];

function toggleLike(song) {
  const idx = likedSongs.findIndex(s => s.name === song.name && s.artist === song.artist);
  if (idx === -1) {
    likedSongs.unshift({ ...song });
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
    <div class="song-item" data-song='${JSON.stringify(s).replace(/'/g, "&apos;")}'>
      <div class="song-rank">#${i + 1}</div>
      <div class="song-thumb" style="background:${s.bg}">${s.image?`<img src="${s.image}" style="width:100%;height:100%;object-fit:cover;border-radius:inherit;">`:'🎵'}<div class="song-play-overlay">▶</div></div>
      <div class="song-info"><div class="song-name">${s.name}</div><div class="song-artist">${s.artist}</div></div>
      <div class="song-meta"><span class="song-plays">${s.plays}</span><span class="song-duration">${s.dur}</span></div>
    </div>`).join('');
  el.querySelectorAll('.song-item').forEach(item => {
    item.addEventListener('click', () => { window.playSongFromMain(JSON.parse(item.dataset.song)); });
  });
}

// ========== THỂ LOẠI MỞ RỘNG ==========
const ALL_GENRES = [
  { id: 'all', name: 'Tất cả', emoji: '🏠' },
  { id: 'vpop', name: 'V-Pop', emoji: '🎤' },
  { id: 'pop', name: 'Pop', emoji: '🎸' },
  { id: 'chill', name: 'Chill', emoji: '🌿' },
  { id: 'lofi', name: 'Lofi', emoji: '☕' },
  { id: 'remix', name: 'Remix', emoji: '⚡' },
  { id: 'indie', name: 'Indie', emoji: '🌻' },
  { id: 'rap', name: 'Rap', emoji: '🎙️' },
  { id: 'rock', name: 'Rock', emoji: '🤘' },
  { id: 'edm', name: 'EDM', emoji: '💥' },
  { id: 'ballad', name: 'Ballad', emoji: '💙' },
  { id: 'jpop', name: 'J-Pop', emoji: '🌸' },
  { id: 'kpop', name: 'K-Pop', emoji: '💎' }
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
      window._genreFilter = g;
      document.querySelectorAll('.genre-tag').forEach(t => t.classList.remove('active'));
      const tag = document.querySelector(`.genre-tag[data-genre="${g}"]`);
      if (tag) tag.classList.add('active');
      loadContent('home');
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
  document.querySelectorAll('.nav-item, .mobile-nav-item').forEach(i => i.classList.remove('active'));
  if (btn) {
    btn.classList.add('active');
    const tab = btn.dataset.tab;
    if (tab) document.querySelectorAll(`[data-tab="${tab}"]`).forEach(i => i.classList.add('active'));
  }
}

function initMenu() {
  document.querySelectorAll('[data-tab]').forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      if (tab === 'home' || tab === 'trending') {
        window._genreFilter = 'all';
        document.querySelectorAll('.genre-tag').forEach(t => t.classList.remove('active'));
      }
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
window.renderHome = renderHome;
