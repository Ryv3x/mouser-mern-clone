import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import connectDB from '../config/db.js';

dotenv.config();

const categoryList = [
  { name: 'Microcontrollers', slug: 'microcontrollers' },
  { name: 'Single Board Computers', slug: 'single-board-computers' },
  { name: 'Sensors', slug: 'sensors' },
  { name: 'Passive Components', slug: 'passive-components' },
  { name: 'Power Supplies', slug: 'power-supplies' },
  { name: 'Cables & Connectors', slug: 'cables-connectors' },
  { name: 'Display Modules', slug: 'display-modules' },
];

const getOrCreateCategories = async () => {
  const categories = {};
  
  for (const cat of categoryList) {
    try {
      // Find or create category
      let category = await Category.findOne({ slug: cat.slug });
      if (!category) {
        category = await Category.create({
          name: cat.name,
          slug: cat.slug,
          level: 0,
        });
        console.log(`✅ Created category: ${cat.name}`);
      } else {
        console.log(`📌 Found existing category: ${cat.name}`);
      }
      categories[cat.name] = category._id;
    } catch (error) {
      console.error(`❌ Error with category ${cat.name}:`, error.message);
    }
  }
  
  return categories;
};

const sampleProducts = [
  {
    name: 'Arduino UNO R3',
    description: 'Open-source microcontroller board based on the Microchip ATmega328P',
    categoryName: 'Microcontrollers',
    manufacturer: 'Arduino',
    price: 24.99,
    stock: 150,
    images: ['https://via.placeholder.com/500?text=Arduino+UNO+R3'],
    specifications: { type: 'Microcontroller', processor: 'ATmega328P', clock: '16 MHz' },
  },
  {
    name: 'Raspberry Pi 4B',
    description: 'Single-board computer with quad-core ARM CPU and 4GB RAM',
    categoryName: 'Single Board Computers',
    manufacturer: 'Raspberry Pi',
    price: 45.00,
    stock: 200,
    images: ['https://via.placeholder.com/500?text=Raspberry+Pi+4B'],
    specifications: { processor: 'ARM Cortex-A72', ram: '4GB', cores: 4 },
  },
  {
    name: 'ESP32 Development Board',
    description: 'Dual-core 32-bit MCU with WiFi and Bluetooth',
    categoryName: 'Microcontrollers',
    manufacturer: 'Espressif',
    price: 8.99,
    stock: 300,
    images: ['https://via.placeholder.com/500?text=ESP32+Dev+Board'],
    specifications: { processor: 'Xtensa 32-bit', wifi: 'Yes', bluetooth: 'Yes' },
  },
  {
    name: 'LED Resistor Kit (1000 pcs)',
    description: 'Assorted LED and resistor component kit',
    categoryName: 'Passive Components',
    manufacturer: 'Generic',
    price: 15.99,
    stock: 500,
    images: ['https://via.placeholder.com/500?text=LED+Resistor+Kit'],
    specifications: { quantity: 1000, types: 'LED, Resistor' },
  },
  {
    name: 'USB to Serial Adapter',
    description: 'FTDI FT232RL chipset USB to serial converter',
    categoryName: 'Cables & Connectors',
    manufacturer: 'FTDI',
    price: 19.99,
    stock: 120,
    images: ['https://via.placeholder.com/500?text=USB+Serial+Adapter'],
    specifications: { chipset: 'FT232RL', interface: 'USB 2.0', baud: '3 Mbps' },
  },
  {
    name: 'Breadboard Set 830 Ties',
    description: 'Solderless breadboard with 830 tie points',
    categoryName: 'Passive Components',
    manufacturer: 'Generic',
    price: 6.99,
    stock: 400,
    images: ['https://via.placeholder.com/500?text=Breadboard+830'],
    specifications: { tiePoints: 830, material: 'Plastic' },
  },
  {
    name: 'Jumper Wire Pack 65pcs',
    description: 'Assorted male-to-male, female-to-male jumper wires',
    categoryName: 'Cables & Connectors',
    manufacturer: 'Generic',
    price: 5.99,
    stock: 600,
    images: ['https://via.placeholder.com/500?text=Jumper+Wire+Pack'],
    specifications: { pieces: 65, types: 'M-M, F-M' },
  },
  {
    name: '16x2 LCD Display Module',
    description: 'Blue 16x2 character LCD display with I2C interface',
    categoryName: 'Display Modules',
    manufacturer: 'Generic',
    price: 12.99,
    stock: 180,
    images: ['https://via.placeholder.com/500?text=LCD+16x2'],
    specifications: { size: '16x2', interface: 'I2C', color: 'Blue' },
  },
  {
    name: 'Temperature Sensor DS18B20',
    description: '1-Wire digital temperature sensor with ±0.5°C accuracy',
    categoryName: 'Sensors',
    manufacturer: 'Maxim',
    price: 2.49,
    stock: 1000,
    images: ['https://via.placeholder.com/500?text=DS18B20+Sensor'],
    specifications: { accuracy: '±0.5°C', interface: '1-Wire', range: '-55 to +125°C' },
  },
  {
    name: 'Relay Module 5V',
    description: '5V single-channel relay module with indicator LED',
    categoryName: 'Power Supplies',
    manufacturer: 'Generic',
    price: 3.99,
    stock: 250,
    images: ['https://via.placeholder.com/500?text=5V+Relay+Module'],
    specifications: { voltage: '5V', channels: 1, current: '10A' },
  },
];

const seedProducts = async () => {
  try {
    await connectDB();
    console.log('✅ Connected to MongoDB\n');

    // Get or create categories
    console.log('📂 Setting up categories...');
    const categories = await getOrCreateCategories();
    console.log('\n');

    // Clear existing products
    await Product.deleteMany({});
    console.log('🗑️  Cleared existing products\n');

    // Create products with correct category ObjectIds
    console.log('📦 Creating sample products...');
    const productsToInsert = sampleProducts.map(product => ({
      ...product,
      category: categories[product.categoryName],
    }));

    const inserted = await Product.insertMany(productsToInsert);
    
    console.log(`\n✅ Successfully inserted ${inserted.length} sample products!\n`);
    
    // Display inserted products
    inserted.forEach((product, idx) => {
      console.log(`${idx + 1}. ${product.name} - $${product.price} (${product.stock} in stock)`);
    });

    console.log('\n✨ Product seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding products:', error.message);
    console.error('Details:', error);
    process.exit(1);
  }
};

seedProducts();
