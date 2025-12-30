const { sequelize } = require("./src/Models");

async function syncDatabase() {
  try {
    await sequelize.authenticate();
    console.log("✅ Koneksi database berhasil");

    // Use alter:true to apply model changes (add columns like `is_featured`)
    await sequelize.sync({
      alter: true,
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
