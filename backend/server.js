const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Import Models to ensure they are registered
require('./models/User');
require('./models/UnEmployee');
require('./models/Quarter');
require('./models/Allotment');
require('./models/Bill');
require('./models/Complaint');

const authRoutes = require('./routes/auth');
const unEmployeeRoutes = require('./routes/unEmployees');
const quarterRoutes = require('./routes/quarters');
const allotmentRoutes = require('./routes/allotments');
const billRoutes = require('./routes/bills');
const complaintRoutes = require('./routes/complaints');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/unEmployees', unEmployeeRoutes);
app.use('/api/quarters', quarterRoutes);
app.use('/api/allotments', allotmentRoutes);
app.use('/api/bills', billRoutes);
app.use('/api/complaints', complaintRoutes);

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
