#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

// Path to built JavaScript file
const filePath = path.resolve('./build/index.js');

console.log(`Adding shebang to: ${filePath}`);

// Read the file
fs.readFile(filePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    process.exit(1);
  }

  // Add shebang line if it doesn't already exist
  if (!data.startsWith('#!/usr/bin/env node')) {
    const newContent = `#!/usr/bin/env node\n\n${data}`;
    
    // Write the file back
    fs.writeFile(filePath, newContent, 'utf8', (err) => {
      if (err) {
        console.error('Error writing file:', err);
        process.exit(1);
      }
      console.log('Shebang added successfully!');
    });
  } else {
    console.log('Shebang already exists, no changes made.');
  }
});
