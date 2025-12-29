const express = require('express');
require('dotenv').config();
const cors = require('cors');
const sequelize = require('./config/database');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Import Models to ensure they are registered
require('./models/User');
require('./models/NonEmployee');
require('./models/Quarter');
require('./models/Allotment');
require('./models/Bill');
require('./models/Complaint');
require('./models/Block');

const authRoutes = require('./routes/auth');
const nonEmployeeRoutes = require('./routes/nonEmployees');
const quarterRoutes = require('./routes/quarters');
const allotmentRoutes = require('./routes/allotments');
const billRoutes = require('./routes/bills');
const complaintRoutes = require('./routes/complaints');
const blockRoutes = require('./routes/blocks');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/nonEmployees', nonEmployeeRoutes);
app.use('/api/quarters', quarterRoutes);
app.use('/api/allotments', allotmentRoutes);
app.use('/api/bills', billRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/blocks', blockRoutes);

app.get('/', (req, res) => {
    res.send('Residency Management System API');
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('Unhandled Error:', err);
    res.status(500).json({
        message: 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Sync Database & Start Server
sequelize.sync({ force: false }).then(() => {
    console.log('Database synced');
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}).catch(err => {
    console.error('Database connection error:', err);
});
