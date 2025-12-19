const response = require("response");

const Cart = require("../../Models/scripts/Cart/Cart");
const CartItem = require("../../Models/scripts/Cart/CartItem");
const Variant = require("../../Models/scripts/Catalog/Variant");
const Product = require("../../Models/scripts/Catalog/Product");
const Media = require("../../Models/scripts/Catalog/Media");
const Inventory = require("../../Models/scripts/Catalog/Inventory");

const getMyCart = async (req, res) => {
  try {
    const user_id = req.user.user_id;

    if (!user_id) {
      return response(res, {
        statusCode: 401,
        message: "User tidak terautentikasi",
        data: null,
      });
    }

    const cart = await Cart.findOne({
      where: {
        user_id,
        status: "ACTIVE",
      },
      include: [
        {
          model: CartItem,
          attributes: ["id", "qty"],
          include: [
            {
              model: Variant,
              attributes: ["id", "variant_type", "variant_value", "price"],
              include: [
                {
                  model: Product,
                  attributes: ["id", "product_name", "slug"],
                  include: [
                    {
                      model: Media,
                      attributes: ["media_url", "position"],
                      separate: true,
                      limit: 1,
                      order: [["position", "ASC"]],
                    },
                  ],
                },
                {
                  model: Inventory,
                  attributes: ["stock_qty", "stock_status"],
                },
              ],
            },
          ],
        },
      ],
      order: [[CartItem, "created_at", "ASC"]],
    });

    if (!cart || cart.CartItems.length === 0) {
      return response(res, {
        statusCode: 200,
        message: "Keranjang masih kosong",
        data: {
          items: [],
          total_qty: 0,
          total_price: 0,
        },
      });
    }

    let total_qty = 0;
    let total_price = 0;

    const items = cart.CartItems.map((item) => {
      const variant = item.Variant;
      const price = variant.price;
      const subtotal = price * item.qty;

      total_qty += item.qty;
      total_price += subtotal;

      return {
        cart_item_id: item.id,
        qty: item.qty,
        price,
        subtotal,
        variant: {
          id: variant.id,
          type: variant.variant_type,
          value: variant.variant_value,
        },
        product: {
          id: variant.Product.id,
          name: variant.Product.product_name,
          slug: variant.Product.slug,
          image: variant.Product.Media?.[0]?.media_url || null,
        },
        stock: {
          qty: variant.Inventory.stock_qty,
          status: variant.Inventory.stock_status,
        },
      };
    });

    response(res, {
      statusCode: 200,
      message: "Data keranjang",
      data: {
        cart_id: cart.id,
        items,
        total_qty,
        total_price,
      },
    });
  } catch (error) {
    console.error(error);
    response(res, {
      statusCode: 500,
      message: "Internal Server Error",
      data: null,
    });
  }
};

module.exports = getMyCart;
