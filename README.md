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
```js
- build // 构建目录
- cofig // 构建配置目录
- dll // 动态链接文件目录，主要是放一些不常改变的插件，可以提高打包速度，该目录是自动生成
    - vue // vue 相关不变的项目插件，vue vuex vue-router等
    - utils  // 工具型不变插件，axios lodash date-fns等
- lib // 项目打包等一些的工具包目录
- public // 存放一些公共资源，用于项目构建用，这些资源不会被copy到dist中去
- src // 项目源码目录
    - assets // 静态资源目录
        - iconfont // 字体图标目录，非必须，如果有，会自动生成字体表到style目录下的iconfont目录中
        - images // 存放项目图片资源
        - sprite // 雪碧图目录，非必须，如果有会打包到style目录下的sprite目录中, 打包规则是以目录为准，具体查看config/webpack.base.config.js
    - commponents // 项目级公共组件，建议每个组件一个文件夹，且使用大写字母开头
    - directive // 指令注册目录，如v-scroll v-copy等，尽可能使用指令，以简化流程
    - fetch // 请求封装目录
        - apiMap.js // 接口map文件
        - index.js // 对外输出方法文件
        - request.js // 核心封装文件，如果不想使用axios可在这里修改
        - status // 接口响应状态码定义页面，主要是为了在request.js中的拦截器使用
    - filter // 过滤器注册目录，针对一些需要格式化展示数据的方法可以注册过滤器
    - global // 用于在vue实例上挂载方法等需要全局操作的目录
    - mixins // vue 的mixins存放目录
    - plugins // vue 插件注册目录，默认vue-lazyload 图片懒加载插件，具体使用查看https://www.npmjs.com/package/vue-lazyload
    - router // 路由目录
    - static // 会被copy到dist/static中的资源目录
    - store // vuex插件下的store管理目录
    - style // 样式目录，使用sass
        - core // 核心目录，一些sass的变量、function、mixin等，已经通过loader隐藏注入到vue文件中，不需要再手动引入
            - function // sass的方法，这样在vue文件的style等可以使用过sass的方法，如 color(read);
            - mixin // sass的mixin，混合，这样在vue文件的style等可以使用，如 @include ellipsis();
            - _color.scss // 颜色常量，尽量在项目中使用这里面的颜色，如 colore: $color(red) 或者 color: color(red) 方法型，最好不要 color: ff0000;
            - _function.scss // sass方法文件
            - 。。。
        - iconfont // 非必须，生成的字体图标目录，目前需要手动引入到_core/_index.scss这样就可以在所有的地方使用包括vue文件style标签中
        - sprite // 非必须，生成的雪碧图目录，目前需要手动引入到_core/_index.scss这样就可以在所有的地方使用包括vue文件style标签中
        - _index.scss // 主样式文件
        - normalize.scss // 统一浏览器默认样式
    - utils // 工具目录，lodash date-fns也被统一进去了
    - views // 页面目录
    /**
     * 规则：
     * 1、每一个自定义文件夹代表了一个页面，该文件夹下的index.vue为主文件，这个页面下还有子页面请在创建文件夹
     * 2、属于当前页面的的业务组件放在components文件夹下，如果组件不只是这个页面使用请斟酌是否需要放到全局组件目录
     * 3、如果一个页面 a 的子页面 b 的访问路径需要反映出从属关系如 /a/b 需要在a中添加router-view标签，且在router中a组件下增加children
     * 4、对于一些复用度比较高的方法、数据、逻辑等，尽量放在mixins目录中，然后在业务页面中引入放在mixins属性中，如mixins: [formMixin]
     * 5、对于一些全局型、常量型数据或者获取方法，如 商品类型列表等，可以放在store目录中,然后在业务页面中使用vuex的方法引入、调用、刷新等
     */
    - App.vue // 项目入口根页面，用途：1、展示功能，可以用来做应用入口动画、广告等；2、逻辑功能，因为是刷新、第一次访问的必经页面、且只有一次，可以用来调用初始化应用的一些基础数据、恢复用户状态、判断是否登录、判断是否跳页等
    - main.js // 应用的入口js文件，用来初始化vue应用，执行一些前置脚本

```

### 3、构建配置介绍
