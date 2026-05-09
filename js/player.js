/**
 * Player Logic - SoundWave
 * Chứa logic phát nhạc, SoundCloud API, điều khiển và âm lượng.
 */

// ========== BIẾN TOÀN CỤC PLAYER ==========
window.currentSong = { name: "Chưa chọn bài hát", artist: "Mời bạn chọn nhạc", duration: 0, emoji: "🎵" };
window.currentTime = 0;
window.isPlaying = false;
window.queueList = [];
window.trendingSongs = [];
window.playerReady = false;
window.currentSongObj = null;
window.playerInterval = null;
window.soundcloudWidget = null;
window.soundcloudIframe = null;
window.shuffleMode = false;
window.repeatMode = 0; // 0=off, 1=all, 2=one
window.currentVolume = 80;

// ========== CẬP NHẬT GIAO DIỆN PLAYER ==========
function updatePlayerUI() {
  if (!window.currentSong) return;
  
  const percent = (window.currentTime / window.currentSong.duration) * 100 || 0;
  
  // Progress Bars
  const bars = ['progressFill', 'npmProgressFill'];
  bars.forEach(id => { const el = document.getElementById(id); if (el) el.style.width = `${percent}%`; });
  
  // Times
  const updateTime = (id, val) => { const el = document.getElementById(id); if (el) el.innerText = val; };
  updateTime('currentTime', window.formatTime(window.currentTime));
  updateTime('npmCurrentTime', window.formatTime(window.currentTime));
  updateTime('totalTime', window.formatTime(window.currentSong.duration));
  updateTime('npmTotalTime', window.formatTime(window.currentSong.duration));
  
  // Song Info
  const updateInfo = (id, val) => { const el = document.getElementById(id); if (el) el.innerText = val || ""; };
  updateInfo('npSongName', window.currentSong.name);
  updateInfo('npmName', window.currentSong.name);
  updateInfo('npArtist', window.currentSong.artist);
  updateInfo('npmArtist', window.currentSong.artist);
  updateInfo('bpName', window.currentSong.name);
  updateInfo('bpArtist', window.currentSong.artist);
  
  // Covers
  const covers = [
    { id: 'npCover', icon: '🎵' },
    { id: 'bpThumb', icon: '🎵' },
    { id: 'npmCover', icon: '🎵' }
  ];
  
  covers.forEach(c => {
    const el = document.getElementById(c.id);
    if (el) {
      if (window.currentSongObj && window.currentSongObj.image) {
        const currentImg = el.querySelector('img');
        // Chỉ cập nhật nếu chưa có ảnh HOẶC ảnh hiện tại khác ảnh bài hát mới
        if (!currentImg || currentImg.src !== window.currentSongObj.image) {
          el.innerHTML = `<img src="${window.currentSongObj.image}" style="width:100%;height:100%;object-fit:cover;border-radius:inherit;">`;
        }
      } else {
        el.innerHTML = c.icon;
      }
      // Animation
      if (window.isPlaying) {
        el.classList.add('spinning');
        el.classList.remove('paused');
      } else {
        el.classList.add('paused');
      }
    }
  });

  // Buttons
  const playBtns = ['playPauseBtn', 'bpPlayPauseBtn', 'npmPlayPauseBtn'];
  playBtns.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = window.isPlaying ? '⏸' : '▶';
  });
}

