

//图片管理
(function (flyingon) {


    var image_list = flyingon.images = {}, //图片集
        image_blank = null; //默认图片



    //定义图像
    flyingon.defineImages = function (images) {

        for (var name in images)
        {
            (image_list[name] = new Image()).src = images[name]; //直接转成Image对象
        }

        if (!image_blank && images.blank)
        {
            image_blank = images.blank;
        }
    };



    //获取图片
    flyingon.get_image = function (name) {

        return image_list[name] || image_blank;
    };

    //按顺序获取其中一张有效的图片
    flyingon.get_image_any = function (names) {

        var image;

        for (var i = 0, _ = names.length; i < _; i++)
        {
            if (image = image_list[names[i]])
            {
                return image;
            }
        }

        return image_blank;
    };


})(flyingon);


