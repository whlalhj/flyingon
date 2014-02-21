/// <reference path="../js/flyingon.js" />


/*
定义系统字体
可使用flyingon.Font创建字体 可使用字体派生功能从一已存在的字体派生出新的字体
*/
(function (flyingon) {


    var normal = new flyingon.Font("normal", "normal", "normal", 12, "微软雅黑,宋体,Times New Roman");

    flyingon.defineFonts({

        //普通字体
        normal: normal,

        //粗体
        bold: normal.derive_bold(),

        //斜体
        italic: normal.derive_italic(),

        //粗斜体
        bold_italic: normal.derive_bold_italic()
    });


})(flyingon);





/*
定义系统颜色
1. 可使用flyingon.LinearGradient创建线性渐变色
2. 可使用flyingon.RadialGradient创建径向渐变色
3. 可使用flyingon.ImagePattern创建图像背景
*/
(function (flyingon) {


    flyingon.defineColors({


        "control-back": "#888888",

        "control-text": "#000000",

        "control-border": "blue",


        "input-back": "#FFFFFF",

        "input-text": "#000000",

        "input-border": "#CCCCCC",


        "checked-back": "#FFFFFF",

        "checked-text": "#000000",

        "checked-border": "#CCCCCC",


        "focus-back": "#FFFFFF",

        "focus-text": "#000000",

        "focus-border": "#CCCCCC",


        "hover-back": "#AAAAAA",

        "hover-text": "#000000",

        "hover-border": "#CCCCCC",


        "active-back": "#888888",

        "active-text": "#222222",

        "active-border": "#222222",


        "disabled-back": "#888888",

        "disabled-text": "#222222",

        "disabled-border": "#222222",


        "dark-back": "#888888",

        "dark-text": "#000000",

        "dark-border": "#444444",


        "hightlight-back": "#FFFFFF",

        "hightlight-text": "#000000",

        "hightlight-border": "#CCCCCC",



        "scrollbar-arrow-back": "control-back",

        "scrollbar-slider-back": "control-back",


        "button-background": new flyingon.LinearGradient(0, 0, 0, 1, [[0, "skyblue"], [0.5, "blue"], [0.5, "blue"], [1, "skyblue"]]),


        "window-title-background": new flyingon.LinearGradient(0, 0, 0, 1, [[0, "skyblue"], [0.5, "blue"], [0.5, "blue"], [1, "skyblue"]])

    });


})(flyingon);





