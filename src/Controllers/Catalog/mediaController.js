const Media = require("../../Models/scripts/Catalog/Media");

// GET all media (optional filter by product_id)
exports.getAllMedia = async (req, res) => {
  try {
    const { product_id } = req.query;

    const where = product_id ? { product_id } : {};

    const media = await Media.findAll({
      where,
      order: [["position", "ASC"]],
    });

    res.status(200).json({
      success: true,
      data: media,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET media by ID
exports.getMediaById = async (req, res) => {
  try {
    const media = await Media.findByPk(req.params.id);

    if (!media) {
      return res.status(404).json({
        success: false,
        message: "Media not found",
      });
    }

    res.status(200).json({
      success: true,
      data: media,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// CREATE media
exports.createMedia = async (req, res) => {
  try {
    const media = await Media.create(req.body);

    res.status(201).json({
      success: true,
      data: media,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// UPDATE media
exports.updateMedia = async (req, res) => {
  try {
    const media = await Media.findByPk(req.params.id);

    if (!media) {
      return res.status(404).json({
        success: false,
        message: "Media not found",
      });
    }

    await media.update(req.body);

    res.status(200).json({
      success: true,
      data: media,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE media
exports.deleteMedia = async (req, res) => {
  try {
    const media = await Media.findByPk(req.params.id);

    if (!media) {
      return res.status(404).json({
        success: false,
        message: "Media not found",
      });
    }

    await media.destroy();

    res.status(200).json({
      success: true,
      message: "Media deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
