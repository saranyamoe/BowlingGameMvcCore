var jqtest = {
    showMsg: function (): void {
        let v: any = jQuery.fn.jquery.toString();
        let content: any = $("#ts-example-2")[0].innerHTML;
        console.log(content.toString() + " " + v + "!!");
        $("#ts-example-2")[0].innerHTML = content + " " + v + "!!";
        
    }
};

jqtest.showMsg();