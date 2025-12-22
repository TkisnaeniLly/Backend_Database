const Variant = require("../../Models/scripts/Catalog/Variant");

// GET all variants (optional product_id)
exports.getAllVariants = async (req, res) => {
  try {
    const { product_id } = req.query;

    const where = product_id ? { product_id } : {};

    const variants = await Variant.findAll({ where });

    res.status(200).json({
      success: true,
      data: variants,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET variant by ID
exports.getVariantById = async (req, res) => {
  try {
    const variant = await Variant.findByPk(req.params.id);

    if (!variant) {
      return res.status(404).json({
        success: false,
        message: "Variant not found",
      });
    }

    res.status(200).json({
      success: true,
      data: variant,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// CREATE variant
exports.createVariant = async (req, res) => {
  try {
    const variant = await Variant.create(req.body);

    res.status(201).json({
      success: true,
      data: variant,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// UPDATE variant
exports.updateVariant = async (req, res) => {
  try {
    const variant = await Variant.findByPk(req.params.id);

    if (!variant) {
      return res.status(404).json({
        success: false,
        message: "Variant not found",
      });
    }

    await variant.update(req.body);

    res.status(200).json({
      success: true,
      data: variant,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE variant
exports.deleteVariant = async (req, res) => {
  try {
    const variant = await Variant.findByPk(req.params.id);

    if (!variant) {
      return res.status(404).json({
        success: false,
        message: "Variant not found",
      });
    }

    await variant.destroy();

    res.status(200).json({
      success: true,
      message: "Variant deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
