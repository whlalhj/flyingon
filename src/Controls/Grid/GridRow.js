//子项
(function (flyingon) {


    var prototype = (flyingon.Item = function (value) {

        this.value = value;

    }).prototype;



    //项值
    prototype.value = null;

    //关联控件
    prototype.control = null;

    //是否选中
    prototype.selected = false;


})(flyingon);
