<a name="gtNHw"></a>
## 一、背景
- 在工作当中经常会遇到，测试环境好用，本地不好用的情况，这种情况要么就是版本的问题，要么就是数据的问题
- 但是怎么能debug调试我们测试环境程序呢～
<a name="KY65p"></a>
## 二、解决方案
> ⚠️：nginx实现的测试环境请求复制到本地，并进行debug调试

> 直接上代码

```shell
# 配置服务代理
          location /thread-test/ {
              # 主机地址
						  #模拟nginx转发是测试后台的服务
              proxy_pass http://localhost:9902/thread-test/;
                # 流量复制
                mirror /mirror;
                mirror_request_body on;
          }
# 镜像站点
        location /mirror{
                internal;
								# 模拟本地的服务
                proxy_pass http://localhost:9905$request_uri;
                proxy_pass_request_body on;
                proxy_set_header X-Original-URI $request_uri;
        }
```

- 好处
   - 既能解决debug调试的线上的测试环境，又不会阻塞线上环境的程序运行。

---

> 这里只是放了一个用于测试的最原始的nginx.conf配置文件，

```shell
#user  nobody;
worker_processes  1;

#error_log  logs/error.log;
#error_log  logs/error.log  notice;
#error_log  logs/error.log  info;

#pid        logs/nginx.pid;


events {
    worker_connections  1024;
}


http {
    include       mime.types;
    default_type  application/octet-stream;

    #log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
    #                  '$status $body_bytes_sent "$http_referer" '
    #                  '"$http_user_agent" "$http_x_forwarded_for"';

    #access_log  logs/access.log  main;

    sendfile        on;
    #tcp_nopush     on;

    #keepalive_timeout  0;
    keepalive_timeout  65;

    #gzip  on;

    server {
        listen       80;
        server_name  localhost;

        #charset koi8-r;

        #access_log  logs/host.access.log  main;

        location / {
            root   html;
            index  index.html index.htm;
        }
# 配置服务代理
          location /thread-test/ {
              # 主机地址
              proxy_pass http://localhost:9902/thread-test/;
                # 流量复制
                mirror /mirror;
                mirror_request_body on;
          }
# 镜像站点
        location /mirror{
                internal;
                proxy_pass http://localhost:9905$request_uri;
                proxy_pass_request_body on;
                proxy_set_header X-Original-URI $request_uri;
        }
        #error_page  404              /404.html;

        # redirect server error pages to the static page /50x.html
        #
        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   html;
        }

        # proxy the PHP scripts to Apache listening on 127.0.0.1:80
        #
        #location ~ \.php$ {
        #    proxy_pass   http://127.0.0.1;
        #}

        # pass the PHP scripts to FastCGI server listening on 127.0.0.1:9000
        #
        #location ~ \.php$ {
        #    root           html;
        #    fastcgi_pass   127.0.0.1:9000;
        #    fastcgi_index  index.php;
        #    fastcgi_param  SCRIPT_FILENAME  /scripts$fastcgi_script_name;
        #    include        fastcgi_params;
        #}

        # deny access to .htaccess files, if Apache's document root
        # concurs with nginx's one
        #
        #location ~ /\.ht {
        #    deny  all;
        #}
    }


    # another virtual host using mix of IP-, name-, and port-based configuration
    #
    #server {
    #    listen       8000;
    #    listen       somename:8080;
    #    server_name  somename  alias  another.alias;

    #    location / {
    #        root   html;
    #        index  index.html index.htm;
    #    }
    #}


    # HTTPS server
    #
    #server {
    #    listen       443 ssl;
    #    server_name  localhost;

    #    ssl_certificate      cert.pem;
    #    ssl_certificate_key  cert.key;

    #    ssl_session_cache    shared:SSL:1m;
    #    ssl_session_timeout  5m;

    #    ssl_ciphers  HIGH:!aNULL:!MD5;
    #    ssl_prefer_server_ciphers  on;

    #    location / {
    #        root   html;
    #        index  index.html index.htm;
    #    }
    #}
    include servers/*;
}
```

