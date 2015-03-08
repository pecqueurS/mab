$(function() {
    $('#type').change(function() {
        $('.operation').hide();
        $('#' + $(this).val()).show();
    });

    $('.date-control').datepicker({
        altField: "#datepicker",
        closeText: 'Fermer',
        firstDay: 1 ,
        dateFormat: 'yy-mm-dd'
    });
});
