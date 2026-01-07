const response = require("response");
const WishList = require("../../Models");

const wishList = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return response(res, {
        statusCode: 401,
        message: "Unauthorized.",
        data: null,
      });
    }

    const wishList = await WishList.Wishlist.findAll({
      where: { user_id: user.user_id },
      include: [
        {
          model: WishList.Product,
          include: [
            {
              model: WishList.Media,
              limit: 1, // Only get one image for thumbnail
            },
          ],
        },
        {
          model: WishList.Variant,
        },
      ],
      order: [["created_at", "DESC"]],
    });

    return response(res, {
      statusCode: 200,
      message: "Berhasil mengambil data wishlist.",
      data: wishList,
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
