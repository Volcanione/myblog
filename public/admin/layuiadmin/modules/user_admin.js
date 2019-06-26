layui.define(function (e) {
  layui.use(['table', 'admin', 'common', 'moment'], function () {
    var $ = layui.$,
      form = layui.form,
      admin = layui.admin,
      table = layui.table,
      common = layui.common,
      moment = layui.moment


    //权限判断
    const adminInfo = common.getAdmin()


    var userTable = table.render({
      id: 'adminList',
      elem: '#adminList',
      url: '/adminport/manager',
      toolbar: adminInfo.username === 'admin' ? '#toolbarDemo' : false,
      defaultToolbar: [],
      page: false,
      size: 'md',
      parseData: function (res) {
        //res 即为原始返回的数据
        console.log(res);
        const { code, data, msg, total } = res

        return {
          code,
          count: total,
          data
        }
      },
      cols: [
        [
          {
            templet: '<a >{{d.LAY_INDEX}}</a>',
            title: '序号',
            width: 60,
            fixed: 'left',
            align: 'center'
          },
          { field: 'username', title: '用户名', width: 150 },
          { field: 'call', title: '昵称', width: 150 },
          { field: 'email', title: '邮箱' },
          {
            field: 'status',
            title: '状态',
            templet: '#isDelete',
            align: 'center'
          },
          {
            field: 'createTime',
            title: '加入时间',
            templet: function (d) {
              if (d.createTime === '' || d.createTime === '--') {
                return d.createTime
              }
              return moment(+d.createTime).format('YYYY-MM-DD HH:mm:ss')
            },
            align: 'center'
          },
          {
            fixed: 'right',
            align: 'center',
            width: 120,
            title: '操作',
            toolbar: adminInfo.username === 'admin' ? '#userListBar' : '#DisableBar'
          }
        ]
      ],
      done: function (res) {
        // console.log(res)
        console.log(res)
        form.on('switch', function (data) {
          var elem = data.elem //触发事件的元素
          var checked = elem.checked //元素的选择状态
          $(elem).prop('checked', checked ? '' : 'checked') //阻止状态切换
          form.render('checkbox')
          layer.confirm(
            '你确定执行此操作？',
            {
              btn: ['确定', '取消'] //按钮
            },
            function () {
              layer.load()
              admin.req({
                url: '/adminport/manager',
                data: {
                  id: data.elem.dataset.id,
                  status: +(!checked)
                },
                type: 'patch',
                done: function (res) {
                  layer.closeAll()
                  const { code, msg } = res

                  if (code === 1) return layer.msg(
                    msg,
                    { icon: 2, time: 1000 })


                  $(elem).prop('checked', checked) //处理成功后才切换状态
                  $(elem)
                    .next()
                    .toggleClass('layui-form-onswitch')
                    .children('em')
                    .text(checked ? '启用' : '禁用')
                  $(elem)
                    .parents('tr')
                    .find('[data-field=status]')
                    .children()
                    .text(checked ? '禁用' : '正常')
                  layer.msg(
                    msg,
                    { icon: 1, time: 1000 },
                    function () {
                      // userTable.reload()
                    }
                  )

                }
              })
            }
          )
        })
      }
    })

    console.log(moment(1560741926795).format('YYYY-MM-DD HH:mm:ss'));

    //监听头部工具条
    table.on('toolbar(adminList)', function (obj) {
      var checkStatus = table.checkStatus(obj.config.id)
      if (obj.event === 'add') {
        var index = layer.open({
          type: 1,
          title: '添加二级分类',
          skin: 'layui-layer-rim', //加上边框
          area: ['420px', 'auto'], //宽高
          content: $('#form').html(),
          success(layero, index) {
            form.render()

            //表单验证
            form.verify({
              required: function (value, item) {
                title = $(item).data('title')
                if (!title) {
                  pline = $(item)
                    .parents(
                      '.layui-inline,.layui-form-item,.layui-input-block'
                    )
                    .find('.layui-form-label')
                    .text()
                  title = pline
                }

                if (!value) {
                  return title
                }
              },
              email: [
                /^\w+@\w+(\.[a-z]+){1,2}$/
                , '邮箱格式错误！'
              ]
            })

            //提交表单
            form.on('submit(formDemo)', function (data) {
              console.log(data.field)

              admin.req({
                url: '/adminport/manager',
                type: 'post',
                data: data.field,
                done(res) {
                  const { code, msg } = res
                  layui.admin.exit(function () {
                    if (code === 1) {
                      return layer.msg(
                        msg,
                        { icon: 2, time: 1000 })
                    }
                    layer.msg(
                      msg,
                      { icon: 1, time: 1000 }, function () {
                        layer.close(index)
                        userTable.reload()
                      })
                  })
                }
              })

              return false
            })
          }
        })
      }
    })
  })

  e('user_admin', {})
})
