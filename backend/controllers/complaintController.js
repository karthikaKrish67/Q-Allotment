const Complaint = require('../models/Complaint');
const UnEmployee = require('../models/UnEmployee');

exports.createComplaint = async (req, res) => {
    try {
        const { unEmployeeId, description } = req.body;

        // Verify UnEmployee exists (usually from logged in user, but simplified here)
        const unEmployee = await UnEmployee.findByPk(unEmployeeId);
        if (!unEmployee) return res.status(404).json({ error: 'UnEmployee not found' });

        const complaint = await Complaint.create({
            UnEmployeeId: unEmployeeId,
            description,
            status: 'Pending'
        });

        res.status(201).json(complaint);
    } catch (error) {
        res.status(500).json({ error: 'Failed to raise complaint', details: error.message });
    }
};

exports.getAllComplaints = async (req, res) => {
    try {
        const complaints = await Complaint.findAll({ include: [UnEmployee] });
        res.json(complaints);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch complaints' });
    }
};

exports.updateComplaintStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const complaint = await Complaint.findByPk(req.params.id);
        if (!complaint) return res.status(404).json({ error: 'Complaint not found' });

        complaint.status = status;
        await complaint.save();

        res.json(complaint);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update complaint' });
    }
};
