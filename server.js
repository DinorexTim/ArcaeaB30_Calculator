const express=require("express");
const WebSocket = require('ws');
var querystring=require("querystring");
var bodyParser=require('body-parser');
var session=require('express-session');
var http=require("http");
var mysql=require('mysql2');
const fs=require("fs");
const yaml = require('js-yaml');
const csv=require('csv-parser');
const sqlite=require('sqlite3');

/********************读取Settings.yaml********************/
var settings;
try {
  const yamlContent = fs.readFileSync('Settings.yaml', 'utf8');
  settings = yaml.load(yamlContent);
  console.log(settings);
} catch (error) {
  console.error('Error reading or parsing YAML file:', error);
}
var app=express();
const host=settings.server.host;
const port=settings.server.port;
const location=settings.server.location;
/********************songs.yaml********************/
var songs;
try {
  const randomsong = fs.readFileSync(__dirname+'/data/songs.yaml', 'utf8');
  songs = yaml.load(randomsong);
  songs=songs.song;
} catch (error) {
  console.error('Error converting YAML to JSON:', error);
}
/********************bible.yaml********************/
var bible;
try {
  const yamlinfo = fs.readFileSync(__dirname+'/data/bible.yaml', 'utf8');
  bible = yaml.load(yamlinfo);
  bible=bible.text;
} catch (error) {
  console.error('Error converting YAML to JSON:', error);
}
/*********************创建服务器**********************/
server=http.createServer((request,response)=>{
    response.writeHead(200,{'Content-Type':'text/plain'});
});
console.log(`Server is running at http://${host}:${port}`);
var server=app.listen(port,()=>{});
/********************* 创建WebSocket服务器 *********************/
const wss = new WebSocket.Server({ 
  server:server
});
const clients = new Set();
// 监听WebSocket连接事件
wss.on('connection',(ws)=>{
  console.log("Server connection()");
  clients.add(ws);
  ws.on('message',(message)=>{
    clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });
  ws.on('close', () => {
    clients.delete(ws);
    console.log('客户端已关闭');
  });
});
/*********************创建session**********************/
app.use(session({
    secret:'616nmsl',
    cookie:{maxAge:1440*60*1000},
    resave: false,
    saveUninitialized: false
  }));
/********************MySQL数据库********************/
let connectInfo;
//配置本机mysql连接基本信息
if(settings.mysql.enable){
  connectInfo = mysql.createConnection({
    host: settings.mysql.host,
    port: settings.mysql.port,
    user: settings.mysql.user,
    password: settings.mysql.password,
    database: settings.mysql.database,
  })
  //数据库建立连接
  connectInfo.connect((err)=>{
    if(err){
      console.log('[query] - :'+err);
    }
    console.log("MySQL connection succeed!");
  });
}
/********************sqlite********************/
const dbPath=__dirname+'/data/arc.db';
if(settings.sqlite.enable){
  connectInfo=new sqlite.Database(dbPath,(err)=>{
    if(err){
      console.error('Error connecting to the database: ',err.message);
    }else{
      console.log('Connected to database!');
    }
  });
  connectInfo.query=connectInfo.all;
}
/********************读取歌曲定数***************************/
var GradeTable = [];
fs.createReadStream(__dirname+'/data/song.csv')
.pipe(csv())
.on('data', (data) => {
  GradeTable.push(data);
})
.on('end', () => {
  // console.log(GradeTable);
  console.log('歌曲信息加载完成');
});

