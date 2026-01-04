const homePage = require("./Home");
const home = async (req, res) => {
  return homePage(req, res);
};
const userProfilePage = require("./Home/userProfile");
const userProfile = async (req, res) => {
  return userProfilePage(req, res);
};
const editUserPage = require("./Home/editUser");
const editUser = async (req, res) => {
  return editUserPage(req, res);
};

//! Auth
const registerPage = require("./Auth/Register");
const register = async (req, res) => {
  return registerPage(req, res);
};

const verifyEmailPage = require("./Auth/VerifyEmail");
const verifyEmail = async (req, res) => {
  return verifyEmailPage(req, res);
};

const loginPage = require("./Auth/Login");
const login = async (req, res) => {
  return loginPage(req, res);
};

const verifyLoginOtpPage = require("./Auth/VerifyLoginOtp");
const verifyLogin = async (req, res) => {
  return verifyLoginOtpPage(req, res);
};

const logoutPage = require("./Auth/Logout");
const logout = async (req, res) => {
  return logoutPage(req, res);
};
const logoutAllPage = require("./Auth/LogoutAll");
const logoutAll = async (req, res) => {
  return logoutAllPage(req, res);
};
const getUserDevicesPage = require("./Auth/GetUserDevices");
const getUserDevices = async (req, res) => {
  return getUserDevicesPage(req, res);
};
const revokeDevicePage = require("./Auth/RevokeDevice");
const revokeDevice = async (req, res) => {
  return revokeDevicePage(req, res);
};

//! Product
const catalogPage = require("./Product/getCatalog");
const catalog = async (req, res) => {
  return catalogPage(req, res);
};
const getProductBySlugPage = require("./Product/getProductBySlug");
const getProductBySlug = async (req, res) => {
  return getProductBySlugPage(req, res);
};

const getFeaturedProductsPage = require("./Product/getFeaturedProducts");
const getFeaturedProducts = async (req, res) => {
  return getFeaturedProductsPage(req, res);
};

//! Cart
const addToCartPage = require("./Cart/addToCart");
const addToCart = async (req, res) => {
  return addToCartPage(req, res);
};
const getMyCartPage = require("./Cart/getMyCart");
const getMyCart = async (req, res) => {
  return getMyCartPage(req, res);
};
const updateCartItemPage = require("./Cart/updateCartItem");
const updateCartItem = async (req, res) => {
  return updateCartItemPage(req, res);
};
const deleteCartItemPage = require("./Cart/deleteCartItem");
const deleteCartItem = async (req, res) => {
  return deleteCartItemPage(req, res);
};

//! Checkout
const getCheckoutHistoryPage = require("./Checkout/getCheckoutHistory");
const getCheckoutHistory = async (req, res) => {
  return getCheckoutHistoryPage(req, res);
};
const getCheckoutDetailPage = require("./Checkout/getCheckoutDetail");
const getCheckoutDetail = async (req, res) => {
  return getCheckoutDetailPage(req, res);
};
const getCheckoutTrackingPage = require("./Checkout/getCheckoutTracking");
const getCheckoutTracking = async (req, res) => {
  return getCheckoutTrackingPage(req, res);
};

const processCheckoutPage = require("./Checkout/processCheckout");
const processCheckout = async (req, res) => {
  return processCheckoutPage(req, res);
};

const requestResetPasswordPage = require("./Auth/ResetPassword");
const requestResetPassword = async (req, res) => {
  return requestResetPasswordPage(req, res);
};

const getResetPasswordPage = require("./Auth/GetResetPasswordPage");
const resetPassword = async (req, res) => {
  return getResetPasswordPage(req, res);
};

const requestResetOtpPage = require("./Auth/RequestResetOtp");
const requestResetOtp = async (req, res) => {
  return requestResetOtpPage(req, res);
};

const executeResetPasswordPage = require("./Auth/ExecuteResetPassword");
const executeResetPassword = async (req, res) => {
  return executeResetPasswordPage(req, res);
};

const refreshTokenPage = require("./Auth/RefreshToken");
const refreshToken = async (req, res) => {
  return refreshTokenPage(req, res);
};

// Admin
const adminPage = require("./Checkout/Admin");
const paidVerify = async (req, res) => {
  return adminPage.paidVerify(req, res);
};

module.exports = {
  // User
  home,
  userProfile,
  editUser,
  // Auth
  register,
  verifyEmail,
  login,
  verifyLogin,
  logout,
  logoutAll,
  refreshToken,
  getUserDevices,
  revokeDevice,
  requestResetPassword,
  resetPassword,
  requestResetOtp,
  executeResetPassword,
  // Product
  catalog,
  getProductBySlug,
  getFeaturedProducts,
  // Cart
  addToCart,
  getMyCart,
  updateCartItem,
  deleteCartItem,
  // Checkout
  processCheckout,
  getCheckoutHistory,
  getCheckoutDetail,
  getCheckoutTracking,
  // Admin
  paidVerify,
};
