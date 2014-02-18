/// <reference path="../Base/Core.js" />
/// <reference path="Control.js" />


/*

*/
flyingon.class("PictureBox", flyingon.Control, function (Class, flyingon) {



    this.defineProperty("image", null, "invalidate|style");


    //绘制内框
    this.paint = function (context, boxModel) {

        this.paint_image(context, boxModel.clientRect);
        this.paint_text(context, boxModel.clientRect);
    };


    var images = flyingon_images;

    this.paint_image = function (context, clientRect) {

        var image = this.image;

        if (image)
        {
            if (image.constructor == String && (image = images[image]) == null)
            {
                return;
            }

            context.drawImage(image, clientRect.windowX, clientRect.windowY);
        }
    };


});