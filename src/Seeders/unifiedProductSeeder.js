const fs = require("fs");
const path = require("path");
const {
  sequelize,
  Category,
  Brand,
  Product,
  Media,
  Variant,
  Inventory,
  ProductCategory,
  Cart,
  CartItem,
  Checkout,
  CheckoutTracking,
} = require("../Models");

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function cleanFilename(filename) {
  // Remove extension
  let name = filename.replace(/\.(webp|jpeg|jpg|png)$/i, "");
  // Replace hyphens/underscores with spaces
  name = name.replace(/[-_]/g, " ");
  // Split camelCase
  name = name.replace(/([a-z])([A-Z])/g, "$1 $2");
  // Title Case
  return name.replace(/\b\w/g, (char) => char.toUpperCase());
}

const unifiedProductSeeder = async () => {
  const transaction = await sequelize.transaction();

  try {
    console.log("🔄 Syncing database...");
    await sequelize.sync({ alter: true });

    // =========================
    // CLEAR DATA
    // =========================
    console.log("🧹 Clearing old data...");
    await CheckoutTracking.destroy({ where: {}, transaction });
    await Checkout.destroy({ where: {}, transaction });
    await CartItem.destroy({ where: {}, transaction });
    await Cart.destroy({ where: {}, transaction });
    await Inventory.destroy({ where: {}, transaction });
    await Variant.destroy({ where: {}, transaction });
    await Media.destroy({ where: {}, transaction });
    await Product.destroy({ where: {}, transaction });
    await ProductCategory.destroy({ where: {}, transaction });
    await Category.destroy({ where: {}, transaction });
    await Brand.destroy({ where: {}, transaction });

    // =========================
    // SEED CATEGORIES
    // =========================
    console.log("📂 Seeding Categories...");
    const categoryNames = [
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
      "Wanita",
      "Pria",
    ];

    const categories = [];
    for (const name of categoryNames) {
      const [cat] = await Category.findOrCreate({
        where: { category_name: name },
        defaults: { category_name: name },
        transaction,
      });
      categories.push(cat);
    }

    // Map categories for easy lookup
    const catMap = {};
    categories.forEach((c) => (catMap[c.category_name.toLowerCase()] = c));

    // =========================
    // SEED BRANDS
    // =========================
    console.log("🏷️ Seeding Brands...");
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
    ];

    const brands = [];
    for (const name of brandNames) {
      const [br] = await Brand.findOrCreate({
        where: { brand_name: name },
        defaults: { brand_name: name, origin_country: "Indonesia" },
        transaction,
      });
      brands.push(br);
    }

    // =========================
    // SEED PRODUCTS FROM IMAGES
    // =========================
    console.log("🖼️ Processing Images & Seeding Products...");
    const imagesDir = path.join(__dirname, "../Assets/Public/images/products");

    if (!fs.existsSync(imagesDir)) {
      throw new Error(`Directory not found: ${imagesDir}`);
    }

    const files = fs
      .readdirSync(imagesDir)
      .filter((file) => /\.(jpg|jpeg|png|webp)$/i.test(file));

    for (const file of files) {
      const productName = cleanFilename(file);
      const lowerName = productName.toLowerCase();

      // Determine Category
      let categoryId = catMap["t-shirt"].id; // Default
      if (lowerName.includes("hoodie") || lowerName.includes("hody"))
        categoryId = catMap["hoodie"].id;
      else if (lowerName.includes("jacket") || lowerName.includes("jaket"))
        categoryId = catMap["jaket"].id;
      else if (
        lowerName.includes("sneaker") ||
        lowerName.includes("sepatu") ||
        lowerName.includes("footwear")
      )
        categoryId = catMap["sepatu"].id;
      else if (
        lowerName.includes("jeans") ||
        lowerName.includes("celana") ||
        lowerName.includes("pants") ||
        lowerName.includes("trousers")
      )
        categoryId = catMap["celana"].id;
      else if (lowerName.includes("sock")) categoryId = catMap["socks"].id;
      else if (
        lowerName.includes("cap") ||
        lowerName.includes("hat") ||
        lowerName.includes("topi")
      )
        categoryId = catMap["topi"].id;
      else if (
        lowerName.includes("bag") ||
        lowerName.includes("tas") ||
        lowerName.includes("accessory")
      )
        categoryId = catMap["aksesoris"].id;
      else if (
        lowerName.includes("shirt") ||
        lowerName.includes("kaos") ||
        lowerName.includes("tee")
      )
        categoryId = catMap["t-shirt"].id;
      else if (lowerName.includes("outer")) categoryId = catMap["outer"].id;
      else if (lowerName.includes("underwear"))
        categoryId = catMap["underwear"].id;

      // Random Brand
      const brand = brands[randInt(0, brands.length - 1)];

      // Construct Description
      const descAdjectives = [
        "Nyaman",
        "Trendy",
        "Kualitas Premium",
        "Desain Modern",
        "Tahan Lama",
        "Gaya Kekinian",
      ];
      const descAdj = descAdjectives[randInt(0, descAdjectives.length - 1)];
      const description = `${descAdj} - ${productName}. Dibuat dengan bahan pilihan untuk kenyamanan maksimal Anda. Cocok untuk penggunaan sehari-hari maupun acara casual.`;

      // Determine is_featured
      let isFeatured = false;
      if (lowerName.includes("featured")) {
        isFeatured = true;
      } else {
        // 10% chance to be featured randomly
        if (Math.random() < 0.1) isFeatured = true;
      }

      // Create Product
      const product = await Product.create(
        {
          product_name: productName,
          description: description,
          category_id: categoryId,
          brand_id: brand.id,
          is_featured: isFeatured,
        },
        { transaction, individualHooks: true }
      ); // Hooks for slug

      // Create Media
      await Media.create(
        {
          product_id: product.id,
          media_url: `/images/products/${file}`,
          position: 1,
        },
        { transaction }
      );

      // Link to extra Categories (Randomly add Pria or Wanita)
      const extraCat = randInt(0, 1) === 0 ? catMap["pria"] : catMap["wanita"];
      if (extraCat) {
        await ProductCategory.findOrCreate({
          where: { product_id: product.id, category_id: extraCat.id },
          defaults: { product_id: product.id, category_id: extraCat.id },
          transaction,
        });
      }

      // Also link to the main category via ProductCategory if not already (though usually belongsTo handles the main one, we might want it in M2M too for consistency)
      await ProductCategory.findOrCreate({
        where: { product_id: product.id, category_id: categoryId },
        defaults: { product_id: product.id, category_id: categoryId },
        transaction,
      });

      function getPrettyPrice(min, max) {
        // Generate random price in range
        let price = Math.floor(Math.random() * (max - min + 1)) + min;

        // Custom logic to make it "pretty"
        // 1. Round to nearest 1000
        price = Math.round(price / 1000) * 1000;

        // 2. Adjust to standard psychological prices
        const rand = Math.random();
        if (rand < 0.5) {
          price -= 1000; // e.g. 150.000 -> 149.000
        } else if (rand < 0.8) {
          price -= 100; // e.g. 150.000 -> 149.900
        }
        // else keep flat e.g. 150.000

        // Ensure not below min
        return price < min ? min : price;
      }

      // Create Variants & Inventory
      const variantsData = [];

      if (categoryId === catMap["sepatu"].id) {
        // Shoes: 199.000 - 649.000
        const sizes = ["39", "40", "41", "42", "43", "44"];
        sizes.forEach((size) => {
          variantsData.push({
            type: "SIZE",
            value: size,
            price: getPrettyPrice(199000, 649000),
          });
        });
      } else if (
        categoryId === catMap["t-shirt"].id ||
        categoryId === catMap["pria"].id ||
        categoryId === catMap["wanita"].id
      ) {
        // T-Shirt/Basic: 59.000 - 149.000
        const sizes = ["S", "M", "L", "XL"];
        sizes.forEach((size) => {
          variantsData.push({
            type: "SIZE",
            value: size,
            price: getPrettyPrice(59000, 149000),
          });
        });
      } else if (
        categoryId === catMap["jaket"].id ||
        categoryId === catMap["hoodie"].id ||
        categoryId === catMap["outer"].id
      ) {
        // Jacket/Hoodie: 179.000 - 399.000
        const sizes = ["S", "M", "L", "XL"];
        sizes.forEach((size) => {
          variantsData.push({
            type: "SIZE",
            value: size,
            price: getPrettyPrice(179000, 399000),
          });
        });
      } else if (categoryId === catMap["celana"].id) {
        // Pants: 149.000 - 299.000
        const sizes = ["28", "30", "32", "34"];
        sizes.forEach((size) => {
          variantsData.push({
            type: "SIZE",
            value: size,
            price: getPrettyPrice(149000, 299000),
          });
        });
      } else if (
        categoryId === catMap["aksesoris"].id ||
        categoryId === catMap["topi"].id ||
        categoryId === catMap["socks"].id
      ) {
        // Accessories: 15.000 - 89.000
        variantsData.push({
          type: "UOM",
          value: "All Size",
          price: getPrettyPrice(15000, 89000),
        });
      } else if (categoryId === catMap["underwear"].id) {
        // Underwear: 25.000 - 59.000
        const sizes = ["M", "L", "XL"];
        sizes.forEach((size) => {
          variantsData.push({
            type: "SIZE",
            value: size,
            price: getPrettyPrice(25000, 59000),
          });
        });
      } else {
        // Default fallthrough
        variantsData.push({
          type: "UOM",
          value: "Pcs",
          price: getPrettyPrice(50000, 150000),
        });
      }

      for (const vData of variantsData) {
        const variant = await Variant.create(
          {
            product_id: product.id,
            variant_type: vData.type,
            variant_value: vData.value,
            price: vData.price,
          },
          { transaction }
        );

        await Inventory.create(
          {
            variant_id: variant.id,
            stock_qty: randInt(0, 50),
            stock_minimum: 5,
            stock_status: "AVAILABLE",
          },
          { transaction }
        );
      }
    }

    await transaction.commit();
    console.log(
      `✅ Unified seeder successfully processed ${files.length} images.`
    );
  } catch (error) {
    await transaction.rollback();
    console.error("❌ Unified seeder failed:", error);
    process.exit(1);
  }
};

(async () => {
  await unifiedProductSeeder();
  process.exit(0);
})();
