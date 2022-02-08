const shell = require('shelljs');
const fs = require('fs');

fs.exists(".husky", (exists) => {
  if (!exists) {
    // 添加husky hooks
    shell.exec('pnpm husky');
    shell.exec('npx husky add .husky/pre-commit "yarn lint-staged"');
    shell.exec('git add .husky/pre-commit');
    console.log("初始化创建创建`.husky`文件夹成功!");
  } else {
    console.log(".husky已存在");
  }
});


