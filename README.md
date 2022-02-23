# font-cli

```sh
npx font-cli -h

  iconfont React 组件生成工具

  使用:
    font [参数] [url]

  参数:
    -t, --type      只生成类型
    -p, --preview   只生成预览文件
    -o, --out       自定义生成路径 [默认: IconFont]
    -c, --config    自定配置文件 [默认: font.config.json]
        --init      生成配置文件
        --prune     修剪图标名前缀
    -s, --singleton 单例模式，多次多版本加载，只会保留最新一份
    -h, --help      显示帮助
    -v, --version   显示版本

  例子: 
    # 生成组件到 IconFont 目录
    font //at.alicdn.com/t/font_2404456_tifhzvgpsp.js
    # 生成组件到 src/components/MyIcon 目录
    font //at.alicdn.com/t/font_2404456_tifhzvgpsp.js -o src/components/MyIcon
    # 生成组件到 IconFont 目录，并去除图标名 icon- 前缀
    font --prune //at.alicdn.com/t/font_2404456_tifhzvgpsp.js
    # 生成组件到 IconFont 目录，并替换图标名 icon- 前缀为 myicon-
    font --prune icon-=myicon- //at.alicdn.com/t/font_2404456_tifhzvgpsp.js
    # 生成 font.config.json 配置到当前目录
    font --init
    # 生成 myconfig.json 配置到当前目录
    font --init myconfig.json
    # 调用自定义配置
    font -c myconfig.json
    # 调用 font.config.json 配置，如果配置不存在则输出帮助信息
    font
```
