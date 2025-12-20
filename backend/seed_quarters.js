const sequelize = require('./config/database');
const Quarter = require('./models/Quarter');

// 5 Blocks: 1, 2, 3, 4, 5 (numeric order)
// Each block has 10 quarters
// 4 Types: Type I, Type II, Type III, Type IV

const blocks = ['1', '2', '3', '4', '5'];
const types = ['Type I', 'Type II', 'Type III', 'Type IV'];

const seedQuarters = async () => {
    try {
        // Sync database - force will recreate the Quarters table with new schema
        await Quarter.sync({ force: true });

        console.log('Database synced successfully!');

        // Check if quarters already exist
        const existingQuarters = await Quarter.count();
        if (existingQuarters > 0) {
            console.log(`${existingQuarters} quarters already exist in the database.`);
            console.log('To reseed, delete existing quarters first or use --force flag.');

            // Check if we should force reseed
            if (process.argv.includes('--force')) {
                console.log('Force flag detected. Deleting existing quarters...');
                await Quarter.destroy({ where: {} });
                console.log('Existing quarters deleted.');
            } else {
                process.exit(0);
            }
        }

        const quarters = [];

        // Create 10 quarters for each of the 5 blocks
        for (const block of blocks) {
            for (let i = 1; i <= 10; i++) {
                // Assign types in a rotating manner (1-3: Type I, 4-5: Type II, 6-7: Type III, 8-10: Type IV)
                let type;
                if (i <= 3) {
                    type = 'Type I';
                } else if (i <= 5) {
                    type = 'Type II';
                } else if (i <= 7) {
                    type = 'Type III';
                } else {
                    type = 'Type IV';
                }

                quarters.push({
                    quarterNumber: `${block}-${String(i).padStart(2, '0')}`,
                    block: `Block ${block}`,
                    type: type,
                    status: 'Vacant'
                });
            }
        }

        // Bulk create all quarters
        await Quarter.bulkCreate(quarters);

        console.log(`✅ Successfully created ${quarters.length} quarters!`);
        console.log('\nQuarters distribution:');

        for (const block of blocks) {
            const blockQuarters = quarters.filter(q => q.block === `Block ${block}`);
            console.log(`  Block ${block}: ${blockQuarters.length} quarters`);
        }

        console.log('\nType distribution:');
        for (const type of types) {
            const typeCount = quarters.filter(q => q.type === type).length;
            console.log(`  ${type}: ${typeCount} quarters`);
        }

        process.exit(0);
    } catch (error) {
        console.error('Error seeding quarters:', error);
        process.exit(1);
    }
};

seedQuarters();
