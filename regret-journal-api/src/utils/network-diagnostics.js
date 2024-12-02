const dns = require('dns');
const net = require('net');
const { URL } = require('url');

async function testMongoDBConnection(connectionString) {
  return new Promise((resolve, reject) => {
    try {
      // Extract hostname from connection string
      const url = new URL(connectionString);
      const hostname = url.hostname;

      console.log(`🔍 Comprehensive Network Diagnostics`);
      console.log(`🌐 Hostname: ${hostname}`);

      // Use resolveSrv for MongoDB Atlas SRV records
      dns.resolveSrv(`_mongodb._tcp.${hostname}`, (err, addresses) => {
        if (err) {
          console.error('❌ SRV Record Resolution Failed:', err);
          console.log('Possible Causes:');
          console.log('1. Incorrect cluster name');
          console.log('2. Network connectivity issues');
          console.log('3. DNS server problems');
          
          // Additional network troubleshooting hints
          console.log('\n🌍 Network Troubleshooting Tips:');
          console.log('- Verify MongoDB Atlas cluster name');
          console.log('- Check internet connection');
          console.log('- Temporarily disable VPN');
          console.log('- Flush DNS cache (ipconfig /flushdns)');
          
          return reject(err);
        }

        console.log(`✅ SRV Records Found: ${addresses.length}`);
        addresses.forEach((srv, index) => {
          console.log(`   Record ${index + 1}: ${srv.name}:${srv.port} (priority: ${srv.priority}, weight: ${srv.weight})`);
        });

        if (addresses.length === 0) {
          console.error('❌ No MongoDB servers found in SRV records');
          return reject(new Error('No MongoDB servers found'));
        }

        // Try to connect to the first available server
        const firstServer = addresses[0];
        const socket = new net.Socket();
        socket.setTimeout(5000);

        socket.connect(firstServer.port, firstServer.name, () => {
          console.log(`✅ TCP Connection Successful to ${firstServer.name}:${firstServer.port}`);
          socket.destroy();
          resolve(true);
        });

        socket.on('timeout', () => {
          console.error('❌ Connection Timeout');
          console.log('Possible Causes:');
          console.log('1. Firewall blocking connection');
          console.log('2. Network restrictions');
          console.log('3. MongoDB Atlas network settings');
          
          socket.destroy();
          reject(new Error('Connection Timeout'));
        });

        socket.on('error', (err) => {
          console.error('❌ Socket Connection Error:', err);
          console.log('Detailed Error Analysis:');
          console.log(`Error Code: ${err.code}`);
          console.log(`Error Message: ${err.message}`);
          
          socket.destroy();
          reject(err);
        });
      });
    } catch (error) {
      console.error('❌ Unexpected Diagnostic Error:', error);
      reject(error);
    }
  });
}

// Additional utility for comprehensive network check
function networkHealthCheck() {
  console.log('🌐 Performing Comprehensive Network Health Check');
  
  // Check DNS servers
  const dnsServers = [
    '8.8.8.8',   // Google
    '1.1.1.1',   // Cloudflare
    '9.9.9.9'    // Quad9
  ];

  dnsServers.forEach(server => {
    try {
      const socket = new net.Socket();
      socket.setTimeout(2000);
      
      socket.connect(53, server, () => {
        console.log(`✅ DNS Server ${server} is reachable`);
        socket.destroy();
      });

      socket.on('timeout', () => {
        console.log(`❌ DNS Server ${server} is not responding`);
        socket.destroy();
      });

      socket.on('error', (err) => {
        console.log(`❌ Error connecting to DNS Server ${server}: ${err.message}`);
        socket.destroy();
      });
    } catch (error) {
      console.error(`Error checking DNS server ${server}:`, error);
    }
  });
}

module.exports = { 
  testMongoDBConnection, 
  networkHealthCheck 
};
