## vue 项目模版
### 1、安装、运行
```js
npm i
"scripts": {
    "start": "npm run dev",
    "dev": "node ./build/dev.js",
    "build": "node ./build/build.js", // 打包
    "analyz": "NODE_ENV=production npm_config_report=true npm run build", // 查看打包情况
    "et-var": "./node_modules/.bin/et -i ./src/style/element-ui/element-variables.scss", // 生成element-ui sass变量，如果使用element-ui
    "et-theme": "./node_modules/.bin/et -c ./src/style/element-ui/element-variables.scss -o ./src/style/element-ui/theme", // 生成element-ui 主题，如果使用
}
```

### 2、目录结构说明