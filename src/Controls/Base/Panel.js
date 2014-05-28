//面板控件
flyingon.defineClass("Panel", flyingon.Control, function (Class, base, flyingon) {



    
    //子控件功能扩展
    this.children_extender(base);




    //修改默认修值接受拖放
    this.defaultValue("droppable", true);



    this.defaultValue("width", 400);

    this.defaultValue("height", 400);


    





   

    ////获取当前可渲染的子项
    //this.__fn_render_children = function (boxModel) {

    //    var result = this.__render_children;

    //    if (!result)
    //    {
    //        var clipToBounds = this.clipToBounds,

    //            children = boxModel.children,
    //            r = boxModel.clientRect,
    //            x = boxModel.scrollLeft,
    //            y = boxModel.scrollTop,
    //            right = x + r.width,
    //            bottom = y + r.height;

    //        result = this.__render_children = [];

    //        for (var i = 0, _ = children.length; i < _; i++)
    //        {
    //            var item = children[i];

    //            if (item.visible &&
    //                item.right >= x &&
    //                item.bottom >= y &&
    //                item.ownerControl.visibility === "visible" &&
    //                (!clipToBounds || (item.x < right && item.y < bottom)))
    //            {
    //                result.push(item);
    //            }
    //        }
    //    }

    //    return result;
    //};

    



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
