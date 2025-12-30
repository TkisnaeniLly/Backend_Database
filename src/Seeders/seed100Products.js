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

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const seed100Products = async () => {
  const transaction = await sequelize.transaction();
  try {
    await sequelize.sync({ alter: true });

    // base categories to use (include primary categories)
    const primaryCategoryNames = [
      "Pria",
      "Wanita",
      "Pria & Wanita",
      "Anak-anak",
      "Bayi",
    ];
    const otherCategoryNames = [
      "T-Shirt",
      "Jaket",
      "Celana",
      "Sepatu",
      "Aksesoris",
      "Hoodie",
      "Outer",
      "Topi",
      "Socks",
      "Underwear",
    ];

    const categories = [];
    // ensure primary categories exist first
    for (const name of primaryCategoryNames.concat(otherCategoryNames)) {
      const [c] = await Category.findOrCreate({
        where: { category_name: name },
        defaults: { category_name: name },
        transaction,
      });
      categories.push(c);
    }
    const categoriesByName = {};
    for (const c of categories) categoriesByName[c.category_name] = c;

    // create some brands (more realistic names)
    const brandNames = [
      "Erigo",
      "Roughneck 1991",
      "Compass",
      "Thanksinsomnia",
      "LocalWear",
      "UrbanEdge",
      "StreetLine",
      "Nomad",
      "Atlas",
      "Pioneer",
      "Heritage",
      "Summit",
      "Cascade",
      "Horizon",
      "Vertex",
      "Momentum",
      "Lumen",
      "Epoch",
      "Vanguard",
      "Axis",
    ];
    const brands = [];
    for (const bname of brandNames) {
      const [b] = await Brand.findOrCreate({
        where: { brand_name: bname },
        defaults: { brand_name: bname, origin_country: "NA" },
        transaction,
      });
      brands.push(b);
    }

    // product types mapped to category names (help ensure correct category assignment)
    const productTypes = [
      { type: "T-Shirt", category: "T-Shirt" },
      { type: "Hoodie", category: "Hoodie" },
      { type: "Jacket", category: "Jaket" },
      { type: "Jeans", category: "Celana" },
      { type: "Sneaker", category: "Sepatu" },
      { type: "Cap", category: "Topi" },
      { type: "Socks", category: "Socks" },
      { type: "Underwear", category: "Underwear" },
      { type: "Outerwear", category: "Outer" },
      { type: "Accessory", category: "Aksesoris" },
    ];

    // We'll create 100 products
    const total = 100;
    for (let i = 1; i <= total; i++) {
      // ensure each product has a primary category (one of Pria/Wanita/Pria & Wanita/Anak-anak/Bayi)
      const primary =
        primaryCategoryNames[randInt(0, primaryCategoryNames.length - 1)];
      const primaryId = categoriesByName[primary].id;

      // pick a realistic product type
      const ptype = productTypes[randInt(0, productTypes.length - 1)];

      // choose total categories between 2 and 5 (minimum 2)
      const totalCategories = randInt(2, 5);

      // choose unique random categories, always include primary and the product type category
      const chosen = new Set();
      chosen.add(primaryId);
      const typeCategory = categoriesByName[ptype.category];
      if (typeCategory) chosen.add(typeCategory.id);

      while (chosen.size < totalCategories) {
        const idx = randInt(0, categories.length - 1);
        chosen.add(categories[idx].id);
      }
      const chosenArr = Array.from(chosen);

      const brand = brands[randInt(0, brands.length - 1)];
      // realistic name and description template
      const adjectives = [
        "Classic",
        "Premium",
        "Essential",
        "Urban",
        "Retro",
        "Sport",
        "Comfort",
        "Slim",
        "Oversize",
        "Lightweight",
      ];
      const models = [
        "Basic",
        "Pro",
        "Series X",
        "Edition",
        "Max",
        "Lite",
        "Vintage",
        "Core",
      ];
      const adj = adjectives[randInt(0, adjectives.length - 1)];
      const model = models[randInt(0, models.length - 1)];
      const productName = `${brand.brand_name} ${adj} ${ptype.type} ${model}`;
      const descriptionTemplates = [
        `Terbuat dari bahan berkualitas, nyaman dipakai sehari-hari. Cocok untuk aktivitas santai dan formal casual.`,
        `Desain modern dengan bahan yang breathable dan tahan lama. Ideal untuk penggunaan harian.`,
        `Kombinasi kenyamanan dan gaya, cocok dipadukan dengan berbagai outfit.`,
        `Bahan premium yang lembut, tidak mudah melar, perawatan mudah.`,
        `Ringan dan tahan lama, cocok untuk olahraga dan kegiatan outdoor.`,
      ];
      const productDescription = `${
        descriptionTemplates[randInt(0, descriptionTemplates.length - 1)]
      } Model: ${model}.`;

      // create product (category_id set to primary category for compatibility)
      const product = await Product.create(
        {
          product_name: productName,
          description: productDescription,
          category_id: primaryId,
          brand_id: brand.id,
        },
        { transaction, individualHooks: true }
      );

      // media
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

      // variant + inventory
      const variant = await Variant.create(
        {
          product_id: product.id,
          variant_type: "SIZE",
          variant_value: "M",
          price: randInt(50000, 500000),
        },
        { transaction }
      );

      await Inventory.create(
        {
          variant_id: variant.id,
          stock_qty: randInt(10, 200),
          stock_minimum: 1,
          stock_status: "AVAILABLE",
        },
        { transaction }
      );

      // link categories (through ProductCategory)
      for (const cid of chosenArr) {
        await ProductCategory.findOrCreate({
          where: { product_id: product.id, category_id: cid },
          defaults: { product_id: product.id, category_id: cid },
          transaction,
        });
      }
    }

    await transaction.commit();
    console.log(
      "✅ seed100Products selesai: 100 produk dibuat dengan kategori 1-5 sesuai aturan"
    );
  } catch (error) {
    await transaction.rollback();
    console.error("❌ seed100Products error:", error);
    process.exitCode = 1;
  }
};

(async () => {
  await seed100Products();
})();
