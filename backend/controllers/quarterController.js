const Quarter = require('../models/Quarter');

exports.createQuarter = async (req, res) => {
    try {
        const { quarterNumber, type, status } = req.body;
        const quarter = await Quarter.create({ quarterNumber, type, status });
        res.status(201).json(quarter);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create Quarter', details: error.message });
    }
};

exports.getAllQuarters = async (req, res) => {
    try {
        const quarters = await Quarter.findAll();
        res.json(quarters);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch Quarters' });
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
