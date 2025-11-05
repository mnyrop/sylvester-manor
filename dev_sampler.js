const fs    = require('fs');
const path  = require('path');

async function createDevSample() {
  try {
    // Read the config file
    const configPath = path.join('config', 'canopy.json');
    const configData = fs.readFileSync(configPath, 'utf-8');
    const config = JSON.parse(configData);

    // Get the collection URL
    const collectionUrl = config.collection;
    if (!collectionUrl) {
      throw new Error('Collection URL not found in config file.');
    }

    // Fetch the collection JSON
    const response = await fetch(collectionUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch collection: ${response.statusText}`);
    }
    const collectionJson = await response.json();

    // Limit to first 50 items
    if (collectionJson.items && Array.isArray(collectionJson.items)) {
      collectionJson.items = collectionJson.items.slice(0, 50);
    } else {
      throw new Error('No items array found in collection JSON.');
    }

    // Write the dev_sample.json file
    const outputPath = path.join('public', 'dev_sample.json');
    fs.writeFileSync(outputPath, JSON.stringify(collectionJson, null, 2), 'utf-8');

    console.log('dev_sample.json created successfully.');
  } catch (error) {
    console.error('Error creating dev_sample.json:', error);
  }
}

createDevSample();

// To run this script from the command line, use the following command:
// node dev_sampler.js