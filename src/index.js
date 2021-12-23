const exec = require('child_process').exec
const path = require('path')
const os = require('os')
const { validate } = require('schema-utils')
const chalk = require('chalk')
const inquirer = require('inquirer')
const fs = require('fs-extra')
const schema = require('./schema.json')

const projectPath = path.join(process.cwd(), 'dist', 'dev', 'mp-weixin')
const uploadPath = path.join(process.cwd(), 'dist', 'build', 'mp-weixin')

const defaultOptions = {
  autoOpen: true, // 是否自动打开
  autoPublish: true, // 是否自动发布
}

class UniCommandWebpackPlugin {
  p = null
  constructor(options) {
    // 验证 options 是否符合规范

    this.currentOptions = { ...defaultOptions, ...options }
    validate(schema, this.currentOptions, {
      name: 'UniUsingComponentsWebpackPlugin',
    })
    this.minniCli = this.getMiniCli()
  }

  /**
   * 获取小程序的 CLI 位置
   */
  getMiniCli() {
    console.log(path.normalize(path.join(process.env.MINI_HOME, '/')))
    if (process.env.MINI_HOME) {
      return path.join(process.env.MINI_HOME, '/')
    }
    return ''
  }

  /**
   * 打开工具
   */
  open() {
    if (!fs.pathExistsSync(this.minniCli)) {
      console.log(
        chalk.bgRed(
          '使用 UniCommandWebpackPlugin 插件，请先按要求配置系统环境变量'
        )
      )
      return
    }
    let commader = ''
    if (process.env.NODE_ENV === 'production') {
      commader = `cli open --project ${uploadPath}`
    } else {
      commader = `cli open --project ${projectPath}`
    }
    this.p = exec(commader, {
      cwd: this.minniCli,
      stdio: 'inherit',
    })
    this.handleProcess()
  }

  handleProcess() {
    this.p.stdout.on('data', (data) => {
      console.log(data.toString())
    })

    this.p.stderr.on('data', (data) => {
      console.error(data.toString())
    })

    this.p.on('error', function (err) {
      console.log(err)
    })

    this.p.on('exit', function (err) {
      console.log('on exit event')
    })
  }

  // 发布小程序
  publish() {
    if (!fs.pathExistsSync(this.minniCli)) {
      console.log(
        chalk.bgRed(
          '使用 UniCommandWebpackPlugin 插件，请先按要求配置系统环境变量'
        )
      )
      return
    }
    inquirer
      .prompt([
        {
          type: 'input',
          name: 'ok',
          message: '是否发布小程序(Y/N)',
        },
      ])
      .then(({ ok }) => {
        if (ok.toLocaleLowerCase() === 'y') {
          inquirer
            .prompt([
              {
                type: 'input',
                name: 'version',
                message: '请填写版本号',
              },
              {
                type: 'input',
                name: 'mark',
                message: '请填写备注',
              },
            ])
            .then(({ version, mark }) => {
              if (!version) {
                console.log(chalk.bgRed('请填写版本号'))
                return
              }
              if (!mark) {
                console.log(chalk.bgRed('请填写备注'))
                return
              }
              this.p = exec(
                `cli upload --project ${uploadPath} -v ${version} -d ${mark}`,
                {
                  cwd: this.minniCli,
                  stdio: 'inherit',
                }
              )
              this.handleProcess()
            })
        }
      })
  }

  handleAfterDone() {
    // 是否自动打开
    if (this.currentOptions.autoOpen) {
      this.open()
    }
    // 是否自动发布
    if (
      this.currentOptions.autoPublish &&
      process.env.NODE_ENV === 'production'
    ) {
      setTimeout(() => {
        this.publish()
      }, 6000)
    }
  }

  apply(compiler) {
    compiler.hooks.done.tap('UniCommandWebpackPlugin', (stats) => {
      if (process.env.UNI_PLATFORM === 'mp-weixin') {
        this.handleAfterDone()
      }
    })
  }
}

module.exports = UniCommandWebpackPlugin
