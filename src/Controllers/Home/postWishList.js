const response = require("response");
const WishList = require("../../Models");

const wishList = async (req, res) => {
  try {
    const user = req.user;
    const { variant_id } = req.body;

    if (!user) {
      return response(res, {
        statusCode: 401,
        message: "Unauthorized.",
        data: null,
      });
    }

    if (!variant_id) {
      return response(res, {
        statusCode: 400,
        message: "Variant ID wajib diisi.",
        data: null,
      });
    }

    // Check if duplicate in wishlist relative to user
    const existingWishlist = await WishList.Wishlist.findOne({
      where: {
        user_id: user.user_id,
        variant_id,
      },
    });

    if (existingWishlist) {
      return response(res, {
        statusCode: 400,
        message: "Variant sudah ada di wishlist.",
        data: null,
      });
    }

    // Check if variant exists in database (Variant Model)
    const variant = await WishList.Variant.findByPk(variant_id);
    if (!variant) {
      // If not found in database, it's a 404 error
      return response(res, {
        statusCode: 404,
        message: "Variant tidak ditemukan.",
        data: null,
      });
    }

    // Add to wishlist
    const newWishlist = await WishList.Wishlist.create({
      user_id: user.user_id,
      variant_id,
      product_id: variant.product_id,
    });

    return response(res, {
      statusCode: 200,
      message: "Berhasil menambahkan ke wishlist.",
      data: newWishlist,
    });
  } catch (error) {
    console.log(error);
    return response(res, {
      statusCode: 500,
      message: "Terjadi kesalahan pada server.",
      data: process.env.NODE_ENV === "development" ? error.message : null,
    });
  }
};

module.exports = wishList;
