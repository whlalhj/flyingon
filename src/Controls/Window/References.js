//引用管理 一般情况下 只有Window,ChildWindow及UserControl支持引用管理
(function (flyingon) {


    var prototype = (flyingon.References = function (parent) {

        this.__parent = parent;
        this.__data = {};

    }).prototype;




    prototype.get = function (name) {

        var result = this.__data[name];

        if (result !== undefined)
        {
            return result;
        }


        var parent = this.__parent;

        while (parent)
        {
            if ((result = parent.__data[name]) !== undefined)
            {
                return result;
            }

            parent = parent.__parent;
        }
    };

    prototype.add = function (name, value) {


    };

    prototype.remove = function (name) {


    };


})(flyingon);