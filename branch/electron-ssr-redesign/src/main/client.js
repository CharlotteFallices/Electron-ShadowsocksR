import path from 'path'
import { exec } from 'child_process'
import treeKill from 'tree-kill'
import { ssrLogPath } from './bootstrap'
import { appConfig$ } from './data'
import logger from './logger'

let child

/**
 * 运行shell命令并写入到日志中
 * @param {*String} command 待执行的shell命令
 */
export function runCommand (command) {
  if (command) {
    child = exec(command)
    child.stdout.on('data', logger.log)
    child.stderr.on('data', logger.error)
    child.on('close', logger.log)
    return child
  }
}

/**
 * 运行ssr
 * @param {*Object} config ssr配置
 * @param {*String} ssrPath local.py的路径
 * @param {*[Number|String]} localPort 本地共享端口
 */
export function run (config, ssrPath, shareOverLan = false, localPort = 1080) {
  // currentConfig = config
  // 先结束之前的
  stop()
  // 参数
  const params = []
  params.push(`-s ${config.server}`)
  params.push(`-p ${config.server_port}`)
  params.push(`-k ${config.password}`)
  params.push(`-m ${config.method}`)
  params.push(`-O ${config.protocol}`)
  config.protocolparam && params.push(`-G ${config.protocolparam}`)
  config.obfs && params.push(`-o ${config.obfs}`)
  config.obfs_param && params.push(`-g ${config.obfs_param}`)
  params.push(`-b ${shareOverLan ? '0.0.0.0' : '127.0.0.1'}`)
  params.push(`-l ${localPort}`)
  config.timeout && params.push(`-t ${config.timeout}`)
  params.push(`--log-file ${ssrLogPath}`)
  // FIXME
  const command = `python "${path.join(ssrPath, 'local.py')}" ${params.join(' ')}`
  if (process.env.NODE_ENV === 'development') {
    console.log('run command: %s', command)
  } else {
    logger.debug('run command: %s', command)
  }
  child = runCommand(command)
}

/**
 * 结束command的后台运行
 */
export function stop () {
  if (child && child.pid) {
    if (process.env.NODE_ENV === 'development') {
      console.log('Kill python client')
    } else {
      logger.log('Kill python client')
    }
    treeKill(child.pid)
    child = null
  }
}

/**
 * 根据配置运行python命令
 * @param {Object} appConfig 应用配置
 */
function runWithConfig (appConfig) {
  if (appConfig.ssrPath && appConfig.enable && appConfig.configs && appConfig.configs[appConfig.index]) {
    run(appConfig.configs[appConfig.index], appConfig.ssrPath, appConfig.shareOverLan, appConfig.localPort)
  }
}

// 监听配置变化
appConfig$.subscribe(data => {
  const [appConfig, changed] = data
  // 初始化
  if (changed.length === 0) {
    runWithConfig(appConfig)
  } else {
    if (changed.indexOf('enable') > -1) {
      if (appConfig.enable) {
        runWithConfig(appConfig)
      } else {
        stop()
      }
    } else if (appConfig.enable) {
      if (['ssrPath', 'index', 'localPort', 'configs', 'shareOverLan'].some(key => changed.indexOf(key) > -1)) {
        // TODO: 优化 只有选中的配置发生改变时才重新运行
        runWithConfig(appConfig)
      }
    }
  }
})
