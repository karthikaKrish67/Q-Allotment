const Bill = require('../models/Bill');
const UnEmployee = require('../models/UnEmployee');
const Allotment = require('../models/Allotment');

exports.generateBill = async (req, res) => {
    try {
        const { unEmployeeId, month, rentAmount, maintenanceAmount } = req.body;

        // Verify UnEmployee exists
        const unEmployee = await UnEmployee.findByPk(unEmployeeId);
        if (!unEmployee) return res.status(404).json({ error: 'UnEmployee not found' });

        const totalAmount = parseFloat(rentAmount) + parseFloat(maintenanceAmount);

        const bill = await Bill.create({
            UnEmployeeId: unEmployeeId,
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
        // If query param unEmployeeId is present, filter by it
        const { unEmployeeId } = req.query;
        const whereClause = unEmployeeId ? { UnEmployeeId: unEmployeeId } : {};

        const bills = await Bill.findAll({
            where: whereClause,
            include: [UnEmployee]
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
