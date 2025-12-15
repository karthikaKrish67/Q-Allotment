const UnEmployee = require('../models/UnEmployee');
const Allotment = require('../models/Allotment');
const Quarter = require('../models/Quarter');

exports.createUnEmployee = async (req, res) => {
    try {
        const { name, privatePartyCode, address, phoneNumber } = req.body;
        const unEmployee = await UnEmployee.create({ name, privatePartyCode, address, phoneNumber });
        res.status(201).json(unEmployee);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create UnEmployee', details: error.message });
    }
};

exports.getAllUnEmployees = async (req, res) => {
    try {
        const unEmployees = await UnEmployee.findAll();
        res.json(unEmployees);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch UnEmployees' });
    }
};

exports.getUnEmployee = async (req, res) => {
    try {
        const unEmployee = await UnEmployee.findByPk(req.params.id, {
            include: [{ model: Allotment, include: [Quarter] }]
        });
        if (!unEmployee) return res.status(404).json({ error: 'UnEmployee not found' });
        res.json(unEmployee);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch UnEmployee' });
    }
};

exports.updateUnEmployee = async (req, res) => {
    try {
        const { name, privatePartyCode, address, phoneNumber } = req.body;
        const unEmployee = await UnEmployee.findByPk(req.params.id);
        if (!unEmployee) return res.status(404).json({ error: 'UnEmployee not found' });

        unEmployee.name = name || unEmployee.name;
        unEmployee.privatePartyCode = privatePartyCode || unEmployee.privatePartyCode;
        unEmployee.address = address || unEmployee.address;
        unEmployee.phoneNumber = phoneNumber || unEmployee.phoneNumber;

        await unEmployee.save();
        res.json(unEmployee);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update UnEmployee' });
    }
};

exports.deleteUnEmployee = async (req, res) => {
    try {
        const unEmployee = await UnEmployee.findByPk(req.params.id);
        if (!unEmployee) return res.status(404).json({ error: 'UnEmployee not found' });
        await unEmployee.destroy();
        res.json({ message: 'UnEmployee deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete UnEmployee' });
    }
};
