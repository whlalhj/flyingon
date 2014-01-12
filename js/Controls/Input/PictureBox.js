/// <reference path="../Base/Core.js" />
/// <reference path="Control.js" />


/*

*/
flyingon.class("PictureBox", flyingon.Control, function (Class, flyingon) {



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
            if (image.constructor == String && (image = flyingon.images[image]) == null)
            {
                return;
            }

            var r = context.boxModel.innerRect;
            context.drawImage(image, r.windowX, r.windowY);
        }
    };


});