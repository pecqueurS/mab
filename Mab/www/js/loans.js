$(function() {
    $('.change_loan').click(function() {
        var btns = $(this).parents('.box-header').find('.box-tools > .btn');
        var optBtn = $(this).parents('.btn-group');
        btns.show();
        optBtn.hide();
        var loan = $(this).parents('.box');
        var editable = loan.find('.editable');
        editable.each(function() {
            var type = $(this).data('type');
            var name = $(this).data('name');
            var value = $(this).find('p').text();
            if (name === 'total' || name === 'interet') {
                value = parseFloat(value.replace(' ', ''));
            };
            var formElement = $(document.createElement(type));
            formElement.attr('name', name).addClass('form-control');
            switch (type) {
                case 'input':
                    formElement.val(value);
                    break;
                case 'textarea':
                    formElement.html(value);
                    break;
                case 'select':
                    if (name === 'recurrence') {
                        var options =   "<option value='1'>Tous les mois</option>" +
                                        "<option value='2'>Tous les 2 mois</option>" +
                                        "<option value='3'>Tous les 3 mois</option>" +
                                        "<option value='4'>Tous les 4 mois</option>" +
                                        "<option value='6'>Tous les 6 mois</option>" +
                                        "<option value='12'>Une fois par an</option>";
                        formElement.append(options);
                        options = formElement.find('option');
                        options.each(function () {
                            if ($(this).text() == value) {
                                $(this).attr('selected', 'selected');
                            }
                        });
                    }
            }
            $(this).find('p').replaceWith(formElement);
        });

        var tableEditable = loan.find('table .editable, table .active');
        loan.find('.dataTables_wrapper > .row').hide();
        tableEditable.each(function() {
            var dateEcheance = $(this).find('td').eq(0);
            var amountEcheance = $(this).find('td').eq(2);
            var dateTxt = dateEcheance.text();
            var amountTxt = parseFloat((amountEcheance.text()).replace(' ', ''));
            dateEcheance.html('<input type="text" class="form-control" value="' + dateTxt + '">');
            amountEcheance.html('<input type="text" class="form-control" value="' + amountTxt + '">');
        });
    });
});