const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');
const Village = require('../models/Village');
const User = require('../models/User');
require('dotenv').config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/gramaraksha');

    console.log('Connected to MongoDB. Starting data seeding...');

    // Clear existing data
    await Admin.deleteMany({});
    await Village.deleteMany({});
    await User.deleteMany({});

    // Create admin
    const admin = await Admin.create({
      username: 'superadmin',
      email: 'admin@gramaraksha.gov.in',
      password: 'Admin@123',
      role: 'super_admin',
      permissions: ['view_reports', 'manage_users', 'manage_ashas', 'export_data', 'system_config']
    });

    console.log('Admin created:', admin.email);

    // Create villages
    const villages = await Village.insertMany([
      {
        name: 'Ramapuram',
        district: 'Warangal',
        state: 'Telangana',
        pincode: '506002',
        population: 2500,
        householdCount: 520,
        phcName: 'Ramapuram PHC',
        phcDistance: 2.5,
        ashaWorkers: [
          { name: 'Lakshmi', phone: '9876543210', workerId: 'ASHA001' },
          { name: 'Sarita', phone: '9876543211', workerId: 'ASHA002' }
        ],
        coordinates: {
          latitude: 18.0,
          longitude: 79.5
        }
      },
      {
        name: 'Krishnapur',
        district: 'Hanamkonda',
        state: 'Telangana',
        pincode: '506001',
        population: 3200,
        householdCount: 680,
        phcName: 'Krishnapur PHC',
        phcDistance: 3.0,
        ashaWorkers: [
          { name: 'Padma', phone: '9876543212', workerId: 'ASHA003' }
        ],
        coordinates: {
          latitude: 18.1,
          longitude: 79.6
        }
      },
      {
        name: 'Venkatapur',
        district: 'Warangal',
        state: 'Telangana',
        pincode: '506003',
        population: 1800,
        householdCount: 390,
        phcName: 'Venkatapur PHC',
        phcDistance: 4.5,
        ashaWorkers: [
          { name: 'Savitri', phone: '9876543213', workerId: 'ASHA004' }
        ],
        coordinates: {
          latitude: 17.9,
          longitude: 79.4
        }
      }
    ]);

    console.log(`Villages created: ${villages.length}`);

    // Create sample users
    const users = await User.insertMany([
      {
        name: 'Ramesh Kumar',
        phone: '9999999901',
        age: 45,
        gender: 'male',
        villageId: villages[0]._id,
        existingConditions: ['diabetes', 'hypertension']
      },
      {
        name: 'Sita Devi',
        phone: '9999999902',
        age: 32,
        gender: 'female',
        villageId: villages[0]._id,
        isAshaWorker: true,
        ashaWorkerId: 'ASHA001'
      },
      {
        name: 'Venkatesh Rao',
        phone: '9999999903',
        age: 65,
        gender: 'male',
        villageId: villages[1]._id,
        existingConditions: ['heart_disease']
      },
      {
        name: 'Lakshmi Bai',
        phone: '9999999904',
        age: 28,
        gender: 'female',
        villageId: villages[1]._id
      },
      {
        name: 'Ravi Shankar',
        phone: '9999999905',
        age: 52,
        gender: 'male',
        villageId: villages[2]._id,
        existingConditions: ['asthma']
      }
    ]);

    console.log(`Users created: ${users.length}`);

    console.log('\n✅ Data seeding completed successfully!');
    console.log('\nLogin Credentials:');
    console.log('─────────────────────────────');
    console.log('Admin:');
    console.log(`  Email: ${admin.email}`);
    console.log('  Password: Admin@123');
    console.log('\nSample Users (phone login):');
    users.forEach(user => {
      console.log(`  ${user.name}: ${user.phone}`);
    });
    console.log('─────────────────────────────\n');

    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedData();
