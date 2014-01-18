/*

*/
(function (flyingon) {



    //变量管理器
    var prototype = (flyingon.BoxModel = function (ownerControl) {

        //所属控件
        this.ownerControl = ownerControl;

    }).prototype;



    //上级盒模型
    prototype.parent = null;

    //相对偏移所属父模型
    prototype.offsetParent = null;

    //子盒模型
    prototype.children = null;

    //附加项
    prototype.additions = null;

    //是否需要渲染
    prototype.visible = true;




    //是否需要重绘
    prototype["x:update"] = false;

    //子模型是否需要重绘
    prototype["x:update-children"] = false;

    //重绘模式 0:重绘自身  1:重绘父级  2:重绘图层
    prototype["x:update-mode"] = 0;



    //是否需要测量
    prototype["x:measure"] = true;

    //是否图层
    prototype["x:layer"] = false;



    //相对x坐标
    prototype.x = 0;

    //相对y坐标
    prototype.y = 0;

    //绝对x坐标
    prototype.windowX = 0;

    //绝对y坐标
    prototype.windowY = 0;


    //渲染宽度
    prototype.width = 0;

    //渲染高度
    prototype.height = 0;

    //右边x坐标
    prototype.right = 0;

    //底部y坐标
    prototype.bottom = 0;


    //x渲染偏移
    prototype.scrollLeft = 0;

    //y渲染偏移
    prototype.scrollTop = 0;

    //滚动宽度
    prototype.scrollWidth = 0;

    //滚动高度
    prototype.scrollHeight = 0;


    //外边距
    prototype.margin = [0, 0, 0, 0];

    //边框
    prototype.border = [0, 0, 0, 0];

    //内边距
    prototype.padding = [0, 0, 0, 0];





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
    prototype.offsetToTarget = function (x, y) {

        var result = scroll.call(this);

        result.x += x - this.windowX;
        result.y += y - this.windowY;

        return result;
    };

    //偏移坐标转窗口坐标
    prototype.offsetToWindow = function (x, y) {

        var result = scroll.call(this);

        result.x += x;
        result.y += y;

        //如果控件自身有滚动动条且落在客户区内则加上滚动偏移
        if (this.scrollLeft && result.x < this.windowX + this.clientRect.right)
        {
            result.x += this.scrollLeft;
        }

        if (this.scrollTop && result.y < this.windowY + this.clientRect.bottom)
        {
            result.y += this.scrollTop;
        }

        return result;
    };

    //偏移坐标转控件坐标
    prototype.offsetToControl = function (x, y) {

        var result = scroll.call(this);

        result.x += x - this.windowX;
        result.y += y - this.windowY;

        //如果控件自身有滚动动条且落在客户区内则加上滚动偏移
        if (this.scrollLeft && result.x < this.clientRect.right)
        {
            result.x += this.scrollLeft;
        }

        if (this.scrollTop && result.y < this.clientRect.bottom)
        {
            result.y += this.scrollTop;
        }

        return result;
    };


    //目标坐标转偏移坐标
    prototype.targetToOffset = function (x, y) {

        var result = scroll.call(this);

        result.x = this.windowX + x - result.x;
        result.y = this.windowY + y - result.y;

        return result;
    };

    //窗口坐标转偏移坐标
    prototype.windowToOffset = function (x, y) {

        var result = scroll.call(this);

        result.x = x - result.x;
        result.y = y - result.y;

        //如果控件自身有滚动动条且落在客户区内则加上滚动偏移
        if (this.scrollLeft && result.x <= this.windowX + this.scrollLeft + this.clientRect.right)
        {
            result.x -= this.scrollLeft;
        }

        if (this.scrollTop && result.y <= this.windowY + this.scrollTop + this.clientRect.bottom)
        {
            result.y -= this.scrollTop;
        }

        return result;
    };

    //控件坐标转偏移坐标
    prototype.controlToOffset = function (x, y) {

        var result = scroll.call(this);

        result.x = this.windowX + x - result.x;
        result.y = this.windowY + y - result.y;

        //如果控件自身有滚动动条且落在客户区内则加上滚动偏移
        if (this.scrollLeft && result.x <= this.windowX + this.scrollLeft + this.clientRect.right)
        {
            result.x -= this.scrollLeft;
        }

        if (this.scrollTop && result.y <= this.windowY + this.scrollTop + this.clientRect.bottom)
        {
            result.y -= this.scrollTop;
        }

        return result;
    };





    //使当前盒模型无效
    prototype.invalidate = function () {

        if (!this["x:update"])
        {
            this["x:update"] = true;

            var parent = this.parent,
                update = this["x:update-mode"];


            while (parent)
            {
                if (!parent["x:update"])
                {
                    if (update == 0) //如果重绘模式为重绘自身
                    {
                        parent["x:update-children"] = true;
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



    //更新
    prototype.update = function (context) {

        if (this["x:update"]) //如果需要更新
        {
            this.render(context);
        }
        else if (this["x:update-children"]) //如果子控件需要更新
        {
            this["x:update-children"] = false;

            if (this.children)
            {
                this["y:render-children"](context, "update");
            }

            if (this.additions)
            {
                this["y:render-additions"](context, "update");
            }
        }

        return this;
    };




    //计算位置
    var position = function (storage, width, height) {

        var value;

        if (width > 0 && (value = (width - this.width)))
        {
            switch (storage.horizontalAlign)
            {
                case "center":
                    this.x += value >> 1;
                    break;

                case "right":
                    this.x += value;
                    break;
            }
        }

        if (height > 0 && (value = (height - this.height)))
        {
            switch (storage.verticalAlign)
            {
                case "center":
                    this.y += value >> 1;
                    break;

                case "bottom":
                    this.y += value;
                    break;
            }
        }
    };

    //测量 传入的区域为可用区域 系统会自动根据此范围计算出实际占用空间
    //注:width, height <= 0 表示可使用无限大的空间 
    prototype.measure = function (parent, x, y, width, height, additions) {


        var ownerControl = this.ownerControl,
            storage = ownerControl["x:storage"],

            margin = this.margin = ownerControl.styleValue("margin");


        //减去外框
        this.x = x + margin[3];
        this.y = y + margin[0];


        //先测量大小
        switch (width > 0 && ((width -= margin[3] + margin[1]) > 0 || (width = 0)) && storage.stretch)
        {
            case "width":
            case "all":
                this.width = width < storage.minWidth ? storage.minWidth : (storage.maxWidth > 0 && width > storage.maxWidth ? storage.maxWidth : (width || storage.width));
                break;

            default: //no或无限宽度
                this.width = storage.width;
                break;
        }

        switch (height > 0 && ((height -= margin[0] + margin[2]) > 0 || (height = 0)) && storage.stretch)
        {
            case "height":
            case "all":
                this.height = height < storage.minHeight ? storage.minHeight : (storage.maxHeight > 0 && height > storage.maxHeight ? storage.maxHeight : (height || storage.height));
                break;

            default: //no或无限宽度
                this.height = storage.height;
                break;
        }


        //计算位置
        position.call(this, storage, width, height);


        //处理父模型
        this.parent = parent;

        if (parent)
        {
            if (additions !== true)
            {
                this.offsetParent = parent;
                (parent.children || (parent.children = [])).push(this);
            }
            else
            {
                this.offsetParent = parent && parent.parent;
                (parent.additions || (parent.additions = [])).push(this);
            }
        }
        else
        {
            this.offsetParent = null;
        }


        //处理自动大小
        if (storage.autoSize != "no")
        {
            //测量
            this["y:measure"](ownerControl);

            ownerControl.measureText(this); //自定义文字测量
            ownerControl.adjustAutoSize(this);

            position.call(this, storage, width, height);

            this.compute();
        }
        else //延迟测量
        {
            this["x:measure"] = true;
        }


        //
        this.right = this.x + this.width;
        this.bottom = this.y + this.height;


        this["x:update"] = true;
        return this;
    };


    //移动至指定位置(大小不变)
    prototype.moveTo = function (x, y) {

        this.right = (this.x += x - this.x) + this.width;
        this.bottom = (this.y += y - this.y) + this.height;

        if (!this["x:measure"])
        {
            this.compute();
        }

        return this;
    };


    //定位单个内容控件
    prototype.content = function (content) {

        if (content)
        {
            var r = this.clientRect,
                box = content["x:boxModel"],
                margin = box.margin = content.styleValue("margin");

            box.measure(this, margin[3], margin[0], r.width - margin[3] - margin[1], r.height - margin[0] - margin[2]);
        }

        return this;
    };



    prototype["y:measure"] = function (ownerControl) {

        //测量
        this["x:measure"] = false;
        this["x:update-mode"] = 0;


        //设置滚动范围
        this.scrollWidth = 0;
        this.scrollHeight = 0;


        var fn = ownerControl.measure;
        if (fn)
        {
            fn.call(ownerControl, this);
        }
        else
        {
            this.compute();
        }
    };



    //计算盒模型
    prototype.compute = function () {


        var ownerControl = this.ownerControl,
            storage = ownerControl["x:storage"],

            r = this.offsetParent && this.offsetParent.clientRect,
            windowX = r ? r.windowX : 0,
            windowY = r ? r.windowY : 0,

            insideRect = this.insideRect = new flyingon.Rect(), //内部区域(除边框及滚动条外的区域,含padding)
            clientRect = this.clientRect = new flyingon.Rect(), //客户区域(内容区,不含padding)

            x = this.x,
            y = this.y,
            width = this.width,
            height = this.height,

            border = this.border = ownerControl.styleValue("border"),
            padding = this.padding = ownerControl.styleValue("padding");


        //圆角边框不能隐藏边线及不支持粗细不同的边线
        if (border.border = border[0] > 0)
        {
            if (this.borderRadius = ownerControl.styleValue("borderRadius"))
            {
                border[1] = border[2] = border[3] = border[0];
            }
        }
        else
        {
            border.border = border[1] > 0 || border[2] > 0 || border[3] > 0; //是否有边框线标志
        }

        this.windowX = x + windowX;
        this.windowY = y + windowY;

        insideRect.windowX = (insideRect.x = x + border[3]) + windowX;
        insideRect.windowY = (insideRect.y = y + border[0]) + windowY;
        insideRect.width = width - (border[3] + border[1]);
        insideRect.height = height - (border[0] + border[2]);

        clientRect.windowX = (clientRect.x = x + (clientRect.spaceX = border[3] + padding[3])) + windowX;
        clientRect.windowY = (clientRect.y = y + (clientRect.spaceY = border[0] + padding[0])) + windowY;
        clientRect.width = insideRect.width - (padding[3] + padding[1]);
        clientRect.height = insideRect.height - (padding[0] + padding[2]);

        return this;
    };


    //渲染
    prototype.render = function (context) {


        var ownerControl = this.ownerControl;


        //测量
        if (this["x:measure"])
        {
            this["y:measure"](ownerControl);

            //自定义文字测量
            ownerControl.measureText(this);
        }


        //设置渲染环境
        context.boxModel = this;

        //绘制背景
        if (!ownerControl["paint-background"](context, this) || context.globalAlpha < 1)
        {
            this["x:update-mode"] = 1;
        }


        //绘制子项
        if (this.children)
        {
            this["y:render-children"](context, "render");
        }

        //绘制附加内容
        if (this.additions)
        {
            this["y:render-additions"](context, "render");
        }


        //设置渲染环境
        context.boxModel = this;

        //绘制内框
        ownerControl.paint(context, this);

        //绘制外框
        ownerControl["paint-border"](context, this);


        //绘制装饰
        var decorates = ownerControl.styleValue("decorates");
        if (decorates && decorates.length > 0)
        {
            this["y:paint-decorates"](context, decorates);
        }

        //修改状态
        this["x:update"] = false;

        return this;
    };


    //渲染或更新子项
    prototype["y:render-children"] = function (context, fn) {

        var ownerControl = this.ownerControl,
            items = ownerControl["y:render-children"],
            item,
            length;


        items = (items && items.call(ownerControl, this)) || this.children;

        if ((length = items.length) > 0)
        {
            context.save();

            if (this.scrollLeft || this.scrollTop)
            {
                context.translate(-this.scrollLeft, -this.scrollTop);
            }

            if (ownerControl["x:storage"].clipToBounds)
            {
                var r = this.clientRect;

                context.beginPath();
                context.rect(r.x + this.scrollLeft, r.y + this.scrollTop, r.width, r.height);
                context.clip();
            }

            for (var i = 0; i < length; i++)
            {
                if ((item = items[i]) && item.visible)
                {
                    item[fn](context);
                }
            }

            context.restore();
        }
    };


    //渲染或更新附加内容
    prototype["y:render-additions"] = function (context, fn) {

        var additions = this.additions,
            item;

        if (additions)
        {
            for (var i = 0, length = additions.length; i < length; i++)
            {
                if ((item = additions[i]) && item.visible)
                {
                    item[fn](context, this);
                }
            }
        }
    };


    //绘制装饰
    prototype["y:paint-decorates"] = function (context, decorates) {

        var reader;

        for (var i = 0, length = decorates.length; i < length; i++)
        {
            var item = decorates[i];

            //未处理
            if (!(item instanceof flyingon.Shape))
            {
                item = decorates[i] = (reader || (reader = new flyingon.SerializeReader())).deserialize(item);
            }

            //重绘模式
            if (item.updateMode > this["x:update-mode"])
            {
                this["x:update-mode"] = item.updateMode;
            }

            item.paint(context, this);
        }
    };




})(flyingon);