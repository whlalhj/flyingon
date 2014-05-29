//面板控件
flyingon.defineClass("Panel", flyingon.Control, function (Class, base, flyingon) {




    //子控件功能扩展
    flyingon.children_extender.call(this, base);




    //修改默认修值接受拖放
    this.defaultValue("droppable", true);



    this.defaultValue("width", 400);

    this.defaultValue("height", 400);





    this.__fn_arrange = function () {

        var children = this.__children,
            length;

        if (children && (length = children.length) > 0)
        {
            base.__fn_arrange.call(this);

            var items = this.__visible_items = [],
                x = this.contentX,
                y = this.contentY,
                right = x + this.clientWidth,
                bottom = y + this.clientHeight,
                cache;

            for (var i = 0; i < length; i++)
            {
                var item = children[i],
                    x1 = item.__visualX,
                    y1 = item.__visualY;

                if (item.__visible &&
                    x1 < right &&
                    y1 < bottom &&
                    x1 + item.__visualWidth >= x &&
                    y1 + item.__visualHeight >= y)
                {
                    result.push(item);
                }
            }
        }
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
