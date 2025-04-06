const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Detect if running in Replit
const isReplit = process.env.REPL_ID && process.env.REPL_SLUG;

// Configuration
const config = {
  // How often to check for changes (in milliseconds)
  checkInterval: isReplit ? 120000 : 60000, // 2 minutes on Replit, 1 minute locally
  
  // Minimum time between pushes (in milliseconds)
  minPushInterval: isReplit ? 300000 : 300000, // 5 minutes
  
  // Branch to push to
  branch: 'main',
  
  // Files to ignore (in addition to .gitignore)
  ignorePatterns: [
    '.git',
    'node_modules',
    'auto-push.js.lock',
    'auto-push.log',
    'auto-push.pid'
  ],
  
  // Commit message template (supports dynamic values)
  commitMessageTemplate: 'Auto-update via Replit: {{changedFiles}} | {{timestamp}}',
  
  // Max number of files to list in commit message
  maxFilesToList: 3,
  
  // Show colorful console output
  enableColors: true,
  
  // Log level: 0 = minimal, 1 = normal, 2 = verbose
  logLevel: isReplit ? 1 : 2
};

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  underscore: '\x1b[4m',
  blink: '\x1b[5m',
  reverse: '\x1b[7m',
  hidden: '\x1b[8m',
  
  black: '\x1b[30m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m'
};

// State tracking
let lastPushTime = 0;
let fileHashes = {};
let lockFile = path.join(__dirname, 'auto-push.js.lock');

// Colored logging utility
function log(message, level = 1, color = null) {
  if (level > config.logLevel) return;
  
  const timestamp = new Date().toISOString();
  const prefix = `[${timestamp}] [AutoPush]`;
  
  if (config.enableColors && color) {
    console.log(`${colors[color]}${prefix} ${message}${colors.reset}`);
  } else {
    console.log(`${prefix} ${message}`);
  }
}

// Replit-specific setup
function setupReplit() {
  if (!isReplit) return false;
  
  log('Detected Replit environment. Applying Replit-specific configurations...', 0, 'magenta');
  
  try {
    // Ensure Git is configured properly for Replit
    if (!execSync('git config --get user.name', { stdio: 'pipe' }).toString().trim()) {
      execSync('git config --global user.name "Mountain Edge Homes"');
      execSync('git config --global user.email "auto-push@mountainedgehomes.com"');
      log('Configured Git user for Replit', 1, 'green');
    }
    
    // Make sure we're using credential.helper store
    execSync('git config --global credential.helper store');
    
    return true;
  } catch (error) {
    log(`Failed to configure Replit: ${error.message}`, 0, 'red');
    return false;
  }
}

// Create a lock file to prevent multiple instances
function createLock() {
  try {
    if (fs.existsSync(lockFile)) {
      const lockData = fs.readFileSync(lockFile, 'utf8');
      const lockInfo = JSON.parse(lockData);
      const now = Date.now();
      
      // Check if lock is stale (older than 10 minutes)
      if (now - lockInfo.timestamp < 600000) {
        log(`Another instance is already running (PID: ${lockInfo.pid})`, 0, 'red');
        process.exit(1);
      }
      
      log(`Found stale lock file. Overriding...`, 1, 'yellow');
    }
    
    // Create a new lock file
    fs.writeFileSync(lockFile, JSON.stringify({
      pid: process.pid,
      timestamp: Date.now()
    }));
  } catch (error) {
    log(`Failed to create lock file: ${error.message}`, 0, 'red');
  }
}

// Release lock when the script exits
function releaseLock() {
  try {
    if (fs.existsSync(lockFile)) {
      fs.unlinkSync(lockFile);
    }
  } catch (error) {
    log(`Failed to release lock: ${error.message}`, 1, 'red');
  }
}

// Calculate hash for a file
function getFileHash(filePath) {
  try {
    const content = fs.readFileSync(filePath);
    return crypto.createHash('md5').update(content).digest('hex');
  } catch (error) {
    log(`Error hashing file ${filePath}: ${error.message}`, 2, 'red');
    return null;
  }
}

// Check if file should be ignored
function shouldIgnore(filePath) {
  // Check custom ignore patterns
  for (const pattern of config.ignorePatterns) {
    if (filePath.includes(pattern)) {
      return true;
    }
  }
  
  // Respect .gitignore
  try {
    const result = execSync(`git check-ignore ${filePath}`, { stdio: 'pipe' }).toString().trim();
    return result !== '';
  } catch (error) {
    // File is not ignored
    return false;
  }
}

// Get all files in the project recursively
function getAllFiles(dir = __dirname, fileList = []) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (shouldIgnore(filePath)) {
      continue;
    }
    
    if (stat.isDirectory()) {
      getAllFiles(filePath, fileList);
    } else {
      fileList.push(filePath);
    }
  }
  
  return fileList;
}

// Load current state of the repository
function loadCurrentState() {
  log('Loading current repository state...', 1, 'blue');
  const files = getAllFiles();
  const newHashes = {};
  
  for (const file of files) {
    const relativePath = path.relative(__dirname, file);
    const hash = getFileHash(file);
    if (hash) {
      newHashes[relativePath] = hash;
    }
  }
  
  log(`Loaded ${Object.keys(newHashes).length} files`, 1, 'green');
  return newHashes;
}

// Check for changes between current state and previous state
function checkForChanges() {
  const newHashes = loadCurrentState();
  const changedFiles = [];
  
  // Check for new or modified files
  for (const [file, hash] of Object.entries(newHashes)) {
    if (!fileHashes[file] || fileHashes[file] !== hash) {
      changedFiles.push(file);
    }
  }
  
  // Check for deleted files
  for (const file of Object.keys(fileHashes)) {
    if (!newHashes[file]) {
      changedFiles.push(file);
    }
  }
  
  // Update stored hashes
  fileHashes = newHashes;
  
  return changedFiles;
}

