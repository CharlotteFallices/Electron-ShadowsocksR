## 写在前面
原作者``@erguotou520``于2019年5月15日删除了并停止开发这个基于ssr-python的GUI,感谢原作者的付出

[English](https://github.com/CharlotteFallices/Electron-ShadowsocksR/edit/master/README_EN.md)|[Other Version](https://github.com/shadowsocks/shadowsocks/wiki/Ports-and-Clients)

## 注意事项
- 内置http_proxy,若需要同时使用其它同类代理,请按需进行配置<br>
- 本应用使用`gsetting`设置系统代理，所以有些Linux系统无法使用该功能,手动设置系统代理<br>
- 火狐浏览器请注意在浏览器设置中更改代理方式为使用系统代理或手动设置<br>
- Chrome浏览器默认使用系统代理<br>
- 对于macOS10.15.3(Catalina),**19D62e**及以上的beta版本请使用系统自带代理功能
- 此版本不支持`Spotlight`(**⌘-Space**)
- Windows系统切换全局代理不生效

## 2019-08-05更新
更新内容:<br>
- 增加原作者发布的0.2.5安装包,未在release发布请访问项目文件夹[0.2.5App](https://github.com/CharlotteFallices/electron-ssr-backup/tree/master/releases)<br>

## 下载
建议优先使用0.2.6版本[Github release](https://github.com/CharlotteFallices/electron-ssr-backup/releases/tag/v0.2.6)

## Debian系列安装与配置[Ubuntu.md](https://github.com/qingshuisiyuan/electron-ssr-backup/blob/master/Ubuntu.md)

## 收集已知问题和解决方案[issue.md](https://github.com/qingshuisiyuan/electron-ssr-backup/blob/master/issue.md)

## Issues

- 在发issue前请先在issue中搜索是否有同类issue<br>
- 发Bug类issue请详细描述你的使用环境<br>
- 欢迎在issues写出你们的经验,包括如何解决错误,依赖设置代理等<br>
- 合理的issue会收集到项目代码中

## 添加方式

- 手动添加配置
- 服务器订阅更新
- 二维码扫描(请确保屏幕中只有一个有效的二维码)
- 从剪贴板,配置文件导入
- 从ss/ssr链接添加配置(仅Mac和Windows)

## 功能特色
- 创建配置二维码,ssr链接
- 支持PAC,内置http_proxy可在选项(**⌘-,**)中关闭

## 配置文件位置

- Windows `C:\Users\{username}\AppData\Roaming\electron-ssr\gui-config.json`
- Mac `~/Library/Application Support/electron-ssr/gui-config.json`
- Linux `~/.config/gui-config.json`

## 快捷键

加入快捷键本来是为了解决部分Linux发行版无法显示图标导致功能无法使用而加入的,同时支持在设置中进行开启/关闭以及更换按键的操作

### 全局快捷键

- `CommandOrControl+Shift+W` 打开主窗口

### 应用内快捷键

- `CommandOrControl+Shift+B` 切换是否显示操作菜单,仅Linux可用

## 开发和构建

``` bash
# or npm install
yarn

# 开发时
npm run dev

# 打包构建
npm run build

# 单元测试
npm run mocha

# 代码风格检查
npm run lint

```
<br>
最后附上原作者的开发日志

#记录在开发electron-ssr过程中遇到的问题
------------------------------------------------------------------------------------------------------------------------------
首先是项目介绍，其实这个项目就是给shadowsocksr-python项目加一个GUI壳，所以它的功能就是为了FQ。GitHub地址在这

其次，本文这里只记录这此在2017年底开始的重构经历，因为之前的代码写得实在比较乱（我一开始只是打算练习用的。。。）。OK，话不多说，下面进入正题。

## 脚手架

我们在开发一个完整的功能的时候往往不是从零开始做（因为那太费时间和经历了，还得自己维护项目框架），这里我是从electron-vue项目初始化而来的。为什么用这个框架？跨平台用electron，前端开发用vue配合webpack，所以就选择了这个框架咯。

## 开发前的约定

之前其它分支的代码乱就是因为在开发之前没有做一个好的规划，然后就是哪用到什么就直接写，不方便后期维护和代码阅读。这次在开发之前做了几个简单的约定：

ipc通讯的channel要约定清楚，并且用常量定义，详见https://github.com/erguotou520/electron-ssr/blob/redesign/docs/EVENT_LIST.md(链接已失效)
主进程代码在src/main目录维护，渲染进程代码在src/renderer目录维护，两者通用代码在src/shared目录维护，第三方库在src/lib目录维护
主进程和渲染进程都使用数据驱动开发的方式开发，渲染进程使用vue开发，主进程使用rxjs开发，2个进程间使用ipc进行数据变更通知和更新
主进程和渲染进程代码统一使用ES6语法编写
项目目录结构

有了开发约定好就开始撸码，有些代码是从之前的分支中复制过来稍作改变便可，而大部分则是全新编写。src目录的大致结构如下：
src
├─lib
│ ├─proxy_conf_helper     # mac os上用于设置系统代理模式的helper
│ └─sysproxy.exe          # windows上用于设置系统代理模式的helper
├─main                    # main进程
│ ├─bootstrap.js          # 项目启动，初始化操作
│ ├─client.js             # shadowsocksr-python命令执行和终止
│ ├─data.js               # main进程的中央数据文件
│ ├─index.dev.js          # 开发环境的入口文件
│ ├─index.js              # 入口文件
│ ├─ipc.js                # 负责ipc通讯
│ ├─logger.js             # 日志
│ ├─pac.js                # 负责pac文件下载和提供pac地址
│ ├─proxy.js              # 设置系统代理模式
│ ├─tray-handler.js       # 任务栏操作方法
│ ├─tray.js               # 任务栏
│ └─window.js             # 页面窗口
├─renderer                # renderer进程
│ ├─assets                # 页面资源
│ ├─components            # vue组件
│ ├─qrcode                # 二维码识别
│ ├─store                 # renderer进程的中央数据
│ ├─views                 # 页面
│ ├─ipc.js                # 负责ipc通讯
│ ├─constants.js          # 常量定义
│ └─main.js               # 前端入口文件
└─shared                  # main和renderer共享文件夹
  ├─config.js             # 应用配置相关
  ├─env.js                # 应用环境相关
  ├─events.js             # ipc交互事件定义集合
  ├─ssr.js                # SSR配置对象
  └─utils.js              # 工具集

## renderer进程开发技术点

页面开发中用到了vue vuex 和iview组件库，其中iview稍微做了些修改。
vuex作为前端数据中心，维护了很多页面数据，页面的修改都是维护vuex的state。
鉴于页面内容不是特别多就没有使用vue-router，而是使用简单的component配置is属性做页面切换。
整个页面开发中最饶人的是我把扁平的configs数组变成了按分组显示的树形结构，导致整个交互变得极其复杂，最后在绕来绕去饶了好几次后还是使用数据驱动开发的思维解决。

## main进程开发技术点

由于main进程使用rxjs作为数据维护中心，而我又是第一次使用rxjs，所以在初期就遇到了不少问题。比如多处文件可能会触发（ipc和tray都会触发）数据变更，应该怎么去编写和改变Observable数据，比如支持多播以及和renderer进程保持同步。最后还是在data.js中统一初始化和改变数据（对外暴露可改变数据的方法）并提供多播能力，其它文件在使用时直接subscribe关注，在变更时使用data.js暴露的入口进行数据变更。这样在开发时数据的维护会更方便，而且可以保持每个文件尽量只关注自己的业务。
main进程最复杂的应该是设置系统代理功能。由于每个系统的调用方法不一致，所以要收集所有系统的实现方式，可以参考https://github.com/erguotou520/electron-ssr/blob/redesign/docs/AUTO_PROXY.md的收集结果（Linux系统中非gnome桌面如何实现还没有找到方法，如果你知道，欢迎提issue告知）(链接已失效)。

理论知道了只是第一步，实现是第二步。开开心心地用child_process.exec执行命令，开发时一切正常，happy。然而到了打包的时候懵逼了，没有可执行文件了。OK，我放到static目录下，还是不行，因为这些文件还是在asar压缩包里，没法复制和执行。最后在electron-builder中找到了extraFiles字段，就是用来将文件复制到项目根目录下的（如何找到项目根目录也是个坑，得使用app.getPaht(‘exe’)来实现`）。

目前还有一个问题也是mac上实现最大的问题。mac上使用networksetup设置需要sudo权限，而如何实现只弹框输入一次管理员密码就可以一直修改系统代理模式才是最大的难题。一开始使用networksetup命令实现时每次切换都需要输入密码，很烦。后来参考shadowsocks-NG项目，直接将它生成的proxy_conf_helper文件复制到项目里使用，但目前在打包后还是会闪退，目前仍在查找实现方案。然后使用sudo-prompt模块执行sudo命令将其拷贝到指定位置并赋权。

在打包到0.2.0-beta-1版本之前一直使用正常，忽然有人跟我说10.9.5版本的mac闪退，远程调试后才发现原来shadowsocks-NG的proxy_conf_helper不支持10.11以下版本，尴尬。目前最简单的方法就是检查mac版本，然后低于10.11版本的直接屏蔽切换代理的功能，当然有没有更优雅的实现方式还是有待继续思考的。
还有个有意思的问题是在0.2.0-alpha-4版本时提的issue。后来我重新查看了下NodeJs文档，发现确实用execFile更佳，因为它不是在shell中执行，避免了命令被特殊字符（比如&|"'等等）干扰的问题，这个问题倒是也让我学到了些开发经验。
一开始在开发PAC功能时考虑的是这个版本先按简单的来，满足最基本的pac功能即可，而且自己一般都是用chrome插件来选择性的FQ，所以开发完也没太测试。然后打版发布后有用户提BUG说PAC功能用不了，然后自己本地试了下啊，确实用不了（之前蜜汁自信了）。然后找原因啊，还求助了别人啊，愣是没发现哪里的错。一个偶然的情况下重新看到PAC原理才想起来我返回的pac内容里面根本没有指定socks地址和端口啊！后来想了想，因为ssr是要用一些特殊字段做标记然后使用运行时的变量来替换特殊字段的（简单的说就是pac.replace(/__PROXY__/g, 'socks5 127.0.0.1:1080')），这才明白错在哪，原来真相竟然就是这么简单，害我一开始还在那研究http服务器的问题。

## 其它的坑

配置向下兼容。如果再后期维护时添加了新的系统配置项，需要在系统初始化时复制到应用配置对象中并保存。
异常处理。错误文件？端口占用？
在更新订阅服务器时，同时使用window.fetch和electron.net.request来请求数据，并使用Promise.race来选择最快完成的数据。
mac系统打包后默认不能复制粘贴，需要添加Menu菜单和常见的一些菜单项来修复该问题。
