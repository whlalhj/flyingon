//面板控件
flyingon.defineClass("Panel", flyingon.Control, function (Class, base, flyingon) {



    var layouts = flyingon.layouts,         //缓存布局服务

        layout_unkown = layouts["flow"];    //设置未知布局类型




    //子控件功能扩展
    flyingon.children_extender.call(this, base);



    //修改默认修值接受拖放
    this.defaultValue("droppable", true);



    this.defaultValue("width", 400);

    this.defaultValue("height", 400);




    //设置rtl排列变换为沿y中心轴变换
    this.__fn_arrange_rtl = this.__fn_arrange_y;


    //排列子控件
    this.arrange = function () {

        var items = this.__children;

        if (items && items.length > 0)
        {
            (layouts[this.layoutType] || layout_unkown).call(this, items);
        }
    };


    //重载子控件渲染方法 在渲染前计算可视控件
    this.__fn_render_children = function (painter, update) {

        var children = this.__children,
            length;

        if (children && (length = children.length) > 0)
        {
            //计算可视控件
            var items = this.__visible_items = [],
                x = this.contentX,
                y = this.contentY,
                right = x + this.clientWidth,
                bottom = y + this.clientHeight,
                cache;

            for (var i = 0; i < length; i++)
            {
                var item = children[i],
                    x1 = item.controlX,
                    y1 = item.controlY;

                if (item.__visible &&
                    x1 <= right &&
                    y1 <= bottom &&
                    x1 + item.controlWidth >= x &&
                    y1 + item.controlHeight >= y)
                {
                    items.push(item);
                }
            }
        }

        base.__fn_render_children.call(this, painter, update);
    };


    //this.focus = function () {


    //    if (this.containsFocused)
    //    {
    //        return true;
    //    }


    //    var items = this.__children;

    //    for (var i = 0, _ = items.length; i < _; i++)
    //    {
    //        if (items[i].focus(event))
    //        {
    //            return true;
    //        }
    //    }

    //    return base.focus.call(this, event);
    //};

    //this.blur = function () {

    //    return this.containsFocused ? base.blur.call(this, event) : false;
    //};




    //this.serialize = function (writer) {

    //    base.serialize.call(this, writer);

    //    var items = this.__children;
    //    if (items.length > 0)
    //    {
    //        writer.array("children", items);
    //    }
    //};

    //this.deserialize = function (reader, data, excludes) {

    //    excludes.children = true;

    //    base.deserialize.call(this, reader, data, excludes);
    //    this.__children.deserialize(reader, data["children"]);
    //};


}, true);