/********************加载静态资源***************************/
app.use('/ArcaeaB30_Calculator',express.static('ArcaeaB30_Calculator'));
app.get('/', (req,res)=>{
    if (req.session.sign) {//检查用户是否已经登录
      console.log(req.session);//打印session的值
      res.redirect(`${location}/b30.html`);
    }else{
      res.sendFile(__dirname+"/"+"html/index.html");
    }
    console.log("Current Page: index.html");
});
app.get('/getscore.html', (req,res)=>{
    res.sendFile(__dirname+"/"+"html/getscore.html");
    console.log("Current Page: getscore.html");
})
app.get('/b30.html', (req,res)=>{
  res.sendFile(__dirname+"/"+"html/b30.html");
  console.log("Current Page: b30.html");
})
app.get('/AIsauce.html', (req,res)=>{
  res.sendFile(__dirname+"/"+"html/AIsauce.html");
  console.log("Current Page: AIsauce.html");
})
app.get('/comment.html', (req,res)=>{
  res.sendFile(__dirname+"/"+"html/comment.html");
  console.log("Current Page: comment.html");
})
app.get('/loginerror.html', (req,res)=>{
  res.sendFile(__dirname+"/"+"html/loginerror.html");
  console.log("Current Page: loginerror.html");
})
app.get('/css/:cssName', (req, res) => {
  const cssName = req.params.cssName;
  fs.readFile(`./css/${cssName}`,(err,data)=>{
    if(err){
      console.log(`加载${cssName}失败！`);
    }
    res.writeHead(200,{
      "Content-type":"text/css"
    });
    res.end(data)
  });
});
app.get('/js/:jsName',(req,res)=>{
  const jsName=req.params.jsName;
  fs.readFile(`./js/${jsName}`,(err,data)=>{
    if(err){
      console.log(`加载${jsName}失败！`);
      throw err;
    }
    res.writeHead(200,{
      "Content-type":"text/javascript"
    });
    res.end(data)
  });
});
app.get('/images/Songcovers/:imageName', (req, res) => {
  const imageName = req.params.imageName;
  fs.readFile(`./images/Songcovers/${imageName}`,(err,data)=>{
    if(err){
      console.log(`加载${imageName}失败！`);
    }
    res.writeHead(200,{
      "Content-type":"image/jpg"
    });
    res.end(data)
  });
});
app.get('/images/AIsauce/AIsauce.jpg',(req,res)=>{
  fs.readFile("./images/AIsauce/AIsauce.jpg",(err,data)=>{
    if(err){
      console.log("加载AIsauce.jpg失败！");
    }
    res.writeHead(200,{
      "Content-type":"image/jpg"
    });
    res.end(data)
  });
});
app.get('/images/guy/guyb30.jpg',(req,res)=>{
  fs.readFile("./images/guy/guyb30.jpg",(err,data)=>{
    if(err){
      console.log("guyb30.jpg失败！");
    }
    res.writeHead(200,{
      "Content-type":"image/jpg"
    });
    res.end(data)
  });
});
app.get('/images/icon/icon.png',(req,res)=>{
  fs.readFile("./images/icon/icon.png",(err,data)=>{
    if(err){
      console.log("加载失败！");
    }
    res.writeHead(200,{
      "Content-type":"image/png"
    });
    res.end(data)
  });
});
app.get('/images/arcaea/:imageName', (req, res) => {
  const imageName = req.params.imageName;
  fs.readFile(`./images/arcaea/${imageName}`,(err,data)=>{
    if(err){
      console.log(`加载${imageName}失败！`);
    }
    res.writeHead(200,{
      "Content-type":"image/jpg"
    });
    res.end(data)
  });
});
app.get('/images/avatar/:imageName', (req, res) => {
  const imageName = req.params.imageName;
  fs.readFile(`./images/avatar/${imageName}`,(err,data)=>{
    if(err){
      console.log(`加载${imageName}失败！`);
    }
    res.writeHead(200,{
      "Content-type":"image/png"
    });
    res.end(data)
  });
});
app.get('/images/rank/:imageName', (req, res) => {
  const imageName = req.params.imageName;
  fs.readFile(`./images/rank/${imageName}`,(err,data)=>{
    if(err){
      console.log(`加载${imageName}失败！`);
    }
    res.writeHead(200,{
      "Content-type":"image/png"
    });
    res.end(data)
  });
});
app.get('/images/grade/:imageName', (req, res) => {
  const imageName = req.params.imageName;
  fs.readFile(`./images/grade/${imageName}`,(err,data)=>{
    if(err){
      console.log(`加载${imageName}失败！`);
    }
    res.writeHead(200,{
      "Content-type":"image/png"
    });
    res.end(data)
  });
});
app.get('/font/:fontname', (req, res) => {
  const fontname = req.params.fontname;
  fs.readFile(`./font/${fontname}`,(err,data)=>{
    if(err){
      console.log(`加载${fontname}失败！`);
    }
    res.writeHead(200,{
      "Content-type":"font/ttf"
    });
    res.end(data)
  });
});
/********************处理请求********************/
var account="";
app.post('/login',(req,res)=>{
  var body=[];
  req.on("data", (chunk) => {
    body.push(chunk);
  });
  req.on("end",()=>{
    req.session.sign = true;
    req.session.name = 'User';
    body = Buffer.concat(body).toString();
    body = querystring.parse(body);
    console.log(body);
    req.session.account=body.account;
    account=body.account;
    //检测是否注册
    if(body.isRegister=='register'){
      sql_check_isregistered="SELECT * FROM `user` WHERE "+`account=${JSON.stringify(body.account)}`;
      connectInfo.query(sql_check_isregistered,(err,result,field)=>{
        if(err){
          console.log("[SELECT ERROR] - ",err.message);
          return;
        }
        if(result.length!=0){
          res.redirect(`${location}/loginerror.html`);
        }
      });
      sql_register="INSERT INTO `user` VALUES "+`(${JSON.stringify(body.account)},${JSON.stringify(body.password)})`;
      connectInfo.query(sql_register,(err,result,field)=>{
        if(err){
          console.log("[INSERT ERROR] - ",err.message);
          return;
        }
        res.redirect(`${location}/getscore.html`);
      });
    }else{
      sql_login="SELECT * FROM `user` WHERE "+`account=${JSON.stringify(body.account)} AND password=${JSON.stringify(body.password)}`;
      connectInfo.query(sql_login,(err,result,filed)=>{
        if(err){
          console.log("[SELECT ERROR] - ",err.message);
          return;
        }
        if(result.length==0){
          res.redirect(`${location}/loginerror.html`);
        }else{
          res.redirect(`${location}/getscore.html`);
        }
      });
    }
    body=[];
  })
});
app.post('/getAccount',(req,res)=>{
  if(req.session.sign==true){
    res.json({
      "account":req.session.account
    });
  }else{
    res.json({
      "account":"forbidden"
    });
  }
});
app.post('/getisUploaded',(req,res)=>{
  var body='';
  req.on('data',(chunk)=>{
    body+=chunk.toString();
  });
  req.on('end',()=>{
    body=JSON.parse(body);
    sql_isUploaded="SELECT * FROM `grade` WHERE "+`account="${body.account}"`;
    connectInfo.query(sql_isUploaded,(err,result,field)=>{
      if(err){
        console.log("[SELECT ERROR] - ",err.message);
        return;
      }
      if(result.length!=0){
        res.json({
          "isUploaded":1
        });
      }else{
        res.json({
          "isUploaded":0
        })
      }
    });
  });
});
app.post('/getGradeTable',(req,res)=>{
  res.json(GradeTable);
})
app.post('/getGradeTableStored',(req,res)=>{
  var body='';
  req.on('data',(chunk)=>{
    body+=chunk.toString();
  });
  req.on('end',()=>{
    body=JSON.parse(body);
    sql_load_grade="SELECT * FROM `grade` WHERE "+`account="${body.account}"`;
    connectInfo.query(sql_load_grade,(err,result,field)=>{
      if(err){
        console.log("[SELECT ERROR] - ",err.message);
        return;
      }
      if(result.length!=0){
        res.json({
          "GradeTable":result[0].grade
        })
      }else{
        res.json({
          "GradeTable":"[]"
        })
      }
    });
  })
});
app.post('/uploadGrade',(req,res)=>{
  var body='';
  req.on('data',(chunk)=>{
    body+=chunk.toString();
  });
  req.on('end',()=>{
    body=JSON.parse(body);
    sql_delete="DELETE FROM `grade` WHERE account="+`"${body.account}"`;
    sql_save_grade="INSERT INTO `grade` VALUES "+`("${body.account}",'${body.b30}')`
    if(settings.sqlite.enable){
      const deleteStatement = connectInfo.prepare('DELETE FROM grade WHERE account = ?');
      const nameToDelete = `${body.account}`;
      deleteStatement.run(nameToDelete);
      deleteStatement.finalize();
      const insertStatement = connectInfo.prepare('INSERT INTO grade (account,grade) VALUES (?,?)');
      insertStatement.run(`${body.account}`,`${body.b30}`);
      insertStatement.finalize();
    }else if(settings.mysql.enable){
      connectInfo.query(sql_delete,(err,result,field)=>{
        if(err){
          console.log("[DELETE ERROR] - ",err.message);
          return;
        }
      });
      connectInfo.query(sql_save_grade,(err,result,field)=>{
        if(err){
          console.log("[INSERT ERROR] - ",err.message);
          return;
        }
        console.log("成绩存储成功！");
      });
    }
  })
  res.json({
    "status":"success"
  });
});
app.post('/getrandomsong',(req,res)=>{
  function getRandomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  res.json({
    "content":songs[getRandomInteger(0,songs.length-1)]
  });
});
app.post('/getbible',(req,res)=>{
  function getRandomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  res.json({
    "content":bible[getRandomInteger(0,bible.length-1)]
  });
});
app.get('/logout',(req,res)=>{
  req.session.destroy(err => {
    if (err) {
      console.error('Error destroying session:', err);
    }
    res.json({
      status:'success'
    });
  });
});
app.post('/getDialogueID',(req,res)=>{
  sql_selectid="SELECT id FROM `comment` WHERE id = (SELECT MAX(id) FROM `comment`)";
  connectInfo.query(sql_selectid,(err,result,field)=>{
    if(err){
      console.log("[SELECT ERROR] - ",err.message);
      return null;
    }
    if(result.length==0){
      res.json({
        "id":-1
      });
    }else{
      res.json({
        "id":result[0].id
      })
    }
  });
});
app.post('/saveDialogue',(req,res)=>{
  var body="";
  req.on('data',(chunk)=>{
    body+=chunk.toString();
  });
  req.on('end',()=>{
    body=JSON.parse(body);
    if(settings.mysql.enable){
      sql_save_dialogue="INSERT INTO `comment` VALUES "+`(
        ${parseInt(body.id)},
        "${body.account}",
        "${body.comment}",
        ${parseInt(body.like)},
        ${parseInt(body.fun)},
        "${body.time}"
      )`;
      connectInfo.query(sql_save_dialogue,(err,result,field)=>{
        if(err){
          console.log("[INSERT ERROR] - ",err.message);
          return null;
        }
        console.log("存储评论成功！");
        res.json({
          "status":"success"
        });
      });
    }
    
  });
});
app.post('/getDialogue',(req,res)=>{
  sql_selectid="SELECT * FROM `comment`";
  connectInfo.query(sql_selectid,(err,result,field)=>{
    if(err){
      console.log("[SELECT ERROR] - ",err.message);
      return null;
    }
    if(result.length==0){
      res.json({
        "Res":[]
      });
    }else{
      res.json({
        "Res":result
      })
    }
  });
});
app.post('/update',(req,res)=>{
  var body="";
  req.on('data',(chunk)=>{
    body+=chunk.toString();
  });
  req.on('end',()=>{
    body=JSON.parse(body);
    sql_update="UPDATE `comment` SET "+`comment.${body.tochange}=${body.num} WHERE id=${body.id}`;
    if(settings.mysql.enable){
      connectInfo.query(sql_update,(err,result)=>{
        if(err){
          console.log("[UPDATE ERROR] - ",err.message);
          return null;
        }
        res.json({
          "status":"success"
        })
      });
    }
  });
});

