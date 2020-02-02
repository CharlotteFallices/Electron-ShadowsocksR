import path from 'path'
import { Menu, Tray, nativeImage } from 'electron'
import { appConfig$ } from './data'
import * as handler from './tray-handler'
import { groupConfigs } from '../shared/utils'
import { isMac, isWin } from '../shared/env'

const osTrayIcon = isMac ? 'tray_mac.png' : (isWin ? 'tray_win.png' : 'tray_win@2x.png')
let tray

/**
 * 生成服务器子菜单
 * @param {*Array<Object>} configs ssr配置集合
 * @param {*Number} selectedIndex 选中的ssr配置的索引
 */
function generateConfigSubmenus (configs, selectedIndex) {
  const groups = groupConfigs(configs, selectedIndex)
  const submenus = Object.keys(groups).map(key => {
    const configs = groups[key]
    return {
      label: `${configs.some(config => config.checked) ? '● ' : ''}${key}`,
      submenu: configs.map(config => {
        return {
          label: `${config.remarks}(${config.server}:${config.server_port})`,
          type: 'checkbox',
          checked: config.checked,
          click (e) {
            handler.switchConfig(e.menu.items.indexOf(e))
          }
        }
      })
    }
  })
  if (!configs || !configs.length) {
    submenus.push({ label: 'none', enabled: false })
  }
  submenus.push({ type: 'separator' })
  submenus.push({ label: '编辑服务器', click: handler.showManagePanel })
  submenus.push({ label: '订阅管理', click: handler.showSubscribes })
  submenus.push({ label: '更新订阅服务器', click: handler.updateSubscribes })
  return submenus
}

/**
 * 根据应用配置生成菜单
 * @param {Object} appConfig 应用配置
 */
function generateMenus (appConfig) {
  return [
    { label: '开启应用', type: 'checkbox', checked: appConfig.enable, click: handler.toggleEnable },
    { label: '系统代理模式        ', submenu: [
      { label: '不启用代理', type: 'checkbox', checked: appConfig.sysProxyMode === 0, click: () => handler.toggleProxy(0) },
      { label: 'PAC代理', type: 'checkbox', checked: appConfig.sysProxyMode === 1, click: () => handler.toggleProxy(1) },
      { label: '全局代理', type: 'checkbox', checked: appConfig.sysProxyMode === 2, click: () => handler.toggleProxy(2) }
    ] },
    { label: 'PAC', submenu: [
      { label: '更新PAC', click: handler.updatePac }
    ] },
    { label: '服务器', submenu: generateConfigSubmenus(appConfig.configs, appConfig.index) },
    { label: '二维码扫描', click: handler.scanQRCode },
    { label: '配置', submenu: [
      { label: '选项设置...', click: handler.showOptions },
      { label: '导入gui-config.json文件', click: handler.importConfigFromFile },
      { label: '导出gui-confi.gjson文件', click: handler.exportConfigToFile },
      { label: '从剪贴板批量导入ssr://地址', click: handler.importConfigFromClipboard },
      { label: '打开配置文件', click: handler.openConfigFile }
    ] },
    { label: '复制http代理设置', click: handler.copyHttpProxyCode },
    { label: '帮助', submenu: [
      { label: '检查更新', click: handler.checkUpdate },
      { label: '查看日志', click: handler.openLog },
      { label: '项目主页', click: () => { handler.openURL('https://github.com/erguotou520/electron-ssr') } },
      { label: 'Bug反馈', click: () => { handler.openURL('https://github.com/erguotou520/electron-ssr/issues') } },
      { label: '捐赠', click: () => { handler.openURL('https://github.com/erguotou520/donate') } },
      { label: '打开开发者工具', click: handler.openDevtool }
    ] },
    { label: '退出', click: handler.exitApp }
  ]
}

// 根据配置显示tray tooltip
function getTooltip (appConfig) {
  if (!appConfig.enable) {
    return 'ShadowsocksR客户端：应用未启动'
  }
  const arr = []
  if (appConfig.enable) {
    arr.push('ShadowsocksR客户端：应用已启动\n')
  }
  arr.push('代理启动方式：')
  if (appConfig.sysProxyMode === 0) {
    arr.push('未启用代理')
  } else if (appConfig.sysProxyMode === 1) {
    arr.push('PAC代理')
  } else if (appConfig.sysProxyMode === 2) {
    arr.push('全局代理')
  }
  const selectedConfig = appConfig.configs[appConfig.index]
  if (selectedConfig) {
    arr.push('\n')
    arr.push(`${selectedConfig.group ? selectedConfig.group + ' - ' : ''}${selectedConfig.remarks || (selectedConfig.server + ':' + selectedConfig.port)}`)
  }
  return arr.join('')
}

/**
 * 更新任务栏菜单
 * @param {Object} appConfig 应用配置
 */
function updateTray (appConfig) {
  const menus = generateMenus(appConfig)
  const contextMenu = Menu.buildFromTemplate(menus)
  tray.setContextMenu(contextMenu)
  tray.setToolTip(getTooltip(appConfig))
}

/**
 * 渲染托盘图标和托盘菜单
 */
export default function renderTray (appConfig) {
  // 生成tray
  tray = new Tray(nativeImage.createFromPath(path.join(__static, osTrayIcon)))
  updateTray(appConfig)
  tray.on((isMac || isWin) ? 'double-click' : 'click', handler.showMainWindow)
}

/**
 * 销毁托盘
 */
export function destroyTray () {
  if (tray) {
    tray.destroy()
  }
}

// 监听数据变更
appConfig$.subscribe(data => {
  const [appConfig, changed] = data
  if (['enable', 'sysProxyMode', 'configs', 'index'].some(key => changed.indexOf(key) > -1)) {
    updateTray(appConfig)
  }
})
