#!/usr/bin/env node
// console.log("linan-cli脚手架工具");
// console.log(process.argv);
const program = require('commander')
//从git上下载东西的工具
const download = require('download-git-repo')
program
  .version('0.1.0')
  

  //定义模板仓库地址
const templates = {
  'tpl-a': {
    url:'https://github.com/liNan0/tpl_a',  //仓库地址
    downloadURL: "https://github.com:liNan0/tpl_a#master",  //下载地址
    description: '李楠的cli练手--a'
  },
  'tpl-b': {
    url:'https://github.com/liNan0/tpl_b',
    downloadURL: "https://github.com:liNan0/tpl_b#master", 
    description: '李楠的cli练手--b'
  },
  'tpl-c': {
    url:'https://github.com/liNan0/tpl_c',
    downloadURL: "https://github.com:liNan0/tpl_c#master", 
    description: '李楠的cli练手--c'
  }
}

program
  .command('init <templateName> <projectName>')
  .description('初始化项目模板')
  .option("-s, --setup_mode [mode]", "Which setup mode to use")
  .action(function(templateName, projectName){
    //根据模板名到Github上下载相应模板并重命名
    console.log("正在下载中请等待>>> # 仓库地址" + templates[templateName].url);
    
    const { downloadURL, url } = templates[templateName]
    //download 第一个参数：仓库地址   第二个参数：下载路径
    download(downloadURL, projectName, {clone: true}, (err) => {
      if(err) {
        console.log("下载失败");
      }else {
        console.log("下载成功");
      }
    })
    
  });

program
  .command('list')
  .description('查看所有可用模板')
  .option("-s, --setup_mode [mode]", "Which setup mode to use")
  .action(() => {
    for(let key in templates) {
      console.log(`${key}——${templates[key].description}`)
    }
  });
//p6
program.parse(process.argv);