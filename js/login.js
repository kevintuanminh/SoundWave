let users = JSON.parse(localStorage.getItem('users')) || [];

if (users.length === 0) {
  users.push({
    username: "demo",
    email: "demo@example.com",
    password: "123456"
  });
  localStorage.setItem('users', JSON.stringify(users));
}

document.addEventListener('DOMContentLoaded', () => {
  const registerBtn = document.getElementById('registerBtn');
  if (registerBtn) {
    registerBtn.addEventListener('click', () => {
      const username = document.getElementById('regUsername').value.trim();
      const email = document.getElementById('regEmail').value.trim();
      const password = document.getElementById('regPassword').value;
      const confirmPassword = document.getElementById('regConfirmPassword').value;

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

      if (users.find(u => u.email === email)) {
        alert('Email đã được đăng ký!');
        return;
      }
      if (users.find(u => u.username === username)) {
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

  const loginBtn = document.getElementById('loginBtn');
  if (loginBtn) {
    loginBtn.addEventListener('click', () => {
      const usernameOrEmail = document.getElementById('loginUsername').value.trim();
      const password = document.getElementById('loginPassword').value;

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

      localStorage.setItem('username', user.username);

      const page = document.getElementById('loginPage');
      if (page) page.classList.add('fade-out');
      
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 400);
    });
  }

  const forgotBtn = document.getElementById('forgotBtn');
  const forgotModal = document.getElementById('forgotModal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const resetPasswordBtn = document.getElementById('resetPasswordBtn');

  if (forgotBtn && forgotModal) {
    forgotBtn.onclick = (e) => {
      e.preventDefault();
      forgotModal.style.display = 'flex';
    };
  }

  if (closeModalBtn && forgotModal) {
    closeModalBtn.onclick = () => {
      forgotModal.style.display = 'none';
    };
  }

  if (resetPasswordBtn) {
    resetPasswordBtn.onclick = () => {
      const email = document.getElementById('forgotEmail').value.trim();
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
    };
  }

  document.querySelectorAll('input').forEach(input => {
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        if (loginBtn) loginBtn.click();
        else if (registerBtn) registerBtn.click();
      }
    });
  });
});