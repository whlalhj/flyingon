/// <reference path="../../../js/flyingon.js" />



(function (flyingon) {


    var layouts = {};


    flyingon.registry_layout = function (name, arrange_fn) {

        layouts[name] = arrange_fn;
    };


    flyingon.unregistry_layout = function (name) {

        delete layouts[name];
    };




    //线性布局
    (function (flyingon) {


        function horizontal(items, clientRect, spaceX, spaceY) {

            var x = 0,

                width = clientRect.width,
                height = clientRect.height,

                boxModel = this.__boxModel,
                scrollWidth = boxModel.scrollWidth,
                scrollHeight = boxModel.scrollHeight;


            for (var i = 0, length = items.length; i < length; i++)
            {
                var item = items[i],
                    box = item.__boxModel;

                if (box.visible = (item.visibility !== "collapsed"))
                {
                    item.__fn_measure_size(box, width - x, height, false);

                    if ((x = box.right + box.margin.left) > scrollWidth)
                    {
                        scrollWidth = x;
                    }

                    x += spaceX;

                    if (box.height > scrollHeight)
                    {
                        scrollHeight = box.height;
                    }
                }
            }


            boxModel.scrollWidth = scrollWidth;
            boxModel.scrollHeight = scrollHeight;
        };

        function vertical(items, clientRect, spaceX, spaceY) {

            var y = 0,

                width = clientRect.width,
                height = clientRect.height,

                boxModel = this.__boxModel,
                scrollWidth = boxModel.scrollWidth,
                scrollHeight = boxModel.scrollHeight;


            for (var i = 0, length = items.length; i < length; i++)
            {
                var item = items[i],
                    box = item.__boxModel;

                if (box.visible = (item.visibility !== "collapsed"))
                {
                    box.measure(0, y, 0, 0, width, height - y, width);

                    if (box.width > scrollWidth)
                    {
                        scrollWidth = box.width;
                    }

                    if ((y = box.bottom + box.margin.bottom) > scrollHeight)
                    {
                        scrollHeight = y;
                    }

                    y += spaceY;
                }
            }


            boxModel.scrollWidth = scrollWidth;
            boxModel.scrollHeight = scrollHeight;
        };


        //注册线性布局
        flyingon.registry_layout("line", function (items, clientRect, vertical, spaceX, spaceY) {

            (vertical ? horizontal : vertical).call(this, items, clientRect, spaceX, spaceY);
        });


    })(flyingon);


})(flyingon);