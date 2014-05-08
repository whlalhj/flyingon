//子项
flyingon.Item = (function (value) {

    this.value = value;

}).extend(function () {


    //项值
    this.value = null;

    //关联控件
    this.control = null;

    //是否选中
    this.selected = false;

});

