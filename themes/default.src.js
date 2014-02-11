//样式定义
(function (flyingon) {



    //结果对象
    var result = {};


    //当前语言
    var language = flyingon_setting.language;




    /*
    定义系统光标
    */
    (function (flyingon) {


        result.cursors = {

            "none": "none",

            "default": "default",

            "crosshair": "crosshair",

            "pointer": "pointer",

            "text": "text",

            "vertical-text": "vertical-text",

            "move": "move",

            "scroll": "all-scroll",

            "progress": "progress",

            "e-resize": "e-resize",

            "s-resize": "s-resize",

            "w-resize": "w-resize",

            "n-resize": "n-resize",

            "ne-resize": "ne-resize",

            "se-resize": "se-resize",

            "nw-resize": "nw-resize",

            "sw-resize": "sw-resize",

            "col-resize": "col-resize",

            "row-resize": "row-resize",

            "wait": "wait",

            "help": "help",

            "allow-drop": "move", //safari不支持copy

            "no-drop": "no-drop",

            "not-allowed": "not-allowed"

            //"zoom-in": "-webkit-zoom-in,-moz-zoom-in",

            //"zoom-out": "-webkit-zoom-out,-moz-zoom-out"

        };


    })(flyingon);




    /*
    定义系统图片
    */
    (function (flyingon) {


        var images = result.images = {

            //窗口图标
            "window-icon": "data:image/gif;base64,R0lGODlhEgASAMQVAOjo6Pb29s3NzSwsLNLS0l5eXsXFxTExMWFhYcHBweLi4s7Ozt/f3/r6+tnZ2f39/dTU1Hp6epubmwAAAP///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAABUALAAAAAASABIAAAVVYCWOZGmeaKquqOS+sHRKVG3b0XzvuSk9wAci+OiVJI1kY6JQGkmSQOAwqRakz5EEwF1MBAICICuSMM6MgQFNrkgccHgi3pZA7nh8O8Lv+9ssgYKBIQA7",

            //窗口关闭按钮
            "window-close": "data:image/gif;base64,R0lGODlhEgASAMQVAOjo6Pb29s3NzSwsLNLS0l5eXsXFxTExMWFhYcHBweLi4s7Ozt/f3/r6+tnZ2f39/dTU1Hp6epubmwAAAP///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAABUALAAAAAASABIAAAVVYCWOZGmeaKquqOS+sHRKVG3b0XzvuSk9wAci+OiVJI1kY6JQGkmSQOAwqRakz5EEwF1MBAICICuSMM6MgQFNrkgccHgi3pZA7nh8O8Lv+9ssgYKBIQA7",

            //鼠标划过时窗口关闭按钮
            "window-close-hover": "data:image/gif;base64,R0lGODlhEgASAMQRAOjo6N/f3wAAAMXFxVlZWcbGxsrKyi4uLtTU1Pb29tnZ2f39/dDQ0Pr6+pubm4mJif///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAABEALAAAAAASABIAAAVQYCSOZGmeaKqu6OO+8HM+TG3bzozsPJ+bD4VwOPyVHoHCYGkIOI2kBwBwEFgJU+jokeh6vVrRo0Eul8ORx2LNZqMfkLhcjnbY73g0a8/fhwAAOw==",

            //窗口最小化按钮
            "window-minimize": "data:image/gif;base64,R0lGODlhEgASAMQVAOjo6Pb29s3NzSwsLNLS0l5eXsXFxTExMWFhYcHBweLi4s7Ozt/f3/r6+tnZ2f39/dTU1Hp6epubmwAAAP///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAABUALAAAAAASABIAAAVVYCWOZGmeaKquqOS+sHRKVG3b0XzvuSk9wAci+OiVJI1kY6JQGkmSQOAwqRakz5EEwF1MBAICICuSMM6MgQFNrkgccHgi3pZA7nh8O8Lv+9ssgYKBIQA7",

            //鼠标划过时窗口最小化按钮
            "window-minimize-hover": "data:image/gif;base64,R0lGODlhEgASAMQRAOjo6N/f3wAAAMXFxVlZWcbGxsrKyi4uLtTU1Pb29tnZ2f39/dDQ0Pr6+pubm4mJif///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAABEALAAAAAASABIAAAVQYCSOZGmeaKqu6OO+8HM+TG3bzozsPJ+bD4VwOPyVHoHCYGkIOI2kBwBwEFgJU+jokeh6vVrRo0Eul8ORx2LNZqMfkLhcjnbY73g0a8/fhwAAOw==",

            //窗口最大化按钮
            "window-maximize": "data:image/gif;base64,R0lGODlhEgASAMQVAOjo6Pb29s3NzSwsLNLS0l5eXsXFxTExMWFhYcHBweLi4s7Ozt/f3/r6+tnZ2f39/dTU1Hp6epubmwAAAP///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAABUALAAAAAASABIAAAVVYCWOZGmeaKquqOS+sHRKVG3b0XzvuSk9wAci+OiVJI1kY6JQGkmSQOAwqRakz5EEwF1MBAICICuSMM6MgQFNrkgccHgi3pZA7nh8O8Lv+9ssgYKBIQA7",

            //鼠标划过时窗口最大化按钮
            "window-maximize-hover": "data:image/gif;base64,R0lGODlhEgASAMQRAOjo6N/f3wAAAMXFxVlZWcbGxsrKyi4uLtTU1Pb29tnZ2f39/dDQ0Pr6+pubm4mJif///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAABEALAAAAAASABIAAAVQYCSOZGmeaKqu6OO+8HM+TG3bzozsPJ+bD4VwOPyVHoHCYGkIOI2kBwBwEFgJU+jokeh6vVrRo0Eul8ORx2LNZqMfkLhcjnbY73g0a8/fhwAAOw==",



            //向左箭头图标
            "arrow-left": "data:image/gif;base64,R0lGODlhEgASAMQVAOjo6Pb29s3NzSwsLNLS0l5eXsXFxTExMWFhYcHBweLi4s7Ozt/f3/r6+tnZ2f39/dTU1Hp6epubmwAAAP///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAABUALAAAAAASABIAAAVVYCWOZGmeaKquqOS+sHRKVG3b0XzvuSk9wAci+OiVJI1kY6JQGkmSQOAwqRakz5EEwF1MBAICICuSMM6MgQFNrkgccHgi3pZA7nh8O8Lv+9ssgYKBIQA7",

            //鼠标划过时向左箭头图标
            "arrow-left-hover": "data:image/gif;base64,R0lGODlhEgASAMQRAOjo6N/f3wAAAMXFxVlZWcbGxsrKyi4uLtTU1Pb29tnZ2f39/dDQ0Pr6+pubm4mJif///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAABEALAAAAAASABIAAAVQYCSOZGmeaKqu6OO+8HM+TG3bzozsPJ+bD4VwOPyVHoHCYGkIOI2kBwBwEFgJU+jokeh6vVrRo0Eul8ORx2LNZqMfkLhcjnbY73g0a8/fhwAAOw==",

            //向上箭头图标
            "arrow-up": "data:image/gif;base64,R0lGODlhEgASAMQVAOjo6Pb29s3NzSwsLNLS0l5eXsXFxTExMWFhYcHBweLi4s7Ozt/f3/r6+tnZ2f39/dTU1Hp6epubmwAAAP///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAABUALAAAAAASABIAAAVVYCWOZGmeaKquqOS+sHRKVG3b0XzvuSk9wAci+OiVJI1kY6JQGkmSQOAwqRakz5EEwF1MBAICICuSMM6MgQFNrkgccHgi3pZA7nh8O8Lv+9ssgYKBIQA7",

            //鼠标划过时向上箭头图标
            "arrow-up-hover": "data:image/gif;base64,R0lGODlhEgASAMQRAOjo6N/f3wAAAMXFxVlZWcbGxsrKyi4uLtTU1Pb29tnZ2f39/dDQ0Pr6+pubm4mJif///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAABEALAAAAAASABIAAAVQYCSOZGmeaKqu6OO+8HM+TG3bzozsPJ+bD4VwOPyVHoHCYGkIOI2kBwBwEFgJU+jokeh6vVrRo0Eul8ORx2LNZqMfkLhcjnbY73g0a8/fhwAAOw==",

            //向右箭头图标
            "arrow-right": "data:image/gif;base64,R0lGODlhEgASAMQVAOjo6Pb29s3NzSwsLNLS0l5eXsXFxTExMWFhYcHBweLi4s7Ozt/f3/r6+tnZ2f39/dTU1Hp6epubmwAAAP///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAABUALAAAAAASABIAAAVVYCWOZGmeaKquqOS+sHRKVG3b0XzvuSk9wAci+OiVJI1kY6JQGkmSQOAwqRakz5EEwF1MBAICICuSMM6MgQFNrkgccHgi3pZA7nh8O8Lv+9ssgYKBIQA7",

            //鼠标划过时向右箭头图标
            "arrow-right-hover": "data:image/gif;base64,R0lGODlhEgASAMQRAOjo6N/f3wAAAMXFxVlZWcbGxsrKyi4uLtTU1Pb29tnZ2f39/dDQ0Pr6+pubm4mJif///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAABEALAAAAAASABIAAAVQYCSOZGmeaKqu6OO+8HM+TG3bzozsPJ+bD4VwOPyVHoHCYGkIOI2kBwBwEFgJU+jokeh6vVrRo0Eul8ORx2LNZqMfkLhcjnbY73g0a8/fhwAAOw==",

            //向下箭头图标
            "arrow-down": "data:image/gif;base64,R0lGODlhEgASAMQVAOjo6Pb29s3NzSwsLNLS0l5eXsXFxTExMWFhYcHBweLi4s7Ozt/f3/r6+tnZ2f39/dTU1Hp6epubmwAAAP///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAABUALAAAAAASABIAAAVVYCWOZGmeaKquqOS+sHRKVG3b0XzvuSk9wAci+OiVJI1kY6JQGkmSQOAwqRakz5EEwF1MBAICICuSMM6MgQFNrkgccHgi3pZA7nh8O8Lv+9ssgYKBIQA7",

            //鼠标划过时向下箭头图标
            "arrow-down-hover": "data:image/gif;base64,R0lGODlhEgASAMQRAOjo6N/f3wAAAMXFxVlZWcbGxsrKyi4uLtTU1Pb29tnZ2f39/dDQ0Pr6+pubm4mJif///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAABEALAAAAAASABIAAAVQYCSOZGmeaKqu6OO+8HM+TG3bzozsPJ+bD4VwOPyVHoHCYGkIOI2kBwBwEFgJU+jokeh6vVrRo0Eul8ORx2LNZqMfkLhcjnbY73g0a8/fhwAAOw==",

            //滚动条滑块图标
            "scroll-slider": "data:image/gif;base64,R0lGODlhEgASAMQVAOjo6Pb29s3NzSwsLNLS0l5eXsXFxTExMWFhYcHBweLi4s7Ozt/f3/r6+tnZ2f39/dTU1Hp6epubmwAAAP///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAABUALAAAAAASABIAAAVVYCWOZGmeaKquqOS+sHRKVG3b0XzvuSk9wAci+OiVJI1kY6JQGkmSQOAwqRakz5EEwF1MBAICICuSMM6MgQFNrkgccHgi3pZA7nh8O8Lv+9ssgYKBIQA7",

            //鼠标划过时滚动条滑块图标
            "scroll-slider-hover": "data:image/gif;base64,R0lGODlhEgASAMQRAOjo6N/f3wAAAMXFxVlZWcbGxsrKyi4uLtTU1Pb29tnZ2f39/dDQ0Pr6+pubm4mJif///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAABEALAAAAAASABIAAAVQYCSOZGmeaKqu6OO+8HM+TG3bzozsPJ+bD4VwOPyVHoHCYGkIOI2kBwBwEFgJU+jokeh6vVrRo0Eul8ORx2LNZqMfkLhcjnbY73g0a8/fhwAAOw==",




            //选择选中图标
            "check-checked": "data:image/gif;base64,R0lGODlhEgASAMQVAOjo6Pb29s3NzSwsLNLS0l5eXsXFxTExMWFhYcHBweLi4s7Ozt/f3/r6+tnZ2f39/dTU1Hp6epubmwAAAP///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAABUALAAAAAASABIAAAVVYCWOZGmeaKquqOS+sHRKVG3b0XzvuSk9wAci+OiVJI1kY6JQGkmSQOAwqRakz5EEwF1MBAICICuSMM6MgQFNrkgccHgi3pZA7nh8O8Lv+9ssgYKBIQA7",

            //捕获焦点时选择选中图标
            "check-checked-focus": "data:image/gif;base64,R0lGODlhEgASAMQRAOjo6N/f3wAAAMXFxVlZWcbGxsrKyi4uLtTU1Pb29tnZ2f39/dDQ0Pr6+pubm4mJif///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAABEALAAAAAASABIAAAVQYCSOZGmeaKqu6OO+8HM+TG3bzozsPJ+bD4VwOPyVHoHCYGkIOI2kBwBwEFgJU+jokeh6vVrRo0Eul8ORx2LNZqMfkLhcjnbY73g0a8/fhwAAOw==",

            //鼠标划过时选择选中图标
            "check-checked-hover": "data:image/gif;base64,R0lGODlhEgASAMQRAOjo6N/f3wAAAMXFxVlZWcbGxsrKyi4uLtTU1Pb29tnZ2f39/dDQ0Pr6+pubm4mJif///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAABEALAAAAAASABIAAAVQYCSOZGmeaKqu6OO+8HM+TG3bzozsPJ+bD4VwOPyVHoHCYGkIOI2kBwBwEFgJU+jokeh6vVrRo0Eul8ORx2LNZqMfkLhcjnbY73g0a8/fhwAAOw==",

            //选择未选中图标
            "check-unchecked": "data:image/gif;base64,R0lGODlhEgASAMQVAOjo6Pb29s3NzSwsLNLS0l5eXsXFxTExMWFhYcHBweLi4s7Ozt/f3/r6+tnZ2f39/dTU1Hp6epubmwAAAP///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAABUALAAAAAASABIAAAVVYCWOZGmeaKquqOS+sHRKVG3b0XzvuSk9wAci+OiVJI1kY6JQGkmSQOAwqRakz5EEwF1MBAICICuSMM6MgQFNrkgccHgi3pZA7nh8O8Lv+9ssgYKBIQA7",

            //捕获焦点时选择未选中图标
            "check-unchecked-focus": "data:image/gif;base64,R0lGODlhEgASAMQRAOjo6N/f3wAAAMXFxVlZWcbGxsrKyi4uLtTU1Pb29tnZ2f39/dDQ0Pr6+pubm4mJif///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAABEALAAAAAASABIAAAVQYCSOZGmeaKqu6OO+8HM+TG3bzozsPJ+bD4VwOPyVHoHCYGkIOI2kBwBwEFgJU+jokeh6vVrRo0Eul8ORx2LNZqMfkLhcjnbY73g0a8/fhwAAOw==",

            //鼠标划过时选择未选中图标
            "check-unchecked-hover": "data:image/gif;base64,R0lGODlhEgASAMQVAOjo6Pb29s3NzSwsLNLS0l5eXsXFxTExMWFhYcHBweLi4s7Ozt/f3/r6+tnZ2f39/dTU1Hp6epubmwAAAP///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAABUALAAAAAASABIAAAVVYCWOZGmeaKquqOS+sHRKVG3b0XzvuSk9wAci+OiVJI1kY6JQGkmSQOAwqRakz5EEwF1MBAICICuSMM6MgQFNrkgccHgi3pZA7nh8O8Lv+9ssgYKBIQA7",

            //选择未知选择图标
            "check-unkown": "data:image/gif;base64,R0lGODlhEgASAMQVAOjo6Pb29s3NzSwsLNLS0l5eXsXFxTExMWFhYcHBweLi4s7Ozt/f3/r6+tnZ2f39/dTU1Hp6epubmwAAAP///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAABUALAAAAAASABIAAAVVYCWOZGmeaKquqOS+sHRKVG3b0XzvuSk9wAci+OiVJI1kY6JQGkmSQOAwqRakz5EEwF1MBAICICuSMM6MgQFNrkgccHgi3pZA7nh8O8Lv+9ssgYKBIQA7",

            //捕获焦点时选择未知选择图标
            "check-unkown-focus": "data:image/gif;base64,R0lGODlhEgASAMQVAOjo6Pb29s3NzSwsLNLS0l5eXsXFxTExMWFhYcHBweLi4s7Ozt/f3/r6+tnZ2f39/dTU1Hp6epubmwAAAP///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAABUALAAAAAASABIAAAVVYCWOZGmeaKquqOS+sHRKVG3b0XzvuSk9wAci+OiVJI1kY6JQGkmSQOAwqRakz5EEwF1MBAICICuSMM6MgQFNrkgccHgi3pZA7nh8O8Lv+9ssgYKBIQA7",

            //鼠标划过时选择未知选择图标
            "check-unkown-hover": "data:image/gif;base64,R0lGODlhEgASAMQVAOjo6Pb29s3NzSwsLNLS0l5eXsXFxTExMWFhYcHBweLi4s7Ozt/f3/r6+tnZ2f39/dTU1Hp6epubmwAAAP///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAABUALAAAAAASABIAAAVVYCWOZGmeaKquqOS+sHRKVG3b0XzvuSk9wAci+OiVJI1kY6JQGkmSQOAwqRakz5EEwF1MBAICICuSMM6MgQFNrkgccHgi3pZA7nh8O8Lv+9ssgYKBIQA7",



            //单选选中图标
            "radio-checked": "data:image/gif;base64,R0lGODlhEgASAMQVAOjo6Pb29s3NzSwsLNLS0l5eXsXFxTExMWFhYcHBweLi4s7Ozt/f3/r6+tnZ2f39/dTU1Hp6epubmwAAAP///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAABUALAAAAAASABIAAAVVYCWOZGmeaKquqOS+sHRKVG3b0XzvuSk9wAci+OiVJI1kY6JQGkmSQOAwqRakz5EEwF1MBAICICuSMM6MgQFNrkgccHgi3pZA7nh8O8Lv+9ssgYKBIQA7",

            //捕获焦点时单选选中图标
            "radio-checked-focus": "data:image/gif;base64,R0lGODlhEgASAMQVAOjo6Pb29s3NzSwsLNLS0l5eXsXFxTExMWFhYcHBweLi4s7Ozt/f3/r6+tnZ2f39/dTU1Hp6epubmwAAAP///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAABUALAAAAAASABIAAAVVYCWOZGmeaKquqOS+sHRKVG3b0XzvuSk9wAci+OiVJI1kY6JQGkmSQOAwqRakz5EEwF1MBAICICuSMM6MgQFNrkgccHgi3pZA7nh8O8Lv+9ssgYKBIQA7",

            //鼠标划过时单选选中图标
            "radio-checked-hover": "data:image/gif;base64,R0lGODlhEgASAMQVAOjo6Pb29s3NzSwsLNLS0l5eXsXFxTExMWFhYcHBweLi4s7Ozt/f3/r6+tnZ2f39/dTU1Hp6epubmwAAAP///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAABUALAAAAAASABIAAAVVYCWOZGmeaKquqOS+sHRKVG3b0XzvuSk9wAci+OiVJI1kY6JQGkmSQOAwqRakz5EEwF1MBAICICuSMM6MgQFNrkgccHgi3pZA7nh8O8Lv+9ssgYKBIQA7",

            //单选未选中图标
            "radio-unchecked": "data:image/gif;base64,R0lGODlhEgASAMQVAOjo6Pb29s3NzSwsLNLS0l5eXsXFxTExMWFhYcHBweLi4s7Ozt/f3/r6+tnZ2f39/dTU1Hp6epubmwAAAP///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAABUALAAAAAASABIAAAVVYCWOZGmeaKquqOS+sHRKVG3b0XzvuSk9wAci+OiVJI1kY6JQGkmSQOAwqRakz5EEwF1MBAICICuSMM6MgQFNrkgccHgi3pZA7nh8O8Lv+9ssgYKBIQA7",

            //捕获焦点时单选未选中图标
            "radio-unchecked-focus": "data:image/gif;base64,R0lGODlhEgASAMQVAOjo6Pb29s3NzSwsLNLS0l5eXsXFxTExMWFhYcHBweLi4s7Ozt/f3/r6+tnZ2f39/dTU1Hp6epubmwAAAP///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAABUALAAAAAASABIAAAVVYCWOZGmeaKquqOS+sHRKVG3b0XzvuSk9wAci+OiVJI1kY6JQGkmSQOAwqRakz5EEwF1MBAICICuSMM6MgQFNrkgccHgi3pZA7nh8O8Lv+9ssgYKBIQA7",

            //鼠标划过时单选未选中图标
            "radio-unchecked-hover": "data:image/gif;base64,R0lGODlhEgASAMQVAOjo6Pb29s3NzSwsLNLS0l5eXsXFxTExMWFhYcHBweLi4s7Ozt/f3/r6+tnZ2f39/dTU1Hp6epubmwAAAP///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAABUALAAAAAASABIAAAVVYCWOZGmeaKquqOS+sHRKVG3b0XzvuSk9wAci+OiVJI1kY6JQGkmSQOAwqRakz5EEwF1MBAICICuSMM6MgQFNrkgccHgi3pZA7nh8O8Lv+9ssgYKBIQA7",

            //单选未知选择图标
            "radio-unkown": "data:image/gif;base64,R0lGODlhEgASAMQVAOjo6Pb29s3NzSwsLNLS0l5eXsXFxTExMWFhYcHBweLi4s7Ozt/f3/r6+tnZ2f39/dTU1Hp6epubmwAAAP///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAABUALAAAAAASABIAAAVVYCWOZGmeaKquqOS+sHRKVG3b0XzvuSk9wAci+OiVJI1kY6JQGkmSQOAwqRakz5EEwF1MBAICICuSMM6MgQFNrkgccHgi3pZA7nh8O8Lv+9ssgYKBIQA7",

            //捕获焦点时单选未知选择图标
            "radio-unkown-focus": "data:image/gif;base64,R0lGODlhEgASAMQVAOjo6Pb29s3NzSwsLNLS0l5eXsXFxTExMWFhYcHBweLi4s7Ozt/f3/r6+tnZ2f39/dTU1Hp6epubmwAAAP///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAABUALAAAAAASABIAAAVVYCWOZGmeaKquqOS+sHRKVG3b0XzvuSk9wAci+OiVJI1kY6JQGkmSQOAwqRakz5EEwF1MBAICICuSMM6MgQFNrkgccHgi3pZA7nh8O8Lv+9ssgYKBIQA7",

            //鼠标划过时单选未知选择图标
            "radio-unkown-hover": "data:image/gif;base64,R0lGODlhEgASAMQVAOjo6Pb29s3NzSwsLNLS0l5eXsXFxTExMWFhYcHBweLi4s7Ozt/f3/r6+tnZ2f39/dTU1Hp6epubmwAAAP///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAABUALAAAAAASABIAAAVVYCWOZGmeaKquqOS+sHRKVG3b0XzvuSk9wAci+OiVJI1kY6JQGkmSQOAwqRakz5EEwF1MBAICICuSMM6MgQFNrkgccHgi3pZA7nh8O8Lv+9ssgYKBIQA7",



            //树收拢图标
            "tree-collapse": "data:image/gif;base64,R0lGODlhEgASAMQVAOjo6Pb29s3NzSwsLNLS0l5eXsXFxTExMWFhYcHBweLi4s7Ozt/f3/r6+tnZ2f39/dTU1Hp6epubmwAAAP///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAABUALAAAAAASABIAAAVVYCWOZGmeaKquqOS+sHRKVG3b0XzvuSk9wAci+OiVJI1kY6JQGkmSQOAwqRakz5EEwF1MBAICICuSMM6MgQFNrkgccHgi3pZA7nh8O8Lv+9ssgYKBIQA7",

            //树展开图标
            "tree-expand": "data:image/gif;base64,R0lGODlhEgASAMQVAOjo6Pb29s3NzSwsLNLS0l5eXsXFxTExMWFhYcHBweLi4s7Ozt/f3/r6+tnZ2f39/dTU1Hp6epubmwAAAP///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAABUALAAAAAASABIAAAVVYCWOZGmeaKquqOS+sHRKVG3b0XzvuSk9wAci+OiVJI1kY6JQGkmSQOAwqRakz5EEwF1MBAICICuSMM6MgQFNrkgccHgi3pZA7nh8O8Lv+9ssgYKBIQA7"

        };



        //转成Image对象
        for (var name in images)
        {
            var value = images[name];
            (images[name] = new Image()).src = value;
        }


    })(flyingon);





    /*
    定义系统颜色
    1. 可使用flyingon.LinearGradient创建线性渐变色
    2. 可使用flyingon.RadialGradient创建径向渐变色
    3. 可使用flyingon.ImagePattern创建图像背景
    */
    (function (flyingon) {


        result.colors = {


            "control-back": "#888888",

            "control-text": "#000000",

            "control-border": "blue",


            "window-back": "#FFFFFF",

            "window-text": "#000000",

            "window-border": "#CCCCCC",


            "hover-back": "#FFFFFF",

            "hover-text": "#000000",

            "hover-border": "#CCCCCC",


            "focused-back": "#FFFFFF",

            "focused-text": "#000000",

            "focused-border": "#CCCCCC",


            "checked-back": "#FFFFFF",

            "checked-text": "#000000",

            "checked-border": "#CCCCCC",


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

        };


    })(flyingon);





    /*
    定义系统字体
    可使用flyingon.Font创建字体 可使用字体派生功能从一已存在的字体派生出新的字体
    */
    (function (flyingon) {
        

        var fonts = result.fonts = {};


        //普通字体
        var normal = fonts.normal = new flyingon.Font("normal", "normal", "normal", 12, "微软雅黑,宋体,Times New Roman");

        //粗体
        fonts.bold = normal.deriveBold();

        //斜体
        fonts.italic = normal.deriveItalic();

        //粗斜体
        fonts.bold_italic = normal.deriveBoldItalic();


    })(flyingon);





    /*
    定义样式
    
    */
    (function (flyingon) {


        result.styles = {


            //默认控件样式
            Control: {

                //宽度 default|fill|auto|number|number%
                width: "default",

                //高度 default|fill|auto|number|number%
                height: "default",

                //外边距 上->右->下-左     示例: 5 | "5,5" | "5,5,5" | "5,5,5,5" | [5,5] | [5,5,5] | [5,5,5,5]
                margin: 0,

                //边框 上->右->下-左       示例: 5 | "5,5" | "5,5,5" | "5,5,5,5" | [5,5] | [5,5,5] | [5,5,5,5]
                border: 0,

                //内边距 上->右->下-左     示例: 5 | "5,5" | "5,5,5" | "5,5,5,5" | [5,5] | [5,5,5] | [5,5,5,5]
                padding: 0,

                //字体
                font: "normal",

                //光标
                cursor: "default",

                //透明度
                opacity: 1,

                //背景色
                background: null,

                //前景色
                foreground: "control-text",

                //边框颜色
                borderColor: "control-border",

                //边框圆角
                borderRadius: 0,

                //装饰
                decorates: null,


                //状态组 同一组互斥 不同组属性叠加 按定义顺序后面冲前面
                /*
                common-states:  普通状态组(enter-animate disabled pressed)
                check-states:   选中状态组(checked unchecked unkown)
                focus-states:   焦点状态组(focused leave-animate)
                hover-states:   鼠标悬停状态组(hover leave-animate)
                */
                states: {

                    "common-states": {

                        //状态切入时动画
                        "enter-animate": null,

                        //禁用状态
                        disabled: {

                            background: null,

                            foreground: "disabled-text",

                            borderColor: "disabled-border",

                            //状态切入时动画
                            "enter-animate": null
                        },

                        //按下状态
                        pressed: {

                            //状态切入时动画
                            "enter-animate": null
                        }
                    },

                    "check-states": {

                        //选中时
                        checked: {

                            //状态切入时动画
                            "enter-animate": null
                        },

                        //未选中时
                        unchecked: {

                            //状态切入时动画
                            "enter-animate": null
                        },

                        //未知
                        unkown: {

                            //状态切入时动画
                            "enter-animate": null
                        }
                    },

                    "focus-states": {

                        //获取焦点时
                        focused: {

                            //状态切入时动画
                            "enter-animate": null
                        },

                        //失去焦点时动画
                        "leave-animate": null
                    },

                    "hover-states": {

                        //鼠标悬停时
                        hover: {

                            //状态切入时动画
                            "enter-animate": null
                        },

                        //鼠标离开时动画
                        "leave-animate": null
                    }
                }

            },



            //滚动条样式
            ScrollBase: {

                //背景色
                background: "dark-back",

                //箭头背景
                arrowBackground: "control-back",

                //向左箭头图片
                arrowLeftImage: null,

                //向上箭头图片
                arrowUpImage: null,

                //向右箭头图片
                arrowRightImage: null,

                //向下箭头图片
                arrowDownImage: null,

                //滑块背景
                sliderBackground: null,

                //滑块图片
                sliderImage: null,

                states: {

                    "hover-states": {

                        hover: {

                            background: "yellow",

                            "enter-animate": null
                        },

                        "leave-animate": null
                    }
                }

            },



            //内容控件样式
            ContentControl: {


            },



            //面板控件样式
            Panel: {


            },



            //文本框样式
            TextBoxBase: {

                background: "window-back",

                border: 1,

                cursor: "text",

                states: {

                    "hover-states": {

                        hover: {

                            decorates: [{

                                className: "Rectangle", strokeStyle: "control-border", fillStyle: "window-back", children: [{

                                    className: "RoundRectangle", offset: [2, 2, 2, 2], anticlockwise: true
                                }]
                            }]
                        }
                    }
                }

            },



            //文本框样式
            ListBox: {

                background: "window-back",

                border: 1
            },



            //文本框样式
            Button: {

                background: "button-background",

                border: 1,

                borderRadius: 0,

                cursor: "pointer"

            },



            Window: {

                background: "window-back"
            },

            ".window-icon": {

                image: "window-icon"
            },

            ".window-close": {

                image: "window-close",

                states: {

                    "hover-states": {

                        hover: {

                            background: "white",

                            image: "window-close-hover"
                        }
                    }
                }
            },

            ".window-maximize": {

                image: "window-maximize",

                states: {

                    "hover-states": {

                        hover: {

                            background: "white",

                            image: "window-maximize-hover"
                        }
                    }
                }
            },

            ".window-minimize": {

                image: "window-minimize",

                states: {

                    "hover-states": {

                        hover: {

                            background: "white",

                            image: "window-minimize-hover"
                        }
                    }
                }
            },


            WindowTitleBar: {

                width: "fill",

                height: "fill",

                background: "window-title-background",

                border: 1
            },


            ChildWindow: {

                background: "window-back",

                border: 1
            }


        };



    })(flyingon);






    /*
    定义模板
    
    */
    (function (flyingon) {


        result.templates = {



        };


    })(flyingon);





    //返回结果
    return result;


})(flyingon);