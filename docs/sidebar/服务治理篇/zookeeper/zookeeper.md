 **zookeeper**

- zookeeper
   - 安装
      - 环境：linux
         - 下载
            - 官网下载：[https://zookeeper.apache.org/releases.html](https://zookeeper.apache.org/releases.html)
         - 上传至服务器
         - 解压
tar -zxvf zookeeper-3.4.13.tar.gz
         - 编辑配置文件
            - 1.进入conf目录：
[root@localhost local]# cd zookeeper-3.4.13/conf
            - 2. 将zoo_sample.cfg这个文件复制为zoo.cfg (必须是这个文件名)
[root@localhost conf]# cp zoo_sample.cfg zoo.cfg
         - 配置环境变量
            - [root@localhost zookeeper-3.4.13]# export ZOOKEEPER_INSTALL=/usr/local/zookeeper-3.4.13/
            - [root@localhost zookeeper-3.4.13]# export PATH=PATH:PATH:PATH:ZOOKEEPER_INSTALL/bin
         - 启动zookeeper
            - 1.进入bin目录，并启动zookeeper。
如果不是在bin目录下执行，启动zookeeper时会报错： bash: ./zkServer.sh: No such file or directory
            - 注意： ./zkServer.sh start前面的 . 不可忽略。
               - [root@localhost local]# cd /usr/local/zookeeper-3.4.13/bin
               - [root@localhost bin]# ./zkServer.sh start
            - 2.启动成功效果如下：![image.png](images/1659927874780-77028ce6-1ffc-4e8e-a9bd-792002862602.png)
            - 3.zookeeper的服务端启动后，还需要启动zookeeper的客户端：
[root@localhost bin]# ./zkCli.sh
            - 4.查看状态：![image.png](images/1659927874768-7e3238e2-0c14-44d4-a956-6fdc352a5898.png)
   - 创建服务并注册进zookeeper
      - 服务样例![image.png](images/1659927878363-8a95a06e-ce97-42fb-9783-fb43c5dec39a.png)
      - appliaction.yml![image.png](images/1659927876112-85fa3aed-99a8-4a30-b893-bf986fc824b1.png)
   - 测试
      - 启动zookeeper服务
         - ./zkServer.sh start
      - 在服务器上启用zookeeper客户端
         - ./zkCli.sh![image.png](images/1659927875156-e672b575-4b67-45a0-9f6e-d2faed6c8b4d.png)
图二为结果
      - 查看根结点
如果没有服务注册进zookeeper时，根结点就只有一个zookeeper节点
         - ls /![image.png](images/1659927875844-40b58d6b-2378-4f2e-8102-f72e5635e0e6.png)
      - 查看节点里的其他节点![image.png](images/1659927877017-450890bb-e94c-4034-bc05-79853f9ee048.png)
   - 获取在zookeeper中，注册的服务信息
get /.../....
      - 实例![image.png](images/1659927877243-9676604d-3083-4fbf-9b1b-a43983199869.png)
         - 节点信息转成json对象后
            - 实例![image.png](images/1659927877704-cc63a5b9-93f7-4a3f-afc6-66530b834a08.png)
   - springcloud整合zookeeper
      - 服务配置（application.yml）
         - 服务提供者
            - application.yml![image.png](images/1659927878113-d8176e25-016f-4f94-82c0-8224ab7ef0f4.png)
            - 主启动类![image.png](images/1659927878785-bba22e6a-54f1-481b-a081-208b202a43e9.png)
            - 业务类（controller）![image.png](images/1659927880192-4b28e8ac-149e-4083-8ef3-e7ea9e85b3b6.png)
         - 服务消费者
            - application.yml![image.png](images/1659927880155-331a9823-d79c-47a9-a2df-6da55a14dd73.png)
            - 主启动类![image.png](images/1659927880233-b3f8fa36-39dc-4819-b1f0-392d719fb758.png)
            - 业务类（controller）![image.png](images/1659927881286-4b5ab4e2-9abb-40fa-971a-31aa25bea7b8.png)
      - 服务注册
         - 当服务配置完以后，启动服务就会根据配置注册到zookeeper中。
         - zookeeper里被注册了服务后就会在根结点多一个services![image.png](images/1659927881626-5f475a8f-7915-42bf-8734-f59318284a88.png)
         - 查看services![image.png](images/1659927882639-7ea23eff-c12f-4f51-9b86-37677e934756.png)
         - 查看单个服务![image.png](images/1659927882892-364fe992-a62f-4e28-956c-d2ea1d437a85.png)
         - 根据节点流水号查询节点服务相关信息![image.png](images/1659927883052-301f7a76-8a72-439a-937d-a3b046257f13.png)
         - 根据返回的json串即可读取服务的相关信息

