/*

定义样式

注1: 使用类css选择器样式字符串
注2: 子类直接继承父类控件样式
注3: 注意选择器权重(与css相仿)
注4: class样式书写顺序无所谓,同一个对象应用多个class时后置优先
注5: 伪类优先级 selection > enabled, disabled > active > hover > focus > checked 
注6: 仅 writingMode, align, textAlign ... 支持继承
注7: font, background, margin, border, padding可分子属性设置样式, 但不支持与其它样式的子属性合并 如: .class1 { marginLeft: 10 } .class2 { marginTop: 10 } 在优先应用.class2样式时不使用.class1的marginLeft属性值 


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


    /*

    注1. 可使用flyingon.LinearGradient创建线性渐变颜色
    注2. 可使用flyingon.RadialGradient创建径向渐变颜色
    注3. 可使用flyingon.ImagePattern创建图像背景

    */


    //缓存定义样式方法
    var defineStyle = flyingon.defineStyle;


    //示例
    defineStyle("*:hover", {

 
    });


})(flyingon);