// ========== KHỞI TẠO SỰ KIỆN NPM ==========
function initNpm() {
  const modal = document.getElementById('nowPlayingModal');
  const bottomPlayer = document.getElementById('bottomPlayer');
  const closeBtn = document.getElementById('closeNpmBtn');
  
  if (bottomPlayer) {
    bottomPlayer.onclick = (e) => {
      if (e.target.closest('.bp-controls')) return;
      modal.classList.add('show');
    };
  }
  
  if (closeBtn) closeBtn.onclick = () => modal.classList.remove('show');

  // Gắn sự kiện cho các nút trong modal
  const bind = (id, fn) => { const el = document.getElementById(id); if (el) el.onclick = fn; };
  bind('npmPlayPauseBtn', () => window.togglePlayPause());
  bind('npmNextBtn', () => window.playNextSong());
  bind('npmPrevBtn', () => window.playPrevSong());
  bind('npmShuffleBtn', () => window.toggleShuffle());
  bind('npmRepeatBtn', () => window.cycleRepeat());

  // TUA NHẠC (SEEKING)
  const handleSeek = (barId, e) => {
    const bar = document.getElementById(barId);
    if (!bar || !window.currentSong || !window.soundcloudWidget) return;
    const rect = bar.getBoundingClientRect();
    const x = e.clientX || (e.touches && e.touches[0].clientX);
    if (!x) return;
    const offsetX = x - rect.left;
    const percent = Math.min(Math.max(offsetX / rect.width, 0), 1);
    const seekToMs = percent * window.currentSong.duration * 1000;
    window.soundcloudWidget.seekTo(seekToMs);
    window.currentTime = seekToMs / 1000;
    updatePlayerUI();
  };

  const npmBar = document.getElementById('npmProgressBar');
  if (npmBar) npmBar.onclick = (e) => handleSeek('npmProgressBar', e);

  const mainBar = document.getElementById('progressBar');
  if (mainBar) mainBar.onclick = (e) => handleSeek('progressBar', e);
}

// Thêm initNpm vào window để gọi từ main.js
window.initNpm = initNpm;

// ========== HÀM CẬP NHẬT THỜI GIAN ==========
function startTimeUpdate() {
  if (window.playerInterval) clearInterval(window.playerInterval);
  window.playerInterval = setInterval(function() {
    if (window.isPlaying && window.soundcloudWidget && typeof SC !== 'undefined') {
      window.soundcloudWidget.getPosition(function(position) {
        if (position && !isNaN(position)) {
          window.currentTime = position / 1000;
          updatePlayerUI();
        }
      });
    }
  }, 500);
}

function stopTimeUpdate() {
  if (window.playerInterval) {
    clearInterval(window.playerInterval);
    window.playerInterval = null;
  }
}

// ========== KHỞI TẠO SOUNDCLOUD PLAYER ==========
function initSoundCloudPlayer(trackUrl, song) {
  const playerDiv = document.getElementById('soundcloudPlayer');
  if (!playerDiv) return;
  
  if (!window.soundcloudWidget) {
    // Chỉ tạo iframe 1 lần duy nhất
    const iframe = document.createElement('iframe');
    iframe.id = "sc-widget-iframe";
    iframe.width = "0"; iframe.height = "0"; iframe.style.display = "none";
    iframe.src = `https://w.soundcloud.com/player/?url=${encodeURIComponent(trackUrl)}&auto_play=true&hide_related=true&show_comments=false&show_user=false&show_reposts=false&visual=false`;
    iframe.setAttribute('allow', 'autoplay; encrypted-media');
    playerDiv.appendChild(iframe);
    
    window.soundcloudWidget = SC.Widget(iframe);
    window.soundcloudIframe = iframe;
    
    // Gắn sự kiện 1 lần
    window.soundcloudWidget.bind(SC.Widget.Events.READY, function() {
      window.playerReady = true;
      window.soundcloudWidget.setVolume(window.currentVolume);
      window.soundcloudWidget.play();
      startTimeUpdate();
    });

    window.soundcloudWidget.bind(SC.Widget.Events.PLAY, function() {
      window.isPlaying = true;
      updatePlayerUI();
      startTimeUpdate();
      
      // Fix iOS 1s stop: Kiểm tra sau 1s nếu bị dừng thì phát lại
      setTimeout(() => {
        window.soundcloudWidget.isPaused(function(paused) {
          if (paused && window.isPlaying) window.soundcloudWidget.play();
        });
      }, 1000);
    });

    window.soundcloudWidget.bind(SC.Widget.Events.PAUSE, function() {
      window.isPlaying = false;
      updatePlayerUI();
      stopTimeUpdate();
    });

    window.soundcloudWidget.bind(SC.Widget.Events.FINISH, function() {
      if (window.repeatMode === 2) {
        window.soundcloudWidget.seekTo(0);
        window.soundcloudWidget.play();
      } else {
        playNextSong();
      }
    });
  } else {
    // Nếu đã có widget, chỉ load bài mới
    window.soundcloudWidget.load(trackUrl, {
      auto_play: true,
      hide_related: true,
      show_comments: false,
      show_user: false,
      show_reposts: false,
      visual: false,
      callback: function() {
        window.soundcloudWidget.play();
        // Cập nhật duration mới
        window.soundcloudWidget.getDuration(function(d) {
           if (d) window.currentSong.duration = d / 1000;
        });
      }
    });
  }
}