/*
定义系统图片
*/
(function (flyingon) {


    flyingon.defineImages({

        //窗口图标
        "window-icon": "data:image/gif,base64,R0lGODlhEgASAMQVAOjo6Pb29s3NzSwsLNLS0l5eXsXFxTExMWFhYcHBweLi4s7Ozt/f3/r6+tnZ2f39/dTU1Hp6epubmwAAAP///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAABUALAAAAAASABIAAAVVYCWOZGmeaKquqOS+sHRKVG3b0XzvuSk9wAci+OiVJI1kY6JQGkmSQOAwqRakz5EEwF1MBAICICuSMM6MgQFNrkgccHgi3pZA7nh8O8Lv+9ssgYKBIQA7",

        //窗口关闭按钮
        "window-close": "data:image/gif,base64,R0lGODlhEgASAMQVAOjo6Pb29s3NzSwsLNLS0l5eXsXFxTExMWFhYcHBweLi4s7Ozt/f3/r6+tnZ2f39/dTU1Hp6epubmwAAAP///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAABUALAAAAAASABIAAAVVYCWOZGmeaKquqOS+sHRKVG3b0XzvuSk9wAci+OiVJI1kY6JQGkmSQOAwqRakz5EEwF1MBAICICuSMM6MgQFNrkgccHgi3pZA7nh8O8Lv+9ssgYKBIQA7",

        //鼠标划过时窗口关闭按钮
        "window-close-hover": "data:image/gif,base64,R0lGODlhEgASAMQRAOjo6N/f3wAAAMXFxVlZWcbGxsrKyi4uLtTU1Pb29tnZ2f39/dDQ0Pr6+pubm4mJif///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAABEALAAAAAASABIAAAVQYCSOZGmeaKqu6OO+8HM+TG3bzozsPJ+bD4VwOPyVHoHCYGkIOI2kBwBwEFgJU+jokeh6vVrRo0Eul8ORx2LNZqMfkLhcjnbY73g0a8/fhwAAOw==",

        //窗口最小化按钮
        "window-minimize": "data:image/gif,base64,R0lGODlhEgASAMQVAOjo6Pb29s3NzSwsLNLS0l5eXsXFxTExMWFhYcHBweLi4s7Ozt/f3/r6+tnZ2f39/dTU1Hp6epubmwAAAP///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAABUALAAAAAASABIAAAVVYCWOZGmeaKquqOS+sHRKVG3b0XzvuSk9wAci+OiVJI1kY6JQGkmSQOAwqRakz5EEwF1MBAICICuSMM6MgQFNrkgccHgi3pZA7nh8O8Lv+9ssgYKBIQA7",

        //鼠标划过时窗口最小化按钮
        "window-minimize-hover": "data:image/gif,base64,R0lGODlhEgASAMQRAOjo6N/f3wAAAMXFxVlZWcbGxsrKyi4uLtTU1Pb29tnZ2f39/dDQ0Pr6+pubm4mJif///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAABEALAAAAAASABIAAAVQYCSOZGmeaKqu6OO+8HM+TG3bzozsPJ+bD4VwOPyVHoHCYGkIOI2kBwBwEFgJU+jokeh6vVrRo0Eul8ORx2LNZqMfkLhcjnbY73g0a8/fhwAAOw==",

        //窗口最大化按钮
        "window-maximize": "data:image/gif,base64,R0lGODlhEgASAMQVAOjo6Pb29s3NzSwsLNLS0l5eXsXFxTExMWFhYcHBweLi4s7Ozt/f3/r6+tnZ2f39/dTU1Hp6epubmwAAAP///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAABUALAAAAAASABIAAAVVYCWOZGmeaKquqOS+sHRKVG3b0XzvuSk9wAci+OiVJI1kY6JQGkmSQOAwqRakz5EEwF1MBAICICuSMM6MgQFNrkgccHgi3pZA7nh8O8Lv+9ssgYKBIQA7",

        //鼠标划过时窗口最大化按钮
        "window-maximize-hover": "data:image/gif,base64,R0lGODlhEgASAMQRAOjo6N/f3wAAAMXFxVlZWcbGxsrKyi4uLtTU1Pb29tnZ2f39/dDQ0Pr6+pubm4mJif///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAABEALAAAAAASABIAAAVQYCSOZGmeaKqu6OO+8HM+TG3bzozsPJ+bD4VwOPyVHoHCYGkIOI2kBwBwEFgJU+jokeh6vVrRo0Eul8ORx2LNZqMfkLhcjnbY73g0a8/fhwAAOw==",



        //向左箭头图标
        "arrow-left": "data:image/gif,base64,R0lGODlhEgASAMQVAOjo6Pb29s3NzSwsLNLS0l5eXsXFxTExMWFhYcHBweLi4s7Ozt/f3/r6+tnZ2f39/dTU1Hp6epubmwAAAP///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAABUALAAAAAASABIAAAVVYCWOZGmeaKquqOS+sHRKVG3b0XzvuSk9wAci+OiVJI1kY6JQGkmSQOAwqRakz5EEwF1MBAICICuSMM6MgQFNrkgccHgi3pZA7nh8O8Lv+9ssgYKBIQA7",

        //鼠标划过时向左箭头图标
        "arrow-left-hover": "data:image/gif,base64,R0lGODlhEgASAMQRAOjo6N/f3wAAAMXFxVlZWcbGxsrKyi4uLtTU1Pb29tnZ2f39/dDQ0Pr6+pubm4mJif///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAABEALAAAAAASABIAAAVQYCSOZGmeaKqu6OO+8HM+TG3bzozsPJ+bD4VwOPyVHoHCYGkIOI2kBwBwEFgJU+jokeh6vVrRo0Eul8ORx2LNZqMfkLhcjnbY73g0a8/fhwAAOw==",

        //向上箭头图标
        "arrow-up": "data:image/gif,base64,R0lGODlhEgASAMQVAOjo6Pb29s3NzSwsLNLS0l5eXsXFxTExMWFhYcHBweLi4s7Ozt/f3/r6+tnZ2f39/dTU1Hp6epubmwAAAP///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAABUALAAAAAASABIAAAVVYCWOZGmeaKquqOS+sHRKVG3b0XzvuSk9wAci+OiVJI1kY6JQGkmSQOAwqRakz5EEwF1MBAICICuSMM6MgQFNrkgccHgi3pZA7nh8O8Lv+9ssgYKBIQA7",

        //鼠标划过时向上箭头图标
        "arrow-up-hover": "data:image/gif,base64,R0lGODlhEgASAMQRAOjo6N/f3wAAAMXFxVlZWcbGxsrKyi4uLtTU1Pb29tnZ2f39/dDQ0Pr6+pubm4mJif///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAABEALAAAAAASABIAAAVQYCSOZGmeaKqu6OO+8HM+TG3bzozsPJ+bD4VwOPyVHoHCYGkIOI2kBwBwEFgJU+jokeh6vVrRo0Eul8ORx2LNZqMfkLhcjnbY73g0a8/fhwAAOw==",

        //向右箭头图标
        "arrow-right": "data:image/gif,base64,R0lGODlhEgASAMQVAOjo6Pb29s3NzSwsLNLS0l5eXsXFxTExMWFhYcHBweLi4s7Ozt/f3/r6+tnZ2f39/dTU1Hp6epubmwAAAP///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAABUALAAAAAASABIAAAVVYCWOZGmeaKquqOS+sHRKVG3b0XzvuSk9wAci+OiVJI1kY6JQGkmSQOAwqRakz5EEwF1MBAICICuSMM6MgQFNrkgccHgi3pZA7nh8O8Lv+9ssgYKBIQA7",

        //鼠标划过时向右箭头图标
        "arrow-right-hover": "data:image/gif,base64,R0lGODlhEgASAMQRAOjo6N/f3wAAAMXFxVlZWcbGxsrKyi4uLtTU1Pb29tnZ2f39/dDQ0Pr6+pubm4mJif///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAABEALAAAAAASABIAAAVQYCSOZGmeaKqu6OO+8HM+TG3bzozsPJ+bD4VwOPyVHoHCYGkIOI2kBwBwEFgJU+jokeh6vVrRo0Eul8ORx2LNZqMfkLhcjnbY73g0a8/fhwAAOw==",

        //向下箭头图标
        "arrow-down": "data:image/gif,base64,R0lGODlhEgASAMQVAOjo6Pb29s3NzSwsLNLS0l5eXsXFxTExMWFhYcHBweLi4s7Ozt/f3/r6+tnZ2f39/dTU1Hp6epubmwAAAP///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAABUALAAAAAASABIAAAVVYCWOZGmeaKquqOS+sHRKVG3b0XzvuSk9wAci+OiVJI1kY6JQGkmSQOAwqRakz5EEwF1MBAICICuSMM6MgQFNrkgccHgi3pZA7nh8O8Lv+9ssgYKBIQA7",

        //鼠标划过时向下箭头图标
        "arrow-down-hover": "data:image/gif,base64,R0lGODlhEgASAMQRAOjo6N/f3wAAAMXFxVlZWcbGxsrKyi4uLtTU1Pb29tnZ2f39/dDQ0Pr6+pubm4mJif///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAABEALAAAAAASABIAAAVQYCSOZGmeaKqu6OO+8HM+TG3bzozsPJ+bD4VwOPyVHoHCYGkIOI2kBwBwEFgJU+jokeh6vVrRo0Eul8ORx2LNZqMfkLhcjnbY73g0a8/fhwAAOw==",

        //滚动条滑块图标
        "scroll-slider": "data:image/gif,base64,R0lGODlhEgASAMQVAOjo6Pb29s3NzSwsLNLS0l5eXsXFxTExMWFhYcHBweLi4s7Ozt/f3/r6+tnZ2f39/dTU1Hp6epubmwAAAP///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAABUALAAAAAASABIAAAVVYCWOZGmeaKquqOS+sHRKVG3b0XzvuSk9wAci+OiVJI1kY6JQGkmSQOAwqRakz5EEwF1MBAICICuSMM6MgQFNrkgccHgi3pZA7nh8O8Lv+9ssgYKBIQA7",

        //鼠标划过时滚动条滑块图标
        "scroll-slider-hover": "data:image/gif,base64,R0lGODlhEgASAMQRAOjo6N/f3wAAAMXFxVlZWcbGxsrKyi4uLtTU1Pb29tnZ2f39/dDQ0Pr6+pubm4mJif///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAABEALAAAAAASABIAAAVQYCSOZGmeaKqu6OO+8HM+TG3bzozsPJ+bD4VwOPyVHoHCYGkIOI2kBwBwEFgJU+jokeh6vVrRo0Eul8ORx2LNZqMfkLhcjnbY73g0a8/fhwAAOw==",




        //选择选中图标
        "check-checked": "data:image/gif,base64,R0lGODlhEgASAMQVAOjo6Pb29s3NzSwsLNLS0l5eXsXFxTExMWFhYcHBweLi4s7Ozt/f3/r6+tnZ2f39/dTU1Hp6epubmwAAAP///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAABUALAAAAAASABIAAAVVYCWOZGmeaKquqOS+sHRKVG3b0XzvuSk9wAci+OiVJI1kY6JQGkmSQOAwqRakz5EEwF1MBAICICuSMM6MgQFNrkgccHgi3pZA7nh8O8Lv+9ssgYKBIQA7",

        //捕获焦点时选择选中图标
        "check-checked-focus": "data:image/gif,base64,R0lGODlhEgASAMQRAOjo6N/f3wAAAMXFxVlZWcbGxsrKyi4uLtTU1Pb29tnZ2f39/dDQ0Pr6+pubm4mJif///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAABEALAAAAAASABIAAAVQYCSOZGmeaKqu6OO+8HM+TG3bzozsPJ+bD4VwOPyVHoHCYGkIOI2kBwBwEFgJU+jokeh6vVrRo0Eul8ORx2LNZqMfkLhcjnbY73g0a8/fhwAAOw==",

        //鼠标划过时选择选中图标
        "check-checked-hover": "data:image/gif,base64,R0lGODlhEgASAMQRAOjo6N/f3wAAAMXFxVlZWcbGxsrKyi4uLtTU1Pb29tnZ2f39/dDQ0Pr6+pubm4mJif///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAABEALAAAAAASABIAAAVQYCSOZGmeaKqu6OO+8HM+TG3bzozsPJ+bD4VwOPyVHoHCYGkIOI2kBwBwEFgJU+jokeh6vVrRo0Eul8ORx2LNZqMfkLhcjnbY73g0a8/fhwAAOw==",

        //选择未选中图标
        "check-unchecked": "data:image/gif,base64,R0lGODlhEgASAMQVAOjo6Pb29s3NzSwsLNLS0l5eXsXFxTExMWFhYcHBweLi4s7Ozt/f3/r6+tnZ2f39/dTU1Hp6epubmwAAAP///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAABUALAAAAAASABIAAAVVYCWOZGmeaKquqOS+sHRKVG3b0XzvuSk9wAci+OiVJI1kY6JQGkmSQOAwqRakz5EEwF1MBAICICuSMM6MgQFNrkgccHgi3pZA7nh8O8Lv+9ssgYKBIQA7",

        //捕获焦点时选择未选中图标
        "check-unchecked-focus": "data:image/gif,base64,R0lGODlhEgASAMQRAOjo6N/f3wAAAMXFxVlZWcbGxsrKyi4uLtTU1Pb29tnZ2f39/dDQ0Pr6+pubm4mJif///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAABEALAAAAAASABIAAAVQYCSOZGmeaKqu6OO+8HM+TG3bzozsPJ+bD4VwOPyVHoHCYGkIOI2kBwBwEFgJU+jokeh6vVrRo0Eul8ORx2LNZqMfkLhcjnbY73g0a8/fhwAAOw==",

        //鼠标划过时选择未选中图标
        "check-unchecked-hover": "data:image/gif,base64,R0lGODlhEgASAMQVAOjo6Pb29s3NzSwsLNLS0l5eXsXFxTExMWFhYcHBweLi4s7Ozt/f3/r6+tnZ2f39/dTU1Hp6epubmwAAAP///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAABUALAAAAAASABIAAAVVYCWOZGmeaKquqOS+sHRKVG3b0XzvuSk9wAci+OiVJI1kY6JQGkmSQOAwqRakz5EEwF1MBAICICuSMM6MgQFNrkgccHgi3pZA7nh8O8Lv+9ssgYKBIQA7",

        //选择未知选择图标
        "check-unkown": "data:image/gif,base64,R0lGODlhEgASAMQVAOjo6Pb29s3NzSwsLNLS0l5eXsXFxTExMWFhYcHBweLi4s7Ozt/f3/r6+tnZ2f39/dTU1Hp6epubmwAAAP///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAABUALAAAAAASABIAAAVVYCWOZGmeaKquqOS+sHRKVG3b0XzvuSk9wAci+OiVJI1kY6JQGkmSQOAwqRakz5EEwF1MBAICICuSMM6MgQFNrkgccHgi3pZA7nh8O8Lv+9ssgYKBIQA7",

        //捕获焦点时选择未知选择图标
        "check-unkown-focus": "data:image/gif,base64,R0lGODlhEgASAMQVAOjo6Pb29s3NzSwsLNLS0l5eXsXFxTExMWFhYcHBweLi4s7Ozt/f3/r6+tnZ2f39/dTU1Hp6epubmwAAAP///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAABUALAAAAAASABIAAAVVYCWOZGmeaKquqOS+sHRKVG3b0XzvuSk9wAci+OiVJI1kY6JQGkmSQOAwqRakz5EEwF1MBAICICuSMM6MgQFNrkgccHgi3pZA7nh8O8Lv+9ssgYKBIQA7",

        //鼠标划过时选择未知选择图标
        "check-unkown-hover": "data:image/gif,base64,R0lGODlhEgASAMQVAOjo6Pb29s3NzSwsLNLS0l5eXsXFxTExMWFhYcHBweLi4s7Ozt/f3/r6+tnZ2f39/dTU1Hp6epubmwAAAP///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAABUALAAAAAASABIAAAVVYCWOZGmeaKquqOS+sHRKVG3b0XzvuSk9wAci+OiVJI1kY6JQGkmSQOAwqRakz5EEwF1MBAICICuSMM6MgQFNrkgccHgi3pZA7nh8O8Lv+9ssgYKBIQA7",



        //单选选中图标
        "radio-checked": "data:image/gif,base64,R0lGODlhEgASAMQVAOjo6Pb29s3NzSwsLNLS0l5eXsXFxTExMWFhYcHBweLi4s7Ozt/f3/r6+tnZ2f39/dTU1Hp6epubmwAAAP///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAABUALAAAAAASABIAAAVVYCWOZGmeaKquqOS+sHRKVG3b0XzvuSk9wAci+OiVJI1kY6JQGkmSQOAwqRakz5EEwF1MBAICICuSMM6MgQFNrkgccHgi3pZA7nh8O8Lv+9ssgYKBIQA7",

        //捕获焦点时单选选中图标
        "radio-checked-focus": "data:image/gif,base64,R0lGODlhEgASAMQVAOjo6Pb29s3NzSwsLNLS0l5eXsXFxTExMWFhYcHBweLi4s7Ozt/f3/r6+tnZ2f39/dTU1Hp6epubmwAAAP///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAABUALAAAAAASABIAAAVVYCWOZGmeaKquqOS+sHRKVG3b0XzvuSk9wAci+OiVJI1kY6JQGkmSQOAwqRakz5EEwF1MBAICICuSMM6MgQFNrkgccHgi3pZA7nh8O8Lv+9ssgYKBIQA7",

        //鼠标划过时单选选中图标
        "radio-checked-hover": "data:image/gif,base64,R0lGODlhEgASAMQVAOjo6Pb29s3NzSwsLNLS0l5eXsXFxTExMWFhYcHBweLi4s7Ozt/f3/r6+tnZ2f39/dTU1Hp6epubmwAAAP///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAABUALAAAAAASABIAAAVVYCWOZGmeaKquqOS+sHRKVG3b0XzvuSk9wAci+OiVJI1kY6JQGkmSQOAwqRakz5EEwF1MBAICICuSMM6MgQFNrkgccHgi3pZA7nh8O8Lv+9ssgYKBIQA7",

        //单选未选中图标
        "radio-unchecked": "data:image/gif,base64,R0lGODlhEgASAMQVAOjo6Pb29s3NzSwsLNLS0l5eXsXFxTExMWFhYcHBweLi4s7Ozt/f3/r6+tnZ2f39/dTU1Hp6epubmwAAAP///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAABUALAAAAAASABIAAAVVYCWOZGmeaKquqOS+sHRKVG3b0XzvuSk9wAci+OiVJI1kY6JQGkmSQOAwqRakz5EEwF1MBAICICuSMM6MgQFNrkgccHgi3pZA7nh8O8Lv+9ssgYKBIQA7",

        //捕获焦点时单选未选中图标
        "radio-unchecked-focus": "data:image/gif,base64,R0lGODlhEgASAMQVAOjo6Pb29s3NzSwsLNLS0l5eXsXFxTExMWFhYcHBweLi4s7Ozt/f3/r6+tnZ2f39/dTU1Hp6epubmwAAAP///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAABUALAAAAAASABIAAAVVYCWOZGmeaKquqOS+sHRKVG3b0XzvuSk9wAci+OiVJI1kY6JQGkmSQOAwqRakz5EEwF1MBAICICuSMM6MgQFNrkgccHgi3pZA7nh8O8Lv+9ssgYKBIQA7",

        //鼠标划过时单选未选中图标
        "radio-unchecked-hover": "data:image/gif,base64,R0lGODlhEgASAMQVAOjo6Pb29s3NzSwsLNLS0l5eXsXFxTExMWFhYcHBweLi4s7Ozt/f3/r6+tnZ2f39/dTU1Hp6epubmwAAAP///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAABUALAAAAAASABIAAAVVYCWOZGmeaKquqOS+sHRKVG3b0XzvuSk9wAci+OiVJI1kY6JQGkmSQOAwqRakz5EEwF1MBAICICuSMM6MgQFNrkgccHgi3pZA7nh8O8Lv+9ssgYKBIQA7",

        //单选未知选择图标
        "radio-unkown": "data:image/gif,base64,R0lGODlhEgASAMQVAOjo6Pb29s3NzSwsLNLS0l5eXsXFxTExMWFhYcHBweLi4s7Ozt/f3/r6+tnZ2f39/dTU1Hp6epubmwAAAP///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAABUALAAAAAASABIAAAVVYCWOZGmeaKquqOS+sHRKVG3b0XzvuSk9wAci+OiVJI1kY6JQGkmSQOAwqRakz5EEwF1MBAICICuSMM6MgQFNrkgccHgi3pZA7nh8O8Lv+9ssgYKBIQA7",

        //捕获焦点时单选未知选择图标
        "radio-unkown-focus": "data:image/gif,base64,R0lGODlhEgASAMQVAOjo6Pb29s3NzSwsLNLS0l5eXsXFxTExMWFhYcHBweLi4s7Ozt/f3/r6+tnZ2f39/dTU1Hp6epubmwAAAP///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAABUALAAAAAASABIAAAVVYCWOZGmeaKquqOS+sHRKVG3b0XzvuSk9wAci+OiVJI1kY6JQGkmSQOAwqRakz5EEwF1MBAICICuSMM6MgQFNrkgccHgi3pZA7nh8O8Lv+9ssgYKBIQA7",

        //鼠标划过时单选未知选择图标
        "radio-unkown-hover": "data:image/gif,base64,R0lGODlhEgASAMQVAOjo6Pb29s3NzSwsLNLS0l5eXsXFxTExMWFhYcHBweLi4s7Ozt/f3/r6+tnZ2f39/dTU1Hp6epubmwAAAP///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAABUALAAAAAASABIAAAVVYCWOZGmeaKquqOS+sHRKVG3b0XzvuSk9wAci+OiVJI1kY6JQGkmSQOAwqRakz5EEwF1MBAICICuSMM6MgQFNrkgccHgi3pZA7nh8O8Lv+9ssgYKBIQA7",



        //树收拢图标
        "tree-collapse": "data:image/gif,base64,R0lGODlhEgASAMQVAOjo6Pb29s3NzSwsLNLS0l5eXsXFxTExMWFhYcHBweLi4s7Ozt/f3/r6+tnZ2f39/dTU1Hp6epubmwAAAP///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAABUALAAAAAASABIAAAVVYCWOZGmeaKquqOS+sHRKVG3b0XzvuSk9wAci+OiVJI1kY6JQGkmSQOAwqRakz5EEwF1MBAICICuSMM6MgQFNrkgccHgi3pZA7nh8O8Lv+9ssgYKBIQA7",

        //树展开图标
        "tree-expand": "data:image/gif,base64,R0lGODlhEgASAMQVAOjo6Pb29s3NzSwsLNLS0l5eXsXFxTExMWFhYcHBweLi4s7Ozt/f3/r6+tnZ2f39/dTU1Hp6epubmwAAAP///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAABUALAAAAAASABIAAAVVYCWOZGmeaKquqOS+sHRKVG3b0XzvuSk9wAci+OiVJI1kY6JQGkmSQOAwqRakz5EEwF1MBAICICuSMM6MgQFNrkgccHgi3pZA7nh8O8Lv+9ssgYKBIQA7"

    });


})(flyingon);






