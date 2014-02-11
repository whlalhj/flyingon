
//选择器
(function (flyingon) {



    //flyingon.query 选择器方法扩展
    var prototype = flyingon.query = (flyingon.Query = function (selector, context) {

        if (selector)
        {
            //字符串
            switch (typeof selector)
            {
                case "string":
                    query_string.call(this, selector, context);
                    break;

                case "function":
                    query_function.call(this, selector, context);
                    break;

                case "object":
                    var constructor = selector.constructor;

                    if (constructor == Array)
                    {
                        for (var i = 0, length = selector.length; i < length; i++)
                        {
                            this[this.length++] = selector[i];
                        }
                    }
                    else if (constructor == String)
                    {
                        query_string.call(this, selector, context);
                    }
                    else
                    {
                        this[this.length++] = selector;
                    }
                    break;

                default:
                    this[this.length++] = selector;
                    break;
            }
        }

    }).prototype;


    //选中项长度
    prototype.length = 0;


    //扩展选择器方法
    /*
    flyingon.extend_query({

        test: function () {

            return this.forEach(...);
        }
    });
    */
    flyingon.extend_query = function (data) {

        if (data)
        {
            for (var name in data)
            {
                prototype[name] = data[name];
            }
        }
    };



    prototype.forEach = function (fn) {

        for (var i = 0, length = this.length; i < length; i++)
        {
            fn.apply(this[i]);
        }

        return this;
    };






    function query_string(selector, context) {

    };

    function query_function(selector, context) {

        //query_list:可选择对象接口
        if (context && (context = context.query_list) && (context = context()))
        {
            for (var i = 0, length = context.length; i < length; i++)
            {
                var target = context[i];

                if (selector.call(target))
                {
                    this[this.length++] = target;
                }

                if (target.query_list)
                {
                    query_function.call(this, selector, target);
                }
            }
        }
    };


    //合并
    prototype.merge = function (selector, context) {

        flyingon.Selector.call(this, selector, context);
        return this;
    };

    //剔除子项
    prototype.reject = function (control) {

    };

    //筛选子项
    prototype.filter = function (fn) {

    };

    //如果进行过筛选则回到筛选前的状态
    prototype.back = function () {


    };





    prototype.addEventListener = function (type, fn) {

        for (var i = 0, length = this.length; i < length; i++)
        {
            this[i].addEventListener(type, fn);
        }

        return this;
    };

    prototype.removeEventListener = function (type, fn) {

        for (var i = 0, length = this.length; i < length; i++)
        {
            this[i].removeEventListener(type, fn);
        }

        return this;
    };




    prototype.addStyle = function (styleName) {

        for (var i = 0, length = this.length; i < length; i++)
        {
            this[i].add_styleName(styleName);
        }

        return this;
    };

    prototype.removeStyle = function (styleName) {

        for (var i = 0, length = this.length; i < length; i++)
        {
            this[i].remove_styleName(styleName);
        }

        return this;
    };



})(flyingon);


