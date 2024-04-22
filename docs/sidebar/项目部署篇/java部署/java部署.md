1、官网下载 jdk-8u231-linux-x64.tar.gz
地址（[https://www.oracle.com/technetwork/java/javase/downloads/jdk12-downloads-5295953.html](https://links.jianshu.com/go?to=https%3A%2F%2Fwww.oracle.com%2Ftechnetwork%2Fjava%2Fjavase%2Fdownloads%2Fjdk12-downloads-5295953.html)）
2、解压
```shell
tar -xzvf jdk-8u231-linux-x64.tar.gz -C /opt
```
3、配置环境变量
```shell
[root@xxx] vi /etc/profile
#export PATH USER LOGNAME MAIL HOSTNAME HISTSIZE HISTCONTROL下添加

#Java
export JAVA_HOME=/opt/jdk1.8.0_231
export PATH=$JAVA_HOME/bin:$PATH
```
4、刷新配置文件
```bash
[root@xxx] source /etc/profile
```
5、验证是否安装成功
```shell
[root@xxx] java -version

java version "1.8.0_231"
Java(TM) SE Runtime Environment (build 1.8.0_231-b11)
Java HotSpot(TM) 64-Bit Server VM (build 25.231-b11, mixed mode)
```

> **注意**
> 1. 在配置java环境变量的时候
> 2. 在‘source /etc/profile’时候提示-bash: TMOUT: readonly variable
> 3. 解决办法
> 4. 修改/etc/profile配置文件，将export TMOUT=600 readonly TMOUT 这两行注释掉
>    1. export TMOUT=600 :是用户在指定秒数内没有活动（操作）时间
>    2. readonly TMOUT: 是防止用户在命令行执行TMOUT=0操作
> 5. source /etc/profile ：重新加载配置文件，是其马上生效 

