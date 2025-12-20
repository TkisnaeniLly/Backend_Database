const crypto = require("crypto");
const { User, EmailVerification } = require("../../Models");

const renderPage = (title, message, icon = "success") => {
  return `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
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
      height: 100vh;
      background: linear-gradient(135deg, var(--cream), var(--sage));
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: "Segoe UI", sans-serif;
    }
  </style>
</head>
<body>

<script>
  Swal.fire({
    title: "${title}",
    text: "${message}",
    icon: "${icon}",
    confirmButtonColor: "#9cafaa",
    background: "#fbf3d5",
    color: "#333333",
    timer: 3000,
    timerProgressBar: true,
    allowOutsideClick: false,
    allowEscapeKey: false,
    showConfirmButton: false
  }).then(() => {
    window.location.href = "https://tishop.naxgrinting.my.id";
  });
</script>

</body>
</html>
`;
};

const VerifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.send(
        renderPage(
          "Verifikasi Gagal",
          "Token verifikasi tidak ditemukan.",
          "error"
        )
      );
    }

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    const verification = await EmailVerification.findOne({
      where: { token_hash: tokenHash },
    });

    if (!verification) {
      return res.send(
        renderPage("Verifikasi Gagal", "Token verifikasi tidak valid.", "error")
      );
    }

    if (verification.verified_at) {
      return res.send(
        renderPage(
          "Email Sudah Diverifikasi",
          "Akun Anda sudah aktif sebelumnya.",
          "info"
        )
      );
    }

    if (new Date() > verification.expired_at) {
      return res.send(
        renderPage(
          "Verifikasi Kedaluwarsa",
          "Token verifikasi sudah kedaluwarsa.",
          "error"
        )
      );
    }

    const user = await User.findByPk(verification.user_id);

    if (!user) {
      return res.send(
        renderPage("Verifikasi Gagal", "User tidak ditemukan.", "error")
      );
    }

    user.status_akun = "active";
    await user.save();

    verification.verified_at = new Date();
    await verification.save();

    return res.send(
      renderPage(
        "Verifikasi Berhasil",
        "Email berhasil diverifikasi. Akun Anda sudah aktif.",
        "success"
      )
    );
  } catch (error) {
    console.error("Error VerifyEmail Controller:", error);
    return res.send(
      renderPage(
        "Terjadi Kesalahan",
        "Internal Server Error. Silakan coba lagi.",
        "error"
      )
    );
  }
};

module.exports = VerifyEmail;
