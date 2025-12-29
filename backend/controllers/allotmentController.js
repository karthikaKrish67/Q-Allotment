const Allotment = require('../models/Allotment');
const Quarter = require('../models/Quarter');
const NonEmployee = require('../models/NonEmployee');
const User = require('../models/User');

// Get all allotments
exports.getAllAllotments = async (req, res) => {
    try {
        const allotments = await Allotment.findAll({
            include: [
                { model: Quarter, attributes: ['id', 'quarterNumber', 'block', 'type', 'status'] },
                { model: NonEmployee, attributes: ['id', 'name', 'phoneNumber', 'privatePartyCode', 'address'] }
            ],
            order: [['createdAt', 'DESC']]
        });
        res.json(allotments);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch allotments', details: error.message });
    }
};

exports.allotQuarter = async (req, res) => {
    const { nonEmployeeId, quarterId } = req.body;
    try {
        // Check if Quarter is Vacant
        const quarter = await Quarter.findByPk(quarterId);
        if (!quarter) return res.status(404).json({ error: 'Quarter not found' });
        if (quarter.status === 'Occupied') return res.status(400).json({ error: 'Quarter is already occupied' });

        // Check if NonEmployee exists
        const nonEmployee = await NonEmployee.findByPk(nonEmployeeId);
        if (!nonEmployee) return res.status(404).json({ error: 'NonEmployee not found' });

        // Create Allotment
        const allotment = await Allotment.create({
            NonEmployeeId: nonEmployeeId,
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

// Get allotment for the logged-in resident
exports.getMyAllotment = async (req, res) => {
    try {
        const userId = req.user.id;

        // 1. Find the User record
        const user = await User.findByPk(userId);
        if (!user) return res.status(404).json({ error: 'User not found' });

        // 2. Find the resident matching this user (username == privatePartyCode)
        const resident = await NonEmployee.findOne({
            where: { privatePartyCode: user.username }
        });

        if (!resident) {
            return res.status(404).json({ error: 'Resident profile not found' });
        }

        // 3. Find active allotment for this resident
        const allotment = await Allotment.findOne({
            where: { NonEmployeeId: resident.id, status: 'Active' },
            include: [
                { model: Quarter },
                { model: NonEmployee }
            ]
        });

        if (!allotment) {
            return res.status(200).json(null); // Return null if no active allotment
        }

        res.json(allotment);
    } catch (error) {
        console.error('Error fetching my-allotment:', error);
        res.status(500).json({ error: 'Failed to fetch your allotment details' });
    }
};
