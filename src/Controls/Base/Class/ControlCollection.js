/*

*/
flyingon.defineClass("ControlCollection", flyingon.Collection, function (Class, base, flyingon) {


    Class.create = function (ownerControl) {

        this.__ownerControl = ownerControl;
    };



    //添加进集合时进行验证
    this.__fn_validate = function (index, item) {

        if (item instanceof flyingon.Control)
        {
            item.__boxModel.initialize(this.__ownerControl.__boxModel);

            if (flyingon.__initializing)
            {
                item.__parent = this.__ownerControl;
            }
            else
            {
                item.__fn_parent(this.__ownerControl);
            }

            return item;
        }

        return undefined;
    };

    //移\\\\\
    this.__fn_remove = function (index, item) {

        var box = item.__boxModel;

        box.parent = box.offsetParent = null;

        box = this.__ownerControl.__boxModel;
        box.children.splice(index, 1);

        if (!flyingon.__initializing)
        {
            item.__fn_parent(null);
            this.__ownerControl.invalidate(false);
        }
    };

    //注: 清除不触发相关事件
    this.__fn_clear = function () {

        this.__ownerControl.__boxModel.children.length = 0;

        for (var i = 0, _ = this.length; i < _; i++)
        {
            var item = this[i],
                box = item.__boxModel;

            item.__parent = null;
            box.parent = box.offsetParent = null;
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

            var box = this.__ownerControl.__boxModel,
                item;

            for (var i = 0, _ = this.length; i < _; i++)
            {
                if (item = this[i])
                {
                    item.__boxModel.initialize(box);
                    item.__parent = this.__ownerControl;
                }
            }
        }
    };



}, true);

