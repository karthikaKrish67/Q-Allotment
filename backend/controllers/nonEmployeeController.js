const NonEmployee = require('../models/NonEmployee');
const Allotment = require('../models/Allotment');
const Quarter = require('../models/Quarter');

exports.createNonEmployee = async (req, res) => {
    try {
        const { name, privatePartyCode, address, phoneNumber } = req.body;
        const nonEmployee = await NonEmployee.create({ name, privatePartyCode, address, phoneNumber });
        res.status(201).json(nonEmployee);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create NonEmployee', details: error.message });
    }
};

exports.getAllNonEmployees = async (req, res) => {
    try {
        const nonEmployees = await NonEmployee.findAll();
        res.json(nonEmployees);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch NonEmployees' });
    }
};

exports.getNonEmployee = async (req, res) => {
    try {
        const nonEmployee = await NonEmployee.findByPk(req.params.id, {
            include: [{ model: Allotment, include: [Quarter] }]
        });
        if (!nonEmployee) return res.status(404).json({ error: 'NonEmployee not found' });
        res.json(nonEmployee);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch NonEmployee' });
    }
};

exports.updateNonEmployee = async (req, res) => {
    try {
        const { name, privatePartyCode, address, phoneNumber } = req.body;
        const nonEmployee = await NonEmployee.findByPk(req.params.id);
        if (!nonEmployee) return res.status(404).json({ error: 'NonEmployee not found' });

        nonEmployee.name = name || nonEmployee.name;
        nonEmployee.privatePartyCode = privatePartyCode || nonEmployee.privatePartyCode;
        nonEmployee.address = address || nonEmployee.address;
        nonEmployee.phoneNumber = phoneNumber || nonEmployee.phoneNumber;

        await nonEmployee.save();
        res.json(nonEmployee);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update NonEmployee' });
    }
};

exports.deleteNonEmployee = async (req, res) => {
    try {
        const nonEmployee = await NonEmployee.findByPk(req.params.id);
        if (!nonEmployee) return res.status(404).json({ error: 'NonEmployee not found' });
        await nonEmployee.destroy();
        res.json({ message: 'NonEmployee deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete NonEmployee' });
    }
};
