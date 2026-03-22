module.exports = function validateRequestBody(req, res, next) {
  // if (["POST", "PUT", "PATCH"].includes(req.method)) {
  //   const hasBody = req.body && Object.keys(req.body).length > 0;
  //   const hasFile = req.file || (req.files && Object.keys(req.files).length > 0);

  //   if (!hasBody && !hasFile) {
  //     return res.status(400).json({
  //       success: false,
  //       message: "Request body cannot be empty.",
  //     });
  //   }

  //   // ✅ Fix: Try parsing all body fields that look like JSON
  //   Object.keys(req.body).forEach((key) => {
  //     if (typeof req.body[key] === "string") {
  //       try {
  //         req.body[key] = JSON.parse(req.body[key]);
  //       } catch (e) {
  //         // keep as string if not valid JSON
  //       }
  //     }
  //   });
  // }

  next();
};
