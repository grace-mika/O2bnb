const asyncWrap = (Controller) => {
    return (req, res, next) => {
        Controller(req, res, next).catch(next)
    }
}

const globalErrorHandler = (err, req, res, next) => {
    res.status(err.statusCode || 500).json({ message:err.message })
}

module.exports = {
    asyncWrap,
    globalErrorHandler
}