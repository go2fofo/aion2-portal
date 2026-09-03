/*
 * @Author: fofo
 * @Date: 2026-09-03 14:28:31
 * @LastEditTime: 2026-09-03 14:29:18
 * @LastEditors: fofo
 * @Description: 自动更新版本号
 * * @FilePath: /aion2-portal/scripts/update-version.js
 */
const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, '../nuxt.config.ts');

try {
  let content = fs.readFileSync(configPath, 'utf8');
  const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  
  // 匹配 appVersion: `AIon2 S3 v0.2.6 (20260812)`
  const versionRegex = /appVersion:\s*`AIon2 S3 v(\d+)\.(\d+)\.(\d+)\s*\(\d+\)`/;
  const match = content.match(versionRegex);

  if (match) {
    const major = match[1];
    const minor = match[2];
    const patch = parseInt(match[3], 10) + 1; // 每次打包补丁版本自动 +1
    const newVersionString = `AIon2 S3 v${major}.${minor}.${patch} (${today})`;

    content = content.replace(versionRegex, `appVersion: \`${newVersionString}\``);
    fs.writeFileSync(configPath, content, 'utf8');
    
    console.log(`✨ 自动更新版本成功: ${newVersionString}`);
  }
} catch (err) {
  console.error('❌ 自动更新版本失败:', err);
  process.exit(1);
}