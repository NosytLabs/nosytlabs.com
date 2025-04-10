/**
 * Automated MongoDB backup script
 * Uses mongodump to export the database daily
 */

const { exec } = require('child_process');
const path = require('path');
const cron = require('node-cron');
const fs = require('fs');

const backupDir = path.join(__dirname, 'backups');
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir);
}

let latestBackupStatus = {
  timestamp: null,
  success: false,
  message: 'No backup run yet'
};

function runBackup() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const outDir = path.join(backupDir, `backup-${timestamp}`);
  const cmd = `mongodump --uri="mongodb://localhost:27017/radiation_admin" --out="${outDir}"`;

  console.log(`[Backup] Starting backup at ${timestamp}`);
  exec(cmd, (error, stdout, stderr) => {
    if (error) {
      console.error(`[Backup] Error: ${error.message}`);
      latestBackupStatus = {
        timestamp,
        success: false,
        message: error.message
      };
      return;
    }
    if (stderr) {
      console.error(`[Backup] Stderr: ${stderr}`);
    }

    // Basic verification: check if dump folder exists and contains expected db folder
    const dbDumpPath = path.join(outDir, 'radiation_admin');
    fs.access(dbDumpPath, fs.constants.R_OK, (err) => {
      if (err) {
        console.error(`[Backup] Verification failed: dump folder missing`);
        latestBackupStatus = {
          timestamp,
          success: false,
          message: 'Dump folder missing or unreadable'
        };
      } else {
        console.log(`[Backup] Backup verified successfully: ${outDir}`);
        latestBackupStatus = {
          timestamp,
          success: true,
          message: 'Backup and verification successful'
        };
      }
    });
  });
}

function getBackupStatus() {
  return latestBackupStatus;
}

module.exports = { runBackup, getBackupStatus };

// Schedule daily at 2:00 AM
cron.schedule('0 2 * * *', () => {
  runBackup();
});

console.log('Automated backup system initialized. Daily at 2:00 AM.');