"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedProducts = seedProducts;
require("dotenv/config");
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
// Données de test pour les utilisateurs
const testUsers = [
    {
        email: 'admin@test.com',
        password: 'admin123',
        role: 'ADMIN'
    },
    {
        email: 'user1@test.com',
        password: 'user123',
        role: 'USER'
    },
    {
        email: 'user2@test.com',
        password: 'user123',
        role: 'USER'
    },
    {
        email: 'user3@test.com',
        password: 'user123',
        role: 'USER'
    }
];
// Données de test pour les produits
const testProducts = [
    // Électronique
    { name: 'iPhone 15 Pro', price: 1199.99, userEmail: 'admin@test.com' },
    { name: 'MacBook Pro M3', price: 2499.99, userEmail: 'admin@test.com' },
    { name: 'AirPods Pro', price: 249.99, userEmail: 'user1@test.com' },
    { name: 'iPad Air', price: 599.99, userEmail: 'user1@test.com' },
    { name: 'Apple Watch Series 9', price: 399.99, userEmail: 'user2@test.com' },
    { name: 'Samsung Galaxy S24', price: 999.99, userEmail: 'user2@test.com' },
    { name: 'Sony WH-1000XM5', price: 399.99, userEmail: 'user3@test.com' },
    { name: 'Nintendo Switch OLED', price: 349.99, userEmail: 'user3@test.com' },
    // Vêtements
    { name: 'T-shirt Nike', price: 29.99, userEmail: 'user1@test.com' },
    { name: 'Jean Levis 501', price: 89.99, userEmail: 'user2@test.com' },
    { name: 'Sneakers Adidas', price: 120.00, userEmail: 'user3@test.com' },
    { name: 'Pull Zara', price: 45.99, userEmail: 'user1@test.com' },
    { name: 'Veste The North Face', price: 199.99, userEmail: 'user2@test.com' },
    // Maison & Jardin
    { name: 'Aspirateur Dyson', price: 399.99, userEmail: 'admin@test.com' },
    { name: 'Machine à café Nespresso', price: 149.99, userEmail: 'user1@test.com' },
    { name: 'Table Ikea', price: 79.99, userEmail: 'user2@test.com' },
    { name: 'Chaise ergonomique', price: 299.99, userEmail: 'user3@test.com' },
    { name: 'Lampadaire design', price: 89.99, userEmail: 'user1@test.com' },
    // Livres & Média
    { name: 'Clean Code - Robert Martin', price: 35.99, userEmail: 'admin@test.com' },
    { name: 'Design Patterns - Gang of Four', price: 49.99, userEmail: 'user1@test.com' },
    { name: 'The Pragmatic Programmer', price: 29.99, userEmail: 'user2@test.com' },
    { name: 'System Design Interview', price: 39.99, userEmail: 'user3@test.com' },
    // Sport & Fitness
    { name: 'Dumbbells 10kg', price: 45.99, userEmail: 'user1@test.com' },
    { name: 'Yoga Mat Premium', price: 29.99, userEmail: 'user2@test.com' },
    { name: 'Tapis de course', price: 599.99, userEmail: 'admin@test.com' },
    { name: 'Raquette de tennis', price: 89.99, userEmail: 'user3@test.com' },
    // Alimentation
    { name: 'Café en grains premium', price: 24.99, userEmail: 'user1@test.com' },
    { name: 'Thé vert bio', price: 12.99, userEmail: 'user2@test.com' },
    { name: 'Chocolat artisanal', price: 18.99, userEmail: 'user3@test.com' },
    { name: 'Miel de lavande', price: 15.99, userEmail: 'admin@test.com' }
];
async function seedProducts() {
    try {
        console.log('🌱 Début du seeding des produits...');
        // Nettoyer les données existantes (optionnel)
        console.log('🧹 Nettoyage des données existantes...');
        await prisma.product.deleteMany({});
        await prisma.user.deleteMany({});
        // Créer les utilisateurs de test
        console.log('👥 Création des utilisateurs de test...');
        const createdUsers = [];
        for (const userData of testUsers) {
            const hashedPassword = await bcryptjs_1.default.hash(userData.password, 10);
            const user = await prisma.user.create({
                data: {
                    email: userData.email,
                    password: hashedPassword,
                    role: userData.role
                }
            });
            createdUsers.push(user);
            console.log(`✅ Utilisateur créé: ${user.email} (${user.role})`);
        }
        // Créer un mapping email -> userId
        const emailToUserId = new Map();
        createdUsers.forEach(user => {
            emailToUserId.set(user.email, user.id);
        });
        // Créer les produits de test
        console.log('📦 Création des produits de test...');
        let productCount = 0;
        for (const productData of testProducts) {
            const userId = emailToUserId.get(productData.userEmail);
            if (!userId) {
                console.warn(`⚠️  Utilisateur non trouvé pour ${productData.userEmail}`);
                continue;
            }
            const product = await prisma.product.create({
                data: {
                    name: productData.name,
                    price: productData.price,
                    userId: userId
                }
            });
            productCount++;
            console.log(`✅ Produit créé: ${product.name} - ${product.price}€ (par ${productData.userEmail})`);
        }
        console.log(`\n🎉 Seeding terminé avec succès !`);
        console.log(`📊 Statistiques:`);
        console.log(`   - ${createdUsers.length} utilisateurs créés`);
        console.log(`   - ${productCount} produits créés`);
        console.log(`\n🔐 Comptes de test disponibles:`);
        console.log(`   - admin@test.com / admin123 (ADMIN)`);
        console.log(`   - user1@test.com / user123 (USER)`);
        console.log(`   - user2@test.com / user123 (USER)`);
        console.log(`   - user3@test.com / user123 (USER)`);
    }
    catch (error) {
        console.error('❌ Erreur lors du seeding:', error);
        throw error;
    }
    finally {
        await prisma.$disconnect();
    }
}
// Exécuter le script si appelé directement
// Vérification si le script est exécuté directement (pas importé)
const isMainModule = process.argv[1] && process.argv[1].endsWith('seed-products.ts');
if (isMainModule) {
    seedProducts()
        .then(() => {
        console.log('✅ Script de seeding terminé');
        process.exit(0);
    })
        .catch((error) => {
        console.error('❌ Erreur fatale:', error);
        process.exit(1);
    });
}
//# sourceMappingURL=seed-products.js.map