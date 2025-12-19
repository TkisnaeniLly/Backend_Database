const sequelize = require("../Config/sequelizeConnect");

// ==================
// Import Models
// ==================
// Auth
const User = require("./scripts/Auth/User");
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
// Relasi Auth (Updated)
// ==================

/** * User -> Profile (DIHAPUS)
 * Sesuai DATABASE_OVERVIEW.md, tabel User dan Customer (Profile) sudah digabung.
 */

// User -> EmailVerification (1 : N)
User.hasMany(EmailVerification, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
});
EmailVerification.belongsTo(User, {
  foreignKey: "user_id",
});

// User -> Login Device (1 : N)
User.hasMany(UserLoginDevice, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
});
UserLoginDevice.belongsTo(User, {
  foreignKey: "user_id",
});

// User -> Login OTP (1 : N)
User.hasMany(LoginOtp, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
});
LoginOtp.belongsTo(User, {
  foreignKey: "user_id",
});

// ==================
// Relasi Catalog & Cart (Tetap)
// ==================

// Brand -> Product (1 : N)
Brand.hasMany(Product, {
  foreignKey: "brand_id",
  onDelete: "RESTRICT",
});
Product.belongsTo(Brand, {
  foreignKey: "brand_id",
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
Variant.hasOne(Inventory, {
  foreignKey: "variant_id",
  onDelete: "CASCADE",
});
Inventory.belongsTo(Variant, {
  foreignKey: "variant_id",
});

// User -> Cart (1 : N)
User.hasMany(Cart, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
});
Cart.belongsTo(User, {
  foreignKey: "user_id",
});

// Cart -> CartItem (1 : N)
Cart.hasMany(CartItem, {
  foreignKey: "cart_id",
  onDelete: "CASCADE",
});
CartItem.belongsTo(Cart, {
  foreignKey: "cart_id",
});

module.exports = {
  sequelize,
  User,
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
