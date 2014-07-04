/*

*/
flyingon.defineClass("ControlCollection", flyingon.Collection, function (Class, base, flyingon) {




    Class.create_mode = "merge";

    Class.create = function (ownerControl) {

        this.ownerControl = ownerControl;
    };



    //添加进集合时进行验证
    this.__fn_validate = function (index, item) {

        if (item instanceof flyingon.Control)
        {
            if (item.__parent) //从原有父控件中删除
            {
                item.remove();
            }

            if (flyingon.__initializing)
            {
                item.__parent = this.ownerControl;
            }
            else
            {
                item.__fn_parent(this.ownerControl);
            }

            return item;
        }
    };

    //移除
    this.__fn_remove = function (index, item) {

        if (!flyingon.__initializing)
        {
            item.__fn_parent(null);
            item.__ownerWindow = null;
            item.__ownerLayer = null;

            this.ownerControl.invalidate(false);

            if ((item = item.__children) && item.length > 0)
            {
                clear_children(item);
            }
        }
    };

    //注: 清除不触发相关事件
    this.__fn_clear = function () {

        for (var i = 0, _ = this.length; i < _; i++)
        {
            var item = this[i];

            item.__parent = null;
            item.__ownerWindow = null;
            item.__ownerLayer = null;

            if ((item = item.__children) && item.length > 0)
            {
                clear_children(item);
            }
        }
    };

    //清除子控件关系缓存
    function clear_children(children) {

        for (var i = 0, _ = children.length; i < _; i++)
        {
            var item = children[i];

            item.__ownerWindow = null;
            item.__ownerLayer = null;

            if ((item = item.__children) && item.length > 0)
            {
                clear_children(item);
            }
        }
    };


    //循环执行指定函数
    this.cascade_call = function (fn) {

        var result, item;

        for (var i = 0, _ = this.length; i < _; i++)
        {
            if ((result = fn(item = this[i], i)) !== undefined)
            {
                return result;
            }

            if ((item = item.__children) && (result = item.cascade_call(fn, true)) !== undefined)
            {
                return result;
            }
        }
    };



    //重载自定义反序列化 
    //注: 反序列化时不执行验证
    this.deserialize = function (reader, data, excludes) {

        if (data)
        {
            reader.properties(this, data, excludes);

            var parent = this.ownerControl,
                item;

            for (var i = 0, _ = this.length; i < _; i++)
            {
                if (item = this[i])
                {
                    item.__parent = parent;
                }
            }
        }
    };



});

