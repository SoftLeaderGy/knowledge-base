> Stream流是处理集合的一种响应式编程

<a name="peIj4"></a>
# 一、方法
<a name="ytKuj"></a>
## 1.1、filter()
```java
List<String> list = Arrays.asList("Hello","World","Java");
List<Integer> intList = Arrays.asList(2,1,4,5,6,3);
/**
* filter() 过滤方法参数是 Predicate 条件 也可以直接传入larmd表达式
* .collect(Collectors.toList()); 返回一个新的集合
*
*/
List<String> collect = list.stream()
    .filter(str -> str.length() >= 5)
    .collect(Collectors.toList());
System.out.println(collect); // [Hello, World]
```
<a name="UIcns"></a>
## 1.2、limit()
```java
List<String> list = Arrays.asList("Hello","World","Java");
List<Integer> intList = Arrays.asList(2,1,4,5,6,3);

/**
 * limit() 方法截取数组中的前几位元素
 * .limit(2) 截取数组中的前两个元素
 *
 */

list.stream()
        .limit(2)
        .forEach(str -> System.out.println(str)); // HelloWorld
```
<a name="AwNMe"></a>
## 1.3、sorted()
```java
List<String> list = Arrays.asList("Hello","World","Java");
List<Integer> intList = Arrays.asList(2,1,4,5,6,3);

/**
 * sorted()方法排序 默认是升序
 * .sorted(Comparator.reverseOrder())  降序 排序
 */
intList.stream()
        .sorted(Comparator.reverseOrder())
        .forEach(num -> System.out.println(num));
// 输出最大
// max(Integer::compareTo) 参数的意思为，以Integer方式进行排序
System.out.println(intList.stream()
        .max(Integer::compareTo).get());
// 输出最下
System.out.println(intList.stream()
        .min(Integer::compareTo).get());
// 输出集合长度
System.out.println(intList.stream().count());
```
<a name="MVYRa"></a>
## 1.4、map()
- 基础
    ```java
    List<String> list = Arrays.asList("Hello","World","Java");
    List<Integer> intList = Arrays.asList(2,1,4,5,6,3);
    /**
     * map() 对数组中的元素进行操作
     */
    List<Integer> collect = intList.stream()
            .map(num -> num + 10)
            .collect(Collectors.toList());
    System.out.println(collect);
    ```
- 结果list转换（doList转dtoList）
  ```java
        // 查询数据库返回doList
        List<DoctorInfoNeuDO> doctorInfoNeuDOS = doctorInfoNeuDAO.selectList(wrapper);
        // doList转换成dtoList
        List<DoctorInfoNeuDTO> doctorInfoNeuDTOList = doctorInfoNeuDOS.stream().map(item -> {
            DoctorInfoNeuDTO doctorInfoNeuResDTO = new DoctorInfoNeuDTO();
            BeanUtils.copyProperties(item, doctorInfoNeuResDTO);
            return doctorInfoNeuResDTO;
        }).collect(Collectors.toList());
        // 返回dtoList结果集
        return doctorInfoNeuDTOList;
  ```
<a name="gZKh1"></a>
## 1.5、reduce()
```java
List<String> list = Arrays.asList("Hello","World","Java");
List<Integer> intList = Arrays.asList(2,1,4,5,6,3);
/**
 * reduce() 方法 返回的是一个值，
 * 以数字数组集合为例
 * 参数是在 传了两个值 sum，num
 * sum为要累加的和的值 num为数组中的每个元素
 */
System.out.println(intList.stream()
        .reduce((sum, num) -> sum += num).get());
```
<a name="O4nVm"></a>
## 1.6、collect()
```java
List<String> list = Arrays.asList("Hello","World","Java");
List<Integer> intList = Arrays.asList(2,1,4,5,6,3);
 /**
 * collect() 方法 基于目标集合生成一个新的集合
 */
System.out.println(intList.stream()
        .filter(num -> num % 2 == 0)
        .collect(Collectors.toList()));
```

