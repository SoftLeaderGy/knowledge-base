# 一、整合mp
## 1、导入坐标
```java
<dependency>
   <groupId>com.baomidou</groupId>
   <artifactId>mybatis-plus-boot-starter</artifactId>
   <version>3.2.0</version>
</dependency>
```
## 2、配置类 用于扫包 (或者或者使用注解在启动类上@MapperScanner)
```java
@Configuration
public class MyBatisPlusConfig {
    @Bean
    public MapperScannerConfigurer mapperScannerConfigurer() {
        MapperScannerConfigurer scannerConfigurer = new MapperScannerConfigurer();        scannerConfigurer.setBasePackage("com.cloud.demo");
        return scannerConfigurer;
    }
}
```
## 3、yml配置文件
```yaml
mybatis-plus:
   mapper-locations: classpath:/mapper/*Mapper.xml
   typeAliasesPackage: com.ftsino.citychallenge.common.entity,com.ftsino.citychallenge.common.po
   configuration:
      log-impl: org.apache.ibatis.logging.stdout.StdOutImpl

```
# 二、整合mp多数据源
## 1、引入dynamic依赖(动态数据源)
```xml
<dependency>
  <groupId>com.baomidou</groupId>
  <artifactId>dynamic-datasource-spring-boot-starter</artifactId>
  <version>2.5.4</version>
</dependency>
```
## 2、yml多数据源配置
```yaml
spring:
  datasource:
    dynamic:
      primary: master #设置默认的数据源或者数据源组,默认值即为master
      strict: false #设置严格模式,默认false不启动. 启动后在未匹配到指定数据源时候回抛出异常,不启动会使用默认数据源.
      datasource:
        master:
          url: jdbc:mysql://xx.xx.xx.xx:3306/dynamic
          username: root
          password: 123456
          driver-class-name: com.mysql.jdbc.Driver
        slave_1:
          url: jdbc:mysql://xx.xx.xx.xx:3307/dynamic
          username: root
          password: 123456
          driver-class-name: com.mysql.jdbc.Driver
        slave_2:
          url: ENC(xxxxx) # 内置加密,使用请查看详细文档
          username: ENC(xxxxx)
          password: ENC(xxxxx)
          driver-class-name: com.mysql.jdbc.Driver
          schema: db/schema.sql # 配置则生效,自动初始化表结构
          data: db/data.sql # 配置则生效,自动初始化数据
          continue-on-error: true # 默认true,初始化失败是否继续
          separator: ";" # sql默认分号分隔符
          
       #......省略
       #以上会配置一个默认库master，一个组slave下有两个子库slave_1,slave_2
```
## 3、使用注解@DS 来切换指定的数据库
(指定的是yml中配置的名字 如果不指定 走yml中的默认配置数据库)
```yaml
@DS("slave_1")
public interface AccountMapper extends BaseMapper<Account> {

}

public interface UserMapper extends BaseMapper<User> {

}

```
