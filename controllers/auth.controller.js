
const User = require("../models/User.model");
const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");

const { clearRes, createJWT } = require("../utils/utils");

exports.signupProcess = (req, res, next) => {

    const { role, email, password, confirmPassword, bankAccount, ...restUser } = req.body;


/*     const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;
    if(!regex.test(password)){
        res.render('auth/userSignup',{errorMessage:' Password needs at leas:t 8 characters, 1 uppercase, 1 lowercase letter and a number. No special characters @,#, etc, allowed.'})
        return;
    } */

const regex1 = /^(\d{14,14})$/g;
    if(!regex1.test(bankAccount)){
      return res.status(400).json({error:"Tu cuenta bancaria debe tener 14 números."})
    }


    if (!email.length || !password.length || !confirmPassword.length)
      return res
        .status(400)
        .json({ errorMessage: "No debes mandar campos vacíos." });
  
    if (password != confirmPassword)
      return res
        .status(400)
        .json({ errorMessage: "La contraseña no son iguales!" });
  
    //ponle un regex al password.

    User.findOne({ email })
      .then((found) => {
        if (found)
          return res
            .status(400)
            .json({ errorMessage: "este correo ya fue tomado" });
  
        return bcryptjs
          .genSalt(10)
          .then((salt) => bcryptjs.hash(password, salt))
          .then((hashedPassword) => {
            return User.create({ email, password: hashedPassword, bankAccount, ...restUser });
          })
  
          .then((user) => {
            const [header, payload, signature] = createJWT(user); 

            res.cookie("headload", `${header}.${payload}`, {
              maxAge: 1000 * 60 * 30,
              httpOnly: true,
              sameSite: "strict",
              secure: false,
            });
  
            res.cookie("signature", signature, {
              maxAge: 1000 * 60 * 30,
              httpOnly: true,
              sameSite: "strict",
              secure: false,
            });
  
            const newUser = clearRes(user.toObject());
            res.status(200).json({ user: newUser });
          });
      })
      .catch((error) => {
        if (error instanceof mongoose.Error.ValidationError) {
          return res.status(400).json({ errorMessage: error.message });
        }
        if (error.code === 11000) {
          return res.status(400).json({
            errorMessage: "El correo electronico ya esta en uso.",
          });
        }
        return res.status(500).json({ errorMessage: error.message });
      });
  };

  exports.loginProcess = (req, res, next) => {
    const { email, password } = req.body;
  
    if (!email || !password || !email.length || !password.length)
      return res
        .status(401)
        .json({ errorMessage: "no puedes mandar campos vacíos" });
  
    //validar el password > 9 o colocar el regex;
  
    User.findOne({ email })
      .then((user) => {
        if (!user)
          return res
            .status(401)
            .json({ errorMessage: "Credenciales invalidas!" });
        //ver si la contraseña es correcta:
        return bcryptjs.compare(password, user.password).then((match) => {
          if (!match)
            return res
              .status(401)
              .json({ errorMessage: "Credenciales invalidas!" });
  
          const [header, payload, signature] = createJWT(user);
  
          res.cookie("headload", `${header}.${payload}`, {
            maxAge: 1000 * 60 * 30,
            httpOnly: true,
            sameSite: "strict",
            secure: false, 
          });
  
          res.cookie("signature", signature, {
            maxAge: 1000 * 60 * 30,
            httpOnly: true,
            sameSite: "strict",
            secure: false,
          });
  
          const newUser = clearRes(user.toObject());
          res.status(200).json({ user: newUser });
        });
      })
  
      .catch((error) => {
        if (error instanceof mongoose.Error.ValidationError) {
          return res.status(400).json({ errorMessage: error.message });
        }
        if (error.code === 11000) {
          return res.status(400).json({
            errorMessage: "El correo electronico ya esta en uso.",
          });
        }
        return res.status(500).json({ errorMessage: error.message });
      });
  };

  exports.logoutProcess=(req, res, next)=>{
    res.clearCookie('headload')
    res.clearCookie('signature')
    res.status(200).json({successMessage:"Has cerrado sesión."})
}