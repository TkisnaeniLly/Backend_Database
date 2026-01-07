const response = require("response");
const Wishlist = require("../../Models/scripts/Wishlist/Wishlist");

const removeWishlist = async (req, res) => {
    try {
        const user_id = req.user.user_id;
        const { product_id } = req.body; // Menggunakan body agar seragam dengan addWishlist, atau bisa params

        // Jika ingin support delete via params /wishlist/:id, bisa cek params
        // Disini asumsi delete via body product_id atau params id.
        // Jika req.params.product_id ada, gunakan itu.

        const targetId = req.params.id || product_id;

        if (!targetId) {
            return response(res, {
                statusCode: 400,
                message: "ID atau product_id wajib diisi",
                data: null,
            });
        }

        // Cek apakah targetId adalah ID wishlist atau Product ID. 
        // Biasanya user ingin 'hapus produk X dari wishlist'.
        // Mari kita coba cari by product_id dulu, jika tidak ketemu coba anggap itu wishlist id.
        // Namun untuk amannya, kita konsistenkan.
        // Skenario: User di halaman produk klik 'unlike'. Kirim product_id.
        // Skenario: User di halaman wishlist klik 'delete'. Kirim wishlist_id atau product_id.

        // Kita coba cari berdasarkan product_id AND user_id dulu.
        let wishlist = await Wishlist.findOne({
            where: {
                user_id,
                product_id: targetId
            }
        });

        // Jika tidak ketemu, mungkin targetId adalah primary key wishlist
        if (!wishlist) {
            wishlist = await Wishlist.findOne({
                where: {
                    id: targetId,
                    user_id
                }
            });
        }

        if (!wishlist) {
            return response(res, {
                statusCode: 404,
                message: "Item wishlist tidak ditemukan",
                data: null,
            });
        }

        await wishlist.destroy();

        return response(res, {
            statusCode: 200,
            message: "Produk berhasil dihapus dari wishlist",
            data: null,
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

module.exports = removeWishlist;
