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



    //拉伸方式
    flyingon.Stretch = {

        //不拉伸
        no: "no",

        //宽度拉伸
        width: "width",

        //高度拉伸
        height: "height",

        //全部拉伸
        all: "all"

    };



    //自动调整大小方式
    flyingon.AutoSize = {

        //不调整
        no: "no",

        //宽度调整
        width: "width",

        //高度调整
        height: "height",

        //全部调整
        all: "all"

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
    flyingon.ScrollBarVisibility = {

        //自动显示或隐藏
        auto: "auto",

        //总是显示
        always: "always",

        //从不显示
        never: "never"

    };

    


})(flyingon);
