import { fileURLToPath, pathToFileURL } from "url";
import { dirname } from "path";
import dotenv from 'dotenv';
dotenv.config();

const dircName = dirname(fileURLToPath(import.meta.url)); //url to directory path
export var userpasswordManager = [
  {
    id: 0,
    email: "useremail",
    username: "username",
    password: "passwordofuser",
  },
  {
    id: 1,
    email: "nskbobby1@gmail.com",
    username: "bobby",
    password: "a12345678",
  },
];


// verify user
export function veriyUser(req, res) {
    console.log(process.env.check);
    let userFound = false; // Flag to track if the user exists
  
    for (var i = 0; i < userpasswordManager.length; i++) {
      const user = userpasswordManager[i];
  
      // Check if the email or username matches
      if (req.body.email === user.email || req.body.username === user.username) {
        userFound = true; // User was found
  
        // Check if the password matches
        if (req.body.password === user.password) {
         req.session.user={
            userid:user.id,
            username:user.username,
            useremail:user.email,
         }
         return res.redirect('/home'); //return homepage

        } else {
          console.log(
            "Password didn't match. Try again and enter the correct password!!" +
              JSON.stringify(req.body)
          );
           
          return res.redirect('/');
        }
      }
    }
  
    // If user not found after looping through the array
    if (!userFound) {
        console.log("User not found: " + JSON.stringify(req.body));   
      return res.redirect('/');
    }
  }


export function deleteUser(email) {
  userpasswordManager = userpasswordManager.filter(
    (user) => user.email !== email
  );
}

//CheckUserNcreate
export function CheckUserPresence(req, res) {
  for (var i = 0; i < userpasswordManager.length; i++) {
    if (
      req.body.email === userpasswordManager[i].email ||
      req.body.username === userpasswordManager[i].username
    ) {
        console.log("already existing user " + JSON.stringify(req.body));
        res.locals.usercreated = false;
        res.redirect("/");
     
    } 
  }

    if (req.body.password === req.body["confirm-password"]) {
      const newUser = {
        id: userpasswordManager.length,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
      };

      userpasswordManager.push(newUser);

      res.locals.usercreated = true;
      res.redirect("/");
    } else {
      res.locals.usercreated = false;
      console.log(
        `Passwords didn't match ${req.body.password} , ${req.body["confirm-password"]}`
      );
    }

    if (!res.locals.usercreated) {
      console.log("couldn't create user. Please try again");
    } else {
      console.log("user created " + JSON.stringify(userpasswordManager));
    }
  }

export function getuserdetails(){
for(var i=0;i<userpasswordManager.length;i++){
    if(userpasswordManager[i].id==process.env.USERID){
        return userpasswordManager[i];
    }
}
}


//Change password
export function changepassword(req,res){
var currentpassword=getuserdetails().password;


if(req.body.oldpassword===currentpassword){
    getuserdetails().password=req.body.newpassword;
    res.render(dircName + "/../views/mainpages/changepassword.ejs",{
       status:'PASSWORD CHANGED SUCCESSFULLY',
    });
}else{
    res.render(dircName + "/../views/mainpages/changepassword.ejs",{
        status:'OOPS, TRY AGAIN!! PASSWORDS DIDN"T MATCH',
});
}
}