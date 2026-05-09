// Lấy dữ liệu users từ localStorage
let users = JSON.parse(localStorage.getItem('users')) || [];

// Kiểm tra đã có tài khoản mặc định chưa
if (users.length === 0) {
  users.push({
    username: "demo",
    email: "demo@example.com",
    password: "123456"
  });
  localStorage.setItem('users', JSON.stringify(users));
}

// DOM elements
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const forgotModal = document.getElementById('forgotModal');

const loginUsername = document.getElementById('loginUsername');
const loginPassword = document.getElementById('loginPassword');
const loginBtn = document.getElementById('loginBtn');

const regUsername = document.getElementById('regUsername');
const regEmail = document.getElementById('regEmail');
const regPassword = document.getElementById('regPassword');
const regConfirmPassword = document.getElementById('regConfirmPassword');
const registerBtn = document.getElementById('registerBtn');

const showRegisterBtn = document.getElementById('showRegisterBtn');
const showLoginBtn = document.getElementById('showLoginBtn');
const forgotBtn = document.getElementById('forgotBtn');
const closeModalBtn = document.getElementById('closeModalBtn');
const resetPasswordBtn = document.getElementById('resetPasswordBtn');
const forgotEmail = document.getElementById('forgotEmail');

// Hiển thị form đăng ký
if (showRegisterBtn) {
  showRegisterBtn.addEventListener('click', (e) => {
    // Để href tự chuyển trang
  });
}

// Hiển thị form đăng nhập
if (showLoginBtn) {
  showLoginBtn.addEventListener('click', (e) => {
    // Để href tự chuyển trang
  });
}

// Đăng ký
if (registerBtn) {
  registerBtn.addEventListener('click', () => {
    const username = regUsername.value.trim();
    const email = regEmail.value.trim();
    const password = regPassword.value;
    const confirmPassword = regConfirmPassword.value;

    if (!username || !email || !password) {
      alert('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    if (password !== confirmPassword) {
      alert('Mật khẩu xác nhận không khớp!');
      return;
    }

    if (password.length < 6) {
      alert('Mật khẩu phải có ít nhất 6 ký tự!');
      return;
    }

    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      alert('Email đã được đăng ký!');
      return;
    }

    const existingUsername = users.find(u => u.username === username);
    if (existingUsername) {
      alert('Tên người dùng đã tồn tại!');
      return;
    }

    const newUser = {
      username: username,
      email: email,
      password: password,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    alert('Đăng ký thành công! Đang chuyển hướng sang trang đăng nhập...');
    window.location.href = 'login.html';
  });
}

// Đăng nhập
if (loginBtn) {
  loginBtn.addEventListener('click', () => {
    const usernameOrEmail = loginUsername.value.trim();
    const password = loginPassword.value;

    if (!usernameOrEmail || !password) {
      alert('Vui lòng nhập tên đăng nhập/email và mật khẩu!');
      return;
    }

    const user = users.find(u => u.email === usernameOrEmail || u.username === usernameOrEmail);

    if (!user) {
      alert('Tài khoản không tồn tại! Vui lòng đăng ký.');
      return;
    }

    if (user.password !== password) {
      alert('Mật khẩu không chính xác!');
      return;
    }

    // Lưu tên đăng nhập
    localStorage.setItem('username', user.username);

    // Chuyển sang trang chủ
    document.getElementById('loginPage').classList.add('fade-out');
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 400);
  });
}

// Modal quên mật khẩu
if (forgotBtn) {
  forgotBtn.addEventListener('click', (e) => {
    e.preventDefault();
    forgotModal.style.display = 'flex';
  });
}

if (closeModalBtn) {
  closeModalBtn.addEventListener('click', () => {
    forgotModal.style.display = 'none';
  });
}

window.addEventListener('click', (e) => {
  if (e.target === forgotModal) {
    forgotModal.style.display = 'none';
  }
});

// Xử lý quên mật khẩu
if (resetPasswordBtn) {
  resetPasswordBtn.addEventListener('click', () => {
    const email = forgotEmail.value.trim();

    if (!email) {
      alert('Vui lòng nhập email!');
      return;
    }

    const user = users.find(u => u.email === email);

    if (!user) {
      alert('Email không tồn tại trong hệ thống!');
      return;
    }

    const newPassword = Math.random().toString(36).slice(-8);
    user.password = newPassword;
    localStorage.setItem('users', JSON.stringify(users));

    alert(`Mật khẩu mới của bạn là: ${newPassword}\nVui lòng đăng nhập và đổi mật khẩu sau.`);
    forgotModal.style.display = 'none';
    forgotEmail.value = '';
  });
}

// Enter key support
const inputs = [loginUsername, loginPassword, regUsername, regEmail, regPassword, regConfirmPassword];
inputs.forEach(input => {
  if (input) {
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        if (loginForm && loginForm.style.display !== 'none') {
          loginBtn.click();
        } else if (registerForm && registerForm.style.display !== 'none') {
          registerBtn.click();
        }
      }
    });
  }
});