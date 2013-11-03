/*
枚举定义
*/
(function ($) {



    //显示方式
    $.Visibility = {

        //显示
        visible: "visible",

        //不显示但保留占位
        hidden: "hidden",

        //不显示也不占位
        collapsed: "collapsed"

    };



    //停靠方式
    $.Dock = {

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



    //拉伸方式
    $.Stretch = {

        //不拉伸
        none: "n",

        //水平拉伸
        horizontal: "x",

        //垂直拉伸
        vertical: "y",

        //全部拉伸
        all: "xy"

    };



    //水平对齐方式
    $.HorizontalAlign = {

        //左对齐
        left: "left",

        //居中对齐
        center: "center",

        //右对齐
        right: "right"

    };



    //垂直对齐方式
    $.VerticalAlign = {

        //顶部对齐
        top: "top",

        //居中对齐
        center: "center",

        //底部对齐
        bottom: "bottom"

    };




    //布局方式
    $.Layout = {

        //单行排列
        row: "row",

        //单列排列
        column: "column",

        //多行排列
        rows: "rows",

        //多列排列
        columns: "columns",

        //停靠
        dock: "dock",

        //单页显示
        page: "page",

        //风格排列
        grid: "grid",

        //表格排列
        table: "table",

        //绝对定义
        absolute: "absolute",

        //自定义
        custom: "custom"

    };



    //滚动条显示方式
    $.ScrollBarVisibility = {

        //自动显示或隐藏
        auto: "auto",

        //总是显示
        always: "always",

        //从不显示
        never: "never"

    };

    


})(flyingon);
