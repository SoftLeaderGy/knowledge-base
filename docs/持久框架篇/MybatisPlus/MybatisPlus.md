# MybatisPlus
[Demo  GitHub - SoftLeaderGy/StartMybatisPlus](https://github.com/SoftLeaderGy/StartMybatisPlus)

---


快速入门：

使用第三方组件（步骤）：

	1、导入对应的依赖

	2、研究依赖如何配置

	3、代码如何编写

	4、提高扩展技术能力

步骤：

1、创建数据库'mybatisplus'

2、创建user表

```sql
CREATE TABLE user
(
	id BIGINT(20) NOT NULL COMMENT '主键ID',
	name VARCHAR(30) NULL DEFAULT NULL COMMENT '姓名',
	age INT(11) NULL DEFAULT NULL COMMENT '年龄',
	email VARCHAR(50) NULL DEFAULT NULL COMMENT '邮箱',
	PRIMARY KEY (id)
);
INSERT INTO user (id, name, age, email) VALUES
(1, 'Jone', 18, 'test1@baomidou.com'),
(2, 'Jack', 20, 'test2@baomidou.com'),
(3, 'Tom', 28, 'test3@baomidou.com'),
(4, 'Sandy', 21, 'test4@baomidou.com'),
(5, 'Billie', 24, 'test5@baomidou.com');
```

3、编写项目，初始化项目：使用SpringBoot初始化项目

4、导入依赖

```xml
<!--导入数据库驱动-->
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <version>5.1.47</version>
</dependency>
<!--导入lombok-->
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
</dependency>
<!--导入mybatisPlus-->
<dependency>
    <groupId>com.baomidou</groupId>
    <artifactId>mybatis-plus-boot-starter</artifactId>
    <version>3.0.5</version>
</dependency>

说明：我们使用mybatisPlus可以节省大量的代码，尽量不要同时导入mybatis和mybatisPlus版本的差异
```

application配置连接数据库

```
#mysql  5  驱动不同
spring.datasource.username=root
spring.datasource.password=gunveda^123456
spring.datasource.url=jdbc:mysql://t.gunveda.top:33060/mybatisPlus?useSSL=false&useUnicode=true&characterEncoding=utf-8
spring.datasource.driver-class-name=com.mysql.jdbc.Driver

#mysql  8  驱动不同，com.mysql.cj.jdbc.Driver需要增加时区的配置serverTimezone=GMT%2B8
```

6、传统方式 pojo—dao（链接mybatis，配置mapper.xml文件）-service-controller

6、使用mybatisPlus之后

- pojo

```java
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class User {

    private Long id;
    private String name;
    private Integer age;
    private String email;
    
}
```

- mapper接口

```

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.guo.pojo.User;
import org.springframework.stereotype.Repository;

//在对应的Mapper上面继承基本的类 BaseMapper
@Repository //表示这个类是持久层的（表示他是个mapper或者是dao层的）
public interface UserMapper extends BaseMapper<User> {

    //所有的crud操作已经完成了
    //不需要像以前一样配置一堆文件

}
```

- 使用
- 注意点，我们需要在启动类上 去扫描我们的mapper包下的所有接口       @MapperScan("com.guo.mapper")
- 测试类中的例子

```java
@SpringBootTest
class MybatisPlusApplicationTests {

    //继承了BaseMapper，所有的方法都来自于自己的父类，我们也可以编写自己的扩展方法！
    @Autowired
    private UserMapper userMapper;

    @Test
    void contextLoads() {
        //  查询全部用户
        //参数是一个Wapper， 条件构造器
        List<User> users = userMapper.selectList(null);
        users.forEach(System.out::println);
    }

}
```

结果查询出来～

> 思考问题


1. SQl谁帮我们写的？MybatisPlus
2. 方法哪里来的？ MybatisPlus都写好了

### 配置日志

我们所有的sql现在是不可见的，我们希望知道他是怎么运行的，所以我们必须要看日志！

```
#配置日志
mybatis-plus.configuration.log-impl=org.apache.ibatis.logging.stdout.StdOutImpl
```

配置完毕日志之后，后面的学习就需要注意这个自动生成的SQL。就会喜欢上mybatisPLus

### CRUD扩展

#### 插入操作

> 插入测试


```java
    //测试插入功能
    @Test
    public void  testInsert(){

        User user = new User();
        user.setName("郭洋");
        user.setAge(3);
        user.setEmail("826044698@qq.com");


        int result = userMapper.insert(user);// 帮我们自动生成了 id

        System.out.println(result);// 受影响的行数
        System.out.println(user); // 发现id会自动回填
    }
    
    
日志：
==>  Preparing: INSERT INTO user ( id, name, age, email ) VALUES ( ?, ?, ?, ? ) 
==> Parameters: 1310754142725124098(Long), 郭洋(String), 3(Integer), 826044698@qq.com(String)
```

插入成功～

> 数据库插入的id的默认值为：全局唯一的id


### 主键生成策略

```java
//IdType 源码中的几种类型

public enum IdType {
    AUTO, NONE, INPUT, ID_WORKER, UUID, ID_WORKER_STR;

    private int key;

    private IdType(int key) { /* compiled code */ }

    public int getKey() { /* compiled code */ }
}
```

```
默认 @TableId(type = IdType.ID_WORKER) 全局唯一id (ID_WORKER)
```

分布式系统唯一id生成：[https://www.cnblogs.com/haoxinyue/p/5208136.html](https://www.cnblogs.com/haoxinyue/p/5208136.html)

#### 雪花算法

1. snowflake是Twitter开源的分布式ID生成算法，结果是一个long型的ID。其核心思想是：使用41bit作为毫秒数，10bit作为机器的ID（5个bit是数据中心，5个bit的机器ID），12bit作为毫秒内的流水号（意味着每个节点在每毫秒可以产生 4096 个 ID），最后还有一个符号位，永远是0。几乎可以保证全球唯一了！

> 主键自增 [@TableId(type ](/TableId(type ) = IdType.AUTO)   自增（AUTO） 


1. 实体类字段上     [@TableId(type ](/TableId(type ) = IdType.AUTO) 
2. 数据库字段一定要自增
3. 再次测试 id自增～

> 其余的源码解释


```java
public enum IdType {
    AUTO, //数据库id自增
    NONE, // 未设置主键
    INPUT, // 手动输入
    ID_WORKER, // 默认的全局id
    UUID, // 全局唯一id
    ID_WORKER_STR; // ID_WORKER的字符串表示法

    private int key;

    private IdType(int key) { /* compiled code */ }

    public int getKey() { /* compiled code */ }
}
```

#### 更新操作

> 测试更新


```java

    //更新操作测试
    @Test
    public void testUpdata(){
        User user = new User();

        // 通过条件自动拼接动态sql
        user.setName("郭洋");
        user.setId(1L);

        //注意：虽然方法名字叫 updateById，但是 参数 是一个对象！
        userMapper.updateById(user);
    }
```

所有的sql都是自动帮你动态配置的！

### 自动填充

创建时间、修改时间！ 这些操作都是自动化完成的，我们不希望手动更新

> 方式一： 数据库级别


- 在表中新增字段 create_time、update_time
- 在插入字段 之后 ，我们需要先把实体类同步(添加字段)

```java
    private Date createTime;
    private Date updateTime;
```

- 再次测试 插入方法， 时间自动更新完成～

> 方式二： 代码级别


-  删除数据库中的默认值、更新操作（初始化数据库 让数据库变为一个干净的数据库） 
-  实体类字段属性上需要增加注解 

```java
    // 字段添加填充内容
    @TableField(fill = FieldFill.INSERT)
    private Date createTime;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private Date updateTime;
```

- 编写处理器 处理这个注解即可

```java
package com.guo.handler;

import com.baomidou.mybatisplus.core.handlers.MetaObjectHandler;
import lombok.extern.slf4j.Slf4j;
import org.apache.ibatis.reflection.MetaObject;
import org.springframework.stereotype.Component;

import java.util.Date;

@Slf4j   //日志
@Component   // 将类放在springboot容器中
public class MyMetaObjectHandler  implements MetaObjectHandler {

    // 插入时的填充策略
    @Override
    public void insertFill(MetaObject metaObject) {

        log.info("statr insert fill...");
        
        // 里边的三个参数：
        // (java.lang.String fieldName,  需要填充的字段名
        // java.lang.Object fieldVal,   填充的字段值
        // org.apache.ibatis.reflection.MetaObject metaObject)   给那个数据处理

        this.setFieldValByName("createTime",new Date(),metaObject);
        this.setFieldValByName("updateTime",new Date(),metaObject);
    }
    
    // 更新时的填充策略
    @Override
    public void updateFill(MetaObject metaObject) {
        log.info("start update fill...");

        this.setFieldValByName("updateTime",new Date(),metaObject);

    }
}
```

- 测试插入操作～
- 测试更新操作，观察更新时间～

### 乐观锁

在面试过程中，我们经常会被问到乐观锁、悲观锁

> 乐观锁 ： 顾名思义 十分乐观，他总是认为不会出现问题，无论干什么都不去上锁，如果出现了问题，再次更新值测试


> 悲观锁： 顾名思义 十分悲观，他总是认为出现问题，无论干什么 都会上锁。再去操作


我们这里主要讲解乐观锁插件
乐观锁实现方式：

- 取出记录时，获取当前version
- 更新时，带上这个version
- 执行更新时， set version = newVersion where version = oldVersion
- 如果version不对，就更新失败

```
乐观所： 1、先查询，获得版本号 version = 1

--A线程

update user set name = "guoyang" , version = version + 1 
where id = 2 and version = 1


--B线程 抢先执行完成，这个时候 version = 2， 会导致A线程修改失败！

update user set name = "guoyang" , version = version + 1 
where id = 2 and version = 1
```

> 测试一下MybatisPlus 的乐观锁插件


1.  给数据库中增加version字段 
2.  实体类加上对应的字段 

```java
    //乐观锁测试（版本号）
    @Version // 乐观锁Version注解
    private Integer version;
```

3. 注册组件
（新建config包 创建配置类 config.class ）

```java
package com.guo.config;

import com.baomidou.mybatisplus.extension.plugins.OptimisticLockerInterceptor;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;


//扫描我们的 mapper 文件夹
@MapperScan("com.guo.mapper")
@Configuration //表示他是个配置类
public class MyBatisPlusConfig {


    // 注册乐观锁插件
    @Bean
    public OptimisticLockerInterceptor optimisticLockerInterceptor() {
        return new OptimisticLockerInterceptor();
    }


}
```

4. 测试

```java
    //测试乐观锁 成功

    @Test
    public void OptimisticLocker(){
        // 1、查询用户信息
        User user = userMapper.selectById(1L);

        // 2、修改用户信息
        user.setName("guoyang");
        user.setEmail("1765567867@qq.com");

        // 3、执行更新操作
        userMapper.updateById(user);


    }


    //测试乐观锁 失败  多线程下

    @Test
    public void OptimisticLocker2(){

        //线程1
        User user = userMapper.selectById(1L);
        user.setName("guoyang111");
        user.setEmail("1765567867@qq.com");

        //模拟另外一个线程执行了插队操作
        User user2 = userMapper.selectById(1L);
        user2.setName("guoyang222");
        user2.setEmail("1765567867@qq.com");
        userMapper.updateById(user2);

        //
        userMapper.updateById(user);//  如果没有乐观锁 就会覆盖插队线程的值
    }

}
```

### 查询操作

```java
    //测试查询
@Test
    public void testSelectById(){
        User user = userMapper.selectById(1L);

        System.out.println(user);
    }


    // 测试批量查询
    @Test
    public void testSelectByBatchId(){
        List<User> users = userMapper.selectBatchIds(Arrays.asList(1, 2, 3));

        users.forEach(System.out::println);
    }

    @Test
    //按条件查询 之一 使用 map   （where 条件查询）
    public void testSelectByBatchIds(){
        HashMap<String, Object> map = new HashMap<>();

        //自定义查询
        map.put("name", "guoyang222");
        map.put("age", 3);

        List<User> users = userMapper.selectByMap(map);

        users.forEach(System.out::println);
    }
```

### 分页查询

1. 原始的limit 进行分页
2. 第三方插件pageHelper
3. MybatisPlus也内置了分页插件

> 如何使用呢？


- 配置拦截器组件（在MyBatisPlusConfig配置类中配置）

```java
    // 分页插件
    @Bean
    public PaginationInterceptor paginationInterceptor() {
        return new PaginationInterceptor();
    }
```

- 直接使用page对象即可

```java
    //测试分页查询
    @Test
    public void testPage(){
        //参数一： 当前第几页
        //参数二： 页面显示几条数据

        Page<User> page = new Page<>(2,5);
        userMapper.selectPage(page,null);

        page.getRecords().forEach(System.out::println);
        System.out.println(page.getTotal());
    }
```

### 删除操作

- 基本的删除操作

```java
    //测试删除
    @Test
    public void testDeleteById(){

        userMapper.deleteById(1310778514273808386L);
    }


    // 通过id批量删除
    @Test
    public void testDeleteBatchById(){

        userMapper.deleteBatchIds(Arrays.asList(1310564048345018370L,1310754142725124098L));
    }

    //通过 map 条件删除
    @Test
    public void testDeleteMapById(){

        HashMap<String, Object> map = new HashMap<>();
        map.put("name", "洋");
    userMapper.deleteByMap(map);
    }
```

工作中会遇到一些问题： 逻辑删除

### 逻辑删除

> 物理删除 ： 从数据库中移除


> 逻辑删除 ： 在数据库中没有移除，而是通过一个变量来让他失效！ deleted=0 变为 delete= 1 将deleted = 0 作为条件 去做一些操作  就实现了逻辑删除（启用、停用）


实例： 管理员可以查看被删除的记录 防止数据库的删除、类似于回收站

- 在数据库中增加一个deleted字段
- 实体类中增加属性

```java
    @TableLogic//逻辑删除注解
    private Integer deleted;
```

- 在配置文件中进行配置

```
#配置逻辑删除
mybatis-plus.global-config.db-config.logic-not-delete-value=0
mybatis-plus.global-config.db-config.logic-delete-value=1
```

- 测试

> 执行的是删除操作，但是实际走的是修改操作  将deleted将修改为1
查询的时候会默认将deleted = 0 拼接称查询条件


### 性能分析插件

我们在开发中，会遇到慢sql。
mybatisPlus也提供了性能分析插件，如果超过这个时间就停止运行！（新版MytaisPlus版本已经移除了）

- 导入插件
- 测试使用

### 条件构造器

Wrapper
我们写一些复杂的sql就可以使用他来借代

- 测试一

```java
 @Test
    void contextLoads() {

        // 查询name不为空的用户，并且邮箱不为空的用户，年龄大于等于12
        QueryWrapper<User> Wrapper = new QueryWrapper<>();
        Wrapper
                .isNotNull("name")
                .isNotNull("email")
                .ge("age",12);//g:表示大于  e：表示等于

        userMapper.selectList(Wrapper).forEach(System.out::println);// 和刚学过的map对比一下
    }
```

- 测试二

```java
    @Test
    void test2() {

        //查询名字等于Tom的
        QueryWrapper<User> Wrapper = new QueryWrapper<>();
        Wrapper.eq("name","Tom");
        User user = userMapper.selectOne(Wrapper);//selectOne 查询一个数据
        System.out.println(user);
    }
```

- 测试三(between 相当于 sql里between and )

```java
    @Test
    void test3() {

        //查询年龄在20～30之间的用户
        QueryWrapper<User> wrapper = new QueryWrapper<>();

        wrapper.between("age", 20 ,30);// 区间
        Integer count = userMapper.selectCount(wrapper);//查询结果数
        System.out.println(count);
        
    }
```

- 测试四(模糊查询)

```java

    //模糊查询
    @Test
    void test4() {

        //查询年龄在20～30之间的用户
        QueryWrapper<User> wrapper = new QueryWrapper<>();

        wrapper.notLike("name", "e")// name 字段中 不含e的
                .likeRight("email" , "t");//likeRight（有通配）相当于  t%

        List<Map<String, Object>> maps = userMapper.selectMaps(wrapper);
        maps.forEach(System.out::println);
        
    }
```

- 测试五（子查询）

```java
    @Test
    void test5() {

        QueryWrapper<User> wrapper = new QueryWrapper<>();

        // 假设id在子查询里
        wrapper.inSql("id","select id from user where id < 3 ");
        List<Object> objects = userMapper.selectObjs(wrapper);
        objects.forEach(System.out::println);

    }
```

- 测试六(orderByDesc)倒叙排序

```java
    @Test
    void test6() {

        QueryWrapper<User> wrapper = new QueryWrapper<>();

        // 通过id进行排序
        wrapper.orderByDesc("id");
        
        List<User> users = userMapper.selectList(wrapper);
        users.forEach(System.out::println);

    }
```

### 代码自动生成器
