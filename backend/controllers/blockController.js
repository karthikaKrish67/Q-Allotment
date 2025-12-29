const Block = require('../models/Block');

exports.createBlock = async (req, res) => {
    try {
        const { name } = req.body;
        const block = await Block.create({ name });
        res.status(201).json(block);
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ error: 'Block already exists' });
        }
        res.status(500).json({ error: 'Failed to create Block', details: error.message });
    }
};

exports.getAllBlocks = async (req, res) => {
    try {
        const blocks = await Block.findAll({
            order: [['name', 'ASC']]
        });
        res.json(blocks);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch Blocks' });
    }
};

exports.deleteBlock = async (req, res) => {
    try {
        const { name } = req.params;
        const deleted = await Block.destroy({
            where: { name }
        });
        if (deleted) {
            res.json({ message: 'Block deleted successfully' });
        } else {
            res.status(404).json({ error: 'Block not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete Block', details: error.message });
    }
};
