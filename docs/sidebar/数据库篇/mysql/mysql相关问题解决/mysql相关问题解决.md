## 1、quartz服务报错
- 问题描述
> quartz 报错：Failure obtaining db row lock: Table ‘test.QRTZ_LOCKS‘ doesn‘t exist

- 思路
> 首先我的数据库的表是没问题的
> 表名是qrtz_locks
> 那么问题就出在表名大小写问题上，顺着这个我就查了下，在我们本地电脑上mysql是不区分大小写的，
> 但是本次部署我把mysql部署在了linux上，在linux上的mysql默认是区分大小写的

- 解决办法
   - 方法一：改表名就可以了（快，但不建议）
   - 方法二：修改mysql服务使其忽略大小写
```sql
# 先执行sql查看lower_case_table_names
show variables like '%lower_case_table_names%';

# 修改/etc/my.cnf文件，在文件末尾加lower_case_table_names=1
vim /etc/my.cnf
# 末尾加上lower_case_table_names=1  保存退出
service mysqld restart
```
## 2、解决MYSQL中文乱码问题
### 2.1、更改MySQL服务器字符集

- 查看MySQL服务器当前的字符集设置。：
```shell
mysql> show variables like ‘character%’;
```

- 如果发现MySQL使用的不是UTF-8字符集，那么您需要更改它。您可以通过编辑MySQL配置文件my.cnf或my.ini文件来实现这一点。
```python
[client]
default-character-set=utf8

[mysql]
default-character-set=utf8

[mysqld]
character-set-server=utf8
collation-server=utf8_general_ci
init-connect='SET NAMES utf8'
```

- 其中，character-set-server和collation-server配置项用于设置MySQL服务器的字符集和校对规则。init-connect配置项用于在每个新连接上设置字符集。
- 需要重启MySQL服务以使更改生效。
