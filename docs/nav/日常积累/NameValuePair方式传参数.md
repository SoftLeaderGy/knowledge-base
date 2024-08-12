> 今天工作中联调外部的一个接口用post方式传输，我按照文档封装参数成Jason字符串传入，但是对方一直接受参数为空，折腾了半天也没找到问题。很苦恼，检查代码都没有错误，可是为什么对方接受参数为空呢？然后找对方的技术人员联调，看看是怎么回事，也折腾了半天最后发现对方是用NameValuePair方式传参数。虽然这个方式已经过时了，但是在这里记录下，以备以后出现类似的方式传参数。

NameValuePair是简单名称值对节点类型。多用于Java像url发送Post请求。在发送post请求时用该list来存放参数。  
- 例如：  

```java
String url="访问网址";  
HttpPost httppost=new HttpPost(url); //建立HttpPost对象  
//建立一个NameValuePair数组，用于存储传送的数据  
List<NameValuePair> params=new ArrayList<NameValuePair>();  
//添加参数  
params.add(new BasicNameValuePair("键","值"));  
//设置编码  
httppost.setEntity(new UrlEncodedFormEntity(params,HTTP.UTF_8));  
//发送Post,并返回一个HttpResponse对象  
HttpResponse response=new DefaultHttpClient().execute(httppost);
```

- 实例

```java
List<NameValuePair> params = new ArrayList<>();  
JSONObject data =  new JSONObject();  
Class<?> clazz = sendMessageReqDTO.getClass();
// 获取对象所有字段，遍历
for (Field field : clazz.getDeclaredFields()) {  
	// 设置字段允许访问
    field.setAccessible(true);  
    // 设置NameValuePair参数的键值对
    params.add(new BasicNameValuePair(field.getName(),(String) field.get(sendMessageReqDTO)));  
}  
// 设置参数
data.put("method","sendMessage");  
data.put("param",JSONObject.toJSONString(sendMessageReqDTO));  
params.add(new BasicNameValuePair("method","sendMessage"));  
params.add(new BasicNameValuePair("param",JSONObject.toJSONString(sendMessageReqDTO)));
```
- HttpUtils
```java
public static String postForm(String path, List<NameValuePair> parametersBody) throws PssPwException {  
    HttpEntity entity = new UrlEncodedFormEntity(parametersBody, Charsets.UTF_8);  
    return postRequest(path, "application/x-www-form-urlencoded", entity);  
}
```