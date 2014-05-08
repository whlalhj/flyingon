
//复合控件
flyingon.defineClass("ComplexControl", flyingon.Control, function (Class, base, flyingon) {




    Class.create = function () {


        //子控件集合
        this.__children__ = new flyingon.ControlCollection(this);

        //初始化子盒模型
        this.__boxModel__.children = [];
    };

    


    //获取指定位置的控件
    this.findAt = function (x, y) {

        //判断滚动条
        var result = base.findAt.call(this, x, y);

        if (result !== this)
        {
            return result;
        }



        var box = this.__boxModel__,
            r = box.clientRect;


        x += box.scrollLeft - r.x;
        y += box.scrollTop - r.y;

        //if (this.transform)
        //{

        //}


        var items = this.__render_children__;

        if (items && items.length > 0)
        {
            for (var i = items.length - 1; i >= 0 ; i--)
            {
                var item = items[i].ownerControl;

                if (item.hitTest(x, y))
                {
                    return item.findAt ? item.findAt(x, y) : item;
                }
            }
        }


        return this;
    };




    this.focus = function () {


        if (this.containsFocused)
        {
            return true;
        }


        var items = this.__children__;

        for (var i = 0, length = items.length; i < length; i++)
        {
            if (items[i].focus(event))
            {
                return true;
            }
        }

        return base.focus.call(this, event);
    };

    this.blur = function () {

        return this.containsFocused ? base.blur.call(this, event) : false;
    };




    this.serialize = function (writer) {

        base.serialize.call(this, writer);

        var items = this.__children__;
        if (items.length > 0)
        {
            writer.array("children", items);
        }
    };

    this.deserialize = function (reader, data, excludes) {

        excludes.children = true;

        base.deserialize.call(this, reader, data, excludes);
        this.__children__.deserialize(reader, data["children"]);
    };




}, true);

