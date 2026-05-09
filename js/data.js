// ========== DỮ LIỆU TẬP TRUNG — SoundWave ==========
// File này được load trước main.js và dùng chung cho tất cả các trang

window.SONGS_DATA = [
  // --- V-POP ---
  { id:1,  rank:1,  name:"Đừng Làm Trái Tim Anh Đau",   artist:"Sơn Tùng M-TP",          plays:"8.2M", duration:224, dur:"3:44", bg:"linear-gradient(135deg,#1a0a2e,#3a1a5e)", genre:"vpop",   soundCloudUrl:"https://soundcloud.com/nguy-n-tr-n-mai-anh-923490590/ng-l-m-tr-i-tim-anh-au", image: "images/Sơn_Tùng_M-TP_-_Đừng_làm_trái_tim_anh_đau.png" },
  { id:2,  rank:2,  name:"Chúng Ta Của Hiện Tại",        artist:"Sơn Tùng M-TP",          plays:"6.5M", duration:252, dur:"4:12", bg:"linear-gradient(135deg,#0a1a2e,#1a3a5e)", genre:"vpop",   soundCloudUrl:"https://soundcloud.com/b-h-ng-22387867/chu-ng-ta-cu-a-hie-n-ta-i-s-n", image: "images/Chúng_ta_của_hiện_tại.jpg" },
  { id:3,  rank:3,  name:"Nơi Này Có Anh",               artist:"Sơn Tùng M-TP",          plays:"5.9M", duration:238, dur:"3:58", bg:"linear-gradient(135deg,#0a2e1a,#1a5e3a)", genre:"vpop",   soundCloudUrl:"https://soundcloud.com/vpoppamtio/noi-nay-co-anh", image: "images/Nơi_này_có_anh_-_Single_Cover.jpg" },
  { id:4,  rank:4,  name:"Người Lạ Ơi",                  artist:"Karik & Orange",          plays:"5.1M", duration:265, dur:"4:25", bg:"linear-gradient(135deg,#2e1a0a,#5e3a1a)", genre:"vpop",   soundCloudUrl:"https://soundcloud.com/user-55508202/nguoi-la-oi", image: "images/nguoi_la_oi.jpg" },
  { id:5,  rank:5,  name:"Một Triệu Like",               artist:"Đen Vâu, Thành Đồng",    plays:"4.8M", duration:210, dur:"3:30", bg:"linear-gradient(135deg,#0a0a0a,#2a2a2a)", genre:"vpop", soundCloudUrl:"https://soundcloud.com/den1305/den-mot-trieu-like-ft-thanh-dong", image: "images/mot_trieu_like.webp" },
  { id:6,  rank:6,  name:"Đừng Lo Anh Đợi Mà",           artist:"Mr Siro",                plays:"4.5M", duration:220, dur:"3:40", bg:"linear-gradient(135deg,#0a1a3e,#1a2a5e)", genre:"vpop", soundCloudUrl:"https://soundcloud.com/user-553628931/dung-lo-anh-doi-ma-mr-siro", image: "images/Dung_lo_anh_doi ma.jpg" },
  { id:7,  rank:7,  name:"Đi Để Trở Về",                 artist:"Soobin Hoàng Sơn",       plays:"4.3M", duration:215, dur:"3:35", bg:"linear-gradient(135deg,#1a2e0a,#2e4e1a)", genre:"vpop",   soundCloudUrl:"https://soundcloud.com/vpoppamtio/di-de-tro-ve", image: "images/di_de_tro_ve.jpg" },
  { id:8,  rank:8,  name:"Ngày Đầu Tiên",                artist:"Đức Phúc",                plays:"4.1M", duration:210, dur:"3:30", bg:"linear-gradient(135deg,#2e0a1a,#4e1a2e)", genre:"vpop", soundCloudUrl:"https://soundcloud.com/user-948647771/ngay-dau-tien-duc-phuc-official-music-valentine-2022", image: "images/ngay_dau_tien.jpg" },
  { id:11, rank:11, name:"Từng Quen",                    artist:"Wren Evans",              plays:"3.5M", duration:210, dur:"3:30", bg:"linear-gradient(135deg,#0a2e2e,#1a4e4e)", genre:"vpop", soundCloudUrl:"https://soundcloud.com/tran-nguyen-thanh-mai/y2matecom-wren-evans-tung-quen-official-audio-audiotrimmercom", image: "images/tung_quen.jpg" },
  { id:12, rank:12, name:"Lối Nhỏ",                      artist:"Đen Vâu, Phương Anh Đào", plays:"3.3M", duration:210, dur:"3:30", bg:"linear-gradient(135deg,#1a1a0a,#3a3a1a)", genre:"vpop", soundCloudUrl:"https://soundcloud.com/den1305/loi-nho", image: "images/loi_nho.jpg" },
  { id:13, rank:13, name:"Phép Màu",                     artist:"MAYDAYs, Minh Tốc",       plays:"3.1M", duration:210, dur:"3:30", bg:"linear-gradient(135deg,#2e0a1a,#4e1a2e)", genre:"vpop",    soundCloudUrl:"https://soundcloud.com/1708-ph-m-h-u-vi-t/phep-mau-dan-ca-go-ost-maydays-ft-minh-toc", image: "images/Phep_mau_ost.jpg" },
  { id:14, rank:14, name:"Từ Đó",              artist:"Phan Mạnh Quỳnh",                    plays:"2.9M", duration:234, dur:"3:54", bg:"linear-gradient(135deg,#0a0a2e,#1a1a5e)", genre:"vpop", soundCloudUrl:"https://soundcloud.com/miyeonssi/tu-do-phan-manh-quynh-mat-biec-ost", image: "images/tu_do.webp" },
  { id:15, rank:15, name:"Đi Về Nhà",           artist:"Đen Vâu, JustaTee",          plays:"2.7M", duration:195, dur:"3:15", bg:"linear-gradient(135deg,#0a2e0a,#1a5e1a)", genre:"vpop",   soundCloudUrl:"https://soundcloud.com/den1305/den-x-justatee-di-ve-nha", image: "images/di_ve_nha.jpg" },
  { id:16, rank:16, name:"Sóng Gió",             artist:"K-ICM, Jack", plays:"2.5M", duration:258, dur:"4:18", bg:"linear-gradient(135deg,#1a0a0a,#3a1a1a)", genre:"vpop", soundCloudUrl:"https://soundcloud.com/nguyenbaokhanhkicm/song-gio-k-icm-x-jack", image: "" },
  { id:17, rank:17, name:"Nấu Ăn Cho Em",         artist:"Đen Vâu,PiaLinh",          plays:"2.3M", duration:204, dur:"3:24", bg:"linear-gradient(135deg,#2e0a2a,#5e1a1a)", genre:"vpop",   soundCloudUrl:"https://soundcloud.com/h-ng-ph-ng-duy-546609611/9582b794-ad70-42b3-b90e", image: "" },
  { id:18, rank:18, name:"Bạc Phận",           artist:"K-ICM, Jack",                plays:"2.1M", duration:218, dur:"3:38", bg:"linear-gradient(135deg,#1a1a2e,#2a2a4e)", genre:"vpop",    soundCloudUrl:"https://soundcloud.com/user-234099171/b-c-ph-n-1", image: "" },
  { id:19, rank:19, name:"Thích Em Hơi Nhiều",           artist:"Wren Evans",              plays:"1.9M", duration:195, dur:"3:15", bg:"linear-gradient(135deg,#2e0a2e,#4e1a4e)", genre:"vpop",    soundCloudUrl:"https://soundcloud.com/tphuong-asher/thich-em-hoi-nhieu", image: "" },
  { id:20, rank:20, name:"Bắc Bling",                   artist:"Hoà Minzy, Tuấn Cry, NS Xuân Hinh, Masew",             plays:"1.7M", duration:210, dur:"3:30", bg:"linear-gradient(135deg,#0a0a0a,#1a1a1a)", genre:"vpop", soundCloudUrl:"https://soundcloud.com/ducat-05/b-c-bling", image: "" },

  // --- CHILL ---
  { id:9,  rank:9,  name:"Bài Này Chill Phết",           artist:"Đen Vâu, MIN",            plays:"3.9M", duration:210, dur:"3:30", bg:"linear-gradient(135deg,#0a2e1a,#1a4e2a)", genre:"chill",  soundCloudUrl:"https://soundcloud.com/den1305/bai-nay-chill-phet", image: "" },
  { id:10, rank:10, name:"Chuyện Đôi Ta",                artist:"Emcee L, Muộii",          plays:"3.7M", duration:210, dur:"3:30", bg:"linear-gradient(135deg,#1a0a2e,#2e1a4e)", genre:"chill",  soundCloudUrl:"https://soundcloud.com/minh-ph-789763242/chuyen-doi-ta-emcee-l-ft-muoii-lofi-ver", image: "" },
  // --- BALLAD ---
  // --- ROCK ---
  // --- BALLAD ---
  // --- HIP-HOP ---
  // --- EDM ---
  { id:21, rank:21, name:"Fly Away",                   artist:"TheFatRat",             plays:"1.7M", duration:210, dur:"3:30", bg:"linear-gradient(135deg,#0a0a0a,#1a1a1a)", genre:"edm", soundCloudUrl:"https://soundcloud.com/thefatrat/thefatrat-fly-away-feat-anjulie", image: "" },
  // --- JAZZ ---
  // --- LOFI ---
  // --- REMIX ---
  // --- INDIE ---
  // --- RAP ---
  // --- J-POP ---
  // --- K-POP ---
];

