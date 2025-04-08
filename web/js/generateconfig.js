// generateConfig.js
const fs = require('fs');

const config = `export default {
  API_KEY: '${process.env.API_KEY}',
};`;

fs.writeFileSync(`src/config.js`, config);