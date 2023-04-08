const express = require("express");
const jwt = require("jsonwebtoken");
const BankModel = require("../model/userModel");
const authorization = require("../middleware/authMiddleware");
require("dotenv").config();

const BankRoute = express.Router();

BankRoute.post("/openaccount", async (req, res) => {
  let { name, gender, dob, email, mobile, initialBalance, aadharNo, panNo } =
    req.body;
  try {
    let user = await BankModel.findOne({ email, aadharNo });
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.SECRET_CODE);
      return res.send({ msg: "Logged In Successfully", success: true, token });
    } else {
      let user = await BankModel.create({
        name,
        gender,
        dob,
        email,
        mobile,
        initialBalance,
        aadharNo,
        panNo,
        amount: initialBalance,
      });
      const token = jwt.sign({ id: user._id }, process.env.SECRET_CODE);
      return res.send({ msg: "Registered Successfully", success: true, token });
    }
  } catch (error) {
    res.json({
      msg: "Something went wrong",
      success: false,
      error: error.message,
    });
  }
});

BankRoute.patch("/updatekyc", authorization, async (req, res) => {
  let { name, dob, email, mobile, aadharNo, panNo, user } = req.body;
  try {
    await BankModel.findOneAndUpdate(
      { _id: user },
      { name, dob, email, mobile, aadharNo, panNo }
    );
    res.send({ success: true, msg: "KYC updated successfully" });
  } catch (error) {
    res.send({
      success: false,
      msg: "Something went wrong updating",
      error: error.message,
    });
  }
});

BankRoute.patch("/depositmoney", authorization, async (req, res) => {
  let { amount, user } = req.body;
  try {
    let newuser = await BankModel.findOne({ _id: user });
    if (newuser) {
      await BankModel.findByIdAndUpdate(
        { _id: user },
        { amount: newuser.amount + +amount }
      );
      res.send({ success: true, msg: "Money has been credited Successfully" });
    } else {
      res.send({ success: false, msg: "Something went wrong" });
    }
  } catch (error) {
    res.send({
      success: false,
      msg: "Something went wrong updating",
      error: error.message,
    });
  }
});

BankRoute.patch("/withdrawmoney", authorization, async (req, res) => {
  let { amount, user } = req.body;
  try {
    let newuser = await BankModel.findOne({ _id: user });
    if (newuser) {
      if (newuser.amount >= +amount) {
        await BankModel.findByIdAndUpdate(
          { _id: user },
          { amount: newuser.amount - +amount }
        );
        res.send({ success: true, msg: "Money has been debited Successfully" });
      } else {
        res.send({ success: false, msg: "Insufficient blance" });
      }
    } else {
      res.send({ success: false, msg: "Something went wrong" });
    }
  } catch (error) {
    res.send({
      success: false,
      msg: "Something went wrong updating",
      error: error.message,
    });
  }
});

BankRoute.get("/", authorization, async (req, res) => {
  try {
    let user = await BankModel.findOne({ _id: req.body.user });
    if (user) {
      res.send({ user, success: true, msg: "User found" });
    } else {
      res.send({ success: false, msg: "User Not found" });
    }
  } catch (error) {
    res.send({
      success: false,
      msg: "Something went wrong try again",
      error: error.message,
    });
  }
});

BankRoute.patch('/transfermoney', authorization, async (req, res) => {
  try {
    const userID = req.body.user;
    const { toName, email, panNo, amount } = req.body;


    const user = await BankModel.findById(userID);
    if (!user) {
      return res.send({ msg: "User not found" });
    }
    const currentAmount = user.amount;
    if (currentAmount < amount) {
      return res.send({ msg: "Insufficient balance" });
    }


    const updatedUser = await BankModel.findOneAndUpdate(
      { _id: userID },
      { $inc: { amount: -amount } },
      { new: true }
    );


    const recipientUser = await BankModel.findOne({ $or: [{ email }, { panNo }] });
    if (!recipientUser) {
      return res.send({ msg: "Recipient user not found" });
    }


    const updatedRecipientUser = await BankModel.findOneAndUpdate(
      { _id: recipientUser._id },
      { $inc: { amount } },
      { new: true }
    );

    res.send({
      msg: "Money transferred successfully",
      sender: updatedUser,
      recipient: updatedRecipientUser,
      success:true
    });
  } catch (error) {
    res.send({ msg: error.message, success: false });
  }
});

BankRoute.delete("/closeaccount", authorization, async (req, res) => {
  try {
    await BankModel.findByIdAndDelete({ _id: req.body.user });
    res.send({ msg:"Successfully deleted", success:true})
  } catch (error) {
    res.send({ msg:"Something went wrong", success:false})
  }
})

module.exports = BankRoute;
