/**

 @Name：layuiAdmin（iframe版） 设置
 @Author：贤心
 @Site：http://www.layui.com/admin/
 @License: LPPL
    
 */

layui.define(['form', 'upload', 'common', 'admin', 'upload'], function(
  exports
) {
  var $ = layui.$,
    layer = layui.layer,
    laytpl = layui.laytpl,
    setter = layui.setter,
    view = layui.view,
    admin = layui.admin,
    form = layui.form,
    admin = layui.admin,
    common = layui.common,
    upload = layui.upload

  var $body = $('body')

  //自定义验证
  form.verify({
    pass: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],

    //确认密码
    repass: function(value) {
      if (value !== $('#LAY_password').val()) {
        return '两次密码输入不一致'
      }
    }
  })

  //admin信息
  let username
  common.renderAdmin(data => {
    console.log(data)
    const { call, email, role } = data
    username = data.username
    form.val('userInfo', { call, email, role, username })
    $('.picUrl').val(data.head)
    $('.head').attr(
      'src',
      !data.head ? '../../../layuiadmin/style/res/none.png' : data.head
    )
  })

  //上传头像
  var uploadInst = upload.render({
    elem: '#test1',
    url: '/adminport/upload',
    field: 'head',
    method: 'post',
    multiple: true,
    auto: true,
    before: function(obj) {
      //预读本地文件示例，不支持ie8
      obj.preview(function(index, file, result) {
        // $('#demo1').attr('src', result); //图片链接（base64）
      })
    },
    done: function(res) {
      console.log(res)
      $('#demo1').attr('src', res.data.src) //图片链接（base64）
      $('.picUrl').val(res.data.src)
      //如果上传失败
      if (res.code > 0) {
        return layer.msg('上传失败')
      }
      layer.msg(res.msg, { icon: 1, time: 1000 })
      //上传成功
    },
    error: function() {}
  })

  //保存信息
  form.on('submit(userInfo)', function(data) {
    data.field.head = $('.picUrl').val()
    console.log(data.field)

    admin.req({
      url: '/adminport/updateAdmin',
      type: 'post',
      data: data.field,
      success(data) {
        const { code, msg } = data
        if (code === 1) {
          return layer.msg(msg, { icon: 0, time: 1000 })
        }
        layer.msg(msg, { icon: 1, time: 1000 }, function() {
          location.reload()
        })
      }
    })

    return false
  })

  //修改密码

  form.on('submit(password)', function(data) {
    console.log(data.field)

    admin.req({
      url: '/adminport/setPassword',
      type: 'post',
      data: {
        username,
        ...data.field
      },
      success(data) {
        const { code, msg } = data
        if (code === 0) {
          return layer.msg(
            '密码修改成功，请重新登录！',
            { icon: 1, time: 1000 },
            function() {
              window.parent.location = '../../../login.html'
            }
          )
        }
        layer.msg(msg, { icon: 2, time: 1000 })
      }
    })

    return false
  })

  //对外暴露的接口
  exports('set', {})
})
