const express = require("express");
const router = express.Router();
const app = require("../Controllers/index");
const authenticated = require("../Middlewares/authenticated");
const authorizeRole = require("../Middlewares/authorizeRole");

// Auth
router.post("/auth/register", app.register);
router.get("/auth/verify-email", app.verifyEmail);
router.post("/auth/login", app.login);
router.put("/auth/verify-login", app.verifyLogin);
router.delete("/auth/logout", authenticated, app.logout);
router.delete("/auth/logout-all", app.logoutAll);
router.get("/auth/get-user-devices", app.getUserDevices);
router.delete("/auth/revoke-device", app.revokeDevice);
// Public
router.get("/", app.home);
router.get("/catalog", app.catalog);
router.get("/product", app.catalog);
router.get("/catalog/:slug", app.getProductBySlug);
router.get("/product/:slug", app.getProductBySlug);
// Users => Home
router.get("/home", authenticated, authorizeRole(["user"]), app.home);
router.get("/beranda", authenticated, authorizeRole(["user"]), app.home);
// User => Cart
router.get("/cart", authenticated, authorizeRole(["user"]), app.getMyCart);
router.post("/cart", authenticated, authorizeRole(["user"]), app.addToCart);
router.put("/cart", authenticated, authorizeRole(["user"]), app.updateCartItem);
router.delete(
  "/cart",
  authenticated,
  authorizeRole(["user"]),
  app.deleteCartItem
);
module.exports = router;
