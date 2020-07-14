/*
WEB322N1A: Assignment 2- Web Bank 2
Heroku website URL: https://web-bank-2.herokuapp.com/
Eun Kyung (Aimee) Lee
Prof. George Tsang
07-14-2020
*/ 
//==============================Connect to Server==========================================
const HTTP_PORT= process.env.PORT || 3000;
const course=require("./user.json");
const express= require("express");
const exphbs= require('express-handlebars');
const path= require("path");
const bodyParser= require("body-parser");
//--assign-2--------------------------
const session = require('express-session');
const cookieParser = require('cookie-parser');
const { getHeapCodeStatistics } = require("v8");
const FileStore = require('session-file-store')(session);

const app= express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.engine("hbs", exphbs({
    extname:"hbs",
    defaultLayout:false,
    layoutsDir: __dirname + '/views/layouts',
    }));

app.set("view engine", "hbs");
app.use(express.static('public'));

//----assign-2: session make----------------
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  store: new FileStore()
}));

//==============================Login=============================================
app.get('/', (req,res)=>{
    res.render('index');
});
app.post("/", (req,res)=>{
    let inputusername= req.body.txtUserName;
    let inputpassword= req.body.txtPassword;
    let result= "invalid";
    let fs=require("fs");

    fs.readFile("./user.json", "utf-8", (err,logindata)=>{
        try{
            logindata=JSON.parse(logindata);
            console.log(logindata);
            let check_user="";
            let check_pwd="";

            if(logindata[inputusername] == inputpassword){
                console.log(`auth $logindata[inputusername]`);
                if(!req.session.logined) 
                res.render("https://webbank-2.herokuapp.com/main",{data:inputusername});
                //res.send("hello world");

            }else if(!logindata[inputusername] ){
                console.log("no user");               
                res.render("index",{data:"Invalid User"});
            }else {
                console.log("no password");
                res.render("index",{data:"Invalid Password"});
            }
          
        }catch(err){
            console.log("Error parsing JSON string: ",err);
        }
    })
});
//==============================Logout==========================================
app.post("/logout",(req,res)=>{
  res.render("index");
});
//==============================Deposit==========================================
app.post("/d",(req,res)=>{
 let txtacc = req.body.txtaccount;
 res.render('deposit',{layout:'main2',somedata:txtacc});
});

