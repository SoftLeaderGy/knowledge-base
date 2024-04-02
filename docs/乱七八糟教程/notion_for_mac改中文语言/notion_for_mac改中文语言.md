## 1、下载notion
## 2、下载notion中文语言包
[阿里云盘分享](https://www.aliyundrive.com/s/y2msxAnsfrE)
或
[https://github.com/Reamd7/notion-zh_CN/releases/](https://github.com/Reamd7/notion-zh_CN/releases/)
## 3、配置

1. 打开Finder，应用程序，右键notion.app，显示应用包内容（自2.0.4版本后，任意语言都等价于中文了）
2. 打开 Notion.app\Contents\Resources\app\renderer\ 
3. 下载 notion-zh_CN.js 到上述文件夹（renderer）
4. 使用记事本打开 renderer 文件夹内的 preload.js 文件，在最后一行，添加以下代码，然后保存。
```java
require("./notion-zh_CN") // 添加这一行
```

5. 关闭notion，重新打开notion即变为中文。

---


