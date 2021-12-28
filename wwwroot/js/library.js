var jqtest = {
    showMsg: function () {
        var v = jQuery.fn.jquery.toString();
        var content = $("#ts-example-2")[0].innerHTML;
        console.log(content.toString() + " " + v + "!!");
        $("#ts-example-2")[0].innerHTML = content + " " + v + "!!";
    }
};
jqtest.showMsg();
//# sourceMappingURL=library.js.map