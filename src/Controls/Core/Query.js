
//选择器
(function (flyingon) {



    //选择器
    //selector: css样式选择表达式 
    //start: 开始搜索节点
    flyingon.Query = flyingon.function_extend(

        function (selector, start) {

            if (selector)
            {
                switch (selector.constructor)
                {
                    case String:
                        selector = flyingon.querySelectorAll(selector, start);

                    case Array:
                        if (selector.length > 0)
                        {
                            this.push.apply(this, selector);
                        }
                        break;

                    default:
                        this.push(selector);
                        return;
                }
            }
        },

        function (flyingon) {


            //开放接口
            flyingon.query = this;



            //子项数
            this.length = 0;

            //添加元素
            this.push = Array.prototype.push;

            //移除或替换元素
            this.splice = Array.prototype.splice;



            //扩展for相关方法
            flyingon.for_extend(this);



            //合并
            this.merge = function (selector, context) {

                this.push.call(this, selector, context);
                return this;
            };


            //保存状态
            this.save = function () {

                var query = new flyingon.Query();

                query.push.apply(query, this);
                query.__previous = this;

                return query;
            };

            //恢复到上次保存的状态(没有保存的状态则返回自身)
            this.restore = function () {

                var result = this.__previous;

                if (result)
                {
                    this.__previous = null;
                    return result;
                }

                return this;
            };


            //获取第一个项
            this.first = function () {

                if (this.length > 1)
                {
                    this.splice(1, this.length - 1);
                }

                return this;
            };

            //获取最后一个项
            this.last = function () {

                if (this.length > 1)
                {
                    this.splice(0, this.length - 2);
                }

                return this;
            };

            //获取奇数项
            this.odd = function () {

                return this.mod(0, 2);
            };

            //获取偶数项
            this.even = function () {

                return this.mod(1, 2);
            };

            //复合求余值的项
            this.mod = function (mod, length) {

                var values = [];

                for (var i = 0, length = this.length; i < length; i++)
                {
                    if (i % length === mod)
                    {
                        values.push(this[i]);
                    }
                }

                this.length = 0;
                this.push.apply(this, values);

                return this;
            };

            //筛选项
            this.filter = function (fn) {

                var values = [], item;

                for (var i = 0, length = this.length; i < length; i++)
                {
                    if (i % length === mod)
                    {
                        if (fn(item = this[i], i))
                        {
                            values.push(item);
                        }
                    }
                }

                this.length = 0;
                this.push.apply(this, values);

                return this;
            };





            this.addEventListener = function (type, fn) {

                this.for_apply("addEventListener", arguments);
                return this;
            };

            this.removeEventListener = function (type, fn) {

                this.for_apply("removeEventListener", arguments);
                return this;
            };



            this.hasClass = function (className) {

                return this.for_has("hasClass", true, arguments);
            };

            this.addClass = function (className) {

                this.for_apply("addClass", arguments);
                return this;
            };

            this.removeClass = function (className) {

                this.for_apply("removeClass", arguments);
                return this;
            };

            this.toggleClass = function (className) {

                this.for_apply("toggleClass", arguments);
                return this;
            };


        });



})(flyingon);


