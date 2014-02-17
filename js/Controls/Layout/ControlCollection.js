/*

*/
flyingon.class("ControlCollection", flyingon.Collection, function (Class, flyingon) {


    Class.create = function (ownerControl) {

        this.__ownerControl__ = ownerControl;
    };




    this.__fn_validate__ = function (index, item) {

        if (item instanceof flyingon.Control)
        {
            item.__boxModel__.initialize(this.__ownerControl__.__boxModel__);

            if (flyingon.__initializing__)
            {
                item.__parent__ = this.__ownerControl__;
            }
            else
            {
                item.__fn_parent__(this.__ownerControl__);
            }

            return item;
        }

        return undefined;
    };

    this.__fn_remove__ = function (index, item) {

        var box = item.__boxModel__;

        box.parent = box.offsetParent = null;

        box = this.__ownerControl__.__boxModel__;
        box.children.splice(index, 1);

        if (!flyingon.__initializing__)
        {
            item.__fn_parent__(null);
            this.__ownerControl__.invalidate();
        }
    };

    //注: 清除不触发相关事件
    this.__fn_clear__ = function () {

        this.__ownerControl__.__boxModel__.children.length = 0;

        for (var i = 0, length = this.length; i < length; i++)
        {
            var item = this[i],
                box = item.__boxModel__;

            item.__parent__ = null;
            box.parent = box.offsetParent = null;
        }
    };



    //循环执行指定函数
    this.cascade_call = function (fn, cascade) {

        var result, item;

        for (var i = 0, length = this.length; i < length; i++)
        {
            if ((result = fn(item = this[i], i)) !== undefined)
            {
                return result;
            }

            if (cascade && (item = item.__children__) && (result = item.cascade_call(fn, true)) !== undefined)
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

            var box = this.__ownerControl__.__boxModel__,
                item;

            for (var i = 0, length = this.length; i < length; i++)
            {
                if (item = this[i])
                {
                    item.__boxModel__.initialize(box);
                    item.__parent__ = this.__ownerControl__;
                }
            }
        }
    };



}, true);

