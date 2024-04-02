# CPU飙升
线上资源cpu飙升是我们工作中常见的问题，一篇文章搞定排查方法
## 一、问题复现

- 现在我有两个接口，代码如下
```java
@RestController
public class CPUCheck {
  @RequestMapping("/hello")
  public String helloWorld(){
      return "hello World";
  }

  @RequestMapping("/run")
  public void run(){
      while (true){

      }
  }
}
```

- 代码很简单 接口1“/hello” 返回“hello World”，接口2“/run” 进入死循环，这样就保证了访问接口2cpu升高。
## 二、测试

1. 我们将项目打包部署在服务器上，并启动

![](https://p.ipic.vip/6d32k1.jpg#from=url&id=PFIS9&originHeight=61&originWidth=796&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

1. 测试接口
```
curl http://localhost:9901/thing-test/hello
```
![](https://p.ipic.vip/uuml1a.jpg#from=url&id=UdCir&originHeight=558&originWidth=732&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)
## 三、排查

1. 通过top命令可以查看到有一个java进程占用cpu资源异常
2. 获取pid为32306
3. 通过命令查询tid
```shell
命令：ps -mp 【pid】 -o THREAD,tid,time
实例：ps -mp 32306 -o THREAD,tid,time
```
![](https://p.ipic.vip/dyikob.jpg#from=url&id=kMFir&originHeight=503&originWidth=732&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

   1. 可以看到引起cpu异常的tid是32327
   2. 因为现在的tid32327是十进制的，需要将其转化为十六进制
```
命令：printf "%x\n" 【十进制tid】
实例：printf "%x\n" 32327
```
![](https://p.ipic.vip/ys57nq.jpg#from=url&id=HUNAb&originHeight=44&originWidth=349&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

1. 根据pid 和 tid查询导致cpu飙升的代码
```shell
命令：jstack 【10进制pid】 | grep 【16进制tid】 -A 20
实例：jstack 32306 | grep 7e47 -A 20
```
![](https://p.ipic.vip/8zlovj.jpg#from=url&id=Ojt5s&originHeight=503&originWidth=732&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)
![](https://p.ipic.vip/gemop6.jpg#from=url&id=Cq3Sz&originHeight=504&originWidth=732&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

---

end....
