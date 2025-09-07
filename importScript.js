// Script to import and structure ambalan_data.json into separate MongoDB collections
// Run this script within mongosh

// --- Instructions ---
// 1. Save your JSON data into a file named 'ambalan_data.json' in the same directory where you run mongosh.
// 2. Start mongosh and connect to your database (e.g., `use ambalanDB`).
// 3. Load this script into mongosh using the load() command: `load('importScript.js')`
// 4. The script will automatically read the file, process it, and create structured collections.
// --------------------

// Import the 'fs' (File System) module to read the file
import fs from 'fs';

// Define the filename
const fileName = 'ambalan_data.json';

console.log(`Starting import process for ${fileName}...`);

try {
    // Read the JSON file synchronously
    const dataString = fs.readFileSync(fileName, 'utf8');
    
    // Parse the JSON string into a JavaScript object
    const data = JSON.parse(dataString);
    
    // --- 1. Site Configuration Collection ---
    // This collection will hold general site-wide information.
    const siteInfoCollection = db.getCollection('siteInfo');
    siteInfoCollection.drop(); // Clear existing data to prevent duplicates
    siteInfoCollection.insertOne({
        _id: 'mainConfig', // Use a fixed ID for easy retrieval
        socialLinks: data.socialLinks,
        copyright: data.copyright
    });
    console.log("✅ Collection 'siteInfo' created and populated successfully.");

    // --- 2. Navigation Collection ---
    // Storing navigation items.
    const navigationCollection = db.getCollection('navigation');
    navigationCollection.drop();
    navigationCollection.insertMany(data.navigation);
    console.log(`✅ Collection 'navigation' populated with ${data.navigation.length} items.`);

    // --- 3. Stats Collection ---
    // Storing site statistics.
    const statsCollection = db.getCollection('stats');
    statsCollection.drop();
    statsCollection.insertMany(data.stats);
    console.log(`✅ Collection 'stats' populated with ${data.stats.length} items.`);

    // --- 4. Leadership Periods Collection ---
    // Storing historical leadership data.
    const leadershipPeriodsCollection = db.getCollection('leadershipPeriods');
    leadershipPeriodsCollection.drop();
    leadershipPeriodsCollection.insertMany(data.leadershipPeriods);
    console.log(`✅ Collection 'leadershipPeriods' populated with ${data.leadershipPeriods.length} records.`);

    // --- 5. Pages Collection ---
    // Storing the content of each individual page.
    // We will iterate through the 'pages' object and create a document for each page.
    const pagesCollection = db.getCollection('pages');
    pagesCollection.drop();
    const pagesToInsert = Object.keys(data.pages).map(pageKey => {
        return {
            pageId: pageKey, // e.g., 'tentangKami', 'fotoKegiatan'
            ...data.pages[pageKey] // Spread the rest of the page data
        };
    });
    pagesCollection.insertMany(pagesToInsert);
    console.log(`✅ Collection 'pages' populated with ${pagesToInsert.length} documents.`);

    console.log("\n🚀 Import complete! All data has been successfully structured into collections.");

} catch (err) {
    console.error("❌ An error occurred during the import process:", err);
    if (err.code === 'ENOENT') {
        console.error(`Error: The file '${fileName}' was not found. Please make sure it's in the same directory where you are running mongosh.`);
    }
}