// ========== ĐIỀU KHIỂN PHÁT NHẠC ==========
function playSong(song) {
  if (!song.soundCloudUrl) {
    window.showToast('Bài hát này chưa có link phát!', 'error');
    return;
  }
  
  // Mẹo cho iOS: Nếu đã có widget, gửi lệnh play ngay để "giữ chỗ"
  if (window.soundcloudWidget) {
    window.soundcloudWidget.play();
  }

  window.currentSongObj = song;
  window.currentSong = { name: song.name, artist: song.artist, duration: song.duration || 180 };
  window.currentTime = 0;
  updatePlayerUI();
  window.updateLikeBtn();
  window.saveHistory(song);
  
  if (typeof SC === 'undefined') {
    var script = document.createElement('script');
    script.src = 'https://w.soundcloud.com/player/api.js';
    script.onload = function() { initSoundCloudPlayer(song.soundCloudUrl, song); };
    document.head.appendChild(script);
  } else {
    initSoundCloudPlayer(song.soundCloudUrl, song);
  }
}

function togglePlayPause() {
  if (!window.soundcloudWidget) return;
  
  window.soundcloudWidget.isPaused(function(paused) {
    if (paused) {
      window.isPlaying = true;
      window.soundcloudWidget.play();
    } else {
      window.isPlaying = false;
      window.soundcloudWidget.pause();
    }
    updatePlayerUI();
  });
}

// Giải pháp "Mồi" nhạc cho iOS
document.addEventListener('touchstart', function() {
  if (window.soundcloudWidget && !window.playerUnlocked) {
    window.soundcloudWidget.play();
    window.soundcloudWidget.pause();
    window.playerUnlocked = true;
  }
}, { once: true });

function playNextSong() {
  stopTimeUpdate();
  const list = window.trendingSongs && window.trendingSongs.length > 0 ? window.trendingSongs : (window.SONGS_DATA || []);
  if (window.queueList && window.queueList.length > 0) {
    playSong(window.queueList.shift());
  } else if (list.length > 0) {
    const idx = list.findIndex(s => s.name === window.currentSongObj?.name);
    if (window.shuffleMode) {
      let r = Math.floor(Math.random() * list.length);
      if (list.length > 1 && r === idx) r = (r + 1) % list.length;
      playSong(list[r]);
    } else if (window.repeatMode === 1) {
      playSong(list[(idx + 1) % list.length]);
    } else if (idx !== -1 && idx < list.length - 1) {
      playSong(list[idx + 1]);
    }
  }
}

function playPrevSong() {
  stopTimeUpdate();
  const list = window.trendingSongs && window.trendingSongs.length > 0 ? window.trendingSongs : (window.SONGS_DATA || []);
  if (list.length > 0) {
    const idx = list.findIndex(s => s.name === window.currentSongObj?.name);
    if (window.shuffleMode) {
      playSong(list[Math.floor(Math.random() * list.length)]);
    } else if (idx > 0) {
      playSong(list[idx - 1]);
    } else if (window.repeatMode === 1) {
      playSong(list[list.length - 1]);
    }
  }
}

