<div align="center">

<h1>ddz-vue</h1>
<p>
  <strong>斗地主vue版</strong>,
  <a href="http://voocel.com:88">在线体验地址</a>
</p>

<p>
  <sub>❤︎ 此为客户端vue版, 需要配合服务端使用。
    <a href="https://github.com/voocel/ddz">斗地主服务端</a>
  </sub>
</p>

<img src="https://img.shields.io/badge/vue-2.6.11-brightgreen.svg" alt="vue">

<img src="https://img.shields.io/badge/element--ui-2.13.2-brightgreen.svg" alt="element-ui">

<img src="https://img.shields.io/github/license/mashape/apistatus.svg" alt="license">
</div>

## 前言

>三人斗地主实时对战，AI斗地主，实现基于权重的智能机器人对打。

## 功能

-   [x] 游戏逻辑
-   [x] 登录/注销
-   [x] 游戏大厅
-   [x] 创建/加入房间
-   [x] 随机匹配
-   [x] 智能AI
-   [x] 托管出牌
-   [x] 断线重连
-   [x] 超时自动出牌
-   [x] 换桌
-   [ ] 提示出牌
-   [ ] 解散房间
-   [ ] 聊天
-   [ ] 结算

## 安装步骤

```
#克隆存储库
git clone https://github.com/voocel/ddz-vue.git

#进入应用目录与安装依赖
cd ddz-vue

#安装项目依赖，等待安装完成之后，安装失败可用 cnpm 或 yarn
npm install

#开启服务器，浏览器访问 http://localhost:8080
npm run serve

#执行构建命令，生成的dist文件夹放在服务器下即可访问
npm run build
```
<a href="http://voocel.com:88">演示地址: http://voocel.com:88</a>

演示环境账号密码：

账号 | 密码| 描述
---|---|---
test1 | 123456 |普通账户
test2 | 123456 |普通账户
test3 | 123456 |普通账户

## 预览 效果图

![登录界面](https://voocel.com/storage/img/login.jpeg)
![大厅界面](https://voocel.com/storage/img/hall.jpeg)
![游戏开始界面](https://voocel.com/storage/img/start.jpeg)
![出牌界面](https://voocel.com/storage/img/play.jpeg)