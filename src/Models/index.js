const sequelize = require("../Config/sequelizeConnect");

// ==================
// Import Models
// ==================
// Auth
const User = require("./scripts/Auth/User");
const UserProfile = require("./scripts/Auth/UserProfile");
const EmailVerification = require("./scripts/Auth/EmailVerification");
const UserLoginDevice = require("./scripts/Auth/UserLoginDevice");
const LoginOtp = require("./scripts/Auth/LoginOtp");

// Catalog
const Product = require("./scripts/Catalog/Product");
const Category = require("./scripts/Catalog/Category");
const Brand = require("./scripts/Catalog/Brand");
const Media = require("./scripts/Catalog/Media");
const Variant = require("./scripts/Catalog/Variant");
const Inventory = require("./scripts/Catalog/Inventory");

// Cart
const Cart = require("./scripts/Cart/Cart");
const CartItem = require("./scripts/Cart/CartItem");

// ==================
// Relasi Auth (Tetap)
// ==================
User.hasOne(UserProfile, { foreignKey: "user_id", onDelete: "CASCADE" });
UserProfile.belongsTo(User, { foreignKey: "user_id" });

User.hasMany(EmailVerification, { foreignKey: "user_id", onDelete: "CASCADE" });
EmailVerification.belongsTo(User, { foreignKey: "user_id" });

User.hasMany(UserLoginDevice, { foreignKey: "user_id", onDelete: "CASCADE" });
UserLoginDevice.belongsTo(User, { foreignKey: "user_id" });

// ==========================================
// Relasi Catalog (DISESUAIKAN KE SCRIPT BARU)
// ==========================================

// Category -> Product (1 : N)
Category.hasMany(Product, {
  foreignKey: "category_id",
  sourceKey: "category_id", // Mengacu pada PK baru di Category.js
  onDelete: "RESTRICT",
});
Product.belongsTo(Category, {
  foreignKey: "category_id",
  targetKey: "category_id",
});

// Brand -> Product (1 : N)
Brand.hasMany(Product, {
  foreignKey: "brand_id",
  sourceKey: "brand_id", // Mengacu pada PK baru di Brand.js
  onDelete: "RESTRICT",
});
Product.belongsTo(Brand, {
  foreignKey: "brand_id",
  targetKey: "brand_id",
});

// Product -> Media (1 : N)
Product.hasMany(Media, {
  foreignKey: "product_id",
  onDelete: "CASCADE",
});
Media.belongsTo(Product, {
  foreignKey: "product_id",
});

// Product -> Variant (1 : N)
Product.hasMany(Variant, {
  foreignKey: "product_id",
  onDelete: "CASCADE",
});
Variant.belongsTo(Product, {
  foreignKey: "product_id",
});

// Variant -> Inventory (1 : 1)
// Catatan: Inventory menggunakan inventory_id sebagai PK, tapi variant_id tetap sebagai FK
Variant.hasOne(Inventory, {
  foreignKey: "variant_id",
  onDelete: "CASCADE",
});
Inventory.belongsTo(Variant, {
  foreignKey: "variant_id",
});

// ==================
// Relasi Cart (Tetap)
// ==================
User.hasMany(Cart, { foreignKey: "user_id", onDelete: "CASCADE" });
Cart.belongsTo(User, { foreignKey: "user_id" });

Cart.hasMany(CartItem, { foreignKey: "cart_id", onDelete: "CASCADE" });
CartItem.belongsTo(Cart, { foreignKey: "cart_id" });

Variant.hasMany(CartItem, { foreignKey: "variant_id", onDelete: "CASCADE" });
CartItem.belongsTo(Variant, { foreignKey: "variant_id" });

module.exports = {
  User,
  UserProfile,
  EmailVerification,
  UserLoginDevice,
  LoginOtp,
  Product,
  Category,
  Brand,
  Media,
  Variant,
  Inventory,
  Cart,
  CartItem,
};