function toggleShuffle() {
  window.shuffleMode = !window.shuffleMode;
  const btn = document.getElementById('shuffleCtrlBtn');
  if (btn) {
    btn.style.color = window.shuffleMode ? 'var(--accent)' : '';
    btn.style.textShadow = window.shuffleMode ? '0 0 8px var(--accent)' : '';
  }
  window.showToast(window.shuffleMode ? '🔀 Shuffle bật' : '🔀 Shuffle tắt');
}

function cycleRepeat() {
  window.repeatMode = (window.repeatMode + 1) % 3;
  const btn = document.getElementById('repeatCtrlBtn');
  const labels = ['🔁', '🔁', '🔂'];
  const msgs = ['🔁 Repeat tắt', '🔁 Repeat tất cả', '🔂 Repeat 1 bài'];
  if (btn) {
    btn.textContent = labels[window.repeatMode];
    btn.style.color = window.repeatMode > 0 ? 'var(--accent)' : '';
  }
  window.showToast(msgs[window.repeatMode]);
}

function seekTo(percent) {
  if (!window.soundcloudWidget || typeof SC === 'undefined' || !window.currentSong.duration) return;
  percent = Math.min(100, Math.max(0, percent));
  const seekTime = (percent / 100) * window.currentSong.duration;
  stopTimeUpdate();
  window.currentTime = seekTime;
  updatePlayerUI();
  window.soundcloudWidget.seekTo(seekTime * 1000);
  setTimeout(function() { if (window.isPlaying) startTimeUpdate(); }, 300);
}

function initVolumeControl() {
  const bar = document.getElementById('volumeBar');
  const fill = document.getElementById('volumeFill');
  if (!bar || !fill) return;
  fill.style.width = window.currentVolume + '%';
  bar.addEventListener('click', e => {
    const rect = bar.getBoundingClientRect();
    window.currentVolume = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    window.currentVolume = Math.min(100, Math.max(0, window.currentVolume));
    fill.style.width = window.currentVolume + '%';
    if (window.soundcloudWidget && typeof SC !== 'undefined') window.soundcloudWidget.setVolume(window.currentVolume);
  });
}

function initKeyboard() {
  document.addEventListener('keydown', e => {
    const tag = e.target.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA') return;
    if (e.code === 'Space') { e.preventDefault(); togglePlayPause(); }
    if (e.code === 'ArrowRight') { e.preventDefault(); playNextSong(); }
    if (e.code === 'ArrowLeft') { e.preventDefault(); playPreviousSong(); }
    if (e.code === 'KeyM') {
      window.currentVolume = window.currentVolume > 0 ? 0 : 80;
      const f = document.getElementById('volumeFill');
      if (f) f.style.width = window.currentVolume + '%';
      if (window.soundcloudWidget && typeof SC !== 'undefined') window.soundcloudWidget.setVolume(window.currentVolume);
      window.showToast(window.currentVolume === 0 ? '🔇 Tắt tiếng' : '🔊 Bật tiếng');
    }
    if (e.code === 'KeyL') { if (window.currentSongObj) window.toggleLike(window.currentSongObj); }
    if (e.code === 'KeyS') toggleShuffle();
    if (e.code === 'KeyR') cycleRepeat();
  });
}

// Export ra window
window.playSongFromMain = playSong;
window.togglePlayPause = togglePlayPause;
window.playNextSong = playNextSong;
window.playPrevSong = playPrevSong;
window.toggleShuffle = toggleShuffle;
window.cycleRepeat = cycleRepeat;
window.seekTo = seekTo;
window.initVolumeControl = initVolumeControl;
window.initKeyboard = initKeyboard;
window.updatePlayerUI = updatePlayerUI;
