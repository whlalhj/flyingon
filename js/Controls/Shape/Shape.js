/*
形状基类

*/
$.class("Shape", $.SerializableObject, function ($) {



    //填充色
    this.defineProperty("fillStyle", null);

    //边框色
    this.defineProperty("strokeStyle", $.colors["control-border"]);

    //线宽
    this.defineProperty("lineWidth", 1);



    //固定宽度
    this.defineProperty("width", 0);

    //固定高度
    this.defineProperty("height", 0);

    //x轴缩放比例
    this.defineProperty("scaleX", 1);

    //y轴缩放比例
    this.defineProperty("scaleY", 1);

    //偏移距离 上->右->底->左
    this.defineProperty("offset", [0, 0, 0, 0]);

    //是否逆时针绘制
    this.defineProperty("anticlockwise", false);

    //重绘模式 0:重绘自身  1:重绘父级  2:重绘图层
    this.defineProperty("updateMode", 0);

    //子形状
    this.defineProperty("children", null);




    function children(context, storage, borderRect) {

        var i = 0,
            children = storage.children,
            length = children.length,
            offset;

        while (i < length)
        {
            var item = children[i++];

            storage = item["x:storage"];
            offset = storage.offset;

            item.buildPath(context,
                borderRect.windowX + offset[3],
                borderRect.windowY + offset[0],
                storage.width <= 0 ? borderRect.width * storage.scaleX - offset[3] - offset[1] : storage.width,
                storage.height <= 0 ? borderRect.height * storage.scaleY - offset[0] - offset[2] : storage.height);

            if (storage.children)
            {
                children(context, storage, borderRect);
            }
        }
    };


    this.paint = function (context) {


        var borderRect = context.boxModel.borderRect,
            storage = this["x:storage"],
            offset = storage.offset;


        context.beginPath();

        this.buildPath(context,
            borderRect.windowX + offset[3],
            borderRect.windowY + offset[0],
            storage.width <= 0 ? borderRect.width * storage.scaleX - offset[3] - offset[1] : storage.width,
            storage.height <= 0 ? borderRect.height * storage.scaleY - offset[0] - offset[2] : storage.height);


        if (storage.children)
        {
            children(context, storage, borderRect);
        }


        if (storage.fillStyle)
        {
            context.set_fillStyle(storage.fillStyle);
            context.fill();
        }

        if (storage.strokeStyle)
        {
            context.lineWidth = storage.lineWidth;
            context.set_strokeStyle(storage.strokeStyle);
            context.stroke();
        }
    };

    this.buildPath = function (context, x, y, width, height) {

    };


});

