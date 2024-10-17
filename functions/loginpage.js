import { fileURLToPath, pathToFileURL } from "url";
import { dirname } from "path";
import dotenv from 'dotenv';
dotenv.config();

const dircName = dirname(fileURLToPath(import.meta.url)); //url to directory path
export var userpasswordManager = [
  {
    id: 1,
    email: "nskbobby1@gmail.com",
    username: "bobby",
    password: "a12345678",
  },
];


// verify user
export function verifyUser(req, res) {
    console.log(process.env.check);
    let userFound = false; // Flag to track if the user exists

    const inputEmail = req.body.username ;
    const inputUsername = req.body.username ;
    const inputPassword = req.body.password ;

    // Loop through the userpasswordManager array
    for (var i = 0; i < userpasswordManager.length; i++) {
        const user = userpasswordManager[i];

        // Normalize email and username (trim and lowercase)
        const storedEmail = user.email.trim().toLowerCase();
        const storedUsername = user.username.trim().toLowerCase();
        // Check if the email or username matches
        if (inputEmail === storedEmail || inputUsername === storedUsername) {
            userFound = true; // User was found

            // Check if the password matches
            if (inputPassword === user.password.trim()) {
                console.log("Password matches, logging in...");
                req.session.user = {
                    userid: user.id,
                    username: user.username,
                    useremail: user.email,
                };
                return res.redirect('/home'); // Redirect to homepage
            } else {
                console.log(
                    "Password didn't match. Try again and enter the correct password!! " +
                    JSON.stringify(req.body)
                );
                return res.redirect('/');
            }
        }
    }

    // If no matching user was found
    if (!userFound) {
        console.log("User not found.");
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
        console.log("already existing user " + JSON.stringify(req.body.useremail));
        res.locals.usercreated = false;
       return res.redirect("/");
     
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
      return res.redirect("/");
    } else {
      res.locals.usercreated = false;
      console.log(
        `Passwords didn't match ${req.body.password} , ${req.body["confirm-password"]}`
      );
      return res.redirect('/createaccount');
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



// forgot password reset
export function passwordreset(req, res) {
    var currentuser;
    let found = false;
    
    for (var i = 0; i < userpasswordManager.length; i++) {
        if (userpasswordManager[i].email == req.body.useremail) {
            found = true;
            if (req.body.newpassword) {
                userpasswordManager[i].password = req.body.newpassword;
                return res.render(dircName + "/../views/mainpages/forgotpassword.ejs", {
                    status: 'PASSWORD CHANGED SUCCESSFULLY',
                });
            }
        }
    }

    if (!found) {
        res.render(dircName + "/../views/mainpages/forgotpassword.ejs", {
            status: 'OOPS, TRY AGAIN!! EMAIL DIDN\'T MATCH',
        });
    } else {
        res.render(dircName + "/../views/mainpages/forgotpassword.ejs", {
            status: ''
        });
    }
}