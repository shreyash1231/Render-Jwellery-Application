
const successHandler = (res, statusCode , message, resData = {} ) => {
    
    res.status(statusCode || 200).json({
        success: true,
        message,
        data : resData
    })
}

module.exports= successHandler
