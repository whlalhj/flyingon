/*
枚举定义
*/
(function (flyingon) {



    //显示方式
    flyingon.Visibility = {

        //显示
        visible: "visible",

        //不显示但保留占位
        hidden: "hidden",

        //不显示也不占位
        collapsed: "collapsed"

    };



    //停靠方式
    flyingon.Dock = {

        //左
        left: "left",

        //顶
        top: "top",

        //右
        right: "right",

        //底
        bottom: "bottom",

        //充满
        fill: "fill"

    };



    //水平对齐方式
    flyingon.HorizontalAlign = {

        //左对齐
        left: "left",

        //居中对齐
        center: "center",

        //右对齐
        right: "right"

    };



    //垂直对齐方式
    flyingon.VerticalAlign = {

        //顶部对齐
        top: "top",

        //居中对齐
        center: "center",

        //底部对齐
        bottom: "bottom"

    };




    //布局方式
    flyingon.Layout = {

        //线性布局
        line: "line",

        //流式布局
        flow: "flow",

        //单个显示
        single: "single",

        //停靠布局
        dock: "dock",

        //队列布局
        queue: "queue",

        //网格布局
        grid: "grid",

        //绝对定位
        absolute: "absolute"
    };



    //滚动条显示方式
    flyingon.ScrollBarVisibility = {

        //自动显示或隐藏
        auto: "auto",

        //总是显示
        always: "always",

        //从不显示
        never: "never"

    };

    


})(flyingon);
