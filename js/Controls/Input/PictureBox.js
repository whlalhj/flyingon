/// <reference path="../Base/Core.js" />
/// <reference path="Control.js" />


/*

*/
flyingon.class("PictureBox", flyingon.Control, function (Class, flyingon) {



    this.defineProperty("image", null, "invalidate|style");


    //绘制内框
    this.paint = function (context, boxModel) {

        this["paint-image"](context, boxModel.clientRect);
        this["paint-text"](context, boxModel.clientRect);
    };

    this["paint-image"] = function (context, clientRect) {

        var image = this.image;

        if (image)
        {
            if (image.constructor == String && (image = flyingon.images[image]) == null)
            {
                return;
            }

            context.drawImage(image, clientRect.windowX, clientRect.windowY);
        }
    };


});