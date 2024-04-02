# 一、nginx反向代理POST请求
> 在使用nginx反向代理POST请求的时候，错误配置情况

```nginx
location /sms/sendSmsLocal/ {
  proxy_pass http://localhost:10086/sms/sendSmsLocal/;
}
```
这样配置会出现的问题

1. 原本发出的请求是POST请求，经过nginx转发以后就会变成GET请求
2. 原本POST请求携带的请求体经过转发以后会丢失

正确配置代理POST请求、
```nginx
location /sms/sendSmsLocal {
  proxy_pass http://localhost:10086/sms/sendSmsLocal;
  proxy_redirect off;
}
```

- location 后边跟的路径不要以 / 结尾
- 由于nginx代理会将我们的请求拦截后在做一次重定向，在这个过程中我们的请求携带的请求体就会丢失，解决办法就是屏蔽掉转发 通过 proxy_redirect off; 可以解决
# 二、nginx配置ssl
> 我们在nginx上配置我们的https 证书的时候，需要准备好一些东西，以及一些服务器的前提配置
> 1. 证书：我们要有我们域名申请下来的对应证书（xxx.key xxx.pem或 xxx.crt）
> 2. 一定要确认好我们服务器的443端口是否开通（如果是阿里云的ecs，可以在安全组中设置），配置好以后我们可以通过telnet ip port 来验证一下服务器的443端口是否开放
> 3.  我们正常的配置是监听443端口，然后nginx还会去监听我们另外的一个端口，例如80 我们在server块的80端口下去配置我们的一些业务或我们所需要的东西，然后在443的server块下去将 443的所有请求转到80端口上，并且将http过来的请求，自动转成https。

具体配置如下
```nginx
server {
  # 监听443 端口 在nginx 1.5版本以后 此处配置需要加上 ssl参数
  listen 443 ssl;
  # 此处可以为你的域名 或localhost
  server_name localhost;

  # 配置你的证书
  ssl_certificate /opt/nginx/cert/xxx.pem;
  ssl_certificate_key /opt/nginx/cert/xxx.key;

  ssl_session_cache shared:SSL:1m;
  ssl_session_timeout 5m;
  
	
  #请按照以下套件配置，配置加密套件，写法遵循 openssl 标准。
  ssl_ciphers HIGH:!aNULL:!DES:!MD5:!PSK:!RC4:!RSA;
  #请按照以下协议配置
  ssl_protocols TLSv1 TLSv1.2 TLSv1.1;
  ssl_prefer_server_ciphers on;

  # 将443过来的请求全部转到业务监听端口上去（8090）
  location / {
    proxy_pass http://127.0.0.1:8090;
  }
}
#监听80端口,并重定向到443
 server{
     listen 80;
     server_name www.xxx.com;
     rewrite ^(.*)$ https://$host$1 permanent;
 }
```
配置的整体位置
```nginx
http {
  ...

  server {
    ...
  }
# HTTPS 配置
  server {
    # 监听443 端口 在nginx 1.5版本以后 此处配置需要加上 ssl参数
    listen 443 ssl;
    # 此处可以为你的域名 或localhost
    server_name localhost;
  
    # 配置你的证书
    ssl_certificate /opt/nginx/cert/xxx.pem;
    ssl_certificate_key /opt/nginx/cert/xxx.key;
  
    ssl_session_cache shared:SSL:1m;
    ssl_session_timeout 5m;
  	
    #请按照以下套件配置，配置加密套件，写法遵循 openssl 标准。
    ssl_ciphers HIGH:!aNULL:!DES:!MD5:!PSK:!RC4:!RSA;
    #请按照以下协议配置
    ssl_protocols TLSv1 TLSv1.2 TLSv1.1;
    ssl_prefer_server_ciphers on;
  
    # 将443过来的请求全部转到业务监听端口上去（8090）
    location / {
      proxy_pass http://127.0.0.1:8090;
    }
	}：
#监听80端口,并重定向到443
 	server{
     listen 80;
     server_name www.xxx.com;
     rewrite ^(.*)$ https://$host$1 permanent;
	}
  
}
```

- 配置好以后我们重启nginx `./nginx -s reload`
- 直接在浏览器使用https://域名  就可以直接访问到我们的nginx
# 三、nginx返回json或者文本格式的方法
用nginx怎么返回json格式或者文本格式的数据？其实很简单，如下代码：

1. **返回文本格式**
```sql
location ~ ^/get_text {
  default_type text/html;
  return 200 'hello world!';
}
```

2. **返回json格式**
```sql
location ~ ^/get_json {
  default_type application/json;
  return 200 '{"status":"success","result":"hello world!"}';
}
```

3. **也可以简单的根据请求的URL返回不同的字符串**
```sql
location ~ ^/get_text/article/(.*)_(\d+).html$ {
  default_type text/html;
  set $s $1;
  set $d $2;
  return 200 str:$s$d;
}
```

4. **返回的字符集设置，默认是以GBK字符集返回**
```sql
location ~ ^/get_text {
  default_type text/html;
  add_header Content-Type 'text/html; charset=utf-8';
  return 200 '你好，世界！'; 
}
```
注意：default_type必须要添加，否则浏览器会当成不识别的文件进行下载
# 四、nginx配置日志保留时间

- nginx日志文件的轮循配置的文件,放在`/etc/logrotate.d/` 目录下
- 该文件可能位于`/etc/logrotate.d`中.
- 文件名为 `nginx`
- 文件内容中的 `rotate 10`，其中10为保留天数
- 修改保存后，让修改生效，执行`logrotate /etc/logrotate.d/nginx`

