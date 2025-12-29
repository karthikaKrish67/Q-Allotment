const sequelize = require('./config/database');
const Block = require('./models/Block');

const seedBlocks = async () => {
    try {
        await sequelize.sync();

        const blocks = [
            'Block 1', 'Block 2', 'Block 3', 'Block 4', 'Block 5'
        ];

        for (const name of blocks) {
            await Block.findOrCreate({
                where: { name },
                defaults: { name }
            });
        }

        console.log('Blocks seeded successfully');
        process.exit();
    } catch (error) {
        console.error('Error seeding blocks:', error);
        process.exit(1);
    }
};

seedBlocks();
