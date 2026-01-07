const response = require("response");
const Wishlist = require("../../Models/scripts/Wishlist/Wishlist");
const Product = require("../../Models/scripts/Catalog/Product");
const Media = require("../../Models/scripts/Catalog/Media");

const getWishlist = async (req, res) => {
    try {
        const user_id = req.user.user_id;

        const wishlist = await Wishlist.findAll({
            where: {
                user_id,
            },
            include: [
                {
                    model: Product,
                    include: [
                        {
                            model: Media,
                            limit: 1, // Ambil gambar pertama saja sebagai thumbnail
                        },
                    ],
                },
            ],
            order: [["created_at", "DESC"]],
        });

        return response(res, {
            statusCode: 200,
            message: "Berhasil mengambil data wishlist",
            data: wishlist,
        });
    } catch (error) {
        console.error(error);
        return response(res, {
            statusCode: 500,
            message: "Internal Server Error",
            data: null,
        });
    }
};

module.exports = getWishlist;
