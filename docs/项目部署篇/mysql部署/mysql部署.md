# 一、部署
> 参考链接：
> [https://blog.csdn.net/sunnyzyq/article/details/103285472](https://blog.csdn.net/sunnyzyq/article/details/103285472)
> arm架构：[https://blog.csdn.net/wochunyang/article/details/132460436](https://blog.csdn.net/wochunyang/article/details/132460436)

docker部署mysql,需要docker环境，docker基础不在此处赘述，可以点击 [docker基础](https://softleadergy.gitee.io/Docker/docker%E5%9F%BA%E7%A1%80/docker%E5%9F%BA%E7%A1%80.html)
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