// Create a meaningful commit message
function getCommitMessage(changedFiles) {
  let filesDescription = '';
  
  if (changedFiles.length === 0) {
    filesDescription = 'No files changed';
  } else if (changedFiles.length === 1) {
    filesDescription = `Updated ${changedFiles[0]}`;
  } else if (changedFiles.length <= config.maxFilesToList) {
    filesDescription = `Updated ${changedFiles.join(', ')}`;
  } else {
    const listedFiles = changedFiles.slice(0, config.maxFilesToList);
    filesDescription = `Updated ${listedFiles.join(', ')} and ${changedFiles.length - config.maxFilesToList} more`;
  }
  
  const timestamp = new Date().toLocaleString();
  
  return config.commitMessageTemplate
    .replace('{{changedFiles}}', filesDescription)
    .replace('{{timestamp}}', timestamp)
    .replace('{{count}}', changedFiles.length.toString());
}

// Push changes to GitHub
async function pushChanges(changedFiles) {
  if (changedFiles.length === 0) {
    log('No changes detected', 1, 'yellow');
    return;
  }
  
  // Check if we've pushed recently
  const now = Date.now();
  if (now - lastPushTime < config.minPushInterval) {
    log(`Last push was too recent. Waiting for next cycle...`, 1, 'yellow');
    return;
  }
  
  const commitMessage = getCommitMessage(changedFiles);
  
  try {
    log(`Detected ${changedFiles.length} changed files. Preparing to push...`, 0, 'green');
    
    if (config.logLevel >= 2) {
      log(`Changed files: ${changedFiles.join(', ')}`, 2, 'cyan');
    }
    
    // Add all changes
    log('Adding changes...', 1, 'blue');
    execSync('git add .', { stdio: 'pipe' });
    
    // Commit with message
    log(`Committing with message: "${commitMessage}"`, 1, 'blue');
    execSync(`git commit -m "${commitMessage}"`, { stdio: 'pipe' });
    
    // Push to remote
    log(`Pushing to ${config.branch}...`, 0, 'blue');
    execSync(`git push origin ${config.branch}`, { stdio: 'pipe' });
    
    lastPushTime = now;
    log(`Successfully pushed ${changedFiles.length} changes to GitHub!`, 0, 'green');
    
    // Celebrate with ASCII art for maximum awesomeness
    if (config.logLevel >= 1) {
      console.log(`${colors.green}
   ____  _  _  ____  _  _    ____  _  _  ____  ____  ____  ____  ____  _  _  ____ 
  / ___)/ )( \\/ ___)/ )( \\  / ___)/ )( \\/ ___)(  __)/ ___)(  __)/ ___)/ )( \\/ ___)
 ( (___ ) \\/ (\\___ \\) __ (  \\___ \\) \\/ (\\___ \\ ) _) \\___ \\ ) _) \\___ \\) \\/ (\\___ \\
  \\___/\\____/(____/\\_)(_/  (____/\\____/(____/(____)(____/(____)(____/\\____/(____/
      ${colors.reset}`);
    }
    
  } catch (error) {
    log(`Failed to push changes: ${error.message}`, 0, 'red');
    
    // Log the complete error for debugging
    if (config.logLevel >= 2) {
      console.error(error);
    }
  }
}

// Main function to monitor and push changes
async function monitorAndPush() {
  try {
    const changedFiles = checkForChanges();
    await pushChanges(changedFiles);
  } catch (error) {
    log(`Error in monitor cycle: ${error.message}`, 0, 'red');
  }
  
  // Schedule next check
  setTimeout(monitorAndPush, config.checkInterval);
}

// Startup banner
function showStartupBanner() {
  console.log(`${colors.cyan}
  _____           __  __                       __  _           __   ____           __  
 / ___/__ ___ _  / /_/ /  __ _____  ___ ___  / /_(_)______ __/ /  / __ \\__ _____ / /_ 
/ (_ / _ \`/  ' \\/ __/ _ \\/ // / _ \\/ -_) _ \\/ __/ / __/ -_) _  /  / /_/ / // (_-</ __/
\\___/\\_,_/_/_/_/\\__/_//_/\\_, /_//_/\\__/_//_/\\__/_/\\__/\\__/\\_,_/   \\____/\\_,_/___/\\__/ 
                        /___/                                                          
${colors.reset}`);
  log(`Starting automatic GitHub push service...`, 0, 'magenta');
  log(`Checking interval: ${config.checkInterval / 1000} seconds`, 1, 'cyan');
  log(`Minimum push interval: ${config.minPushInterval / 60000} minutes`, 1, 'cyan');
}

// Handle script termination
process.on('SIGINT', () => {
  log('Received SIGINT. Shutting down...', 0, 'yellow');
  releaseLock();
  process.exit(0);
});

process.on('SIGTERM', () => {
  log('Received SIGTERM. Shutting down...', 0, 'yellow');
  releaseLock();
  process.exit(0);
});

// Start the service
showStartupBanner();

// Initialize based on environment
if (isReplit) {
  log('Running in Replit environment', 0, 'blue');
  setupReplit();
} else {
  log('Running in standard environment', 0, 'blue');
}

createLock();
fileHashes = loadCurrentState();
monitorAndPush();

log(`Auto-push service is now running with PID ${process.pid}`, 0, 'green');
if (isReplit) {
  log(`Changes will be automatically pushed to GitHub from Replit`, 0, 'green');
}
