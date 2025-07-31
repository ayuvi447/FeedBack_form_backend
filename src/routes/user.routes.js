import express from "express";
import bcrypt from "bcrypt";
import { User } from "../models/user.model.js";
import { Form } from "../models/form.model.js";
import { Question } from "../models/question.model.js";
import { isAuth } from "../middlewares/isAuth.js";
import mongoose from "mongoose";
import {
  validateSignInData,
  validateSignUpUser,
} from "../validations/validateSignUpUser.js";
import { generateUniqueSlug } from "../utils/generateUniqueSlug.js";
import validator from 'validator'
const Router = express.Router();


Router.post("/register", async (req, res) => {
  const { name, password, email, role } = req.body;

  try {
    validateSignUpUser(req);

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Hashed Password", hashedPassword);
    const alreadyUser = await User.findOne({ email });
    if (alreadyUser) {
      return res.json({
        message: "user already exist.",
      });
    }

    const user = await User.create({
      name,
      email,
      role,
      password: hashedPassword,
    })
   
    const token = await user.getJWT();

    res.cookie("token", token, {
      expires: new Date(Date.now() + 8 * 3600000),
    });
    return res.status(200).json({
      message: "user saved successfully.",
      data: user,
    });
  } catch (err) {
    return res.status(401).json({
      message: "Error occured while signing up",
      data: err,
    });
  }
});

Router.post("/login", async (req, res) => {
  const { email, password, role } = req.body;

  try {
    console.log("login vicky");

    validateSignInData(req);

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: "user emailId not found.",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user?.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        message: "user password is not correct.",
      });
    }
    const token = await user.getJWT();
    res.cookie("token", token, {
      httpOnly: true, // ✔️ Prevents JS from accessing the cookie
      secure: true, // ✔️ Sends cookie only over HTTPS (required on Render)
      sameSite: "None", // ✔️ Allows frontend-backend on different domains
      expires: new Date(Date.now() + 8 * 3600000), // 8 hours
    });

    return res.status(200).json({
      message: "User logiend successfully.",
      data: user,
    });
  } catch (error) {
    return res.status(502).json({
      message: "Error occured while login.",
    });
  }
});

Router.post("/forms", isAuth, async (req, res) => {
  const { title, description } = req.body;

  try {
    if (!title || !description) {
      return res.status(502).json({
        message: "Please provide title and description both.",
      });
    }

    if (!validator.isLength(title, { min: 4 })) {
      return res.status(502).json({
        message: "Title length be more than 4.",
      });
    }

    if (req.user.role !== "teacher") {
      return res.status(502).json({
        message: "role should be teacher only.",
      });
    }

    const existing = await Form.findOne({ title, createdBy: req.user._id });
    if (existing) {
      return res.status(502).json({
        message: "form already exist.",
      });
    }
    const uniqueUrl = generateUniqueSlug(title);
    const newForm = await Form.create({
      title,
      description,
      uniqueUrl,
      createdBy: req.user._id,
    });

    return res.status(200).json({
      message: "form created successfully.",
      data: {
        _id: newForm._id,
        uniqueUrl: newForm.uniqueUrl,
      },
    });
  } catch (error) {
    console.log("Form creation error:", error);
    return res.status(200).json({
      message: "Error while making the Form.",
      data: error,
    });
  }
});

Router.post('/forms/:formId/questions', isAuth, async(req, res)=>{
    const {formId} = req.params;
    const {text, type, options=[]} = req.body

    try {
        if(!text || !type || !options){
            return res.status(402).json(
                {
                    message:'All fields are needed.'
                }
            )
        }

        if(!text || text.length<5){
            return res.status(502).json({
                message:'Length of the text should be more than 5.'
            })
        }

        if(req.user.role!=='teacher'){
            return res.status(500).json({
                message:'role should only be teacher to create form.'
            })
        }
        console.log("role", req.user.role);
        

        if(!mongoose.Types.ObjectId.isValid(formId)){
            return res.status(401).json({
                message: 'formId is not valid type.'
            })
        }
        
        
          
        const existingForm = await Form.findById(formId)
        if(!existingForm){
            return res.status(502).json({
                message:'form id not valid or available.'
            })
        }


        console.log("existing form",existingForm._id);
        
        if(!['mcq','rating','text'].includes(type)){
            return res.status(502).json({
                message: 'type should only be mcq, rating or text'
            })
        }
        
        if(type==='mcq' && (Array.isArray(options)===false || options.length===2)){
            return res.status(502).json({
                message:'options length should be greater than 2 and should be an array.'
            })
        }

        const newQuestion = await Question.create({
            formID: existingForm._id,
            text,
            type,
            options: type==='mcq'?options:[]
        })

        existingForm.questionId.push(newQuestion._id)
        await existingForm.save();

        return res.status(201).json({
            message:'question added successfully.',
            question: newQuestion
        })
    } catch (error) {
        return res.status(402).json({
            message:'Error in question.'
        })
    }
})


export default Router;
