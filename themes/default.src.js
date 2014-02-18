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


        "window-back": "#FFFFFF",

        "window-text": "#000000",

        "window-border": "#CCCCCC",


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

*/
(function (flyingon) {


    //缓存定义样式方法
    var $ = flyingon.defineStyle;



    //滚动条样式
    $("ScrollBase", {

        background: "dark-back",
    }, "*");

    //滚动条样式
    $("ScrollBase:hover", {

        background: "yellow"
    });


    $(".scrollbar-arrow", {

        background: "control-back"
    });

    $(".scrollbar-arrow-left", {

        image: null
    });

    $(".scrollbar-arrow-top", {

        image: null
    });

    $(".scrollbar-arrow-right", {

        image: null
    });

    $(".scrollbar-arrow-bottom", {

        image: null
    });

    $(".scrollbar-slider", {

        background: null,
        image: null
    });



    //内容控件样式
    $("ContentControl", {

    });



    //面板控件样式
    $("Panel", {

    });



    //文本框样式
    $("TextBoxBase", {

        background: "window-back",
        border: 1,
        cursor: "text"
    });

    $("TextBoxBase:hover", {

        decorates: [{

            type: "Rectangle",
            strokeStyle: "control-border",
            fillStyle: "window-back",
            children: [{

                type: "RoundRectangle",
                offset: [2, 2, 2, 2],
                anticlockwise: true
            }]
        }]
    });



    //文本框样式
    $("ListBox", {

        background: "window-back",
        border: 1
    });



    //文本框样式
    $("Button", {

        background: "button-background",
        border: 1,
        borderRadius: 0,
        cursor: "pointer"
    });



    $("Window", {

        background: "window-back"
    });

    $(".window-icon", {

        image: "window-icon"
    });

    $(".window-close", {

        image: "window-close"
    });

    $(".window-close:hover", {

        background: "white",
        image: "window-close-hover"
    });

    $(".window-maximize", {

        image: "window-maximize"
    });

    $(".window-maximize:hover", {

        background: "white",
        image: "window-maximize-hover"
    });

    $(".window-minimize", {

        image: "window-minimize"
    });

    $(".window-minimize:hover", {

        background: "white",
        image: "window-minimize-hover"
    });


    $("WindowTitleBar", {

        width: "fill",
        height: "fill",
        background: "window-title-background",
        border: 1
    });


    $("ChildWindow", {

        background: "window-back",
        border: 1
    });


})(flyingon);



