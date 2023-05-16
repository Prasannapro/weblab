var express=require("express");
var path=require("path");
var mongoose=require("mongoose");
var config=require("./config/database")
var bodyParser = require('body-parser')
var session=require("express-session")
// var expressValidator=require("express-validator");
const { body, validationResult } = require('express-validator');

//db connection
mongoose.connect(config.database);
var db=mongoose.connection;
db.on('error',console.error.bind(console,'connection error:'));
db.once('open',function(){
    console.log("connected!!");
})


//app initialization
var app=express();

app.set("views",path.join(__dirname,'views'));
app.set("view engine",'ejs');

//public folder
app.use(express.static(path.join(__dirname,'public')));

//gloval
app.locals.errors=null;


app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

//express-session
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
  }))

//express valid
// app.use(expressValidator({
//      errorFormatter:function(parm,msg,value){
//         var namespace = parm.split('.'),
//         root=namespace.shift(),
//         formParm=root;

//         while(namespace.length){
//             formParm+='[' + namespace.shift() + ']';

//         }
//         return {
//             parm: formParm,
//             msg: msg,
//             value:value
//         };
//      }
// }));

//mesage
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});



// app.get('/',function(req,res){
//     res.render('index',{
//         title: "Home"
//     });
// })

//set routes
var pages=require("./routes/pages");
var adminPages=require("./routes/admin_pages");

app.use('/admin/pages',adminPages);
app.use('/',pages);

var port =3000;
app.listen(port,function(){
    console.log("server started on port"+port);
})


