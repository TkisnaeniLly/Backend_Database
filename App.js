require("dotenv").config();
require("module-alias/register");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { exec } = require("child_process");
const methodOverride = require("method-override");
const os = require("os");
const path = require("path");
const fs = require("fs");
const Log = require("./src/Middlewares/Log");
const errorHandler = require("./src/Middlewares/errorHandlers");
const port = process.env.PORT || 5000;
const app = express();

// USE
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());
app.use(Log("semua"));
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGIN,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(methodOverride("_method"));

const aliasesDir = path.join(__dirname, "./src/Libs");
fs.readdirSync(aliasesDir).forEach((file) => {
  if (file.endsWith(".js")) {
    const registerFunction = require(path.join(aliasesDir, file));
    if (typeof registerFunction === "function") {
      registerFunction();
      console.log(`Registered aliases from ${file}`);
    }
  }
});

app.use("/public", express.static(path.join(__dirname, "/src/Assets/Public")));
app.use(
  "/images",
  express.static(path.join(__dirname, "/src/Assets/Public/images"))
);

const apiRoutes = require("./src/Routes/index");
app.use("/api", apiRoutes);

// Tangkap 404 (wajib sebelum errorHandler)
app.use((req, res, next) => {
  next({ status: 404, message: "❌ Halaman tidak ditemukan" });
});

// Tangani semua error
app.use(errorHandler);

const startServer = () => {
  const server = app.listen(port, "0.0.0.0", () => {
    console.log(`🚀 Server running on port ${port}`);
  });

  server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.log(`Port ${port} sudah digunakan`);
      if (os.platform() === "win32") {
        exec(`netstat -a -n -o | find "${port}"`, (error, stdout) => {
          if (error) {
            console.error(
              `Gagal menemukan proses di port ${port}: ${error.message}`
            );
            process.exit(1);
          } else if (stdout) {
            const pidMatch = stdout.match(/LISTENING\s+(\d+)/);
            if (pidMatch && pidMatch[1]) {
              const pid = pidMatch[1];
              console.log(`Menemukan proses dengan PID ${pid} di port ${port}`);
              exec(`taskkill /PID ${pid} /F`, (killError) => {
                if (killError) {
                  console.error(
                    `Gagal menghentikan proses di port ${port}: ${killError.message}`
                  );
                  process.exit(1);
                } else {
                  console.log(`Proses di port ${port} telah dihentikan`);
                  setTimeout(startServer, 1000);
                }
              });
            } else {
              console.error(`Tidak ada proses ditemukan di port ${port}`);
              process.exit(1);
            }
          } else {
            console.error(`Tidak ada proses ditemukan di port ${port}`);
            process.exit(1);
          }
        });
      } else {
        exec(`fuser -k ${port}/tcp`, (error) => {
          if (error) {
            console.error(
              `Gagal menghentikan proses di port ${port}: ${error.message}`
            );
            process.exit(1);
          } else {
            console.log(`Proses di port ${port} telah dihentikan`);
            setTimeout(startServer, 1000);
          }
        });
      }
    } else {
      console.error(`Kesalahan server: ${err.message}`);
      process.exit(1);
    }
  });
};

startServer();