window.ARTISTS_DATA = [
  { id:1, name:"Sơn Tùng M-TP",   genre:"V-Pop",      followers:"5.2M", songs:6,  bg:"linear-gradient(135deg,#1a0a2e,#3a1a5e)", image: "https://upload.wikimedia.org/wikipedia/commons/e/e5/S%C6%A1n_T%C3%B9ng_M-TP_at_the_Sheraton_Saigon_Hotel_%281%29.png" },
  { id:2, name:"Đen Vâu",          genre:"Hip-hop",    followers:"3.1M", songs:4,  bg:"linear-gradient(135deg,#0a0a0a,#2a2a2a)", image: "https://i1.sndcdn.com/avatars-000570530754-0l2e6k-t500x500.jpg" },
  { id:3, name:"MONO",             genre:"Ballad",     followers:"2.8M", songs:3,  bg:"linear-gradient(135deg,#0a1a2e,#1a2a4e)", image: "https://i1.sndcdn.com/avatars-000854425666-4m4n4n-t500x500.jpg" },
  { id:4, name:"Wren Evans",       genre:"R&B/Pop",    followers:"2.1M", songs:3,  bg:"linear-gradient(135deg,#0a2e2e,#1a4e4e)", image: "https://i1.sndcdn.com/avatars-I7B99K09ZlM6E7I3-o0o5cw-t500x500.jpg" },
  { id:5, name:"Karik",            genre:"Hip-hop",    followers:"1.9M", songs:2,  bg:"linear-gradient(135deg,#2e1a0a,#4e2a1a)", image: "" },
  { id:6, name:"Vũ Cát Tường",     genre:"Pop/Ballad", followers:"1.7M", songs:2,  bg:"linear-gradient(135deg,#2e0a1a,#4e1a2e)", image: "" },
  { id:7, name:"Soobin Hoàng Sơn", genre:"V-Pop",      followers:"1.5M", songs:2,  bg:"linear-gradient(135deg,#1a2e0a,#3a4e1a)", image: "" },
  { id:8, name:"Mr Siro",          genre:"Ballad",     followers:"1.3M", songs:2,  bg:"linear-gradient(135deg,#0a1a3e,#1a2a5e)", image: "" },
];

