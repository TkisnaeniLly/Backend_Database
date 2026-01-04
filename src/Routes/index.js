const express = require("express");
const router = express.Router();
const app = require("../Controllers/index");
const authenticated = require("../Middlewares/authenticated");
const authorizeRole = require("../Middlewares/authorizeRole");
const upload = require("../Middlewares/multer");

// Auth
router.post("/auth/register", app.register);
router.get("/auth/verify-email", app.verifyEmail);
router.post("/auth/login", app.login);
router.put("/auth/verify-login", app.verifyLogin);
router.post("/auth/refresh", app.refreshToken);
router.delete("/auth/logout", authenticated, app.logout);
router.delete("/auth/logout-all", app.logoutAll);
router.get("/auth/get-user-devices", app.getUserDevices);
router.delete("/auth/revoke-device", app.revokeDevice);
router.post("/auth/request-reset-password", app.requestResetPassword);
router.get("/auth/reset-password", app.resetPassword);
router.post("/auth/request-reset-otp", app.requestResetOtp);
router.post("/auth/execute-reset-password", app.executeResetPassword);
// Public
router.get("/", app.home);
router.get("/catalog", app.catalog);
router.get("/product", app.catalog);
router.get("/catalog/featured", app.getFeaturedProducts);
router.get("/product/featured", app.getFeaturedProducts);
router.get("/catalog/:slug", app.getProductBySlug);
router.get("/product/:slug", app.getProductBySlug);
// Users => Home
router.get("/home", authenticated, authorizeRole(["user"]), app.home);
router.get("/beranda", authenticated, authorizeRole(["user"]), app.home);
router.put("/profile", authenticated, authorizeRole(["user"]), app.userProfile);
router.post(
  "/profile",
  authenticated,
  authorizeRole(["user"]),
  upload.single("avatar"),
  app.editUser
);
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
// User => Checkout
router.post(
  "/checkout",
  authenticated,
  authorizeRole(["user"]),
  app.processCheckout
);
router.get(
  "/checkout",
  authenticated,
  authorizeRole(["user"]),
  app.getCheckoutHistory
);
router.get(
  "/checkout/:id",
  authenticated,
  authorizeRole(["user"]),
  app.getCheckoutDetail
);
router.get(
  "/checkout/:id/tracking",
  authenticated,
  authorizeRole(["user"]),
  app.getCheckoutTracking
);
module.exports = router;

// Admin
router.post("/opa/checkout/paid-verify", app.paidVerify);
