$(function() {

    $('.actions').click(function() {
        var type = $(this).data('type');
        switch(type) {
            case 'bank':
                var htmlContent = htmlContentBank();
                var title = 'Pointage banque';
                break;
            case 'edit':
                var htmlContent = htmlContentEdit();
                var title = 'Editer';
                break;
            case 'delete':
                var htmlContent = htmlContentDelete();
                var title = 'Supprimer';
                break;
            default:
                var htmlContent = "une erreur s'est produite.";
                var title = false;
                break;
        }

        $.alert(htmlContent, {
            'title': title,
            'confirm': 'Confirmer',
            'dismiss': 'Annuler',
            'noDismiss': false,
            'onHide' : function() {
                $('.modal, .modal-backdrop').remove();
            },
            'onConfirm' : function(e) {
                console.log('valider');

            }
        });
    });
});

var htmlContentBank = function () {
    return 'bank';
};

var htmlContentEdit = function () {
    return 'edit';
};

var htmlContentDelete = function () {
    return 'delete';
};
