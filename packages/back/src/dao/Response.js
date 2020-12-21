class Response {
  constructor({ code = 200, data = {}, msg = '操作成功' }) {
    this.code = code
    this.msg = msg
    this.data = data
  }
}

module.exports = Response
