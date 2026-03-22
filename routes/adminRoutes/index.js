const express = require("express");
const appRoutes = express.Router();
const authorize = require("../../middleware/authMiddleware");

const authRoutes = require("./authRoutes");
const contactRoutes = require("./contactRoutes");
const contentRoutes = require("./contentRoutes");
const domainRoutes = require("./domainRoutes");
const faqRoutes = require("./faqRoutes");

const testimonialRoutes = require("./testimonialRoutes");
const getInTouchRoutes = require("./getInTouchRoutes");
const newsLetterRoutes = require("./newsLetterRoutes");
const userInfoRoutes = require("./userInfoRoutes");

const categoryRoutes = require("./categoryRoutes");
const orderRoutes = require("./orderRoutes");
const paymentRoutes = require("./paymentRoutes");
const reelsRoutes = require("./reelsRoutes");
const signatureRoutes = require("./signatureRoutes");
const bannerRoutes = require("./bannerRoutes");
const couponRoutes = require("./couponRoutes");
const productRoutes = require("./productRoutes");
const dashboardRoutes = require("./dashboardRoutes");
const aboutUsRoutes = require("./aboutUsRoutes");
const customOrderRoutes = require("./customOrderRoutes");

appRoutes.use("/admin", authRoutes);
appRoutes.use("/admin", authorize(["ADMIN"]), productRoutes);
appRoutes.use("/admin", authorize(["ADMIN"]), dashboardRoutes);
appRoutes.use("/admin", authorize(["ADMIN"]), aboutUsRoutes);

appRoutes.use("/admin", authorize(["ADMIN"]), couponRoutes);
appRoutes.use("/admin", authorize(["ADMIN"]), contactRoutes);
appRoutes.use("/admin", authorize(["ADMIN"]), bannerRoutes);

appRoutes.use("/admin", authorize(["ADMIN"]), contentRoutes);
appRoutes.use("/admin", authorize(["ADMIN"]), domainRoutes);
appRoutes.use("/admin", authorize(["ADMIN"]), faqRoutes);

appRoutes.use("/admin", authorize(["ADMIN"]), testimonialRoutes);
appRoutes.use("/admin", authorize(["ADMIN"]), getInTouchRoutes);
appRoutes.use("/admin", authorize(["ADMIN"]), newsLetterRoutes);
appRoutes.use("/admin", authorize(["ADMIN"]), userInfoRoutes);

appRoutes.use("/admin", authorize(["ADMIN"]), categoryRoutes);
appRoutes.use("/admin", authorize(["ADMIN"]), orderRoutes);
appRoutes.use("/admin", authorize(["ADMIN"]), paymentRoutes);
appRoutes.use("/admin", authorize(["ADMIN"]), reelsRoutes);
appRoutes.use("/admin", authorize(["ADMIN"]), signatureRoutes);
appRoutes.use("/admin", authorize(["ADMIN"]), customOrderRoutes);

module.exports = appRoutes;
