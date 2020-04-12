
$(document).ready(function(){
    $("#buttonSet BTN").click(function() {

        var column_num = parseInt( $(this).parent().parent().parent().parent().index()  ) + 1;
        var row_num = parseInt( $(this).parent().parent().parent().parent().parent().parent().parent().index() )+1-10;
        var button_num = parseInt( $(this).index() ) + 1;

        alert( "Row_num =" + row_num + "  ,  column_num ="+ column_num +"button_num ="+ button_num);
    });
});

function myFunc(){
  alert("Save the changes");
  $(':text').val('1000');
}
