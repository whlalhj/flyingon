//图片按钮
flyingon.class("ImageButton", flyingon.Control, function (Class, flyingon) {


    this.defaultValue("width", "fill");

    this.defaultValue("height", "fill");


    //图片
    this.defineProperty("image", null);

    //是否状态图 是则会根据当前状态自动切换不同图片(图片命名需符合规范: image + "-" + state)
    this.defineProperty("state", false, "invalidate|style");



    this.__fn_image__ = function () {

        return this.image;
    };


    this.paint = function (context, boxModel) {

        var r = boxModel.clientRect,
            image = this.__fn_image__();

        if (image = this.state ? this.__fn_state_image__(image) : flyingon.get_image(image))
        {
            context.drawImage(image,
                r.windowX + ((r.width - image.width) >> 1),
                r.windowY + ((r.height - image.height) >> 1));
        }
    };

});