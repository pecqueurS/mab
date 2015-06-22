// define some globals for datatable default
$.tableGlobals = {
    bPaginate: true,
    bLengthChange: true,
    iDisplayLength: 10,
    bFilter: true,
    bSort: true,
    bInfo: true,
    bAutoWidth: false,

    oLanguage: {
        sInfo: "De _START_ à _END_ sur _TOTAL_ entrées",
        sInfoEmpty: "Pas d'entrée",
        sInfoFiltered: "(filtrés sur _MAX_ entrées)",
        sLengthMenu: '<div style="margin-right:10px;display: inline-block;margin-bottom: 0;" class="form-group">'+
        '<select class="form-control">'+
        '<option value="10">10</option>'+
        '<option value="20">20</option>'+
        '<option value="30">30</option>'+
        '<option value="40">40</option>'+
        '<option value="50">50</option>'+
        '<option value="-1">Toutes</option>'+
        '</select>'+
        '</div> lignes',
        sSearch: ''
    },
    sDom: "<'row'<'col-xs-6'l><'col-xs-6'f>r>"+
    "t"+
    "<'row'<'col-xs-4'i><'col-xs-8'p>>"
};
(function( $ ) {
// shortcut
    $.fn.datatable = function(opts) {
        var settings = $.tableGlobals;
        if (opts !== undefined) {
            // Merge object2 into object1, recursively
            $.extend( true, settings, opts );
        }
        var oTable = $(this).dataTable(settings);
        $('.dataTables_filter input').addClass('form-control').css('marginBottom', '0');
        return oTable;
    };
})( jQuery );

