const response = require("response");
const Wishlist = require("../../Models/scripts/Wishlist/Wishlist");
const Product = require("../../Models/scripts/Catalog/Product");

const addWishlist = async (req, res) => {
    try {
        const user_id = req.user.user_id;
        const { product_id } = req.body;

        if (!product_id) {
            return response(res, {
                statusCode: 400,
                message: "product_id wajib diisi",
                data: null,
            });
        }

        const product = await Product.findByPk(product_id);

        if (!product) {
            return response(res, {
                statusCode: 404,
                message: "Produk tidak ditemukan",
                data: null,
            });
        }

        const existingWishlist = await Wishlist.findOne({
            where: {
                user_id,
                product_id,
            },
        });

        if (existingWishlist) {
            return response(res, {
                statusCode: 400,
                message: "Produk sudah ada di wishlist",
                data: null,
            });
        }

        const wishlist = await Wishlist.create({
            user_id,
            product_id,
        });

        return response(res, {
            statusCode: 201,
            message: "Produk berhasil ditambahkan ke wishlist",
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

module.exports = addWishlist;
