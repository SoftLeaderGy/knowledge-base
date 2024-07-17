# 一、部署
> 参考链接：
> [https://blog.csdn.net/sunnyzyq/article/details/103285472](https://blog.csdn.net/sunnyzyq/article/details/103285472)
> arm架构：[https://blog.csdn.net/wochunyang/article/details/132460436](https://blog.csdn.net/wochunyang/article/details/132460436)

docker部署mysql,需要docker环境，docker基础不在此处赘述，可以点击 [docker基础](/Docker/docker基础/docker基础.html)
```shell
docker pull mysql:5.7

docker run -d -p 3310:3306 -v /home/mysql/conf:/etc/mysql/conf.d -v /home/mysql/data:/var/lib/mysql -e MYSQL_ROOT_PASSWORD=123456 --name mysql01 mysql:5.7
```
# 二、相关问题
## 1、mysql忘记密码

## 2、mysql开放远程连接
### 登录mysql服务

- `mysql -u root -p`
- 输入密码
### 切换数据库`mysql`

- 输入 `use mysql;`切换数据库
### 查看账号权限

- `select host, user from user;`
### 执行更新权限语句

- `update user set Host='%' where User='root';`
### 完成

- 再次使用客户端连接即可

## 3、mysql8.X 导入数据到 mysql5.X

> 在工作中如果我们本地的是mysql8.0，但是我们的在部署初始化线上环境的时候如果，线上的mysql是5.X的版本的话
> 我们就没办法将我们本地的sql库表直接导入到线上mysql中，有可能出现的问题“Unknown collation: 'utf8mb4_0900_ai_ci”
- 解决
  1. 将文件中的所有`utf8mb4_0900_ai_ci` 替换为 `utf8_general_ci`
  2. 将文件中的所有`utf8mb4`替换为`utf8`


## 4、部署mysql启动报Failed to start mysqld.service: Access denied

- 报错内容
  > [root@localhost etc]# sudo systemctl start mysqld.service
  > Failed to start mysqld.service: Access denied
  > See system logs and 'systemctl status mysqld.service' for details.

- 解决方法
  ```shell
  # 永久生效
  # 操作前先备份
    cp /etc/selinux/config /etc/selinux/config.bak
    cat /etc/selinux/config
  # 更改setlinux级别
  #SELINUX参数enforcing代表打开，disabled代表关闭
    将SELINUX=enforcing改成SELINUX=disabled
  # 重启服务器
    reboot
  # 查看selinux状态：
    getenforce
  ```
