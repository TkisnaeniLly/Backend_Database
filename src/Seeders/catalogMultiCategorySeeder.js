const {
  sequelize,
  Product,
  Category,
  ProductCategory,
  Brand,
} = require("../Models");

const catalogMultiCategorySeeder = async () => {
  const transaction = await sequelize.transaction();

  try {
    // Ensure tables exist (create product_categories if missing)
    await sequelize.sync({ alter: true });

    // Clear join table
    await ProductCategory.destroy({ where: {}, transaction });

    // Ensure some categories exist (if repository hasn't run the main seeder)
    const existingCategories = await Category.findAll({ transaction });
    if (existingCategories.length === 0) {
      await Category.bulkCreate(
        [
          { category_name: "T-Shirt" },
          { category_name: "Jaket" },
          { category_name: "Celana" },
          { category_name: "Sepatu" },
          { category_name: "Aksesoris" },
        ],
        { transaction }
      );
    }

    // Ensure at least one brand exists for product creation
    const brands = await Brand.findAll({ transaction });
    if (brands.length === 0) {
      await Brand.create(
        { brand_name: "SeedBrand", origin_country: "NA" },
        { transaction }
      );
    }

    // Ensure some products exist
    const existingProducts = await Product.findAll({ transaction });
    if (existingProducts.length === 0) {
      const brand =
        (await Brand.findOne({ transaction })) ||
        (await Brand.create(
          { brand_name: "SeedBrand", origin_country: "NA" },
          { transaction }
        ));
      await Product.bulkCreate(
        [
          {
            product_name: "Seeded T-Shirt",
            category_id: 1,
            brand_id: brand.id,
          },
          { product_name: "Seeded Jacket", category_id: 2, brand_id: brand.id },
          {
            product_name: "Seeded Sneaker",
            category_id: 4,
            brand_id: brand.id,
          },
        ],
        { transaction, individualHooks: true }
      );
    }

    // Re-fetch fresh lists
    const categories = await Category.findAll({ transaction });
    const products = await Product.findAll({ transaction });

    // Helper maps
    const catByName = {};
    for (const c of categories) catByName[c.category_name] = c.id;
    const prodByName = {};
    for (const p of products) prodByName[p.product_name] = p.id;

    // Define associations (product_name -> [category_name,...])
    const mappings = [
      {
        product: Object.keys(prodByName)[0],
        categories: ["T-Shirt", "Aksesoris"],
      },
      {
        product: Object.keys(prodByName)[1],
        categories: ["Jaket", "Aksesoris"],
      },
      { product: Object.keys(prodByName)[2], categories: ["Sepatu", "Celana"] },
    ];

    const rows = [];
    for (const m of mappings) {
      if (!m.product) continue;
      const pid = prodByName[m.product];
      for (const cname of m.categories) {
        const cid = catByName[cname];
        if (pid && cid) rows.push({ product_id: pid, category_id: cid });
      }
    }

    if (rows.length > 0) {
      await ProductCategory.bulkCreate(rows, {
        transaction,
        ignoreDuplicates: true,
      });
    }

    await transaction.commit();
    console.log("✅ catalogMultiCategorySeeder berhasil dijalankan");
  } catch (error) {
    await transaction.rollback();
    console.error("❌ catalogMultiCategorySeeder error:", error);
  }
};

(async () => {
  await catalogMultiCategorySeeder();
  process.exit(0);
})();
