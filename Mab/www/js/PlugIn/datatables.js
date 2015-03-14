// define some globals for alerts
$.tableGlobals = {
    bPaginate: true,
    bLengthChange: true,
    bFilter: true,
    bSort: true,
    bInfo: true,
    bAutoWidth: false,

    oLanguage: {
        sInfo: "De _START_ à _END_ sur _TOTAL_ entrées",
        sInfoEmpty: "Pas d'entrée",
        sInfoFiltered: "(filtrés sur _MAX_ entrées)",
        sLengthMenu: '<div style="margin-right:10px" class="form-group">'+
        '<select class="form-control">'+
        '<option value="10">10</option>'+
        '<option value="20">20</option>'+
        '<option value="30">30</option>'+
        '<option value="40">40</option>'+
        '<option value="50">50</option>'+
        '<option value="-1">Toutes</option>'+
        '</select>'+
        '</div> lignes par page',
        sSearch: ''
    },
    sDom: "<'row'<'col-xs-6'l><'col-xs-6'f>r>"+
    "t"+
    "<'row'<'col-xs-4'i><'col-xs-8'p>>"
};
(function( $ ) {
// shortcut
    $.fn.datatable = function(opts) {
        var settings = opts == undefined ? $.tableGlobals : opts;
        $(this).dataTable(settings);
        $('.dataTables_filter input').addClass('form-control');
        return this;
    };
})( jQuery );

