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
  const progressFill = document.getElementById('progressFill');
  if (progressFill) progressFill.style.width = `${percent}%`;
  
  const currentTimeSpan = document.getElementById('currentTime');
  const totalTimeSpan = document.getElementById('totalTime');
  if (currentTimeSpan) currentTimeSpan.innerText = window.formatTime(window.currentTime);
  if (totalTimeSpan) totalTimeSpan.innerText = window.formatTime(window.currentSong.duration);
  
  const npSongName = document.getElementById('npSongName');
  const npArtist = document.getElementById('npArtist');
  const npCover = document.getElementById('npCover');
  
  if (npSongName) npSongName.innerText = window.currentSong.name || "Chưa chọn bài hát";
  if (npArtist) npArtist.innerText = window.currentSong.artist || "SoundWave";
  
  if (npCover) {
    if (window.currentSongObj && window.currentSongObj.image) {
      npCover.innerHTML = `<img src="${window.currentSongObj.image}" style="width:100%;height:100%;object-fit:cover;border-radius:inherit;">`;
    } else {
      npCover.innerHTML = '🎵'; // Icon mặc định
    }
  }
  
  const bpName = document.getElementById('bpName');
  const bpArtist = document.getElementById('bpArtist');
  const bpThumb = document.getElementById('bpThumb');
  
  if (bpName) bpName.innerText = window.currentSong.name || "Chưa chọn bài hát";
  if (bpArtist) bpArtist.innerText = window.currentSong.artist || "Mời bạn chọn nhạc";
  
  if (bpThumb) {
    if (window.currentSongObj && window.currentSongObj.image) {
      bpThumb.innerHTML = `<img src="${window.currentSongObj.image}" style="width:100%;height:100%;object-fit:cover;border-radius:inherit;">`;
    } else {
      bpThumb.innerHTML = '🎵'; // Icon mặc định
    }
  }
}

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
  
  playerDiv.innerHTML = '';
  const iframe = document.createElement('iframe');
  iframe.width = "0"; iframe.height = "0"; iframe.style.display = "none";
  iframe.src = `https://w.soundcloud.com/player/?url=${encodeURIComponent(trackUrl)}&auto_play=true&hide_related=true&show_comments=false&show_user=false&show_reposts=false&visual=false`;
  iframe.setAttribute('allow', 'autoplay');
  playerDiv.appendChild(iframe);
  
  window.soundcloudWidget = SC.Widget(iframe);
  window.soundcloudIframe = iframe;
  
  window.soundcloudWidget.bind(SC.Widget.Events.READY, function() {
    window.playerReady = true;
    window.soundcloudWidget.getDuration(function(duration) {
      if (duration && duration > 0) {
        window.currentSong.duration = duration / 1000;
        const totalTimeSpan = document.getElementById('totalTime');
        if (totalTimeSpan) totalTimeSpan.innerText = window.formatTime(window.currentSong.duration);
      }
    });
    startTimeUpdate();
  });
  
  window.soundcloudWidget.bind(SC.Widget.Events.PLAY, function() {
    window.isPlaying = true;
    const playBtn = document.getElementById('playPauseBtn');
    const bpPlayBtn = document.getElementById('bpPlayPauseBtn');
    if (playBtn) playBtn.innerHTML = '⏸';
    if (bpPlayBtn) bpPlayBtn.innerHTML = '⏸';
    startTimeUpdate();
  });
  
  window.soundcloudWidget.bind(SC.Widget.Events.PAUSE, function() {
    window.isPlaying = false;
    const playBtn = document.getElementById('playPauseBtn');
    const bpPlayBtn = document.getElementById('bpPlayPauseBtn');
    if (playBtn) playBtn.innerHTML = '▶';
    if (bpPlayBtn) bpPlayBtn.innerHTML = '▶';
    stopTimeUpdate();
  });
  
  window.soundcloudWidget.bind(SC.Widget.Events.FINISH, function() {
    stopTimeUpdate();
    if (window.repeatMode === 2) {
      window.soundcloudWidget.seekTo(0);
      window.soundcloudWidget.play();
    } else {
      playNextSong();
    }
  });
  
  window.soundcloudWidget.bind(SC.Widget.Events.ERROR, function(error) {
    console.error('SoundCloud error:', error);
    alert('Không thể phát bài này. Vui lòng thử bài khác.');
  });
}

// ========== ĐIỀU KHIỂN PHÁT NHẠC ==========
function playSong(song) {
  if (!song.soundCloudUrl) {
    window.showToast('Bài hát này chưa có link phát!', 'error');
    return;
  }
  window.currentSongObj = song;
  window.currentSong = { name: song.name, artist: song.artist, duration: song.duration || 180 };
  window.currentTime = 0;
  updatePlayerUI();
  window.updateLikeBtn();
  window.saveHistory(song);
  stopTimeUpdate();
  window.playerReady = false;
  
  const cover = document.getElementById('npCover');
  if (cover) cover.classList.add('spinning');
  
  if (typeof SC === 'undefined') {
    var script = document.createElement('script');
    script.src = 'https://w.soundcloud.com/player/api.js';
    script.onload = function() { initSoundCloudPlayer(song.soundCloudUrl, song); };
    document.head.appendChild(script);
  } else {
    initSoundCloudPlayer(song.soundCloudUrl, song);
  }
}

function pauseSong() {
  if (window.soundcloudWidget && typeof SC !== 'undefined') window.soundcloudWidget.pause();
  window.isPlaying = false;
  stopTimeUpdate();
  const playBtn = document.getElementById('playPauseBtn');
  const bpPlayBtn = document.getElementById('bpPlayPauseBtn');
  if (playBtn) playBtn.innerHTML = '▶';
  if (bpPlayBtn) bpPlayBtn.innerHTML = '▶';
}

function togglePlayPause() {
  if (!window.soundcloudWidget || typeof SC === 'undefined') return;
  if (window.isPlaying) window.soundcloudWidget.pause();
  else window.soundcloudWidget.play();
}

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

function playPreviousSong() {
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
window.pauseSong = pauseSong;
window.togglePlayPause = togglePlayPause;
window.playNextSong = playNextSong;
window.playPreviousSong = playPreviousSong;
window.toggleShuffle = toggleShuffle;
window.cycleRepeat = cycleRepeat;
window.seekTo = seekTo;
window.initVolumeControl = initVolumeControl;
window.initKeyboard = initKeyboard;
window.updatePlayerUI = updatePlayerUI;
