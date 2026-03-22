const express = require("express");
const appRoutes = express.Router();

const contactRoutes = require("./contactRoutes");
const categoryRoutes = require("./categoryRoutes");
const contentRoutes = require("./contentRoutes");
const domainRoutes = require("./domainRoutes");
const faqRoutes = require("./faqRoutes");
const productRoutes = require("./productRoutes");

const getInTouchRoutes = require("./getInTouchRoutes");
const newsLetterRoutes = require("./newsLetterRoutes");
const userInfoRoutes = require("./userInfoRoutes");

const cartRoutes = require("./cartRoutes");
const orderRoutes = require("./orderRoutes");
const paymentRoutes = require("./paymentRoutes");
const authRoutes = require("./authRoutes");
const addressRoutes = require("./addressRoutes");
const webhookRoutes = require("./webhookRoutes");
const wishlistRoutes = require("./wishlistRoutes");
const reelsRoutes = require("./reelsRoutes");
const signatureRoutes = require("./signatureRoutes");
const bannerRoutes = require("./bannerRoutes");
const couponRoutes = require("./couponRoutes");
const aboutUsRoutes=require("./aboutUsRoutes")
const customOrderRoutes=require("./customOrderRoutes")

appRoutes.use("/user", authRoutes);
appRoutes.use("/user", orderRoutes);
appRoutes.use("/user", contactRoutes);
appRoutes.use("/user", categoryRoutes);
appRoutes.use("/user", contentRoutes);
appRoutes.use("/user", domainRoutes);
appRoutes.use("/user", faqRoutes);
appRoutes.use("/user", productRoutes);
appRoutes.use("/user", bannerRoutes);
appRoutes.use("/user", reelsRoutes);
appRoutes.use("/user", paymentRoutes);

appRoutes.use("/user", getInTouchRoutes);
appRoutes.use("/user", newsLetterRoutes);
appRoutes.use("/user", userInfoRoutes);

appRoutes.use("/user", cartRoutes);
appRoutes.use("/user", addressRoutes);
appRoutes.use("/user", wishlistRoutes);

appRoutes.use("/user", signatureRoutes);
appRoutes.use("/user", couponRoutes);
appRoutes.use("/user", aboutUsRoutes);
appRoutes.use("/user", customOrderRoutes);

module.exports = appRoutes;
