## 一、遇到坑
> linux下启动Nacos报错：
> which: no javac in (/usr/lib64/qt-3.3/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/root/bin)
> readlink: 缺少操作数
> Try 'readlink --help' for more information.

解决方法：配置JAVA的环境变量

1. 找到jdk的安装位置
```shell
[root@localhost bin]# ls -lrt /usr/bin/java
lrwxrwxrwx 1 root root 22 Mar 15 09:59 /usr/bin/java -> /etc/alternatives/java
[root@localhost bin]# ls -lrt /etc/alternatives/java
lrwxrwxrwx 1 root root 73 Mar 15 09:59 /etc/alternatives/java -> /usr/lib/jvm/java-1.8.0-openjdk-1.8.0.242.b08-0.el7_7.x86_64/jre/bin/java
[root@localhost bin]# cd /usr/lib/jvm
[root@localhost jvm]# ll
total 4
drwxr-xr-x 3 root root 4096 Mar 15 09:59 java-1.8.0-openjdk-1.8.0.242.b08-0.el7_7.x86_64
lrwxrwxrwx 1 root root   21 Mar 15 09:59 jre -> /etc/alternatives/jre
lrwxrwxrwx 1 root root   27 Mar 15 09:59 jre-1.8.0 -> /etc/alternatives/jre_1.8.0
lrwxrwxrwx 1 root root   35 Mar 15 09:59 jre-1.8.0-openjdk -> /etc/alternatives/jre_1.8.0_openjdk
lrwxrwxrwx 1 root root   51 Mar 15 09:59 jre-1.8.0-openjdk-1.8.0.242.b08-0.el7_7.x86_64 -> java-1.8.0-openjdk-1.8.0.242.b08-0.el7_7.x86_64/jre
lrwxrwxrwx 1 root root   29 Mar 15 09:59 jre-openjdk -> /etc/alternatives/jre_openjdk
```

2. 在/etc/profile文件下添加以下代码
```shell
export JAVA_HOME=/usr/lib/jvm/jre-1.8.0-openjdk-1.8.0.242.b08-0.el7_7.x86_64/          
export JRE_HOME=$JAVA_HOME/jre
export CLASSPATH=$JAVA_HOME/lib:$JRE_HOME/lib:$CLASSPATH
export PATH=$JAVA_HOME/bin:$JRE_HOME/bin:$PATH
 
[root@localhost ~]# source /etc/profile
```

3. 重新执行nacos启动脚本
```shell
[root@localhost bin]# sh mystartup.sh -m standalone
/usr/lib/jvm/jre-1.8.0-openjdk-1.8.0.242.b08-0.el7_7.x86_64//bin/java  -Xms512m -Xmx512m -Xmn256m -Dnacos.standalone=true -Djava.ext.dirs=/usr/lib/jvm/jre-1.8.0-openjdk-1.8.0.242.b08-0.el7_7.x86_64//jre/lib/ext:/usr/lib/jvm/jre-1.8.0-openjdk-1.8.0.242.b08-0.el7_7.x86_64//lib/ext -Xloggc:/opt/nacos/nacos/logs/nacos_gc.log -verbose:gc -XX:+PrintGCDetails -XX:+PrintGCDateStamps -XX:+PrintGCTimeStamps -XX:+UseGCLogFileRotation -XX:NumberOfGCLogFiles=10 -XX:GCLogFileSize=100M -Dloader.path=/opt/nacos/nacos/plugins/health,/opt/nacos/nacos/plugins/cmdb,/opt/nacos/nacos/plugins/mysql -Dnacos.home=/opt/nacos/nacos -jar /opt/nacos/nacos/target/nacos-server.jar  --spring.config.location=classpath:/,classpath:/config/,file:./,file:./config/,file:/opt/nacos/nacos/conf/ --logging.config=/opt/nacos/nacos/conf/nacos-logback.xml --server.max-http-header-size=524288
nacos is starting with standalone
nacos is starting，you can check the /opt/nacos/nacos/logs/start.out
```
