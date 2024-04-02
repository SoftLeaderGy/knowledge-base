# 配置拦截器

## 1. 拦截器介绍

- 拦截器是在servlet执行之前执行的程序（这里就是controller代码执行之前），它主要是用于拦截用户请求并作相应的处理，比如说可以判断用户是否登录，做相关的日志记录，也可以做权限管理。
- SpringBoot中的拦截器实现和spring mvc 中是一样的，它的大致流程是，先自己定义一个拦截器类，并将这个类实现一个**HandlerInterceptor**类，或者是继承**HandlerInterceptorAdapter**，都可以实现拦截器的定义。然后将自己定义的拦截器注入到适配器中，也有两种方式，一种是实现**WebMvcConfigurer**接口，一种是继承**WebMvcConfigurerAdapter**。下面我们来看看如何完成。

## 2.自定义拦截器

```java
/**
 * @Description: 自定义拦截器
 * @Author: Yang.Guo
 * @Date: 2021/08/09/14:44
 */
@Slf4j
public class Interceptor implements HandlerInterceptor {
    // 请求进来之前进行拦截
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        log.info("进入拦截器了");
        //中间写逻辑代码，比如判断是否登录成功，失败则返回false
        if(request.getHeader("token").equals("123")){
            return true;
        } else {
            return false;
        }
        
    }
    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {
        System.out.println("controller 执行完了");
    }
    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) {
        System.out.println("我获取到了一个返回的结果："+response);
        System.out.println("请求结束了");
    }
}
```

**代码说明：**

1. 自定义的拦截器可以实现**HandlerInterceptor**接口，也可以继承**HandlerInterceptorAdapter**类。
2. 重写三个方法，当然也可以只实现一个最重要的**preHandle**方法。
3. **preHandle**方法：此方法会在进入controller之前执行，返回Boolean值决定是否执行后续操作。
4. **postHandle**方法：此方法将在controller执行之后执行，但是视图还没有解析，可向ModelAndView中添加数据(前后端不分离的)。
5. **afterCompletion**方法：该方法会在整个请求结束（请求结束，但是并未返回结果给客户端）之后执行， 可获取响应数据及异常信息。

## 3.拦截器注入适配器

```java
/**
 * @Description:
 * @Author: Yang.Guo
 * @Date: 2021/08/09/14:50
 */
@Configuration
public class MyInterceptorConfig implements WebMvcConfigurer {
    // 重写添加拦截器的方法
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new Interceptor()) //将我们新建的过滤器添加进装配器中
                .addPathPatterns("/**") // 过滤掉所有的请求。
                .excludePathPatterns("/loginController/login"); // 除了那些请求。
    }
}
```

**代码说明：**

1. 通过实现**WebMvcConfigurer**接口可以自定义一个适配器，也可以通过继承**WebMvcConfigurerAdapter**来定义适配器，建议使用第一种，第二种已经是过时的方法了。
2. 重写**addInterceptors**方法，**addInterceptor**方法是将拦截器注入到适配器中。
3. **addPathPatterns**方法是设置一个需要拦截的路径，可以是多个字符串或者是直接传入一个数组。
4. **excludePathPatterns**是配置不需要拦截的路径。
5. 需要加上**configuration**注解说明这是一个配置类，在项目启动的时候自动执行。

## 4.controller测试

```java
/**
 * @Description:
 * @Author: Yang.Guo
 * @Date: 2021/08/09/15:00
 */
@RestController
public class LoginController {

    @PostMapping("/loginController/login")
    public String loginController(){
        return "不会被拦截的登录请求";
    }
    @PostMapping("/hello")
    public String helloController(){
        return "会被拦截的Hello请求";
    }
}
```

## 5. 测试

测试**未拦截**的接口,浏览器输入：localhost:8097/LoginController/login，查看控制台输出情况。

1. 
控制台只输出了未拦截接口内的代码，说明这个接口是未拦截的。浏览器的显示就不管了。其实一般是拦截登录接口，这里就将它放开了，以供测试。

测试**拦截**的接口，浏览器输入：localhost:8097/hello/hello,查看控制台输出情况。

2. 
可以看到，首先是进入了拦截器，通过拦截器之后，进入了controller中的方法，执行完controller的代码之后就进入了自定义拦截器中的postHandle方法，最后进入afterCompletion方法，并获取到了一个response对象。


## 6. 扩展内容：拦截器链

我们可以定义多个拦截器组成一个拦截器链。我们可以在适配器中注入多个拦截器。多加一行代码就行了。

按照拦截器注入的顺序，拦截器的执行顺序应该是一下顺序：拦截器1，拦截器2，拦截器2处理，拦截器1处理，拦截器2结束，拦截器1结束。对应**三个过程**的方法就是**preHandle**,**postHandle**,**afterCompletion**。

## 7. 总结

本文从拦截器的自定义到自定义适配器，然后将拦截器注入适配器，再到编写测试代码。准备工作完成之后就进行一个测试拦截器是否成功，最后扩展出拦截器链的一些内容。

参考：[https://www.cnblogs.com/swzx-1213/p/12788576.html#1-%E6%8B%A6%E6%88%AA%E5%99%A8%E4%BB%8B%E7%BB%8D](https://www.cnblogs.com/swzx-1213/p/12788576.html#1-%E6%8B%A6%E6%88%AA%E5%99%A8%E4%BB%8B%E7%BB%8D)
