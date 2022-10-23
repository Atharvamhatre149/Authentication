require("dotenv").config();
const express=require("express");
const ejs=require("ejs");
const bodyParser=require("body-parser"); 
const mongoose=require("mongoose")
//const encrypt=require("mongoose-encryption")
const md5=require("md5");

const app=express();


// console.log(process.env.API_KEY);
app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({
    extended:true
}));

mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema= new mongoose.Schema({
    email:String,
    password:String
});

// const secret= "Thisisourlittlesecret";
// userSchema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields:["password"]});

const User=mongoose.model("User",userSchema);


app.get("/",function (req,res) {
    res.render("home");
  });

  app.get("/login",function (req,res) {
    res.render("login");
  });

  app.get("/register",function (req,res) {
    res.render("register");
  });


  app.post("/register",function (req,res) {
    const newuser=new User({
        email:req.body.username,
        password:md5(req.body.password)
    });

    newuser.save(function(err){
        if(err)
        {
            console.log(err);
        }
        else{
            res.render("secrets");
        }
    });
  });

  app.post("/login",function (req,res) {
        const username=req.body.username;
        const password=md5(req.body.password);

        User.findOne({email:username},function(err,finduser){
            if(err)
            {
                console.log(err);
            }
            else{
                if(finduser)
                {
                    if(finduser.password === password)
                    {
                        console.log(finduser.password);
                        console.log(password);
                        res.render("secrets");
                    }
                    else{
                        console.log("Password is invalid!");
                    }
 
                }
                else{
                    console.log("invalid email!");
                }
            }
        })


  })



app.listen(3000,function () {
    console.log("Server is started on 3000");
  })
