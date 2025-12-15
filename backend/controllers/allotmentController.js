const Allotment = require('../models/Allotment');
const Quarter = require('../models/Quarter');
const UnEmployee = require('../models/UnEmployee');

exports.allotQuarter = async (req, res) => {
    const { unEmployeeId, quarterId } = req.body;
    try {
        // Check if Quarter is Vacant
        const quarter = await Quarter.findByPk(quarterId);
        if (!quarter) return res.status(404).json({ error: 'Quarter not found' });
        if (quarter.status === 'Occupied') return res.status(400).json({ error: 'Quarter is already occupied' });

        // Check if UnEmployee exists
        const unEmployee = await UnEmployee.findByPk(unEmployeeId);
        if (!unEmployee) return res.status(404).json({ error: 'UnEmployee not found' });

        // Create Allotment
        const allotment = await Allotment.create({
            UnEmployeeId: unEmployeeId,
            QuarterId: quarterId,
            status: 'Active'
        });

        // Update Quarter Status
        quarter.status = 'Occupied';
        await quarter.save();

        res.status(201).json(allotment);
    } catch (error) {
        res.status(500).json({ error: 'Allotment failed', details: error.message });
    }
};

exports.cancelAllotment = async (req, res) => {
    try {
        const allotment = await Allotment.findByPk(req.params.id);
        if (!allotment) return res.status(404).json({ error: 'Allotment not found' });

        allotment.status = 'Cancelled';
        await allotment.save();

        // Free up the quarter
        const quarter = await Quarter.findByPk(allotment.QuarterId);
        if (quarter) {
            quarter.status = 'Vacant';
            await quarter.save();
        }

        res.json({ message: 'Allotment cancelled and Quarter vacated' });
    } catch (error) {
        res.status(500).json({ error: 'Cancellation failed' });
    }
};