app.post("/deposit", (req,res)=>{
  let txtacc = req.body.txtaccount;
  let txtdeposit = req.body.txtdeposit;
  console.log(txtacc + "/" + txtdeposit);

  let dataDeposit;
  let curr_balance;
  let curr_type;

  let fs2 = require("fs");
  fs2.readFile("./accounts.json", "utf-8", (err, bankingdata)=>{

    try{
      dataDeposit = JSON.parse(bankingdata);

      for(var key in dataDeposit){
        if(dataDeposit.hasOwnProperty(key) && dataDeposit[txtacc]){
          curr_balance = dataDeposit[txtacc].accountBalance;
          curr_type = dataDeposit[txtacc].accountType;
          curr_balance = parseFloat(curr_balance) + parseFloat(txtdeposit);
          console.log(curr_balance);
        }
      }
      dataDeposit.hasOwnProperty(txtacc) && (dataDeposit[txtacc] = {"accountType": curr_type, "accountBalance": curr_balance.toFixed(2)});

      fs2.writeFile("./accounts.json", JSON.stringify(dataDeposit, null, 4), (err) => {        
        if (err) throw err;      
        console.log("File successfully created/updated.");
        res.render("main");
      });
    }catch(err){
      console.log("Error parsing bankingdata JSON string: ",err);
    }
  })
});
//==============================Balance===========================================
app.post("/l",(req,res)=>{
  let txtacc= req.body.txtaccount; 
  let data9=[];
  let type;
  let balance;
  let filterArray=[txtacc];
  let fs2=require("fs");
  let max=0;

  fs2.readFile("./accounts.json", "utf-8", (err,bankingdata)=>{
      try{
         data10 = JSON.parse(bankingdata);  
         
        for (var key in data10) {
          if (data10.hasOwnProperty(key) && data10[txtacc]) {
            data9=           
              {
                no:txtacc,
                mode:data10[txtacc].accountType,
                balance:data10[txtacc].accountBalance
              }              
          
            console.log(JSON.stringify(data9));            
            break;          
          }          
        }        
        res.render('balance',{layout:'main2',hbsdata:data9});
       }catch(err){
            console.log("Error parsing bankingdata JSON string: ",err);
       }
  });
 });
 //==============================Withdrawal==========================================
 app.post("/w",(req,res)=>{
  let txtacc = req.body.txtaccount;
  res.render('withdrawal',{layout:'main2',somedata:txtacc});
 });
 
 app.post("/withdrawal", (req,res)=>{
  let txtacc = req.body.txtaccount;
  let txtwithdrawal = req.body.txtwithdrawal;
  let dataWithdrawal;
  let curr_balance;
  let curr_type;
  let fs2 = require("fs");

  fs2.readFile("./accounts.json", "utf-8", (err, bankingdata)=>{
    try{   
      dataWithdrawal = JSON.parse(bankingdata);

      for(var key in dataWithdrawal){
        if(dataWithdrawal.hasOwnProperty(key) && dataWithdrawal[txtacc]){
          curr_balance = dataWithdrawal[txtacc].accountBalance;
          curr_balance = parseFloat(curr_balance) - parseFloat(txtwithdrawal);
          console.log("...." + curr_balance);
          if(curr_balance <0){
            res.render('withdrawal',{layout:'main2',somedata2:"Not enough balance"});
            break;
          }else{
              curr_type = dataWithdrawal[txtacc].accountType;
  
            dataWithdrawal.hasOwnProperty(txtacc) && (dataWithdrawal[txtacc] = {"accountType": curr_type, "accountBalance": curr_balance.toFixed(2)});
  
            fs2.writeFile("./accounts.json", JSON.stringify(dataWithdrawal, null, 4), (err) => {        
            if (err) throw err;      
            console.log("File successfully created/updated.");
            res.render("main");
            });
          }
          break; 
        }
      }
      
    }catch(err){
      console.log("Error parsing bankingdata JSON string: ",err);
    }
  })
 });
 //==============================Open Account==========================================

 app.post("/a",(req,res)=>{
  console.log(`open...account`);
  res.render('account',{layout:'main2'});
 });
 app.post("/add",(req,res)=>{
  let txtaccountno= req.body.txtaccount;
  let rdtype = req.body.rd_type;
  //console.log('Got body:', req.body);
  //console.log(`fromaa acc=${txtaccountno}  ${rdtype}` );
  let txtlastid;
  let fs2=require("fs");
  fs2.readFile("./accounts.json", "utf-8", (err,bankingdata)=>{

      try{
        let dataObj = JSON.parse(bankingdata);
        txtlastid = dataObj.lastID;
        //----if not exit txtaccountno, insert obj-----------------
        dataObj.hasOwnProperty(txtaccountno) || (dataObj[txtaccountno] = {accountType: rdtype, "accountBalance":0}); 
        //----update lastID as max ID---------------------------------
        if(txtaccountno > txtlastid){
          txtlastid = txtaccountno
        }
        dataObj.lastID=txtlastid;
        //----if exit txtaccountno, update obj---------------------
        console.log(dataObj);
      
        fs2.writeFile("./accounts.json", JSON.stringify(dataObj, null, 4), (err) => {        
          if (err) throw err;      
          console.log("File successfully created/updated.");
          res.render("main", {register: `${rdtype} Account #${txtaccountno} Created`});
        });
      }catch(err){
            console.log("Error parsing bankingdata JSON string: ",err);
      }
  }); 
 });
//==============================Cancel==========================================
app.post("/c", (req,res)=>{
    res.render('main');
});
//==============================================================================
const server= app.listen(HTTP_PORT, ()=>{
    console.log(`Listening on port...>>${HTTP_PORT}`);
});