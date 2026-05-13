/**
 * Playlist Manager - SoundWave
 * Quản lý danh sách phát, tạo mới và thêm bài hát vào playlist.
 */

let userPlaylists = JSON.parse(localStorage.getItem('userPlaylists')) || [];

// Khởi tạo playlist mặc định
if (userPlaylists.length === 0) {
  userPlaylists = [
    { id: 1, name: "Nhạc buổi sáng", songs: [], created: new Date().toISOString() },
    { id: 2, name: "Chill đêm khuya", songs: [], created: new Date().toISOString() },
    { id: 3, name: "V-Pop Hits", songs: [], created: new Date().toISOString() }
  ];
  localStorage.setItem('userPlaylists', JSON.stringify(userPlaylists));
}

function savePlaylists() {
  localStorage.setItem('userPlaylists', JSON.stringify(userPlaylists));
  // Thông báo cho các trang khác (như Library mobile) cập nhật lại UI
  window.dispatchEvent(new Event('playlistUpdated'));
}

function buildSidebarPlaylists() {
  const container = document.getElementById('myPlaylists');
  if (!container) return;
  
  if (userPlaylists.length === 0) {
    container.innerHTML = '<div style="padding:0.5rem;color:#a09cb8;text-align:center">Chưa có playlist nào</div>';
    return;
  }
  
  container.innerHTML = userPlaylists.map(playlist => `
    <div class="playlist-item" data-playlist-id="${playlist.id}">
      <div class="playlist-thumb" style="background:linear-gradient(135deg,#c084fc,#818cf8)">
        <i class="fa-solid fa-list-ul"></i>
      </div>
      <div class="playlist-info">
        <div class="playlist-name">${window.escapeHtml(playlist.name)}</div>
        <div class="playlist-count">${playlist.songs.length} bài</div>
      </div>
    </div>
  `).join('');
  
  document.querySelectorAll('.playlist-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.stopPropagation();
      showPlaylistDetail(parseInt(item.dataset.playlistId));
    });
  });
}

