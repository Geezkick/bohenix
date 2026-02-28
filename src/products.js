// src/products.js
// Single source of truth for all product data.

export const PRODUCTS = [
    // ─── ELECTRONICS ───
    {
        id: 'e1', cat: 'electronics', emoji: '💻',
        name: 'Quantum Core X1',
        desc: '64-core AI-optimised processor with on-chip neural inference engine and zero-latency memory fabric.',
        price: 12400,
    },
    {
        id: 'e2', cat: 'electronics', emoji: '🖥️',
        name: 'Neural Matrix V2',
        desc: 'Industrial edge-AI compute board with 128 TOPS and redundant power rails for 24/7 operation.',
        price: 8900,
    },
    {
        id: 'e3', cat: 'electronics', emoji: '📡',
        name: 'SkyLink 5G Module',
        desc: 'Sub-6GHz & mmWave 5G module with integrated GPS, dual LAN, and -40°C to 85°C tolerance for IoT deployments.',
        price: 3200,
    },
    {
        id: 'e4', cat: 'electronics', emoji: '⚡',
        name: 'PowerCore UPS 10kW',
        desc: 'Industrial uninterruptible power supply with lithium-iron battery, 10kW output, and real-time grid monitoring.',
        price: 5800,
    },
    {
        id: 'e5', cat: 'electronics', emoji: '🔌',
        name: 'BX Embedded Controller',
        desc: 'Ruggedised embedded controller for PLC applications — supports IEC 61131-3 and MQTT/OPC-UA natively.',
        price: 2100,
    },
    {
        id: 'e6', cat: 'electronics', emoji: '🔬',
        name: 'Precision Sensor Array',
        desc: 'Multi-parameter industrial sensor hub: temperature, vibration, pressure, and chemical detection in one unit.',
        price: 1450,
    },
    // ─── MACHINERY ───
    {
        id: 'm1', cat: 'machinery', emoji: '🦾',
        name: 'BX-Arm 6-Axis Robot',
        desc: '6-axis collaborative robotic arm with 12kg payload, vision system, and quick-swap end effector mount.',
        price: 48500,
    },
    {
        id: 'm2', cat: 'machinery', emoji: '⚙️',
        name: 'AutoLine CNC 5X',
        desc: '5-axis CNC machining centre: 0.001mm repeatability, 18,000 RPM spindle, and auto tool-change magazine.',
        price: 92000,
    },
    {
        id: 'm3', cat: 'machinery', emoji: '🏭',
        name: 'X-Pack Conveyor System',
        desc: 'Modular, variable-speed conveyor with built-in weight sensing, barcode scanning, and route logic.',
        price: 16800,
    },
    {
        id: 'm4', cat: 'machinery', emoji: '🔧',
        name: 'Torque Press BP-20',
        desc: 'Servo-electric press with 200kN force, real-time force-displacement monitoring, and Industry 4.0 connectivity.',
        price: 34000,
    },
    {
        id: 'm5', cat: 'machinery', emoji: '🌊',
        name: 'HydroJet Cutter Pro',
        desc: 'Waterjet cutting system — 90,000 PSI, 5-axis motion, cuts steel, carbon fibre, ceramics, and stone.',
        price: 67000,
    },
    {
        id: 'm6', cat: 'machinery', emoji: '🔩',
        name: 'Smart Gripping Unit',
        desc: 'Adaptive pneumatic gripper with force feedback, IP67 wash-down protection, and zero-slip pads.',
        price: 3900,
    },
    // ─── COMPONENTS ───
    {
        id: 'c1', cat: 'components', emoji: '🧩',
        name: 'BX Drive AC/DC 480V',
        desc: 'Variable frequency drive (VFD) for AC/DC motor control. 480V, 200A, compact DIN-rail format.',
        price: 780,
    },
    {
        id: 'c2', cat: 'components', emoji: '🔋',
        name: 'LiFePO4 Stack 48V',
        desc: 'Modular 48V lithium-iron battery stack for energy storage and backup. 300Ah, BMS included.',
        price: 4200,
    },
    {
        id: 'c3', cat: 'components', emoji: '📟',
        name: 'HMI Touchscreen 12"',
        desc: 'Industrial touchscreen HMI, IP65, Modbus/TCP + PROFINET, 12-inch sunlight-readable display.',
        price: 1120,
    },
];
