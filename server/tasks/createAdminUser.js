const db = require('../db/connection');
const users = db.get('users');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function createAdminUser() {
    try {
        const user = await users.findOne({ role: 'admin' });
        if(!user) {
            await users.insert({
                username: 'admin123',
                password: await bcrypt.hash(process.env.DEFAULT_ADMIN_PASSWORD, 12),
                active: true,
                role: 'admin'
            });
            console.log('Admin User Created!');
        }else {
            console.log('Admin user already exists!');
        }
    }catch(error) {
        console.log(error);
    }finally {
        db.close();
    }

};
createAdminUser();