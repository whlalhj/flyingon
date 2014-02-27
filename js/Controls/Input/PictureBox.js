/// <reference path="../Base/Core.js" />
/// <reference path="Control.js" />


/*

*/
flyingon.class("PictureBox", flyingon.Control, function (Class, flyingon) {



    //图片
    this.defineProperty("image", null);



    //绘制内框
    this.paint = function (context, boxModel) {

        this.paint_image(context, boxModel.clientRect);
        this.paint_text(context, boxModel.clientRect);
    };


    this.paint_image = function (context, clientRect) {

        var image = this.image;

        if (image && (image instanceof Image || flyingon.get_image(image)))
        {
            context.drawImage(image, clientRect.windowX, clientRect.windowY);
        }
    };


});