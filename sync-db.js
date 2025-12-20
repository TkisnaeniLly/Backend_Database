const { sequelize } = require("./src/Models");

async function syncDatabase() {
  try {
    await sequelize.authenticate();
    console.log("✅ Koneksi database berhasil");

    await sequelize.sync({
      alter: false,
      force: false,
    });

    console.log("✅ Sinkronisasi database selesai");
  } catch (error) {
    console.error("❌ Gagal sinkronisasi database:", error);
  } finally {
    await sequelize.close();
    process.exit();
  }
}

syncDatabase();
