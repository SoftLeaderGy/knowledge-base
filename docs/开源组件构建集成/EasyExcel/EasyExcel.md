[EasyExcel官方文档 - 基于Java的Excel处理工具 | Easy Excel](https://easyexcel.opensource.alibaba.com/)
# 一、搭建过程
## 1、导入pom依赖
```xml
<dependency>
  <groupId>com.alibaba</groupId>
  <artifactId>easyexcel</artifactId>
  <version>3.3.2</version>
</dependency>
```
## 2、web上传、下载
### 2.1、官方demo代码
```java
/**
* 文件下载（失败了会返回一个有部分数据的Excel）
* <p>
* 1. 创建excel对应的实体对象 参照{@link DownloadData}
* <p>
* 2. 设置返回的 参数
* <p>
* 3. 直接写，这里注意，finish的时候会自动关闭OutputStream,当然你外面再关闭流问题不大
*/
@GetMapping("download")
    public void download(HttpServletResponse response) throws IOException {
    // 这里注意 有同学反应使用swagger 会导致各种问题，请直接用浏览器或者用postman
    response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    response.setCharacterEncoding("utf-8");
    // 这里URLEncoder.encode可以防止中文乱码 当然和easyexcel没有关系
    String fileName = URLEncoder.encode("测试", "UTF-8").replaceAll("\\+", "%20");
    response.setHeader("Content-disposition", "attachment;filename*=utf-8''" + fileName + ".xlsx");
    EasyExcel.write(response.getOutputStream(), DownloadData.class).sheet("模板").doWrite(data());
}

/**
* 文件上传
* <p>1. 创建excel对应的实体对象 参照{@link UploadData}
* <p>2. 由于默认一行行的读取excel，所以需要创建excel一行一行的回调监听器，参照{@link UploadDataListener}
* <p>3. 直接读即可
*/
@PostMapping("upload")
    @ResponseBody
    public String upload(MultipartFile file) throws IOException {
    EasyExcel.read(file.getInputStream(), UploadData.class, new UploadDataListener(uploadDAO)).sheet().doRead();
    return "success";
}
```
```java
package com.alibaba.easyexcel.test.demo.web;

import java.util.List;

import com.alibaba.excel.context.AnalysisContext;
import com.alibaba.excel.read.listener.ReadListener;
import com.alibaba.excel.util.ListUtils;
import com.alibaba.fastjson2.JSON;

import lombok.extern.slf4j.Slf4j;

	/**
    * 模板的读取类
    *
    * @author Jiaju Zhuang
    */
    // 有个很重要的点 DemoDataListener 不能被spring管理，要每次读取excel都要new,然后里面用到spring可以构造方法传进去
    @Slf4j
    public class UploadDataListener implements ReadListener<UploadData> {
        /**
        * 每隔5条存储数据库，实际使用中可以100条，然后清理list ，方便内存回收
        */
        private static final int BATCH_COUNT = 5;
        private List<UploadData> cachedDataList = ListUtils.newArrayListWithExpectedSize(BATCH_COUNT);
        /**
        * 假设这个是一个DAO，当然有业务逻辑这个也可以是一个service。当然如果不用存储这个对象没用。
        */
        private UploadDAO uploadDAO;

        public UploadDataListener() {
            // 这里是demo，所以随便new一个。实际使用如果到了spring,请使用下面的有参构造函数
            uploadDAO = new UploadDAO();
        }

        /**
        * 如果使用了spring,请使用这个构造方法。每次创建Listener的时候需要把spring管理的类传进来
        *
        * @param uploadDAO
        */
        public UploadDataListener(UploadDAO uploadDAO) {
            this.uploadDAO = uploadDAO;
        }

        /**
        * 这个每一条数据解析都会来调用
        *
        * @param data    one row value. It is same as {@link AnalysisContext#readRowHolder()}
        * @param context
        */
        @Override
        public void invoke(UploadData data, AnalysisContext context) {
            log.info("解析到一条数据:{}", JSON.toJSONString(data));
            cachedDataList.add(data);
            // 达到BATCH_COUNT了，需要去存储一次数据库，防止数据几万条数据在内存，容易OOM
            if (cachedDataList.size() >= BATCH_COUNT) {
                saveData();
                // 存储完成清理 list
                cachedDataList = ListUtils.newArrayListWithExpectedSize(BATCH_COUNT);
            }
        }

        /**
        * 所有数据解析完成了 都会来调用
        *
        * @param context
        */
        @Override
        public void doAfterAllAnalysed(AnalysisContext context) {
            // 这里也要保存数据，确保最后遗留的数据也存储到数据库
            saveData();
            log.info("所有数据解析完成！");
        }

        /**
        * 加上存储数据库
        */
        private void saveData() {
            log.info("{}条数据，开始存储数据库！", cachedDataList.size());
            uploadDAO.save(cachedDataList);
            log.info("存储数据库成功！");
        }
    }
```

- 官方完整示例代码

[easyexcel/easyexcel-test/src/test/java/com/alibaba/easyexcel/test/demo/web/WebTest.java at master · alibaba/easyexcel](https://github.com/alibaba/easyexcel/blob/master/easyexcel-test/src/test/java/com/alibaba/easyexcel/test/demo/web/WebTest.java)
### 2.2、项目实战
#### 2.2.1、上传导入

1. 导入依赖
```xml
<dependency>
  <groupId>com.alibaba</groupId>
  <artifactId>easyexcel</artifactId>
  <version>3.3.2</version>
</dependency>
```


2. 创建BusinessLinkUploadListener类，且实现`ReadListener<BusinessLinkDTO>`
3. 有个很重要的点 BusinessLinkUploadListener 不能被spring管理，要每次读取excel都要new,然后里面用到spring可以构造方法传进去，所以使用有参构造
```java
    /**
     * 如果使用了spring,请使用这个构造方法。每次创建Listener的时候需要把spring管理的类传进来
     *
     * @param businessLinkService
     */
    public BusinessLinkUploadListener(BusinessLinkService businessLinkService, HttpServletResponse response) {
        this.businessLinkService = businessLinkService;
        // 响应体
        this.response = response;
    }
```

4. 设置多少条数据之后执行一次存储
```java
    /**
     * 每隔100条存储数据库,然后清理list ，方便内存回收
     */
    private static final int BATCH_COUNT = 100;
```

5. 监听器方法
   1. void invoke(BusinessLinkDTO businessLinkDTO, AnalysisContext context) 方法（这个每一条数据解析都会来调用）
```java
    /**
     * 这个每一条数据解析都会来调用
     *
     * @param businessLinkDTO
     * @param context
     */
    @Override
    public void invoke(BusinessLinkDTO businessLinkDTO, AnalysisContext context) {
        log.info("解析到一条数据:{}", JSONObject.toJSONString(businessLinkDTO));
        cachedDataList.add(businessLinkDTO);
        // 达到BATCH_COUNT了，需要去存储一次数据库，防止数据几万条数据在内存，容易OOM
        if (cachedDataList.size() >= BATCH_COUNT) {
            saveData();
            // 存储完成清理 list
            cachedDataList = ListUtils.newArrayListWithExpectedSize(BATCH_COUNT);
        }
    }
```

   2. void doAfterAllAnalysed(AnalysisContext context) 方法 （所有数据解析完成了 都会来调用）
```java
    /**
     * 所有数据解析完成了 都会来调用
     *
     * @param context
     */
    @Override
    public void doAfterAllAnalysed(AnalysisContext context) {
        // 这里也要保存数据，确保最后遗留的数据也存储到数据库
        saveData();
        log.info("所有数据解析完成！");
        // 重置失败数据list
        failList = new ArrayList<>();
    }
```

6. 业务处理方法（在invoke方法处理时进行做业务数据处理）
```java
    /**
     * 保存数据库
     */
    @SneakyThrows
    private void saveData() {
        log.info("{}条数据，开始存储数据库！", cachedDataList.size());
        for (BusinessLinkDTO businessLinkDTO : cachedDataList) {
            String s = checkParam(businessLinkDTO);
            if (!StringUtils.isEmpty(s)){
                UploadFailBusinessLinkDTO dto = new UploadFailBusinessLinkDTO();
                BeanUtils.copyProperties(businessLinkDTO,dto);
                dto.setFailMsg(s);
                failList.add(dto);
                continue;
            }
            businessLinkService.saveBusinessLink(businessLinkDTO);
        }
        if(failList.size() > 0){
            EasyExcel
                    .write(response.getOutputStream(), UploadFailBusinessLinkDTO.class)
                    .sheet("业务链接")
                    .doWrite(failList);
        }
        log.info("存储数据库成功！");
    }
```

7. Controller代码
```java
    /**
     * 导入
     * @param file
     * @return
     * @throws IOException
     */
    @PostMapping("/upload")
    @ResponseBody
    public String upload(MultipartFile file,HttpServletResponse response) throws IOException {
        EasyExcel.read(
                file.getInputStream(),
                BusinessLinkDTO.class, // 上传数据实体类
                new BusinessLinkUploadListener(businessLinkService,response))
                    .sheet()
                    .doRead();
        return "success";
    }
```
#### 2.2.2、下载导出

1. 实体代码
```java
/**
 * @Description: 业务链接DTO
 * @Author: Guo.Yang
 * @Date: 2023/07/03/09:30
 */
@Data
@TableName("business_link_b")
public class BusinessLinkDTO {
    /**
     * 主键
     */
    @ExcelIgnore
    private Integer id;
    /**
     * 业务名称
     */
    @ExcelProperty(value = "业务名称",index = 0)
    @NotBlank(message = "业务名称不可未空！")
    private String businessName;
    /**
     * 业务链接
     */
    @ExcelProperty(value = "业务链接",index = 1)
    @NotBlank(message = "业务链接不可未空！")
    private String businessUrl;
    /**
     * 类型
     */
    @ExcelProperty(value = "类型",index = 2)
    private String type;
    /**
     * 备注
     */
    @ExcelProperty(value = "备注",index = 3)
    private String remark;
    /**
     * 创建时间
     */
    @ExcelProperty(value = "创建时间",index = 4)
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date crteTime;
    /**
     * 修改时间
     */
    @ExcelProperty(value = "修改时间",index = 5)
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date updtTime;
    /**
     * 有效标识
     */
    @ExcelProperty(value = "有效标识",index = 6)
    private Integer enableFlag;

}

```

2. Controller代码
```java
/**
* 导出数据、导出模版
* @param response
* @param type
* @throws IOException
*/
// type为data时，进行所有数据的查询，并进行导出
// type不为data时，就创建一个空的 List 进行导出也就是所谓的下载模版
@GetMapping("/download/{type}")
    public void download(HttpServletResponse response,@PathVariable("type") String type) throws IOException {
    boolean isDate = "data".equals(type);
    String dataFormat = new SimpleDateFormat("yyyyMMddHHmmss").format(new Date());
    response.setContentType("application/json;charset=UTF-8");
    response.setCharacterEncoding("utf-8");
    String fileName = URLEncoder.encode(dataFormat + "_业务链接" + ( isDate? "导出": "模版"), "UTF-8").replaceAll("\\+", "%20");
    response.setHeader("Content-disposition", "attachment;filename*=utf-8''" + fileName + ".xlsx");
    EasyExcel
        .write(response.getOutputStream(), BusinessLinkDTO.class)
        .sheet("业务链接")
        .doWrite(isDate? businessLinkService.queryBusinessLinkList(new BusinessLinkDTO()): new ArrayList<BusinessLinkDTO>());
}
```
#### 2.2.3、注意
> 导出的时候实体最好不要继承，因为A.class extends B.class 后 ，导出的时候，会将A类的字段作为导出表格的第一列，使用 @ExcelProperty(value = "业务名称",index = 0) 注解标注列顺序的时候在两个列直接，也会失效，当然在一个类内 各个字段的排序是生效的。

 
