
//内容控件
flyingon.defineClass("ComplexControl", flyingon.Control, function (Class, base, flyingon) {


  
    //内容控件
    this.defineProperty("content",

        function () {

            return this.__children__[0] || null;
        },

        function (value) {

            if (this.__children__[0] !== value)
            {
                this.__children__.replace(0, value);
            }
        });


    this.arrange = function (clientRect) {

        this.__boxModel__.content(this.__children__[0]);
    };


});

