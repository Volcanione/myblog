/**

 @Name：layuiAdmin 公共业务
 @Author：贤心
 @Site：http://www.layui.com/admin/
 @License：LPPL
    
 */

layui.define(function(exports) {
  var $ = layui.$,
    layer = layui.layer,
    laytpl = layui.laytpl,
    setter = layui.setter,
    router = layui.router(),
    view = layui.view,
    admin = layui.admin

  //公共业务的逻辑处理可以写在此处，切换任何页面都会执行

  //获取admin信息
  const $user = $('#user')
  const getAdmin = () => {
    return JSON.parse(localStorage.getItem('adminInfo'))
  }
  const renderAdmin = callback => {
    admin.req({
      url: '/adminport/getAdminInfo',
      done(e) {
        console.log(e)
        const { code, msg, data } = e
        if (code === 1 || code === 4) {
          return layer.msg(msg, { icon: 0, time: 1000 }, function() {
            console.log(location)
            if (location.pathname.indexOf('/login.html') === -1) {
              location.href = './login.html'
            }
          })
        }
        callback(data)
      }
    })
  }

  renderAdmin(data => {
    localStorage.setItem('adminInfo', JSON.stringify(data))
    const { id, email, call, username } = data
    $user.text(call ? call : username)
  })

  //退出
  admin.events.logout = function() {
    //执行退出接口
    admin.req({
      url: '/adminport/adminLogout',
      type: 'get',
      data: {},
      done(e) {
        if (e.code === 0) {
          layui.admin.exit(function() {
            layer.msg(
              '已注销',
              { icon: 1, time: 2000, shade: 0.3 },
              function() {
                location.href = '../login.html'
              }
            )
          })
        }
      }
    })
  }

  //对外暴露的接口
  exports('common', {
    getAdmin,
    renderAdmin
  })
})
