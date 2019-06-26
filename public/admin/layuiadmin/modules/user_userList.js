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
      url: '/adminport/registerUser',
      page: true,
      size: 'md',
      limit: 5,
      limits: [5, 10],
      parseData: function (res) {
        //res 即为原始返回的数据
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
          { field: 'mobile', title: '手机号', width: 150 },
          { field: 'email', title: '邮箱' },
          {
            field: 'createTime',
            title: '注册时间',
            sort: true,
            templet: function (d) {
              if (d.createTime === '' || d.createTime === '--') {
                return d.createTime
              }
              return moment(+d.createTime).format('YYYY-MM-DD HH:mm:ss')
            },
            align: 'center'
          }

        ]
      ],
      done: function (res) {

      }
    })

  })

  e('user_userList', {})
})
