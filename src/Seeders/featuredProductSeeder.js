const { sequelize, Product, Brand, Category, Media, Variant, Inventory, ProductCategory } = require("../Models");

(async () => {
  console.log("Seeding featured products...");
  try {
    // list of sample featured product slugs to set/create
    const featuredDefs = [
      {
        slug: "featured-sneaker-1",
        product_name: "Urban Runner Sneaker",
        description: "Comfortable everyday sneaker with breathable upper.",
        brand: "UrbanWear",
        categories: ["Sepatu", "Pria"],
        media: ["/images/products/featured-sneaker-1.jpg"],
        variants: [{ variant_type: "Size", variant_value: "42", price: 499000, stock: 25 }],
      },
      {
        slug: "featured-shirt-1",
        product_name: "Organic Cotton Tee",
        description: "Soft organic cotton t-shirt — eco friendly.",
        brand: "GreenBasics",
        categories: ["Pakaian", "Wanita"],
        media: ["/images/products/featured-shirt-1.jpg"],
        variants: [{ variant_type: "M", variant_value: "M", price: 129000, stock: 50 }],
      },
      {
        slug: "featured-watch-1",
        product_name: "Classic Minimal Watch",
        description: "Slim design watch with leather strap.",
        brand: "Timeless",
        categories: ["Aksesoris", "Pria & Wanita"],
        media: ["/images/products/featured-watch-1.jpg"],
        variants: [{ variant_type: "Default", variant_value: "OneSize", price: 799000, stock: 15 }],
      },
    ];

    for (const def of featuredDefs) {
      // find or create brand
      const [brand] = await Brand.findOrCreate({ where: { brand_name: def.brand }, defaults: { brand_name: def.brand } });

      // ensure at least one category exists and pick first as primary
      let primaryCategory = null;
      for (const catName of def.categories) {
        const [cat] = await Category.findOrCreate({ where: { category_name: catName }, defaults: { category_name: catName } });
        if (!primaryCategory) primaryCategory = cat;
      }

      // find existing product by slug
      let product = await Product.findOne({ where: { slug: def.slug } });
      if (product) {
        await product.update({ is_featured: true, status: "ACTIVE" });
        console.log(`Marked existing product as featured: ${def.slug}`);
      } else {
        // create product
        product = await Product.create({
          product_name: def.product_name,
          slug: def.slug,
          description: def.description,
          brand_id: brand.id,
          category_id: primaryCategory ? primaryCategory.id : null,
          status: "ACTIVE",
          is_featured: true,
        });
        console.log(`Created product: ${def.slug}`);

        // create media entries
        if (Array.isArray(def.media)) {
          for (let i = 0; i < def.media.length; i++) {
            const mediaUrl = def.media[i];
            await Media.create({ product_id: product.id, media_url: mediaUrl, position: i + 1 });
          }
        }

        // create variants + inventory
        if (Array.isArray(def.variants)) {
          for (const v of def.variants) {
            const variant = await Variant.create({
              product_id: product.id,
              variant_type: v.variant_type,
              variant_value: v.variant_value,
              price: v.price,
            });
            await Inventory.create({ variant_id: variant.id, qty: v.stock || 0 });
          }
        }

        // attach additional categories via ProductCategory if available
        if (Array.isArray(def.categories) && typeof ProductCategory !== "undefined") {
          for (const catName of def.categories) {
            const [cat] = await Category.findOrCreate({ where: { category_name: catName }, defaults: { category_name: catName } });
            // create join row if not exists
            await ProductCategory.findOrCreate({ where: { product_id: product.id, category_id: cat.id } });
          }
        }
      }
    }

    console.log("Featured seeder finished.");
    process.exit(0);
  } catch (err) {
    console.error("Error seeding featured products:", err);
    process.exit(1);
  }
})();
