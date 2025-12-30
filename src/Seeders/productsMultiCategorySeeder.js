const {
  sequelize,
  Category,
  Brand,
  Product,
  Media,
  Variant,
  Inventory,
  ProductCategory,
} = require("../Models");

const productsMultiCategorySeeder = async () => {
  const transaction = await sequelize.transaction();

  try {
    await sequelize.sync({ alter: true });

    // Ensure categories exist
    const categoryNames = [
      "T-Shirt",
      "Jaket",
      "Celana",
      "Sepatu",
      "Aksesoris",
      "Hoodie",
      "Outer",
    ];

    const categories = {};
    for (const name of categoryNames) {
      const [c] = await Category.findOrCreate({
        where: { category_name: name },
        defaults: { category_name: name },
        transaction,
      });
      categories[name] = c;
    }

    // Ensure brand exists
    const [brand] = await Brand.findOrCreate({
      where: { brand_name: "SeedBrand" },
      defaults: { brand_name: "SeedBrand", origin_country: "NA" },
      transaction,
    });

    // Define products with desired category associations (2-3 each)
    const seedProducts = [
      {
        product_name: "Multi T-Shirt Alpha",
        description: "Kaos serbaguna, cocok untuk aktivitas harian.",
        categories: ["T-Shirt", "Aksesoris"],
      },
      {
        product_name: "Alpha Hoodie",
        description: "Hoodie nyaman dengan bahan tebal.",
        categories: ["Hoodie", "Outer", "Aksesoris"],
      },
      {
        product_name: "Runner Sepatu Pro",
        description: "Sepatu lari premium, ringan dan tahan lama.",
        categories: ["Sepatu", "Celana"],
      },
      {
        product_name: "Varsity Jacket Classic",
        description: "Jaket varsity gaya klasik.",
        categories: ["Jaket", "Outer"],
      },
    ];

    for (const p of seedProducts) {
      // create product if not exists
      let product = await Product.findOne({
        where: { product_name: p.product_name },
        transaction,
      });
      if (!product) {
        product = await Product.create(
          {
            product_name: p.product_name,
            description: p.description,
            // keep category_id compatible: set to first category id
            category_id: categories[p.categories[0]].id,
            brand_id: brand.id,
          },
          { transaction, individualHooks: true }
        );

        // add a default media
        await Media.create(
          {
            product_id: product.id,
            media_url: `/images/products/${
              product.slug ||
              product.product_name.replace(/\s+/g, "-").toLowerCase()
            }.jpg`,
            position: 1,
          },
          { transaction }
        );

        // add one variant and inventory
        const variant = await Variant.create(
          {
            product_id: product.id,
            variant_type: "SIZE",
            variant_value: "M",
            price: 100000,
          },
          { transaction }
        );

        await Inventory.create(
          {
            variant_id: variant.id,
            stock_qty: 100,
            stock_minimum: 1,
            stock_status: "AVAILABLE",
          },
          { transaction }
        );
      }

      // link product to categories (2-3)
      for (const cname of p.categories) {
        const cat = categories[cname];
        if (!cat) continue;
        await ProductCategory.findOrCreate({
          where: { product_id: product.id, category_id: cat.id },
          defaults: { product_id: product.id, category_id: cat.id },
          transaction,
        });
      }
    }

    await transaction.commit();
    console.log("✅ productsMultiCategorySeeder berhasil dijalankan");
  } catch (error) {
    await transaction.rollback();
    console.error("❌ productsMultiCategorySeeder error:", error);
  }
};

(async () => {
  await productsMultiCategorySeeder();
  process.exit(0);
})();
