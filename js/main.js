/**
 * Main Entry Point - SoundWave
 * Khởi tạo ứng dụng và gắn các sự kiện chính.
 */

function init() {
  // 1. Kiểm tra trạng thái người dùng
  window.checkLoginStatus();
  
  // Khởi tạo menu điều hướng
  if (window.initMenu) window.initMenu();
  
  // Khởi tạo giao diện Đang phát Mobile
  if (window.initNpm) window.initNpm();
  
  // Load nội dung mặc định (Trang chủ)
  window.loadContent('home');
  
  // 4. Khởi tạo các điều khiển player
  window.initVolumeControl();
  window.initKeyboard();
  
  // 5. Khởi tạo danh sách phát
  window.buildSidebarPlaylists();
  window.initPlaylistEvents();

  // 6. Gắn các sự kiện DOM chính
  document.getElementById('playPauseBtn')?.addEventListener('click', window.togglePlayPause);
  document.getElementById('bpPlayPauseBtn')?.addEventListener('click', window.togglePlayPause);
  document.getElementById('nextBtn')?.addEventListener('click', window.playNextSong);
  document.getElementById('bpNextBtn')?.addEventListener('click', window.playNextSong);
  document.getElementById('prevBtn')?.addEventListener('click', window.playPreviousSong);
  document.getElementById('bpPrevBtn')?.addEventListener('click', window.playPreviousSong);
  document.getElementById('shuffleCtrlBtn')?.addEventListener('click', window.toggleShuffle);
  document.getElementById('repeatCtrlBtn')?.addEventListener('click', window.cycleRepeat);

  // Nút Like trong bảng điều khiển phải
  const likeBtn = document.getElementById('likeCurrentBtn');
  if (likeBtn) likeBtn.addEventListener('click', () => { 
    if (window.currentSongObj) window.toggleLike(window.currentSongObj); 
  });

  // Thanh tiến trình
  const progressBar = document.getElementById('progressBar');
  if (progressBar) {
    progressBar.addEventListener('click', e => {
      const rect = progressBar.getBoundingClientRect();
      window.seekTo(Math.min(100, Math.max(0, ((e.clientX - rect.left) / rect.width) * 100)));
    });
  }

  // Tìm kiếm
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', e => {
      // Logic debounce search
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

  // Bộ lọc thể loại
  document.querySelectorAll('.genre-tag').forEach(tag => {
    tag.addEventListener('click', () => {
      document.querySelectorAll('.genre-tag').forEach(t => t.classList.remove('active'));
      tag.classList.add('active');
      window._genreFilter = tag.dataset.genre || 'all';
      window.loadContent('home');
    });
  });

  // Nút mở rộng thể loại
  document.getElementById('moreGenreBtn')?.addEventListener('click', window.openGenreModal);
  document.getElementById('closeGenreModal')?.addEventListener('click', window.closeGenreModal);

  // Luôn cập nhật UI player khi bắt đầu
  window.updatePlayerUI();
}

// Khởi chạy khi DOM sẵn sàng
document.addEventListener('DOMContentLoaded', init);

// Cung cấp một số hàm cho các file script khác (nếu cần)
window.updateTrendingSongs = (songs) => { window.trendingSongs = songs; };