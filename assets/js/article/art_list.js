$(function () {

    const form = layui.form;
    const laypage = layui.laypage;
    //定义一个查询的参数对象 将来请求数据的时候
    //需要将请求的参数对象提交到服务器
    // 定义一个查询的参数对象，将来请求数据的时候，
    // 需要将请求参数对象提交到服务器
    const q = {
        pagenum: 1, // 页码值，默认请求第一页的数据
        pagesize: 1, // 每页显示几条数据，默认每页显示2条
        cate_id: "", // 文章分类的 Id
        state: "", // 文章的发布状态
    };


    //获取文章表格数据
    const initTable = () => {
        $.ajax({
            type: "GET",
            url: "/my/article/list",
            data: q,
            success: (res) => {
                if (res.status !== 0) return layer.msg("获取文章列表失败！");
                layer.msg("获取文章列表成功！")

                // 使用模板引擎渲染页面的数据
                const htmlStr = template("tpl-table", res);
                $("tbody").html(htmlStr);
                //调用渲染分页的方法
                renderPage(res.total);
            }
        })
    }

    initTable();

    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    // 定义补零的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }

    //获取文章分类

    const initCate = () => {
        $.ajax({
            type: "GET",
            url: "/my/article/cates",
            success: (res) => {
                console.log(res);


                // 调用模板引擎渲染分类的可选项
                const htmlStr = template("tpl-cate", res);
                $("[name=cate_id]").html(htmlStr);
                form.render();
            }

        })
    }

    initCate();

    //筛选功能
    $("#form-search").on("submit", (e) => {
        e.preventDefault();
        const cate_id = $("[name=cate_id]").val();
        const state = $("[name=state]").val();
        // console.log(cate_id, state);

        q.cate_id = cate_id;
        q.state = state;
        initTable();
    });



    // 定义渲染分页的方法
    function renderPage(total) {
        // 调用 laypage.render() 方法来渲染分页的结构
        laypage.render({
            elem: 'pageBox', // 分页容器的 Id
            count: total, // 总数据条数
            limit: q.pagesize, // 每页显示几条数据
            curr: q.pagenum, // 设置默认被选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],// 每页展示多少条
        
            // 分页发生切换的时候，触发 jump 回调
            jump: (obj, first) => {
                console.log(obj.curr);
                // 把最新的页码值，赋值到 q 这个查询参数对象中
                q.pagenum = obj.curr;
                q.pagesize = obj.limit;
                if (!first) {
                    initTable();
                }
            }

        })

    }


    //删除文章

    $("tbody").on("click",".btn-delete", function(e){
        const id = $(this).attr("data-id");
        const len = $(".btn-delete").length;
        layer.confirm("确认删除？",{icon:3,tital:"提示"},function(index){
             $.ajax({
                 type:"GET",
                 url:"/my/article/delete/" + id,
                 success:(res) => {
                     if(res.status !== 0) return layer.msg("删除文章失败！");
                     layer.msg("获取文章分类成功!");

                     if(len === 1){
                         q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
                     }

                     initTable();
                 },
             });

             layer.close(index);
        });
    });
});