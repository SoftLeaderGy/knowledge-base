# @JsonFormat日期转换，少了一天问题

## 1、问题描述
> 在工作当中碰到了一个很奇怪的问题，日期类型的dto在接收数据之后使用@JsonFormat注解转换格式的时候发现少了一天。
> 

- 刚开始以为是时区的问题，在实体类上面指定了`@JsonFormat(pattern = "yyyy-MM-dd",timezone="GMT+8")`
- 然后发现换成json后,小于 1991-09-14 22:59:59 这个时间的每年的5、6、7、8、9 月 小于 09-14 22:59:59 这个时间都少一个小时.

## 2、背景知识

> - GMT(Greenwich Mean Time)：格林尼治标准时间。 
> - 北京时间使用东八区时间，即GMT加8个小时就是北京时间。 
> - 夏令时(Daylight Saving Time: DST)，也叫夏时制，是指为了节约能源，在天亮较早的夏季，人为将时间调快一小时。

## 3、问题原因

> 中国在1986年至1991年实行过夏令时，即在这些年份北京时间比GMT提前9个小时。所以使用注解@JsonFormat(pattern = "yyyy-MM-dd", timezone = "GMT+8")看起来像是未起作用。

## 4、解决方案

- 使用注解 `@JsonFormat(pattern = "yyyy-MM-dd", locale = "zh", timezone = "Asia/Shanghai")`
- 代替原来的注解 `@JsonFormat(pattern = "yyyy-MM-dd",timezone="GMT+8")`
