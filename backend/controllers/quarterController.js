const Quarter = require('../models/Quarter');

exports.createQuarter = async (req, res) => {
    try {
        const { quarterNumber, block, type, status } = req.body;

        // Check for duplicate: (Block + Type + Quarter Number)
        const existing = await Quarter.findOne({
            where: { quarterNumber, block, type }
        });

        if (existing) {
            return res.status(400).json({ error: 'This quarter already exists in the selected block and type.' });
        }

        const quarter = await Quarter.create({ quarterNumber, block, type, status });
        res.status(201).json(quarter);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create Quarter', details: error.message });
    }
};

exports.getAllQuarters = async (req, res) => {
    try {
        const quarters = await Quarter.findAll({
            order: [['block', 'ASC'], ['quarterNumber', 'ASC']]
        });
        res.json(quarters);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch Quarters' });
    }
};

exports.getQuarterById = async (req, res) => {
    try {
        const quarter = await Quarter.findByPk(req.params.id);
        if (!quarter) return res.status(404).json({ error: 'Quarter not found' });
        res.json(quarter);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch Quarter' });
    }
};

exports.getQuartersByBlock = async (req, res) => {
    try {
        const { block } = req.params;
        const quarters = await Quarter.findAll({
            where: { block: `Block ${block}` },
            order: [['quarterNumber', 'ASC']]
        });
        res.json(quarters);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch Quarters by block' });
    }
};

exports.updateQuarter = async (req, res) => {
    try {
        const quarter = await Quarter.findByPk(req.params.id);
        if (!quarter) return res.status(404).json({ error: 'Quarter not found' });

        await quarter.update(req.body);
        res.json(quarter);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update Quarter' });
    }
};

exports.deleteQuarter = async (req, res) => {
    try {
        const quarter = await Quarter.findByPk(req.params.id);
        if (!quarter) return res.status(404).json({ error: 'Quarter not found' });
        await quarter.destroy();
        res.json({ message: 'Quarter deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete Quarter' });
    }
};

// Vacate a quarter (set status to Vacant)
exports.vacateQuarter = async (req, res) => {
    try {
        const quarter = await Quarter.findByPk(req.params.id);
        if (!quarter) return res.status(404).json({ error: 'Quarter not found' });

        quarter.status = 'Vacant';
        await quarter.save();

        res.json({ message: 'Quarter vacated successfully', quarter });
    } catch (error) {
        res.status(500).json({ error: 'Failed to vacate Quarter' });
    }
};
