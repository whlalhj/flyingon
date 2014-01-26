/// <reference path="../Base/Core.js" />
/// <reference path="Control.js" />


/*

*/
flyingon.class("TextButtonBase", flyingon.TextBoxBase, function (Class, flyingon) {



    this.defineProperty("items", []);


    this.defineProperty("showButton", true, "measure");



    this.measure = function (boxModel) {


        boxModel.compute();


        var clientRect = boxModel.clientRect,
            imageRect = boxModel.imageRect;


        if (!imageRect)
        {
            imageRect = boxModel.imageRect = new flyingon.Rect();
        }

        imageRect.x = clientRect.x;
        imageRect.y = clientRect.y;


        if (this.showButton)
        {
            clientRect.width -= 16;

            imageRect.canvasX = clientRect.canvasX + clientRect.width;
            imageRect.canvasY = clientRect.canvasY;

            imageRect.width = 16;
            imageRect.height = clientRect.height;
        }
        else
        {
            imageRect.width = 0;
            imageRect.height = 0;
        }
    };



    //绘制内框
    this.paint = function (context, boxModel) {

        this.paint_text(context, boxModel.clientRect);
        this.paint_image(context, boxModel.imageRect);
    };

    this.paint_image = function (context, imageRect) {

        if (imageRect.width > 0)
        {
            context.fillStyle = "blue";
            context.fillRect(imageRect.canvasX, imageRect.canvasY, imageRect.width, imageRect.height);
        }
    };


});

