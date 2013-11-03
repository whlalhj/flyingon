/// <reference path="../Base/Core.js" />
/// <reference path="Control.js" />


/*

*/
$.class("TextButtonBase", $.TextBoxBase, function ($) {



    this.defineProperty("items", []);


    this.defineProperty("showButton", true, "measure");



    this.measure = function (boxModel) {

        var innerRect = boxModel.innerRect,
            imageRect = boxModel.imageRect;

        if (!imageRect)
        {
            imageRect = boxModel.imageRect = new $.Rect();
        }

        imageRect.x = innerRect.x;
        imageRect.y = innerRect.y;


        if (this["x:storage"].showButton)
        {
            innerRect.width -= 16;

            imageRect.canvasX = innerRect.canvasX + innerRect.width;
            imageRect.canvasY = innerRect.canvasY;

            imageRect.width = 16;
            imageRect.height = innerRect.height;
        }
        else
        {
            imageRect.width = 0;
            imageRect.height = 0;
        }
    };



    //绘制内框
    this.paint = function (context) {

        this.paintText(context);
        this.paintImage(context);
    };

    this.paintImage = function (context) {

        var imageRect = context.boxModel.imageRect;

        if (imageRect.width > 0)
        {
            context.fillStyle = "blue";
            context.fillRect(imageRect.canvasX, imageRect.canvasY, imageRect.width, imageRect.height);
        }
    };


});

