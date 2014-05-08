(function (flyingon) {


    var regex = /top|middle|bottom|left|center|right/g;


    //背景
    var Background = flyingon.Background = (function (value) {

        if (value)
        {

        }

    }).extend(function () {


        //颜色
        this.color = "transparent";

        //背景图像
        this.image = null;

        /*
        背景图像重复方式

        repeat	    默认 背景图像将在垂直方向和水平方向重复
        repeat-x	背景图像将在水平方向重复
        repeat-y	背景图像将在垂直方向重复
        no-repeat	背景图像将仅显示一次
        inherit	    规定应该从父元素继承background-repeat属性的设置
        */
        this.repeat = "repeat";

        /*
        背景图像起始位置

        top|center|bottom left|center|right 如果仅规定了一个关键词 那么第二个值将是"center"
        x% y%       第一个值是水平位置 第二个值是垂直位置 左上角是0% 0% 右下角是100% 100% 如果仅规定了一个值则另一个值将是50%
        xpos ypos   第一个值是水平位置，第二个值是垂直位置 左上角是0 0 单位是像素(0px 0px)或任何其他的CSS单位 如果您仅规定了一个值 另一个值将是50% 可以混合使用%和position值
        */
        this.position = "0 0";

        /*
        背景图像是否固定或者随着页面的其余部分滚动

        scroll	背景图像会随着页面其余部分的滚动而移动
        fixed	当页面的其余部分滚动时 背景图像不会移动
        inherit	规定应该从父元素继承background-attachment属性的设置
        */
        this.attachment = "scroll";

        /*
        背景图片定位区域 如果背景图像的 background-attachment 属性为"fixed"则该属性无效

        padding-box	背景图像相对于内边距框来定位
        border-box	背景图像相对于边框盒来定位
        content-box	背景图像相对于内容框来定位
        */
        this.origin = "padding-box";

        /*
        背景图片绘制区域 统一设置时使用: clip-padding clip-border clip-content

        padding-box	背景被裁剪到边框盒
        border-box	背景被裁剪到内边距框
        content-box	背景被裁剪到内容框
        */
        this.clip = "padding-box";

        /*
        背景图片尺寸

        length	    设置背景图像的高度和宽度 第一个值设置宽度 第二个值设置高度 如果只设置一个值则第二个值会被设置为"auto"
        percentage	以父元素的百分比来设置背景图像的宽度和高度 第一个值设置宽度 第二个值设置高度 如果只设置一个值则第二个值会被设置为"auto"
        cover	    把背景图像扩展至足够大以使背景图像完全覆盖背景区域 背景图像的某些部分也许无法显示在背景定位区域中
        contain	    把图像图像扩展至最大尺寸以使其宽度和高度完全适应内容区域
        */
        this.size = "auto";


    });




    //子样式属性名称集合
    Background.names = ["color", "image", "repeat", "position", "attachment", "origin", "clip", "size"];


    //注册样式转换
    flyingon.__fn_style_convert__("background", function (style, value) {

        return value instanceof Background ? value : new Background(value);
    });


    for (var i = 0, length = Background.names; i < length; i++)
    {
        var name = "background",
            key = Background.names[i];

        flyingon.__fn_style_convert__(name + key[0].toUpperCase() + key.substring(1), function (style, value) {

            var result = style[name] || (style[name] = new Background());
            result[key] = value;
            return result;

        }, name);
    };



})(flyingon);