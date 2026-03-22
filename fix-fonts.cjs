const fs = require('fs');
const path = require('path');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace text-[...] with appropriate standard sizes
  // text-[0.35rem] to text-[10px] -> text-sm
  content = content.replace(/text-\[(0\.\d+rem|10px)\]/g, 'text-sm');
  
  // text-[1rem], text-[1.2rem] -> text-base
  content = content.replace(/text-\[1(\.2)?rem\]/g, 'text-base');
  
  // text-[1.5rem], text-[1.618rem], text-[2rem] -> text-2xl
  content = content.replace(/text-\[(1\.5|1\.618|2)rem\]/g, 'text-2xl');
  
  // text-[2.618rem], text-[clamp(...)], text-[4.236rem], text-[6.854rem], text-[25vw], text-[20vw] -> text-6xl
  content = content.replace(/text-\[(2\.618|4\.236|6\.854)rem\]/g, 'text-6xl');
  content = content.replace(/text-\[clamp\([^)]+\)\]/g, 'text-6xl');
  content = content.replace(/text-\[(20|25)vw\]/g, 'text-6xl');
  
  // Also md:text-[...]
  content = content.replace(/md:text-\[(0\.\d+rem|10px)\]/g, 'md:text-sm');
  content = content.replace(/md:text-\[1(\.2)?rem\]/g, 'md:text-base');
  content = content.replace(/md:text-\[(1\.5|1\.618|2)rem\]/g, 'md:text-2xl');
  content = content.replace(/md:text-\[(2\.618|4\.236|6\.854)rem\]/g, 'md:text-6xl');
  content = content.replace(/md:text-\[clamp\([^)]+\)\]/g, 'md:text-6xl');
  content = content.replace(/md:text-\[(20|25)vw\]/g, 'md:text-6xl');

  fs.writeFileSync(filePath, content, 'utf8');
}

const files = [
  'src/App.tsx',
  'src/pages/About.tsx',
  'src/pages/Contact.tsx',
  'src/pages/Services.tsx',
  'src/pages/Team.tsx'
];

files.forEach(processFile);
console.log('Done');