function showPlaylistDetail(playlistId) {
  const playlist = userPlaylists.find(p => p.id === playlistId);
  if (!playlist) return;
  
  let songList = playlist.songs.length === 0 
    ? '<div style="text-align:center;padding:2rem;color:#a09cb8">Chưa có bài hát nào</div>'
    : playlist.songs.map((song, index) => `
      <div class="playlist-song-item" data-song='${JSON.stringify(song).replace(/'/g, "&apos;")}'>
        <div class="playlist-song-rank">${index + 1}</div>
        <div class="playlist-song-info">
          <div class="playlist-song-name">${window.escapeHtml(song.name)}</div>
          <div class="playlist-song-artist">${window.escapeHtml(song.artist)}</div>
        </div>
        <div class="playlist-song-actions">
          <span class="play-song-btn" title="Phát"><i class="fa-solid fa-play"></i></span>
          <span class="remove-song-btn" title="Xóa"><i class="fa-solid fa-trash-can"></i></span>
        </div>
      </div>
    `).join('');
  
  const modal = document.createElement('div');
  modal.className = 'playlist-detail-modal';
  modal.innerHTML = `
    <div class="playlist-detail-content">
      <div class="playlist-detail-header">
        <h3>${window.escapeHtml(playlist.name)}</h3>
        <span class="close-detail">&times;</span>
      </div>
      <div class="playlist-detail-body">${songList}</div>
      <div class="playlist-detail-footer">
        <button class="delete-playlist-btn">Xóa playlist</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  modal.style.display = 'flex';
  
  modal.querySelector('.close-detail').addEventListener('click', () => modal.remove());
  
  modal.querySelector('.delete-playlist-btn').addEventListener('click', () => {
    if (confirm(`Xóa playlist "${playlist.name}"?`)) {
      userPlaylists = userPlaylists.filter(p => p.id !== playlistId);
      savePlaylists();
      buildSidebarPlaylists();
      modal.remove();
    }
  });
  
  modal.querySelectorAll('.play-song-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const song = JSON.parse(btn.closest('.playlist-song-item').dataset.song);
      if (window.updateTrendingSongs) {
        window.updateTrendingSongs(playlist.songs);
      }
      window.playSongFromMain(song);
      modal.remove();
    });
  });
  
  modal.querySelectorAll('.remove-song-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const song = JSON.parse(btn.closest('.playlist-song-item').dataset.song);
      const idx = playlist.songs.findIndex(s => s.name === song.name && s.artist === song.artist);
      if (idx !== -1) {
        playlist.songs.splice(idx, 1);
        savePlaylists();
        buildSidebarPlaylists();
        modal.remove();
        showPlaylistDetail(playlistId);
      }
    });
  });
}

function showAddToPlaylistModal(song) {
  const modal = document.getElementById('playlistManager');
  const overlay = document.getElementById('modalOverlay');
  const container = document.getElementById('playlistListContainer');
  if (!modal || !container) return;
  
  container.innerHTML = userPlaylists.length === 0
    ? '<div style="text-align:center;padding:1rem;color:#a09cb8">Chưa có playlist nào</div>'
    : userPlaylists.map(playlist => `
      <div class="playlist-item-select" data-playlist-id="${playlist.id}">
        <div class="playlist-icon"><i class="fa-solid fa-list-ul"></i></div>
        <div class="playlist-info">
          <div class="playlist-name">${window.escapeHtml(playlist.name)}</div>
          <div class="playlist-count">${playlist.songs.length} bài</div>
        </div>
      </div>
    `).join('');
  
  modal.classList.add('show');
  overlay?.classList.add('show');
  
  document.querySelectorAll('.playlist-item-select').forEach(item => {
    item.addEventListener('click', () => {
      addSongToPlaylist(parseInt(item.dataset.playlistId), song);
      modal.classList.remove('show');
      overlay?.classList.remove('show');
      window.showToast(`Đã thêm vào playlist "${userPlaylists.find(p=>p.id==item.dataset.playlistId).name}"`);
    });
  });
}

function addSongToPlaylist(playlistId, song) {
  const playlist = userPlaylists.find(p => p.id === playlistId);
  if (playlist) {
    if (!playlist.songs.some(s => s.name === song.name && s.artist === song.artist)) {
      playlist.songs.push({ name: song.name, artist: song.artist, soundCloudUrl: song.soundCloudUrl, image: song.image });
      savePlaylists();
      buildSidebarPlaylists();
    } else {
      window.showToast('Bài hát đã có trong playlist này!', 'error');
    }
  }
}

function showCreatePlaylistModal() {
  const modal = document.getElementById('createPlaylistModal');
  const overlay = document.getElementById('modalOverlay');
  if (modal) {
    const input = document.getElementById('newPlaylistName');
    if (input) input.value = '';
    modal.classList.add('show');
    overlay?.classList.add('show');
  }
}

function closeCreatePlaylistModal() {
  document.getElementById('createPlaylistModal')?.classList.remove('show');
  document.getElementById('modalOverlay')?.classList.remove('show');
}

function confirmCreatePlaylist() {
  const name = document.getElementById('newPlaylistName')?.value.trim();
  if (name) {
    userPlaylists.push({ id: Date.now(), name: name, songs: [], created: new Date().toISOString() });
    savePlaylists();
    buildSidebarPlaylists();
    closeCreatePlaylistModal();
    window.showToast(`Đã tạo playlist "${name}"!`);
  } else {
    window.showToast('Vui lòng nhập tên playlist!', 'error');
  }
}

// Khởi tạo các sự kiện tĩnh
function initPlaylistEvents() {
  document.getElementById('closePlaylistManager')?.addEventListener('click', () => {
    document.getElementById('playlistManager')?.classList.remove('show');
    document.getElementById('modalOverlay')?.classList.remove('show');
  });

  document.getElementById('closeCreateModal')?.addEventListener('click', closeCreatePlaylistModal);

  document.getElementById('modalOverlay')?.addEventListener('click', () => {
    document.getElementById('playlistManager')?.classList.remove('show');
    closeCreatePlaylistModal();
  });

  document.getElementById('createNewPlaylistFromModal')?.addEventListener('click', () => {
    document.getElementById('playlistManager')?.classList.remove('show');
    showCreatePlaylistModal();
  });

  document.getElementById('createPlaylistBtn')?.addEventListener('click', showCreatePlaylistModal);
  document.getElementById('confirmCreatePlaylist')?.addEventListener('click', confirmCreatePlaylist);
}

// Export ra window
window.buildSidebarPlaylists = buildSidebarPlaylists;
window.showAddToPlaylistModal = showAddToPlaylistModal;
window.initPlaylistEvents = initPlaylistEvents;
window.showPlaylistDetail = showPlaylistDetail;
window.showCreatePlaylistModal = showCreatePlaylistModal;
window.closeCreatePlaylistModal = closeCreatePlaylistModal;
window.confirmCreatePlaylist = confirmCreatePlaylist;
