const {
  sequelize,
  Category,
  Brand,
  Product,
  Media,
  Variant,
  Inventory,
} = require("../Models");

const catalogSeeder = async () => {
  const transaction = await sequelize.transaction();

  try {
    // =========================
    // SYNC TABLE
    // =========================
    await sequelize.sync({ alter: true });

    // =========================
    // CLEAR DATA (PAKAI DELETE, BUKAN TRUNCATE)
    // URUTAN CHILD -> PARENT
    // =========================
    await Inventory.destroy({ where: {}, transaction });
    await Variant.destroy({ where: {}, transaction });
    await Media.destroy({ where: {}, transaction });
    await Product.destroy({ where: {}, transaction });
    await Category.destroy({ where: {}, transaction });
    await Brand.destroy({ where: {}, transaction });

    // =========================
    // CATEGORY
    // =========================
    const categories = await Category.bulkCreate(
      [
        { category_name: "T-Shirt" },
        { category_name: "Jaket" },
        { category_name: "Celana" },
        { category_name: "Sepatu" },
        { category_name: "Aksesoris" },
      ],
      { transaction }
    );

    // =========================
    // BRAND
    // =========================
    const brands = await Brand.bulkCreate(
      [
        { brand_name: "Erigo", origin_country: "Indonesia" },
        { brand_name: "Roughneck 1991", origin_country: "Indonesia" },
        { brand_name: "Compass", origin_country: "Indonesia" },
        { brand_name: "Thanksinsomnia", origin_country: "Indonesia" },
      ],
      { transaction }
    );

    // =========================
    // PRODUCT (AUTO SLUG VIA HOOK)
    // =========================
    const products = await Product.bulkCreate(
      [
        {
          product_name: "Erigo T-Shirt Basic Oversize",
          description:
            "Kaos oversize bahan cotton combed 24s, nyaman dipakai harian.",
          category_id: categories[0].id,
          brand_id: brands[0].id,
        },
        {
          product_name: "Roughneck Varsity Jacket",
          description:
            "Jaket varsity dengan bahan fleece tebal, cocok untuk cuaca dingin.",
          category_id: categories[1].id,
          brand_id: brands[1].id,
        },
        {
          product_name: "Compass Gazelle Low Black White",
          description:
            "Sepatu lokal premium dengan desain klasik dan sol kuat.",
          category_id: categories[3].id,
          brand_id: brands[2].id,
        },
      ],
      {
        transaction,
        individualHooks: true, // ⬅ PENTING supaya slug ke-generate
      }
    );

    // =========================
    // MEDIA
    // =========================
    await Media.bulkCreate(
      [
        {
          product_id: products[0].id,
          media_url: "/images/products/erigo-tshirt-1.jpg",
          position: 1,
        },
        {
          product_id: products[1].id,
          media_url: "/images/products/roughneck-jacket-1.jpg",
          position: 1,
        },
        {
          product_id: products[2].id,
          media_url: "/images/products/compass-gazelle-1.jpg",
          position: 1,
        },
      ],
      { transaction }
    );

    // =========================
    // VARIANT & INVENTORY
    // =========================
    const tshirtVariants = await Variant.bulkCreate(
      [
        {
          product_id: products[0].id,
          variant_type: "SIZE",
          variant_value: "M",
          price: 99000,
        },
        {
          product_id: products[0].id,
          variant_type: "SIZE",
          variant_value: "L",
          price: 99000,
        },
      ],
      { transaction }
    );

    for (const variant of tshirtVariants) {
      await Inventory.create(
        {
          variant_id: variant.id,
          stock_qty: 50,
          stock_minimum: 5,
          stock_status: "AVAILABLE",
        },
        { transaction }
      );
    }

    const sepatuVariant = await Variant.create(
      {
        product_id: products[2].id,
        variant_type: "SIZE",
        variant_value: "42",
        price: 698000,
      },
      { transaction }
    );

    await Inventory.create(
      {
        variant_id: sepatuVariant.id,
        stock_qty: 20,
        stock_minimum: 3,
        stock_status: "AVAILABLE",
      },
      { transaction }
    );

    await transaction.commit();
    console.log("✅ Catalog seeder berhasil dijalankan");
  } catch (error) {
    await transaction.rollback();
    console.error("❌ Catalog seeder error:", error);
  }
};

(async () => {
  await catalogSeeder();
  process.exit(0);
})();
