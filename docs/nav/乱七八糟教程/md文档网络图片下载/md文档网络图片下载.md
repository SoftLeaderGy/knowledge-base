# md文档网络图片下载

## 背景

> 网络上下载的文档中可能会有一些图片资源文件，在文档中是以连接的形式存在的，依然是图片的cdn问题，在我们部署后，网站是无法访问cdn的连接的，这就有了今天的功能，将md文档中的网络图片下载至本地，并会创建新的文章，在文章的同级目录下生成一个`images`的文件夹，用于存放图片。

## 使用

- 环境:`java8`
  
  1. 运行代码
  
  2. 选择需要处理的文档
  
  3. 等待下载完成即可

- 注意：
  
  1. 代码中，储存图片的文件夹名称、路径、文件名、下载的图片名称，均可以自定义修改。

## 代码

```java
import javax.swing.*;
import java.awt.*;
import java.io.*;
import java.net.URL;
import java.nio.channels.Channels;
import java.nio.channels.ReadableByteChannel;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;


public class MarkdownImageDownloader {
	public static final String Local_PATH_REG = "!\\[.*?]\\(([A-Z]:.*?)\\)";
	public static final String IMG_URL_REG = "!\\[.*?]\\((http.*?)\\)"; // 匹配图片链接地正则表达式
	public static final String IMG_TYPE_REG = "\\.(jpg|jpeg|png|gif|bmp|webp)";    // 匹配图片格式的正则表达式
	public static final String ILLEGAL_CHAR_REG = "[/:*?\\\\<>\"]";  // 匹配文件名非法字符的正则表达式


	public static void main(String[] args) {
		// 打开文件下载窗口选择文件，从而获得markdown文件的路径
		FileDialog dialog = new FileDialog(new JFrame());
		dialog.setVisible(true);
		String filePath = null; // 选择的markdown文件的路径
		if (dialog.getDirectory() == null || dialog.getFile() == null) {
			System.exit(1);
		} else {
			filePath = dialog.getDirectory() + dialog.getFile();
		}
 
		// 构建md保存根路径和图片保存路径
		int index = filePath.lastIndexOf(File.separator);
		String mdPath = filePath.substring(0, index + 1);
		String filename = filePath.substring(index + 1, filePath.length() - 3);
		// 图片文件夹名称：文件名img
//		String imgDirectoryName = filePath.substring(index + 1, filePath.length() - 3) + "img";
		// 自定义
		String imgDirectoryName = "images";
		String imgDirectoryPath = mdPath + imgDirectoryName;
 
		try {
			// 获取md文件内容
			String mdContent = getMdContent(filePath);
			// 创建存放图片的文件夹
			Files.createDirectories(Paths.get(imgDirectoryPath));
 
			// 如果图片是本地的，这将图片复制到新的图片目录下
			mdContent = copyLocalImg(imgDirectoryName, imgDirectoryPath, mdContent);
 
			// 获得图片网络地址，并从网络上下载图片到本地；最后把markdown文档的图片标签换成本地路径
			mdContent = downloadImg(imgDirectoryName, imgDirectoryPath, mdContent);
 
			// 构建副本
			String mdName = filename + "_new.md";
			try (FileWriter writer = new FileWriter(mdPath +mdName)) {
                writer.write(mdContent);
                writer.flush();
            }
 
			JOptionPane.showMessageDialog(null, "任务完成！");
			System.exit(0);
		} catch (IOException e) {
			JOptionPane.showMessageDialog(null, "任务失败！", "IO异常", JOptionPane.ERROR_MESSAGE);
			e.printStackTrace();
		}
		System.exit(1);
	}
 
	private static String copyLocalImg(String imgDirectoryName, String destPath, String mdContent) throws IOException {
		Pattern compile = Pattern.compile(Local_PATH_REG);
		Matcher matcher = compile.matcher(mdContent);
		while (matcher.find()){
			String imgPath = matcher.group(1);
			// 获取图片的文件名
			int start = imgPath.lastIndexOf(File.separator) + 1;
			int index = imgPath.indexOf("?");
			int end = index == -1 ? imgPath.length() : index;
			String imgName = imgPath.substring(start, end);
			Files.copy(Paths.get(imgPath.substring(0, end)), Paths.get(destPath + File.separator + imgName),
					StandardCopyOption.REPLACE_EXISTING);
			mdContent = mdContent.replace(imgPath, imgDirectoryName + "/" + imgName);
		}
		return mdContent;
	}
 
	private static String getMdContent(String filePath) throws IOException {
		// 将markdown文件读入内存，保存到字符串变量stringBuilder中
		StringBuilder stringBuilder = new StringBuilder();
		try (BufferedReader br = new BufferedReader(new InputStreamReader(new FileInputStream(filePath), StandardCharsets.UTF_8))) {
			String line;
			while ((line = br.readLine()) != null)
				stringBuilder.append(line).append("\n");
		}
        return stringBuilder.toString();
	}
 
	private static String downloadImg(String imgDirectoryName, String destPath, String mdContent) throws IOException {
		Pattern pattern = Pattern.compile(IMG_URL_REG); // 匹配url
		Matcher matcher = pattern.matcher(mdContent);    // 构建匹配器
		Pattern imgTypePattern = Pattern.compile(IMG_TYPE_REG);  // 匹配图片格式
		while (matcher.find()) {
			String imgUrl = matcher.group(1);   // 匹配匹配器第一个括号里的内容
			Matcher imgTypeMatcher = imgTypePattern.matcher(imgUrl);
			// 开始获取图片的文件名
			String imgName;
			if (imgTypeMatcher.find()) {
				String imgType = imgTypeMatcher.group(1);
				int start = imgUrl.lastIndexOf("/") + 1;
				int end = imgUrl.lastIndexOf(imgType) + imgType.length();
				imgName = imgUrl.substring(start, end).replaceAll(ILLEGAL_CHAR_REG, "");
			} else {
				// 获取图片连接中的图片名称
//				imgName = imgUrl.substring(imgUrl.lastIndexOf("/") + 1).replaceAll(ILLEGAL_CHAR_REG, "");
				// 使用uuid作为图片名称
				imgName = UUID.randomUUID().toString() + ".jpg";
			}
			try (InputStream inputStream = new URL(imgUrl).openStream()) {
				try (ReadableByteChannel rbc = Channels.newChannel(inputStream)) {
					try (FileOutputStream fos = new FileOutputStream(destPath + File.separator + imgName)) {
						fos.getChannel().transferFrom(rbc, 0L, Long.MAX_VALUE);     // 写入图片文件
					}
				}
			}
			mdContent = mdContent.replace(imgUrl, imgDirectoryName + "/" + imgName);
		}
		return mdContent;
	}
}
```


