/** layuiAdmin.std-v1.0.0 LPPL License By http://www.layui.com/admin/ */
layui.define(function(e) {
  layui.use(['admin', 'carousel'], function() {
    var e = layui.$,
      t = (layui.admin, layui.carousel),
      a = layui.element,
      i = layui.device()
    e('.layadmin-carousel').each(function() {
      var a = e(this)
      t.render({
        elem: this,
        width: '100%',
        arrow: 'none',
        interval: a.data('interval'),
        autoplay: a.data('autoplay') === !0,
        trigger: i.ios || i.android ? 'click' : 'hover',
        anim: a.data('anim')
      })
    }),
      a.render('progress')
  }),
    layui.use(['progress', 'laydateNote', 'admin', 'common'], function() {
      const { progress, laydateNote, admin, common } = layui

      //记事本
      const adminInfo = common.getAdmin()
      laydateNote({
        elem: '#test-n2', //容器id,CLass
        url: '/adminport/adminNote', //异步数据接口,本地浏览时可不设置
        param: {
          adminID: adminInfo.id
        },
        sort: 'up', //日期排序，默认不设置不排序，up 日期升序，down 日期降序
        fine: '.laydateNotebook',
        done(data, chooseData, type) {
          //回调数据，这里发送你的请求ajax
          console.log(chooseData)
          admin.req({
            url: '/adminport/adminNote',
            type,
            data: chooseData,
            success(res) {
              console.log(res)
            }
          })
        }
      })

      //进度条
      const pro = new progress('#pro', {
        size: 4,
        tip: {
          trigger: 'hover',
          align: 'top'
        },
        getVal: function(res) {
          console.log(res.val)
        }
      })
      let cont = 0
      setInterval(function() {
        cont += 0.1
        pro.updateVal(cont)
      }, 15)
    })
  e('home', {})
})
