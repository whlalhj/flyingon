//引用管理 一般情况下 只有Window,ChildWindow及UserControl支持引用管理
(function (flyingon) {


    var prototype = (flyingon.References = function (parent) {

        this.__parent__ = parent;
        this.__data__ = {};

    }).prototype;




    prototype.get = function (name) {

        var result = this.__data__[name];

        if (result !== undefined)
        {
            return result;
        }


        var parent = this.__parent__;

        while (parent)
        {
            if ((result = parent.__data__[name]) !== undefined)
            {
                return result;
            }

            parent = parent.__parent__;
        }
    };

    prototype.add = function (name, value) {


    };

    prototype.remove = function (name) {


    };


})(flyingon);