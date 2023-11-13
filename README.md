# ARC B30计算器
- 一个本地B30计算器，~~高级EXCEL~~
## 功能
- [x] 支持本地/公开查询
- [x] 定数表查询
![images](images/Screenshots/getscore.png)
- [x] B30表格生成
![images](images/Screenshots/B30.png)
- [x] 自选头像、用户名、PTT
- [x] B30一键导出
- [x] ~~复活AI酱~~（随机歌曲、推分建议、音游圣经、彩蛋）
# 本地部署
## Node.js安装
- 前往[nodejs官网](https://nodejs.org)安装Node.js
## 下载源码
- 使用`git clone`下载
- 没有`git`就直接下载压缩包
## 安装依赖
- 打开终端，跳转到工作区目录下，输入命令自动下载依赖
```
npm install
```
## 启动服务
- 打开终端，跳转到工作区目录下，输入命令启动服务
```
node server.js
```
- 打开浏览器访问`http://localhost:8081`即可开始使用
> 若无法正常启动多半是因为端口占用，修改`settings.yaml`的`port`与`location`为未被占用端口（如`port: 8888`，`location: http://localhost:8888`）。
## 配置文件说明（非必需）
- 解压文件后进入工作区，使用文本编辑器打开`settings.yaml`，更改配置选项
```
# 数据库配置（没有mysql就不管）
mysql:
 enable: false
 host: 'localhost'
 port: 3306
 user: 'root'
 password: 'your_password'
 database: 'arcaea'
# sqlite（建议）
sqlite:
  enable: true
# 服务器配置（不知道就不管）
server:
 host: "localhost"
 port: 8081
 location: "http://localhost:8081"
```
- 没有别的需求建议不动配置文件，如果想公开提供服务，需要将`sqlite`的`enable`设置为`false`，将`mysql`的`enable`设置为`true`，并创建mysql数据库，并将`password`修改你的root密码。sql初始化文件在`/sql/init.sql`
- 公开站点可通过公网ip或使用内网穿透（ngrok、cpolar等），将`location`修改为你自己的域名
# 曲库更新
- 在`/data/songs.csv`内增加更新曲目（新添加歌名避免出现'或"），参考格式如下：
```
# 如果没有对应难度可以不写，但是必须有逗号分隔
name,pst,prs,ftr,byd
Arghena,0.0,0.0,11.3,
```
- 在`/images/Songcovers`文件夹下面加入新曲曲绘，注意图片名称修改为xxx.jpg（不要有特殊字符）
# AI酱
- 在`/data/songs.yaml`添加歌曲推荐回答
- 在`/data/bible.yaml`添加圣经
> 填写格式均参考文件内部