/*

定义样式

注1: 使用类css选择器样式字符串
注2: 子类直接继承父类控件样式
注3: 注意控件的继承顺序 父类在前子类后面 否则子类样式可能无法应用


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


    //缓存定义样式方法
    var $ = flyingon.defineStyle;



    //默认样式
    $("*", {

        width: "default", //宽度 default|fill|auto|number|number%
        height: "default", //高度 default|fill|auto|number|number%
        background: "control-back",
        foreground: "control-text",
        borderColor: "control-border"
    });

    //选中时控件默认样式
    $("*:checked", {

        background: "checked-back",
        foreground: "checked-text",
        borderColor: "checked-border"
    });

    //获取焦点时控件默认样式
    $("*:focus", {

        background: "focus-back",
        foreground: "focus-text",
        borderColor: "focus-border"
    });


    //捕获鼠标时控件默认样式
    $("*:hover", {

        background: "hover-back",
        foreground: "hover-text",
        borderColor: "hover-border"
    });

    //活动状态时控件默认样式
    $("*:active", {

        background: "active-back",
        foreground: "active-text",
        borderColor: "active-border"
    });

    //禁用时控件默认样式
    $("*:disabled", {

        background: "disabled-back",
        foreground: "disabled-text",
        borderColor: "disabled-border"
    });




    //滚动条样式
    $("ScrollBase", {

        background: "dark-back",
    }, "*");

    //滚动条样式
    $("ScrollBase:hover", {

        background: "yellow"
    });




    //内容控件样式
    $("ContentControl", {

    });



    //面板控件样式
    $("Panel", {

    });



    //文本框样式
    $("TextBoxBase", {

        background: "input-back",
        foreground: "input-text",
        borderColor: "input-border",
        border: 1,
        borderRadius: 0,
        cursor: "text"
    });

    $("TextBoxBase:hover", {

        decorates: [{

            type: "Rectangle",
            strokeStyle: "control-border",
            fillStyle: "input-back",
            children: [{

                type: "RoundRectangle",
                offset: [2, 2, 2, 2],
                anticlockwise: true
            }]
        }]
    });



    //文本框样式
    $("ListBox", {

    });



    //文本框样式
    $("Button", {

        background: "button-background",
        cursor: "pointer"
    });


    $("WindowBase", {

        background: "input-back",
        foreground: "input-text",
        borderColor: "input-border",
        border: 1,
        borderRadius: 0
    });

    $("Window", {

    });

    $("WindowTitleBar", {

        width: "fill",
        height: "fill",
        background: "window-title-background",
        border: 1
    });


    $("ChildWindow", {

    });


})(flyingon);



