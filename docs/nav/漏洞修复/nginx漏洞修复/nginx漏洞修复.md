## 1、检测到 RC4 密码套件、检测到 SHA-1 密码套件
```nginx
# 在nginx的nginx.conf 文件中加入：
ssl_ciphers ECDHE-RSA-AES128-SHA256:ECDHE-RSA-AES256-SHA384:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES128-SHA256:ECDHE-ECDSA-AES256-SHA384:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:!NULL:!aNULL:!MD5:!ADH:!RC4:!DH:!DHE:!SHA-1;
ssl_prefer_server_ciphers on;
```
## 2、支持不推荐使用的 SSL 版本
```nginx
#将nginx.conf中的
ssl_protocols SSLv2 SSLv3 TLSv1;
#改为
ssl_protocols TLSv1.2;
```
## 3、“Content-Security-Policy”头缺失或不安全
```nginx
# 在nginx的nginx.conf 文件中加入：

add_header Content-Security-Policy "default-src 'self' localhost:8080 'unsafe-inline' 'unsafe-eval' blob: data: ;";
```
## 4、“X-Content-Type-Options”头缺失或不安全
```nginx
# 在nginx的nginx.conf 文件中加入：
add_header X-Content-Type-Options nosniff;
```
## 5、“X-XSS-Protection”头缺失或不安全
```nginx
# 在nginx的nginx.conf 文件中加入：
add_header X-XSS-Protection 1;
# 和
add_header X-Xss-Protection: mod=block;
```
## 6、HTTP Strict-Transport-Security 头缺失或不安全
```nginx
# 在nginx的nginx.conf 文件中加入：
add_header Strict-Transport-Security "max-age=63072000; includeSubdomains; preload";
```
## 7、发现可高速缓存的 SSL 页面
```nginx
# 在nginx的nginx.conf 文件中加入：
add_header Cache-Control no-cache;
```
## 8、检测到隐藏目录（对禁止的资源发布“404 - Not Found”响应状态代码，或者将其完全除去）
```nginx
# 在nginx的nginx.conf 文件中加入：
error_page 403 = 404 /404.html;
```

- 以上8种漏洞修复示例
```nginx
Server{
 
    listen 443 ssl;
     
    add_header Strict-Transport-Security "max-age=63072000; includeSubdomains; preload";
     
    add_header X-Content-Type-Options: nosniff;
     
    add_header Content-Security-Policy "default-src 'self' 127.0.0.1:443 'unsafe-inline' 'unsafe-eval' blob: data: ;";
     
    add_header X-XSS-Protection 1;
     
    add_header X-Xss-Protection: mod=block;
     
    ssl_ciphers"ECDHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-SHA384:ECDHE-RSA-AES128-SHA256:ECDHE-RSA-AES256-SHA:ECDHE-RSA-AES128-SHA:DHE-RSA-AES256-SHA256:DHE-RSA-AES128-SHA256:DHE-RSA-AES256-SHA:DHE-RSA-AES128-SHA:ECDHE-RSA-DES-CBC3-SHA:EDH-RSA-DES-CBC3-SHA:AES256-GCM-SHA384:AES128-GCM-SHA256:AES256-SHA256:AES128-SHA256:AES256-SHA:AES128-SHA:DES-CBC3-SHA:HIGH:!aNULL:!eNULL:!EXPORT:!DES:!MD5:!PSK:!RC4";
     
    ssl_prefer_server_ciphers on;
     
    ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
     
    ssl_prefer_server_ciphers   on;
 
}
```
## 9、nginx关闭低版本tls协议

- 注释掉低版本的tls
```nginx
#将原来的 ssl_protocols TLSv1 TLSv1.1 TLSv1.2; 注释掉
#改成：
ssl_protocols  TLSv1.2;
```

- 修改`ssl_ciphers`
```nginx
ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384;

```
