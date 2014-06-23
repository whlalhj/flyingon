
//内容控件
flyingon.defineClass("ContentControl", flyingon.ScrollableControl, function (Class, base, flyingon) {


  
    //内容控件
    this.defineProperty("content",

        function () {

            return this.__children && this.__children[0] || null;
        },

        function (value) {

            if ((this.__children || this.children)[0] !== value)
            {
                this.__children.replace(0, value);
            }
        });


    this.arrange = function () {

        
    };


});

