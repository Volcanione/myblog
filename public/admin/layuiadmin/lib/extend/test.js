; (function () {
  var obj = {
    sayHi: function (a) {
      console.log(a)
    }
  }
  window.sayHi = obj.sayHi
})()

layui.define(function (exports) {
  exports('test', sayHi)
})
