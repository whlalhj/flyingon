/*

*/
(function ($) {



    //变量管理器
    $.BoxModel = function (ownerControl) {


        //所属控件
        this.ownerControl = ownerControl;


        //外框范围
        this.outerRect = new $.Rect();

        //绘制边框范围
        this.borderRect = new $.Rect();

        //内框范围
        this.innerRect = new $.Rect();
    };




    var p = $.BoxModel.prototype;


    //上级盒模型
    p.parent = null;

    //相对偏移所属父模型
    p.offsetParent = null;

    //子盒模型
    p.children = null;

    //附加项
    p.addition = null;

    //可渲染的子项集
    p.renderItems = null;

    //是否需要渲染
    p.visible = true;




    //是否需要重绘
    p["x:update"] = false;

    //子模型是否需要重绘
    p["x:update:children"] = false;

    //重绘模式 0:重绘自身  1:重绘父级  2:重绘图层
    p["x:update:mode"] = 0;


    //是否影响测量
    p["x:measure"] = true;

    //是否图层
    p["x:layer"] = false;



    //相对x坐标
    p.x = 0;

    //相对y坐标
    p.y = 0;

    //相对x偏移
    p.offsetX = 0;

    //相对y偏移
    p.offsetY = 0;

    //绝对x坐标
    p.windowX = 0;

    //绝对y坐标
    p.windowY = 0;


    //x滚动偏移
    p.scrollLeft = 0;

    //y滚动偏移
    p.scrollTop = 0;

    //滚动宽度
    p.scrollWidth = 0;

    //滚动高度
    p.scrollHeight = 0;


    //渲染宽度
    p.width = 0;

    //渲染高度
    p.height = 0;

    //右边x坐标
    p.right = 0;

    //底部y坐标
    p.bottom = 0;


    //外边距
    p.margin = [0, 0, 0, 0];

    //边框
    p.border = [0, 0, 0, 0];

    //内边距
    p.padding = [0, 0, 0, 0];







    //设置可用范围 注:传入的范围为最大可用范围 系统会自动根据此范围计算出实际占用空间
    p.setUsableRect = function (parent, x, y, width, height, addition) {


        var storage = this.ownerControl["x:storage"];


        //先测量大小
        switch (storage.stretch)
        {
            case "x":
                this.width = width;
                this.height = storage.height;
                break;

            case "y":
                this.width = storage.width;
                this.height = height;
                break;

            case "xy":
                this.width = width;
                this.height = height;
                break;

            default:
                this.width = storage.width;
                this.height = storage.height;
                break
        }

        if (storage.maxWidth > 0 && this.width > storage.maxWidth)
        {
            this.width = storage.maxWidth;
        }

        if (storage.minWidth > 0 && this.width < storage.minWidth)
        {
            this.width = storage.minWidth;
        }


        if (storage.maxHeight > 0 && this.height > storage.maxHeight)
        {
            this.height = storage.maxHeight;
        }

        if (storage.minHeight > 0 && this.height < storage.minHeight)
        {
            this.height = storage.minHeight;
        }



        //再计算位置
        switch (storage.horizontalAlign)
        {
            case "center":
                x += Math.round((width - this.width) / 2);
                break;

            case "right":
                x += width - this.width;
                break;
        }

        switch (storage.verticalAlign)
        {
            case "center":
                y += Math.round((height - this.height) / 2);
                break;

            case "bottom":
                y += height - this.height;
                break;
        }



        this.x = x;
        this.y = y;

        this.offsetX = storage.offsetX;
        this.offsetY = storage.offsetY;

        this.right = x + this.width;
        this.bottom = y + this.height;



        //处理父模型
        this.parent = parent;

        if (parent)
        {
            if (addition !== true)
            {
                this.offsetParent = parent;
                (parent.children || (parent.children = [])).push(this);
            }
            else
            {
                this.offsetParent = parent && parent.parent;
                (parent.addition || (parent.addition = [])).push(this);
            }
        }
        else
        {
            this.offsetParent = null;
        }


        this["x:measure"] = true;
        this["x:update"] = true;

        return this;
    };




    //获取滚动偏移
    function scroll() {

        var target = this,
            parent,
            x = 0,
            y = 0;

        while (parent = target.offsetParent)
        {
            x += parent.scrollLeft;
            y += parent.scrollTop;

            target = parent;
        }

        return { x: x, y: y }
    };

    //偏移坐标转目标坐标
    p.offsetToTarget = function (x, y) {

        var result = scroll.call(this);

        result.x += x - this.windowX;
        result.y += y - this.windowY;

        return result;
    };

    //偏移坐标转窗口坐标
    p.offsetToWindow = function (x, y) {

        var result = scroll.call(this);

        result.x += x;
        result.y += y;


        //如果控件自身有滚动动条且落在客户区内则加上滚动偏移
        if (this.scrollLeft && result.x < this.windowX + this.innerRect.right)
        {
            result.x += this.scrollLeft;
        }

        if (this.scrollTop && result.y < this.windowY + this.innerRect.bottom)
        {
            result.y += this.scrollTop;
        }


        return result;
    };

    //偏移坐标转控件坐标
    p.offsetToControl = function (x, y) {

        var result = scroll.call(this);

        result.x += x - this.windowX;
        result.y += y - this.windowY;


        //如果控件自身有滚动动条且落在客户区内则加上滚动偏移
        if (this.scrollLeft && result.x < this.innerRect.right)
        {
            result.x += this.scrollLeft;
        }

        if (this.scrollTop && result.y < this.innerRect.bottom)
        {
            result.y += this.scrollTop;
        }


        return result;
    };


    //目标坐标转偏移坐标
    p.targetToOffset = function (x, y) {

        var result = scroll.call(this);

        result.x = this.windowX + x - result.x;
        result.y = this.windowY + y - result.y;

        return result;
    };

    //窗口坐标转偏移坐标
    p.windowToOffset = function (x, y) {

        var result = scroll.call(this);

        result.x = x - result.x;
        result.y = y - result.y;


        //如果控件自身有滚动动条且落在客户区内则加上滚动偏移
        if (this.scrollLeft && result.x <= this.windowX + this.scrollLeft + this.innerRect.right)
        {
            result.x -= this.scrollLeft;
        }

        if (this.scrollTop && result.y <= this.windowY + this.scrollTop + this.innerRect.bottom)
        {
            result.y -= this.scrollTop;
        }


        return result;
    };

    //控件坐标转偏移坐标
    p.controlToOffset = function (x, y) {

        var result = scroll.call(this);

        result.x = this.windowX + x - result.x;
        result.y = this.windowY + y - result.y;


        //如果控件自身有滚动动条且落在客户区内则加上滚动偏移
        if (this.scrollLeft && result.x <= this.windowX + this.scrollLeft + this.innerRect.right)
        {
            result.x -= this.scrollLeft;
        }

        if (this.scrollTop && result.y <= this.windowY + this.scrollTop + this.innerRect.bottom)
        {
            result.y -= this.scrollTop;
        }


        return result;
    };




    //测量
    p.measure = function () {


        var ownerControl = this.ownerControl,

            r = this.offsetParent && this.offsetParent.innerRect,
            windowX = r ? r.windowX : 0,
            windowY = r ? r.windowY : 0,

            x = this.x + this.offsetX,
            y = this.y + this.offsetY,
            width = this.width,
            height = this.height,


            border = this.border = ownerControl.getStyleValue("border"), //计算出数据绘制时用
            padding = this.padding = ownerControl.getStyleValue("padding"),

            outerRect = this.outerRect,
            borderRect = this.borderRect,
            innerRect = this.innerRect;


        border.border = (border[0] + border[1] + border[2] + border[3]) > 0; //是否有边框线

        outerRect.windowX = this.windowX = (outerRect.x = x) + windowX;
        outerRect.windowY = this.windowY = (outerRect.y = y) + windowY;
        outerRect.width = width;
        outerRect.height = height;

        borderRect.windowX = (borderRect.x = x + border[3]) + windowX;
        borderRect.windowY = (borderRect.y = y + border[0]) + windowY;
        borderRect.width = width - (border[3] + border[1]);
        borderRect.height = height - (border[0] + border[2]);

        innerRect.windowX = (innerRect.x = x + (innerRect.spaceX = border[3] + padding[3])) + windowX;
        innerRect.windowY = (innerRect.y = y + (innerRect.spaceY = border[0] + padding[0])) + windowY;
        innerRect.width = borderRect.width - (padding[3] + padding[1]);
        innerRect.height = borderRect.height - (padding[0] + padding[2]);


        this.borderRadius = border[0] > 0 && ownerControl.getStyleValue("borderRadius"); //圆角边框不能隐藏边线及不支持粗细不同的边线

        this.renderItems = null;
        this["x:measure"] = false;
        this["x:update:mode"] = 0;

        return this;
    };



    //使当前盒模型无效
    p.invalidate = function () {

        if (!this["x:update"])
        {
            this["x:update"] = true;

            var parent = this.parent,
                update = this["x:update:mode"];


            while (parent)
            {
                if (!parent["x:update"])
                {
                    if (update == 0) //如果重绘模式为重绘自身
                    {
                        parent["x:update:children"] = true;
                    }
                    else
                    {
                        parent["x:update"] = true;

                        if (update == 1)
                        {
                            update = 0;
                        }
                    }
                }

                parent = !parent["x:layer"] && parent.parent;
            }
        }

        return this;
    };



    //获取当前可渲染的子项
    function getRenderItems(clipToBounds) {

        var result = this.renderItems;

        if (!result)
        {
            result = this.renderItems = [];


            var ownerControl = this.ownerControl,
                clipToBounds = ownerControl["x:storage"].clipToBounds,

                r = this.innerRect,

                x = this.scrollLeft,
                y = this.scrollTop,
                right = x + r.width,
                bottom = y + r.height,

                i = 0,
                length = this.children.length;


            while (i < length)
            {
                var box = this.children[i++];

                if (box.visible &&
                    box.right >= x &&
                    box.bottom >= y &&
                    box.ownerControl["x:storage"].visibility == "visible" &&
                    (!clipToBounds || (box.x < right && box.y < bottom)))
                {
                    result.push(box);
                }
            }
        }

        return result;
    };


    //更新
    p.update = function (context) {

        if (this["x:update"]) //如果需要更新
        {
            this.render(context);
        }
        else if (this["x:update:children"]) //如果子控件需要更新
        {
            this["y:render:children"](context, "update");
            this["x:update:children"] = false;
        }

        return this;
    };


    //渲染
    p.render = function (context) {


        var ownerControl = this.ownerControl;



        //文字测量
        if (ownerControl["x:storage"].text != null)
        {
            ownerControl["y:measure:text"]();
        }


        //测量
        if (this["x:measure"])
        {
            if (ownerControl["y:before:measure"])
            {
                ownerControl["y:before:measure"](this);
            }

            this.measure();

            //调用控件的测量方法
            if (ownerControl.measure)
            {
                ownerControl.measure(this);
            }
        }


        //设置渲染环境
        context.boxModel = this;

        //绘制背景
        if (!ownerControl.paintBackground(context) || context.globalAlpha < 1)
        {
            this["x:update:mode"] = 1;
        }

        //绘制子项
        if (this.children)
        {
            this["y:render:children"](context, "render");
        }

        //设置渲染环境
        context.boxModel = this;

        //绘制内框
        ownerControl.paint(context);

        //绘制外框
        ownerControl.paintBorder(context);

        //绘制装饰
        this["x:decorates"] = false;

        var decorates = ownerControl.getStyleValue("decorates");
        if (decorates && decorates.length > 0)
        {
            this["y:paint:decorates"](context, decorates);
            this["x:decorates"] = true;
        }


        //修改状态
        this["x:update"] = false;

        return this;
    };


    //渲染或更新子项
    p["y:render:children"] = function (context, fn) {

        var ownerControl = this.ownerControl,

            items = getRenderItems.call(this),
            i = 0,
            length = items.length;


        context.save();

        if (this.scrollLeft || this.scrollTop)
        {
            context.translate(-this.scrollLeft, -this.scrollTop);
        }

        if (ownerControl["x:storage"].clipToBounds)
        {
            var r = this.innerRect;

            context.beginPath();
            context.rect(r.x + this.scrollLeft, r.y + this.scrollTop, r.width, r.height);
            context.clip();
        }

        while (i < length)
        {
            items[i++][fn](context);
        }

        context.restore();


        //绘制附加内容
        if (this.addition)
        {
            i = 0;
            length = this.addition.length;

            while (i < length)
            {
                this.addition[i++][fn](context);
            }
        }
    };

    //绘制装饰
    p["y:paint:decorates"] = function (context, decorates) {

        var i = 0,
            length = decorates.length;

        while (i < length)
        {
            var item = decorates[i];

            //未处理
            if (!(item instanceof $.Shape))
            {
                item = decorates[i] = new $.SerializeReader().deserialize(item);
            }

            //重绘模式
            if (item.updateMode > this["x:update:mode"])
            {
                this["x:update:mode"] = item.updateMode;
            }

            item.paint(context);
            i++;
        }
    };



})(flyingon);