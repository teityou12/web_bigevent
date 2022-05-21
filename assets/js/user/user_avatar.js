// 1.1 获取裁剪区域的 DOM 元素
var $image = $('#image')
// 1.2 配置选项
const options = {
    // 纵横比
    aspectRatio: 1,
    // 指定预览区域
    preview: '.img-preview'
};

// 1.3 创建裁剪区域
$image.cropper(options);

//模拟文件选择框 点击事件

$("#btnChooseImage").click(() => {
    $("#file").click()
    //设置图片
    const layer = layui.layer;
    $("#file").change((e) => {
        // console.log(e.target.files);
        let fileList = e.target.files;
        if (fileList.length === 0) return layer.msg("请选择文件后上传！");
        //1,获取用户上传的文件
        const file = e.target.files[0];
        //2,获取文件路径
        const imgURL = URL.createObjectURL(file);
        //3,重新初始化剪裁区
        $image
            .cropper("destroy") //销毁旧的剪裁区
            .attr("src", imgURL) //重新设置图片路径
            .cropper(options); //重新初始化剪裁区
    });

});


//上传图片
$("#btnUpload").click((e) => {
    //1 拿到用户裁切之后的头像
    //直接赋值代码即可
    const dataURL = $image
        .cropper("getCroppedCanvas", {
            //创建一个 Canvas 画布
            width: 100,
            height: 100,
        })
        .toDataURL("image/png");

    // 2 发送上传文件请求
    $.ajax({
        type: "POST",
        url: "/my/update/avatar",
        data: {
            avatar: dataURL,
        },
        success: (res) => {
            if (res.status !== 0) return layer.msg("更新头像失败！");
            layer.msg("更新头像成功！");
            //调用父级的 getUserInfo
            window.parent.getUserInfo();
        },


    });
})