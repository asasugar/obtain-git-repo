const shell = require('shelljs');
const fs = require('fs');

fs.exists(".husky/_", (exists) => {
  if (!exists) {
    // 添加husky hooks
    shell.exec('pnpm husky');
    shell.exec('npx husky add .husky/pre-commit "yarn lint-staged"');
    shell.exec('git add .husky/pre-commit');
    console.log("---------------------初始化创建`husky hooks` 成功!---------------------");
  } else {
    console.log("---------------------husky hooks已存在,不重复生成-------------------");
  }
});


