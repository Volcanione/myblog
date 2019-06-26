;(() => {
  const render = ({ url, elem, tpl }) => {
    layui.use(['layer', 'admin', 'jquery', 'laytpl', 'element'], () => {
      const { layer, admin, jquery: $, laytpl, element } = layui
      if (!url || !elem || !tpl)
        return layer.msg('配置错误', { icon: 2, time: 1000 })

      admin.req({
        url,
        done(res) {
          console.log(res)
          laytpl(tpl).render(res, function(html) {
            $(elem).html(html)
          })
          element.render('nav')
        }
      })
    })
  }

  layui.define(function(exports) {
    exports('siderNav', render)
  })
})()
