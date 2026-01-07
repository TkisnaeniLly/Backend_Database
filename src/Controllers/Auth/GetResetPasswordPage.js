const { ResetPassword } = require("../../Models");

const renderResetHasPage = (token, error = null) => {
  return `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Password</title>
  <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
  <style>
    :root {
      --rose: #d6a99d;
      --cream: #fbf3d5;
      --sage: #d6dac8;
      --teal: #9cafaa;
      --dark: #2c2c2c;
      --darker: #1a1a1a;
      --text-light: #f5f5f5;
      --text-dark: #333333;
      --gold: #c9a962;
    }

    body {
      margin: 0;
      min-height: 100vh;
      background: linear-gradient(135deg, var(--cream), var(--sage));
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: "Segoe UI", sans-serif;
      color: var(--text-dark);
    }

    .container {
      background: rgba(255, 255, 255, 0.9);
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
      width: 100%;
      max-width: 400px;
      backdrop-filter: blur(10px);
    }

    h2 {
      text-align: center;
      color: var(--teal);
      margin-bottom: 1.5rem;
    }

    .form-group {
      margin-bottom: 1rem;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
    }

    input {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid var(--sage);
      border-radius: 6px;
      box-sizing: border-box;
      font-size: 1rem;
      transition: border-color 0.3s;
    }

    input:focus {
      outline: none;
      border-color: var(--teal);
    }

    .otp-container {
      display: flex;
      gap: 10px;
    }

    .otp-container input {
      flex: 1;
    }

    .btn {
      width: 100%;
      padding: 0.75rem;
      border: none;
      border-radius: 6px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.3s, transform 0.1s;
    }

    .btn-primary {
      background: var(--teal);
      color: white;
      margin-top: 1rem;
    }

    .btn-primary:hover {
      background: #879997;
    }

    .btn-secondary {
      background: var(--rose);
      color: white;
      font-size: 0.875rem;
      width: auto;
      padding: 0.75rem 1rem;
    }
    
    .btn-secondary:hover {
        background: #c5988d;
    }

    .hidden {
      display: none;
    }
  </style>
</head>
<body>

<div class="container">
  <h2>Reset Password</h2>
  
  <form id="resetForm">
    <input type="hidden" id="token" value="${token}">
    
    <div class="form-group">
      <label for="password">Password Baru</label>
      <input type="password" id="password" required placeholder="Minimal 6 karakter">
    </div>

    <div class="form-group">
      <label for="confirmPassword">Konfirmasi Password</label>
      <input type="password" id="confirmPassword" required placeholder="Ulangi password">
    </div>

    <div class="form-group">
      <label for="otp">Kode OTP</label>
      <div class="otp-container">
        <input type="text" id="otp" placeholder="Masukkan 6 digit OTP" maxlength="6" required>
        <button type="button" id="btnRequestOtp" class="btn btn-secondary">Minta OTP</button>
      </div>
      <small style="color: #666; display: block; margin-top: 5px;">Klik "Minta OTP" jika Anda belum menerimanya.</small>
    </div>

    <button type="submit" class="btn btn-primary" id="btnSubmit">Reset Password</button>
  </form>
</div>

<script>
  const token = document.getElementById('token').value;
  const btnRequestOtp = document.getElementById('btnRequestOtp');
  const resetForm = document.getElementById('resetForm');
  const btnSubmit = document.getElementById('btnSubmit');

  // Request OTP Handler
  btnRequestOtp.addEventListener('click', async () => {
    btnRequestOtp.disabled = true;
    btnRequestOtp.innerText = "Mengirim...";

    try {
      const res = await fetch('/api/auth/request-reset-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      });

      const data = await res.json();

      if (res.ok) {
        Swal.fire('Berhasil', data.message, 'success');
        // Disable button for 60 seconds
        let countdown = 60;
        const interval = setInterval(() => {
            btnRequestOtp.innerText = \`Tunggu \${countdown}s\`;
            countdown--;
            if (countdown < 0) {
                clearInterval(interval);
                btnRequestOtp.disabled = false;
                btnRequestOtp.innerText = "Minta OTP";
            }
        }, 1000);
      } else {
        Swal.fire('Gagal', data.message || 'Gagal mengirim OTP', 'error');
        btnRequestOtp.disabled = false;
        btnRequestOtp.innerText = "Minta OTP";
      }
    } catch (err) {
      Swal.fire('Error', 'Terjadi kesalahan jaringan', 'error');
      btnRequestOtp.disabled = false;
        btnRequestOtp.innerText = "Minta OTP";
    }
  });

  // Submit Reset Form Handler
  resetForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const otp = document.getElementById('otp').value;

    if (password !== confirmPassword) {
      return Swal.fire('Error', 'Password dan Konfirmasi Password tidak sama', 'error');
    }

    if (password.length < 6) {
        return Swal.fire('Error', 'Password minimal 6 karakter', 'error');
    }

    btnSubmit.disabled = true;
    btnSubmit.innerText = "Memproses...";

    try {
      const res = await fetch('/api/auth/execute-reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, otp, password, confirmPassword })
      });

      const data = await res.json();

      if (res.ok) {
        await Swal.fire({
          title: 'Berhasil',
          text: data.message,
          icon: 'success',
          confirmButtonText: 'Login Sekarang',
           confirmButtonColor: "#9cafaa",
        });
        window.location.href = "http://localhost:5173/login";
      } else {
        Swal.fire('Gagal', data.message || 'Gagal mereset password', 'error');
        btnSubmit.disabled = false;
        btnSubmit.innerText = "Reset Password";
      }
    } catch (err) {
      Swal.fire('Error', 'Terjadi kesalahan jaringan', 'error');
      btnSubmit.disabled = false;
      btnSubmit.innerText = "Reset Password";
    }
  });
</script>

</body>
</html>
  `;
};

const GetResetPasswordPage = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).send("Token tidak ditemukan.");
    }

    // Optional: Check if token exists in DB to show specific error page
    const resetData = await ResetPassword.findOne({
      where: { token, is_used: false },
    });

    if (!resetData) {
      return res.status(404).send(`
            <div style="text-align:center; padding: 50px; font-family: sans-serif;">
                <h1>Halaman Tidak Ditemukan</h1>
                <p>Token reset password tidak valid atau sudah kadaluarsa.</p>
            </div>
         `);
    }

    return res.send(renderResetHasPage(token));
  } catch (error) {
    console.error("Error GetResetPasswordPage:", error);
    return res.status(500).send("Terjadi kesalahan pada server.");
  }
};

module.exports = GetResetPasswordPage;
