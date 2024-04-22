- 今天在公司偶然发现一个很神奇的代码。上截图

![image.png](images/1667551045042-0f9d7384-52d1-4cfa-aca7-eb71833d6f4d.png)
# 一、发现问题
> 一个post请求并没有请求体，只是把参数拼在了路径的后边，后台接口接收的参数上也并没有加`@RequestBody`，接收的参数同样是实体类。<br />神奇的是接口接收到了参数。


# 二、查资料
求知聊天记录![image.png](images/1667552088145-119b725a-55dd-4c52-a33e-45031345f654.png)

# 三、探究

- 我们都知道post请求在请求体的情况下，接口不加`@RequestBody`传入的请求体参数是不能被接收的
  - ![image.png](images/1667552427087-b500abd3-7587-4b1d-9a76-e380a60e5e6b.png)
  - ![image.png](images/1667552462029-90261615-8999-4512-8ea1-481d96202a0f.png)
- 我们把参数拼在后边，并且请求体也传入参数的话
  - ![image.png](images/1667552541717-1d9564f7-e8ee-4ec6-88e4-efb38325b6d8.png)
  - ![image.png](images/1667552565525-8ae3f234-e8e0-4ea1-a731-9509cbfdbefb.png)
  - 到此我们得出结论：接口在不加`@RequestBody`注解的时候，我们传入请求体与否对于接口来说是无效的，只有我们拼了参数在后边才会接受到参数
- 接口添加`@RequestBody` 注解 拼接参数且不传入请求体
  - ![image.png](images/1667552890193-37cc2726-0492-487c-b333-624acd145473.png)
  - ![image.png](images/1667552905821-086c5e44-e99a-41ea-bd52-7567ad49c52d.png)
  - 此时我们的服务端返回报错400
  - 报错信息为：Required request body is missing:........
- 接口添加`@RequestBody` 注解 拼接参数且传入请求体
  - ![image.png](images/1667553017443-ec5fe40c-61bc-439b-8d4f-c010a5801edc.png)
  - ![image.png](images/1667553038621-de787bad-31ae-4ee9-b976-c97ec28ee21b.png)
  - 此时我们的接口一样可以接收到参数
# 四、结论
> @RequestBody 主要用于处理 json格式数据，Content-type:application/json
> ContentType类型application/x-www-form-urlencoded,格式为key1=value1&key2=value2提交到后台 ，不需要加@requestBody。
> `使用@requestBody.当请求content_type为：application/json类型的请求，数据类型为json时， json格式如下：{“aaa”:“111”,“bbb”:“222”}`


建议在项目当中不要使用文章开头的形式去写，第一会引起歧义，前台不好写，后台也蒙，最好严格按照 GET（拼接）POST（请求体）的形式，清晰明了

---

END.....
