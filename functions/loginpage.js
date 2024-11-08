import { fileURLToPath } from "url";
import { dirname } from "path";
import dotenv from "dotenv";
dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));

export var userpasswordManager = [
  {
    id: 1,
    email: "nskbobby1@gmail.com",
    username: "bobby",
    password: "a12345678",
  },
];

// User Service Class
class UserService {
  constructor(userDatabase) {
    this.userDatabase = userDatabase;
  }

  findUserByEmailOrUsername(email, username) {
    return this.userDatabase.find(
      (user) =>
        user.email.toLowerCase() === email.toLowerCase() ||
        user.username.toLowerCase() === username.toLowerCase()
    );
  }

  getUserById(userId) {
    return this.userDatabase.find((user) => user.id == userId);
  }

  addUser(email, username, password) {
    const newUser = {
      id: this.userDatabase.length + 1,
      email: email,
      username: username,
      password: password, // Add hashing in production
    };
    this.userDatabase.push(newUser);
    return newUser;
  }

  updateUserPassword(userId, newPassword) {
    const user = this.getUserById(userId);
    if (user) {
      user.password = newPassword; // Add hashing in production
      return true;
    }
    return false;
  }

  deleteUserByEmail(email) {
    this.userDatabase = this.userDatabase.filter((user) => user.email !== email);
  }
}

const userService = new UserService(userpasswordManager);

// AuthController Class for handling authentication and authorization
class AuthController {
  verifyUser(req, res) {
    const { username, password } = req.body;
    const user = userService.findUserByEmailOrUsername(username, username);

    if (user) {
      if (user.password === password.trim()) {
        console.log("Login successful!");
        req.session.user = {
          userid: user.id,
          username: user.username,
          useremail: user.email,
        };
        return res.redirect("/home");
      } else {
        console.log("Incorrect password!");
        return res.redirect("/");
      }
    } else {
      console.log("User not found.");
      return res.redirect("/");
    }
  }

  CheckUserPresence(req, res) {
    const { email, username, password, "confirm-password": confirmPassword } = req.body;

    if (userService.findUserByEmailOrUsername(email, username)) {
      console.log("User already exists!");
      res.locals.usercreated = false;
      return res.redirect("/");
    }

    if (password === confirmPassword) {
      userService.addUser(email, username, password);
      res.locals.usercreated = true;
      console.log("User created successfully.");
      return res.redirect("/");
    } else {
      console.log("Passwords do not match.");
      return res.redirect("/createaccount");
    }
  }
}

const authController = new AuthController();

// PasswordManager Class for handling password changes and resets
class PasswordManager {
  changepassword(req, res) {
    const userId = process.env.USERID;
    const currentUser = userService.getUserById(userId);
    const { oldpassword, newpassword } = req.body;

    if (currentUser && currentUser.password === oldpassword) {
      userService.updateUserPassword(userId, newpassword);
      res.render(`${__dirname}/../views/mainpages/changepassword.ejs`, {
        status: "PASSWORD CHANGED SUCCESSFULLY",
      });
    } else {
      res.render(`${__dirname}/../views/mainpages/changepassword.ejs`, {
        status: "OOPS, TRY AGAIN!! PASSWORDS DIDN'T MATCH",
      });
    }
  }

  passwordreset(req, res) {
    const { useremail, newpassword } = req.body;
    const user = userService.findUserByEmailOrUsername(useremail, "");

    if (user && newpassword) {
      user.password = newpassword; // Add hashing in production
      res.render(`${__dirname}/../views/mainpages/forgotpassword.ejs`, {
        status: "PASSWORD CHANGED SUCCESSFULLY",
      });
    } else {
      res.render(`${__dirname}/../views/mainpages/forgotpassword.ejs`, {
        status: "OOPS, TRY AGAIN!! EMAIL DIDN'T MATCH",
      });
    }
  }
}

const passwordManager = new PasswordManager();

// Exporting functions with original names
export const verifyUser = authController.verifyUser.bind(authController);
export const CheckUserPresence = authController.CheckUserPresence.bind(authController);
export const deleteUser = (email) => userService.deleteUserByEmail(email);
export const changepassword = passwordManager.changepassword.bind(passwordManager);
export const passwordreset = passwordManager.passwordreset.bind(passwordManager);
export const getuserdetails = userService.getUserById.bind(userService);
