/// <reference path="../Base/Core.js" />
/// <reference path="Control.js" />


/*

*/
$.class("PictureBox", $.Control, function ($) {



    this.defineProperty("image", null, "invalidate|style");


    //绘制内框
    this.paint = function (context) {

        this.paintImage(context);
        this.paintText(context);
    };

    this.paintImage = function (context) {

        var image = this.image;

        if (image)
        {
            if (image.constructor == String && (image = $.images[image]) == null)
            {
                return;
            }

            var rect = context.boxModel.innerRect;
            context.drawImage(image, rect.windowX, rect.windowY);
        }
    };


});