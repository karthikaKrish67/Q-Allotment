const Bill = require('../models/Bill');
const NonEmployee = require('../models/NonEmployee');
const Allotment = require('../models/Allotment');

exports.generateBill = async (req, res) => {
    try {
        const { nonEmployeeId, month, rentAmount, maintenanceAmount } = req.body;

        // Verify NonEmployee exists
        const nonEmployee = await NonEmployee.findByPk(nonEmployeeId);
        if (!nonEmployee) return res.status(404).json({ error: 'NonEmployee not found' });

        const totalAmount = parseFloat(rentAmount) + parseFloat(maintenanceAmount);

        const bill = await Bill.create({
            NonEmployeeId: nonEmployeeId,
            month,
            rentAmount,
            maintenanceAmount,
            totalAmount,
            isPaid: false
        });

        res.status(201).json(bill);
    } catch (error) {
        res.status(500).json({ error: 'Failed to generate bill', details: error.message });
    }
};

exports.getBills = async (req, res) => {
    try {
        // If query param nonEmployeeId is present, filter by it
        const { nonEmployeeId } = req.query;
        const whereClause = nonEmployeeId ? { NonEmployeeId: nonEmployeeId } : {};

        const bills = await Bill.findAll({
            where: whereClause,
            include: [NonEmployee]
        });
        res.json(bills);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch bills' });
    }
};

exports.markAsPaid = async (req, res) => {
    try {
        const bill = await Bill.findByPk(req.params.id);
        if (!bill) return res.status(404).json({ error: 'Bill not found' });

        bill.isPaid = true;
        await bill.save();

        res.json({ message: 'Bill marked as paid', bill });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update bill' });
    }
};
