/// <reference path="../js/flyingon.js" />




/*

定义样式

注1: 使用类css选择器样式字符串
注2: 子类直接继承父类控件样式
注3: 注意选择器权重(与css相仿)
注4: 伪类优先级 selection > enabled, disabled > active > hover > focus > checked 


支持的伪类如下:
    
E:active        匹配鼠标已经其上按下、还没有释放的E元素
E:hover         匹配鼠标悬停其上的E元素
E:focus         匹配获得当前焦点的E元素
E:enabled       匹配表单中激活的元素
E:disabled      匹配表单中禁用的元素
E:checked       匹配表单中被选中的radio（单选框）或checkbox（复选框）元素
E:selection     匹配用户当前选中的元素
E:empty         匹配一个不包含任何子元素的元素，注意，文本节点也被看作子元素
    
E:before        E之前元素
E:after         E之后元素
    
E:nth-child(n)          匹配其父元素的第n个子元素，第一个编号为1
E:nth-last-child(n)     匹配其父元素的倒数第n个子元素，第一个编号为1
E:nth-of-type(n)        与:nth-child()作用类似，但是仅匹配使用同种标签的元素
E:nth-last-of-type(n)   与:nth-last-child() 作用类似，但是仅匹配使用同种标签的元素
E:first-child           匹配父元素的第一个子元素
E:last-child            匹配父元素的最后一个子元素，等同于:nth-last-child(1)
E:first-of-type         匹配父元素下使用同种标签的第一个子元素，等同于:nth-of-type(1)
E:last-of-type          匹配父元素下使用同种标签的最后一个子元素，等同于:nth-last-of-type(1)
E:only-child            匹配父元素下仅有的一个子元素，等同于:first-child:last-child或 :nth-child(1):nth-last-child(1)
E:only-of-type          匹配父元素下使用同种标签的唯一一个子元素，等同于:first-of-type:last-of-type或 :nth-of-type(1):nth-last-of-type(1)

*/
(function (flyingon) {




    //颜色可选值如下
    //#rrggbb                                                                           rgb颜色 与css规则相同
    //name                                                                              颜色名称 与css规则相同
    // rgb(0-255 | x%, 0-255 | x%, 0-255 | x%)                                          rgb颜色 与css规则相同
    //rgba(0-255 | x%, 0-255 | x%, 0-255 | x%, 0-1)                                     rgba颜色 与css规则相同
    // hsl(0-360, x%, x%)                                                               hsl颜色 与css规则相同
    //hsla(0-360, x%, x%, 0-1)                                                          hsla颜色 与css规则相同
    //linear(x1, y1, x2, y2, step1, color1, step2, color2[, ...])                       线性渐变颜色 x1,y1,x2,y2: 取值范围:0->1 "0, 0"表示控件左上角 "1, 1"表示控件右下角
    //radial(x1, y1, radius1, x2, y2, radius2, step1, color1, step2, color2[, ...])     径向渐变颜色 x1,y1,x2,y2: 取值范围:0->1 "0, 0"表示控件左上角 "1, 1"表示控件右下角
    //pattern(image, repeat|repeat-x|repeat-y|no-repeat)                                图像填充




    //缓存定义样式方法
    var defineStyle = flyingon.defineStyle;



    //默认样式
    defineStyle("*", {

        color: "#000000",
        borderColor: "blue"
    });

    //选中时控件默认样式
    defineStyle("*:checked", {

        borderColor: "#CCCCCC"
    });

    //获取焦点时控件默认样式
    defineStyle("*:focus", {

        borderColor: "#CCCCCC"
    });


    //捕获鼠标时控件默认样式
    defineStyle("*:hover", {

        borderColor: "#CCCCCC"
    });

    //活动状态时控件默认样式
    defineStyle("*:active", {

        borderColor: "#222222"
    });

    //禁用时控件默认样式
    defineStyle("*:disabled", {

        color: "#222222"
    });




    //横向滚动条
    defineStyle("ScrollBar", {

        backgroundColor: "silver"
    });


    //滚动条按钮
    defineStyle(".scrollbar-button:hover", {

        backgroundColor: "yellow"
    });

    //横向滚动条按钮
    defineStyle(".scrollbar-button-x", {

        margin: "0 1",
    });

    //纵向滚动条按钮
    defineStyle(".scrollbar-button-y", {

        margin: "1 0",
    });


    //滚动条滑块
    defineStyle(".scrollbar-block", {

        backgroundColor: "#666666",
    });

    defineStyle(".scrollbar-block:active", {

        backgroundColor: "red"
    });

    defineStyle(".scrollbar-block:hover", {

        backgroundColor: "yellow"
    });

    //横向滚动条滑块
    defineStyle(".scrollbar-block-x", {

        margin: "2 0"
    });

    //纵向滚动条滑块
    defineStyle(".scrollbar-block-y", {

        margin: "0 2"
    });


    //滚动条拐角
    defineStyle("ScrollCorner", {

        margin: 1
    });




    //内容控件样式
    defineStyle("ContentControl", {

    });



    //面板控件样式
    defineStyle("Panel", {

        overflowX: "auto",
        overflowY: "auto"
    });



    defineStyle("Window", {

    });


    defineStyle("ChildWindow", {

        backgroundColor: "white",
        border: "1px solid black",
        padding: 2
    });

    defineStyle(".window-header", {

        backgroundColor: "linear(0, 0, 0, 1, 0, skyblue, 0.5, blue, 0.5, blue, 1, skyblue)"
    });




    //文本框样式
    defineStyle("TextBoxBase", {

        backgroundColor: "#FFFFFF",
        border: "1 solid #CCCCCC",
        cursor: "text"
    });



    //文本框样式
    defineStyle("ListBox", {

    });



    //文本框样式
    defineStyle("Button", {

        backgroundColor: "linear(0, 0, 0, 1, 0, skyblue, 0.5, blue, 0.5, blue, 1, skyblue)",
        cursor: "pointer"
    });




})(flyingon);



