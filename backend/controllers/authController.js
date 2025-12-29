const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET || 'secret_key', {
        expiresIn: '1d'
    });
};

exports.register = async (req, res) => {
    const { username, password, role } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ username, password: hashedPassword, role });
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Registration failed', details: error.message });
    }
};

exports.login = async (req, res) => {
    const username = req.body.username?.trim();
    const password = req.body.password?.trim();
    try {
        const user = await User.findOne({ where: { username } });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        console.log('Password match:', isMatch);
        if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

        const token = generateToken(user.id, user.role);
        res.json({ token, role: user.role, username: user.username });
    } catch (error) {
        res.status(500).json({ error: 'Login failed', details: error.message });
    }
};

const NonEmployee = require('../models/NonEmployee');

const fs = require('fs');
const path = require('path');

exports.loginWithPhone = async (req, res) => {
    const phoneNumber = req.body.phoneNumber ? req.body.phoneNumber.toString().trim() : '';
    const otp = req.body.otp;
    // Note: OTP validation is simulated on client side or skipped here for demo.
    // In production, verify verifyOTP(phoneNumber, otp)

    try {
        // Find resident with loose string matching (trim)
        // Since we can't trust exact match if DB has spaces, we might want to check exact first then findAll
        let resident = await NonEmployee.findOne({ where: { phoneNumber } });

        if (!resident) {
            // Fallback: Check all if exact match fails (handles dirty data)
            const allResidents = await NonEmployee.findAll();
            resident = allResidents.find(r => r.phoneNumber && r.phoneNumber.toString().trim() === phoneNumber);
        }

        if (!resident) {
            return res.status(404).json({ error: 'Phone number not registered' });
        }

        // Find corresponding user account. Assumes username == privatePartyCode
        const user = await User.findOne({ where: { username: resident.privatePartyCode } });
        if (!user) {
            return res.status(404).json({ error: 'User account not found for this resident' });
        }

        const token = generateToken(user.id, user.role);
        res.json({ token, role: user.role, username: user.username });

    } catch (error) {
        console.error('Login failed:', error);
        res.status(500).json({ error: 'Login failed', details: error.message });
    }
};
