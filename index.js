#!/usr/bin/env node

// console.log("linan-cli脚手架工具");
const program = require('commander')
//从git上下载东西的工具
const download = require('download-git-repo')
//解析读取到的文件
const handlebars = require('handlebars')
const inquirer = require('inquirer')
const fs = require('fs')

const ora = require('ora')
const chalk = require('chalk')

program
  .version('0.1.0')
  

  //定义模板仓库地址
const templates = {
  'tpl-a': {
    url:'https://github.com/linan-0110/tpl_a',  //仓库地址
    downloadURL: "https://github.com:linan-0110/tpl_a#master",  //下载地址
    description: '李楠的cli练手--a'
  },
  'tpl-b': {
    url:'https://github.com/linan-0110/tpl_b',
    downloadURL: "https://github.com:linan-0110/tpl_b#master", 
    description: '李楠的cli练手--b'
  },
  'tpl-c': {
    url:'https://github.com/linan-0110/tpl_c',
    downloadURL: "https://github.com:linan-0110/tpl_c#master", 
    description: '李楠的cli练手--c'
  },
  'tpl-vue': {
    url:'https://github.com/linan-0110/tpl-vue',
    downloadURL: "https://github.com:linan-0110/tpl-vue#master", 
    description: '李楠的项目模板 一个基于Vue、vuex、axios、vue-router的电商项目模板'
  },
  'tpl-react-antd': {
    url:'https://github.com/linan-0110/tpl-react-antd',
    downloadURL: "https://github.com:linan-0110/tpl-react-antd#master", 
    description: '李楠的项目模板 一个基于react antd实现后台项目模板'
  },
}

program
  .command('init <templateName> <projectName>')
  .description('初始化项目模板')
  .option("-s, --setup_mode [mode]", "Which setup mode to use")
  .action(function(templateName, projectName){
    //根据模板名到Github上下载相应模板并重命名
    console.log("模板来源 >>> " + chalk.cyan(templates[templateName].url));
    //添加loading效果
    const spinner = ora("正在下载，请等待...").start()

    const { downloadURL, url } = templates[templateName]
    //download 第一个参数：仓库地址   第二个参数：下载路径
    download(downloadURL, projectName, {clone: true}, (err) => {
      if(err) {
        spinner.fail()  //下载失败提示
        console.error("下载失败")
        console.error("错误："+ err)
        return
      }else {
        spinner.succeed()  //下载成功提示
        //把package.json文件读取出来
        //使用向导方式采集用户输入的值
        //使用模板引擎把用户输入的数据解析到package.json文件中
        //解析完毕，将解析后的数据写入package.json文件中
        inquirer.prompt([{
          type: 'input',
          name: 'name',
          message: '请输入项目名字'
        },{
          type: 'input',
          name: 'description',
          message: '请输入项目描述'
        },{
          type: 'input',
          name: 'author',
          message: '请输入作者名称'
        }
      ]).then(answers => {
          const packagePath = `${projectName}/package.json` //package.json文件路径
          const packageContent = fs.readFileSync(packagePath,'utf8')
          //handlebars 编译读取到的内容 为 渲染函数  再传入用户输入的数据
          const packageResult = handlebars.compile(packageContent)(answers)
          // console.log(packageResult);
          fs.writeFileSync(packagePath, packageResult)
          console.log(chalk.yellow("初始化模板成功！"))
        })
      }
    })
    
  });

program
  .command('list')
  .description('查看所有可用模板')
  .option("-s, --setup_mode [mode]", "Which setup mode to use")
  .action(() => {
    for(let key in templates) {
      console.log(`${chalk.cyan("★")}  ${chalk.cyan(key)} ${chalk.magenta('  >>>  ')}  ${templates[key].description}`)
    }
  });
//p6
program.parse(process.argv);