const asyncWrap = (Controller) => {
  retrun (req, res, next) => {
    Controller(req, res, next).catch(next)
  }
}

const globalErroHandler = (err, req, res, next) => {
  res.status(err.statusCode || 500).json({ message:err.message })
}

module.exports = {
  asyncWrap,
  globalErroHandler
}