window.ALBUMS_DATA = [
  { id:1, name:"Sky Tour",             artist:"Sơn Tùng M-TP",  year:2019, bg:"linear-gradient(135deg,#1a0a2e,#3a1a5e)", genre:"vpop", image: "" },
  { id:2, name:"Độc Âm",               artist:"MONO",            year:2022, bg:"linear-gradient(135deg,#0a1a2e,#1a2a4e)", genre:"ballad", image: "" },
  { id:3, name:"Bước Qua Mùa Cô Đơn", artist:"Vũ Cát Tường",    year:2021, bg:"linear-gradient(135deg,#2e0a1a,#4e1a2e)", genre:"pop", image: "" },
  { id:4, name:"Rap Việt Collection",  artist:"Various Artists", year:2023, bg:"linear-gradient(135deg,#0a0a0a,#2a2a2a)", genre:"hiphop", image: "" },
  { id:5, name:"Cá Hồi Hoang",        artist:"Cá Hồi Hoang",    year:2022, bg:"linear-gradient(135deg,#0a2e2e,#1a4e4e)", genre:"rock", image: "" },
  { id:6, name:"Mixtape Chill",        artist:"Various Artists", year:2024, bg:"linear-gradient(135deg,#0a2e1a,#1a4e2a)", genre:"chill", image: "" },
];
