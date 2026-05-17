function init() {
  window.checkLoginStatus();
  
  if (window.initMenu) window.initMenu();
  if (window.initNpm) window.initNpm();
  
  window.loadContent('home');
  window.initVolumeControl();
  window.initKeyboard();
  
  window.buildSidebarPlaylists();
  window.initPlaylistEvents();

  document.getElementById('playPauseBtn')?.addEventListener('click', window.togglePlayPause);
  document.getElementById('bpPlayPauseBtn')?.addEventListener('click', window.togglePlayPause);
  document.getElementById('nextBtn')?.addEventListener('click', window.playNextSong);
  document.getElementById('bpNextBtn')?.addEventListener('click', window.playNextSong);
  document.getElementById('prevBtn')?.addEventListener('click', window.playPrevSong);
  document.getElementById('bpPrevBtn')?.addEventListener('click', window.playPrevSong);
  document.getElementById('shuffleCtrlBtn')?.addEventListener('click', window.toggleShuffle);
  document.getElementById('repeatCtrlBtn')?.addEventListener('click', window.cycleRepeat);

  const likeBtn = document.getElementById('likeCurrentBtn');
  if (likeBtn) likeBtn.addEventListener('click', () => { 
    if (window.currentSongObj) window.toggleLike(window.currentSongObj); 
  });

  const addNpBtn = document.getElementById('addToPlaylistNpBtn');
  if (addNpBtn) addNpBtn.addEventListener('click', () => {
    if (window.currentSongObj && window.showAddToPlaylistModal) {
      window.showAddToPlaylistModal(window.currentSongObj);
    }
  });

  document.getElementById('npmLikeBtn')?.addEventListener('click', () => {
    if (window.currentSongObj) window.toggleLike(window.currentSongObj);
  });
  document.getElementById('npmAddBtn')?.addEventListener('click', () => {
    if (window.currentSongObj && window.showAddToPlaylistModal) {
      window.showAddToPlaylistModal(window.currentSongObj);
    }
  });

  const progressBar = document.getElementById('progressBar');
  if (progressBar) {
    progressBar.addEventListener('click', e => {
      const rect = progressBar.getBoundingClientRect();
      window.seekTo(Math.min(100, Math.max(0, ((e.clientX - rect.left) / rect.width) * 100)));
    });
  }

  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', e => {
      if (window._searchTimer) clearTimeout(window._searchTimer);
      window._searchTimer = setTimeout(() => window.handleSearch(e.target.value), 350);
    });
    searchInput.addEventListener('keydown', e => {
      if (e.key === 'Escape') { 
        searchInput.value = ''; 
        window.loadContent('home'); 
      }
    });
  }

  document.querySelectorAll('.genre-tag').forEach(tag => {
    tag.addEventListener('click', () => {
      document.querySelectorAll('.genre-tag').forEach(t => t.classList.remove('active'));
      tag.classList.add('active');
      window._genreFilter = tag.dataset.genre || 'all';
      window.loadContent('home');
    });
  });

  document.getElementById('moreGenreBtn')?.addEventListener('click', window.openGenreModal);
  document.getElementById('closeGenreModal')?.addEventListener('click', window.closeGenreModal);
  document.getElementById('closeChangePwdModal')?.addEventListener('click', window.closeChangePwdModal);

  document.getElementById('confirmChangePwdBtn')?.addEventListener('click', () => {
    const oldPwd = document.getElementById('oldPwdInput')?.value;
    const newPwd = document.getElementById('newPwdInput')?.value;
    const confirmPwd = document.getElementById('confirmPwdInput')?.value;
    const username = localStorage.getItem('username');
    
    if (!username || username === 'nguoidung') {
        if(window.showToast) window.showToast('Bạn chưa đăng nhập!', 'error');
        return;
    }
    
    if (!oldPwd || !newPwd || !confirmPwd) {
        if(window.showToast) window.showToast('Vui lòng nhập đầy đủ thông tin!', 'error');
        return;
    }
    
    if (newPwd.length < 6) {
        if(window.showToast) window.showToast('Mật khẩu mới phải ít nhất 6 ký tự!', 'error');
        return;
    }
    
    if (newPwd !== confirmPwd) {
        if(window.showToast) window.showToast('Xác nhận mật khẩu mới không khớp!', 'error');
        return;
    }
    
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = users.findIndex(u => u.username === username);
    
    if (userIndex === -1) {
        if(window.showToast) window.showToast('Không tìm thấy người dùng!', 'error');
        return;
    }
    
    if (users[userIndex].password !== oldPwd) {
        if(window.showToast) window.showToast('Mật khẩu cũ không chính xác!', 'error');
        return;
    }
    
    users[userIndex].password = newPwd;
    localStorage.setItem('users', JSON.stringify(users));
    if(window.showToast) window.showToast('Đổi mật khẩu thành công!');
    if(window.closeChangePwdModal) window.closeChangePwdModal();
  });

  window.updatePlayerUI();
}

document.addEventListener('DOMContentLoaded', init);

window.updateTrendingSongs = (songs) => { window.trendingSongs = songs; };