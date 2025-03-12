const { Connection, clusterApiUrl } = require('@solana/web3.js');

// Create connection to TestNet
const connection = new Connection(clusterApiUrl('testnet'), 'confirmed');

// Function to check connection
async function checkConnection() {
  try {
    const version = await connection.getVersion();
    console.log('Connection established to Solana TestNet:');
    console.log('Version:', version);
    return true;
  } catch (error) {
    console.error('Connection failed:', error);
    return false;
  }
}

// Run test if file is executed directly
if (require.main === module) {
  checkConnection()
    .then(connected => {
      if (connected) {
        console.log('✅ Connection successful');
      } else {
        console.log('❌ Connection failed');
      }
    })
    .catch(console.error);
}

module.exports = { connection, checkConnection };