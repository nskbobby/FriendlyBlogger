import bodyParser from "body-parser";
import express from "express";
import { fileURLToPath, pathToFileURL } from "url";
import { dirname } from "path";
import  session  from "express-session";
import dotenv from "dotenv";
dotenv.config();

// Variables n constants
const dircName = dirname(fileURLToPath(import.meta.url)); //url to directory path
const app_server = process.env.PORT || 3000; //Port the server is running
const loginpageURL = pathToFileURL(dircName + "/functions/loginpage.js");
const loginpage = await import(loginpageURL);
const bmURL=pathToFileURL(dircName + "/functions/blogmanager.js");
const blogmanager = await import(bmURL);





//Middleware integration
const app = express();

//=========================MIDDLEWARES=======================
app.use(bodyParser.urlencoded({ extended: "true" }));
app.use(express.json());
app.use(express.static(dircName + "/public"));



//===================session setup
app.use(session({
    secret:process.env.SESSION_SECRET ,
    resave: false,
    saveUninitialized:true,
    cookie:{secure:false,
        maxAge:0.15 * 60 * 60 * 1000,
    }
}));

app.use((req, res, next) => {
    if (req.session) {
        req.session.cookie.maxAge = 0.15 * 60 * 60 * 1000; // Refresh session expiration
    }
    next();
});

export const isAuthenticated=(req,res,next)=>{

    if(req.session && req.session.user){
        
            process.env.USERID=req.session.user.userid;
            process.env.USERNAME=req.session.user.username;
            process.env.USEREMAIL=req.session.user.useremail;

        return next();
    }else{
        console.log("user is not authenticated");
        return res.redirect('/');
    }
}




//=======================================POST ROUTES==============

//log in page post
app.post("/login", (req, res) => {
  loginpage.verifyUser(req, res);
});

//createpost post
app.post('/createpost',isAuthenticated,(req,res)=>{
 blogmanager.createpost(req,res);
});

//=================================creates account post====

//creates account for user and verifies if created
app.post("/createaccount",(req, res) => {
  loginpage.CheckUserPresence(req, res);
});

app.post("/logout",(req,res)=>{
    console.log("logging out...");
    
    req.session.destroy((err) => {
        if (err) {
          return console.log(err);
        }
        res.redirect('/');
      });

});

//Change password post
app.post('/changepassword',isAuthenticated,(req,res)=>{
    loginpage.changepassword(req,res);
})

//password reset forgot password
app.post('/passwordreset', (req, res) => {
    loginpage.passwordreset(req, res);
});

//delete blog
app.post('/deleteblog/:id',(req,res)=>{
    const blogId = req.params.id;
    blogmanager.deleteBlog(res,blogId);

});


//========ALL GET ROUTES===========================================

//route to Home
app.get("/home",isAuthenticated, (req, res) => {
    var userblogs=blogmanager.getuserblogs();
    var recentblogs=blogmanager.getrecentblogs();
    var allblogs=blogmanager.blogdatabase;
    res.render(dircName + "/views/mainpages//homepage.ejs",{
        userblogs:userblogs,
        recentblogs:recentblogs,
        allblogs:allblogs,
    });
  });

//route to create account
app.get("/createaccount", (req, res) => {
  res.sendFile(dircName + "/views/mainpages/createaccount.html");
});

//home route
app.get("/", (req, res) => {
  res.sendFile(dircName + "/views/mainpages/loginpage.html");
  //res.render(dircName + "/views/mainpages/blogpage.ejs");
});

//createpost route
app.get("/createpost",isAuthenticated, (req, res) => {
    res.render(dircName + "/views/mainpages/createpost.ejs");
    });


//about route
app.get("/account",isAuthenticated, (req, res) => {
    res.render(dircName + "/views/mainpages/account.ejs",{
        username:process.env.USERNAME,
        useremail:process.env.USEREMAIL,
        password:'***********',
    });
    });

//changepassword route
app.get("/changepassword",isAuthenticated,(req, res) => {
    res.render(dircName + "/views/mainpages/changepassword.ejs",{
        status:"CHANGE PASSWORD",
    });
    });

//myarticles route
app.get("/myarticlespage",isAuthenticated, (req, res) => {
    var userblogs=blogmanager.getuserblogs();
    res.render(dircName + "/views/mainpages/myarticlespage.ejs",{
        userblogs:userblogs,
    });
    });

//communitypage route
app.get("/communitypage",isAuthenticated, (req, res) => {
    res.render(dircName + "/views/mainpages/communitypage.ejs");
    });

//blog link route
// Example route for serving the blog details
app.get('/blogs/:id',isAuthenticated, (req, res) => {
    const blogId = req.params.id;
    var blog = blogmanager.getblog(blogId);
    res.render(dircName + "/views/mainpages/blogpage.ejs",{
        blog:blog,
    });
});



//contact route
app.get("/contact",isAuthenticated, (req, res) => {
    res.render(dircName + "/views/mainpages/contactus.ejs");
    });

//privacy-policy route
app.get("/privacy-policy",isAuthenticated, (req, res) => {
    res.render(dircName + "/views/mainpages/privacypolicypage.ejs");
    });

//terms of service route
app.get("/terms-of-service",isAuthenticated, (req, res) => {
    res.render(dircName + "/views/mainpages/termsofservice.ejs");
    });

//about route
app.get("/about",isAuthenticated, (req, res) => {
    res.render(dircName + "/views/mainpages/about.ejs");
    });

//about forgotpassword
app.get("/forgotpassword", (req, res) => {
    res.render(dircName + "/views/mainpages/forgotpassword.ejs",{
        status:null,
    });
    });

//=====================================PORT LISTNER==================================================
//port listner
app.listen(app_server, () => {
  console.log("i am listening on " + app_server);
});

//===================================methods============================================
