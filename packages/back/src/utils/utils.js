function crossOrigin(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', '*')
  if (req.method === 'OPTIONS') {
    res.status = 200
    res.end()
    return
  }
  next()
}

module.exports = {
  crossOrigin,
}
