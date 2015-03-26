// define some globals for loan default
$.loanGlobals = {
    id: 0,
    name: '',
    description: '',
    bank: '',
    recurrence: '',
    nbOfTreats: 0,
    firstDateTreat: '',
    totalAmount: 0,
    interest: 0,
    leftToPay: 0,
    refunded: 0,
    treats: [
        {
            date: '',
            nb: '',
            treatAmount: 0,
            remaining: 0
        }
    ]
};
(function( $ ) {
    var recurrence = {
        "1": "Tous les mois",
        "2": "Tous les 2 mois",
        "3": "Tous les 3 mois",
        "4": "Tous les 4 mois",
        "6": "Tous les 6 mois",
        "12": "Une fois par an"
    };

    var formatAmount = function (amount, currency) {
        if (currency == undefined) {
            currency = ' €';
        } else if (currency === null) {
            currency = '';
        } else {
            currency = ' ' + currency;
        }
        amount = amount + '';
        amount = amount.replace(',', '.');
        var integer = parseInt(amount)+'';
        var decimal = (((amount - integer).toFixed(2)) * 100) + '';
        if (decimal.length < 2) {
            decimal = '0' + decimal;
        }
        var integerReverse = integer.split("").reverse().join("");
        integerString = '';
        for (var i = 0; i < integerReverse.length; i++) {
            if (i != 0 && i % 3 === 0) {
                integerString += ' ';
            }
            integerString += '' + integerReverse[i];
        }
        integer = integerString.split("").reverse().join("");

        return integer + '.' + decimal + currency;
    };

    var usToFrDate = function (usDate, delimiter) {
        if (delimiter == undefined) delimiter = '-';
        var frDate = usDate.split(delimiter).reverse().join(delimiter);
        return frDate;
    };

    var frToUsDate = function (frDate, delimiter) {
        if (delimiter == undefined) delimiter = '-';
        var usDate = frDate.split(delimiter).reverse().join(delimiter);
        return usDate;
    };


    var headerHtml = function (name) {
       return  '<div class="box-header">\
            <i class="fa fa-calculator"></i>\
            <h3 class="box-title" style="cursor:pointer">' + name + '</h3>\
            <div class="pull-right box-tools">\
                <div class="btn-group">\
                    <button data-toggle="dropdown" class="btn btn-danger btn-sm dropdown-toggle"><i class="fa fa-bars"></i></button>\
                    <ul role="menu" class="dropdown-menu pull-right">\
                        <li style="text-align: right"><a class="delete_loan" style="padding: 3px 3px 3px 20px">Supprimer ce prêt&nbsp;&nbsp;<i class="fa fa-times fa-fw"></i></a></li>\
                        <li style="text-align: right"><a class="change_loan" style="padding: 3px 3px 3px 20px">Modifier la structure du prêt&nbsp;&nbsp;<i class="fa fa-magic fa-fw"></i></a></li>\
                    </ul>\
                </div>\
                <button style="display:none;" class="btn btn-success btn-sm valid_loan" title="valider les modifications"><i class="fa fa-check"></i></button>\
                <button style="display:none;" class="btn btn-warning btn-sm cancel_loan" title="Annuler les modifications"><i class="fa fa-times"></i></button>\
            </div>\
        </div>';
    };

    var descriptionHtml = function (description, tag, name, value) {
        var element = '';
        switch (tag) {
            case 'input':
                element = '<input class="form-control" type="text" name="' + name + '" value="' + value + '">';
                break;
            case 'textarea':
                element = '<textarea class="form-control" name="' + name + '">' + value + '</textarea>';
                break;
            case 'select':
                element = '<select class="form-control" name="' + name + '">';
                for (var i = 0; i < value.length; i++) {
                    var valuei = value[i];
                    element += '<option value="' + valuei.keyVal + '" ' + (valuei.isSelected ? 'selected="selected"' : '') + '>' + valuei.value + '</option>';
                }
                element += '</select>';
                break;
            case 'p':
            default:
                element = '<p style="' + (name === 'description' ? 'text-align: justify;' : '') + '">' + value + '</p>';
        }

        return '<div class="col-xs-12 ' + (name === 'description' ? '' : 'col-sm-6') + '">' +
            '<div style="' + (name === 'description' ? 'padding: 15px;' : '') + '" class="callout ' + (name === 'description' ? 'calloutinfo bg-aqua' : 'callout-danger bg-red') + '">' +
                '<h4 style="' + (name === 'description' ? 'text-align: left;' : '') + '">' + description + '</h4>' +
                element +
            '</div>' +
        '</div>';
    };

    var recurrenceFunction = function (select, opts) {
        var recurrenceObj = [];
        for (key in recurrence) {
            if (key == opts.recurrence) {
                var push = {
                    keyVal: key,
                    value: recurrence[key],
                    isSelected: true
                };
            } else {
                var push = {
                    keyVal: key,
                    value: recurrence[key],
                    isSelected: false
                };
            }
            recurrenceObj.push(push);
        }

        return recurrenceObj;
    };


    var informationsLoan = function($type, opts) {
        var informationLoan = $(document.createElement('div'));
        informationLoan.addClass('row-fluid col-xs-12 col-sm-6 col-lg-7');
        switch ($type) {
            case 'edit':
                informationLoan.append(descriptionHtml('Description', 'textarea', 'description', opts.description));
                informationLoan.append(descriptionHtml('Banque', 'p', 'bank', opts.bank));
                informationLoan.append(descriptionHtml('Récurrence', 'select', 'recurrence', recurrenceFunction(recurrence, opts)));
                informationLoan.append(descriptionHtml('Nombre d\'écheances', 'input', 'nbOfTreats', opts.nbOfTreats));
                informationLoan.append(descriptionHtml('1ère écheance', 'input', 'firstDateTreat', usToFrDate(opts.firstDateTreat)));
                informationLoan.append(descriptionHtml('Montant total', 'input', 'totalAmount', opts.totalAmount));
                informationLoan.append(descriptionHtml('Interêts', 'input', 'interest', opts.interest));
                informationLoan.append(descriptionHtml('Reste à payer', 'input', 'leftToPay', opts.leftToPay));
                informationLoan.append(descriptionHtml('Remboursé', 'p', 'refunded', opts.refunded));
                break;

            case 'info':
                informationLoan.append(descriptionHtml('Description', 'p', 'description', opts.description));
                informationLoan.append(descriptionHtml('Banque', 'p', 'bank', opts.bank));
                informationLoan.append(descriptionHtml('Récurrence', 'p', 'recurrence', recurrence[opts.recurrence]));
                informationLoan.append(descriptionHtml('Nombre d\'écheances', 'p', 'nbOfTreats', opts.nbOfTreats));
                informationLoan.append(descriptionHtml('1ère écheance', 'p', 'firstDateTreat', usToFrDate(opts.firstDateTreat)));
                informationLoan.append(descriptionHtml('Montant total', 'p', 'totalAmount', formatAmount(opts.totalAmount)));
                informationLoan.append(descriptionHtml('Interêts', 'p', 'interest', formatAmount(opts.interest)));
                informationLoan.append(descriptionHtml('Reste à payer', 'p', 'leftToPay', formatAmount(opts.leftToPay)));
                informationLoan.append(descriptionHtml('Remboursé', 'p', 'refunded', formatAmount(opts.refunded)));
                break;
        }

        return informationLoan;
    };

    var rowTable = function (treats, rowClass) {
        return '<tr class="' + rowClass + '">\
                <td style="white-space: nowrap;">' + usToFrDate(treats.date) + '</td>\
                <td style="white-space: nowrap;">' + treats.nb + '</td>\
                <td style="white-space: nowrap;text-align: right;">' + formatAmount(treats.treatAmount) + '</td>\
                <td style="white-space: nowrap;text-align: right;">' + formatAmount(treats.remaining) + '</td>\
            </tr>';
    };

    var detailsLoan = function (opts) {
        var TableLoan = $(document.createElement('div'));
        TableLoan.addClass('col-xs-12 col-sm-6 col-lg-5');

        var tableResponsive = $(document.createElement('div'));
        tableResponsive.addClass('table-responsive');

        var table = $(document.createElement('table'));
        table.attr('id', 'loan_' + opts.id);
        table.addClass('table table-hover dataTable');

        var tableHead =
            '<thead>\
                <tr>\
                    <th>Date</th>\
                    <th>N°</th>\
                    <th style="text-align: right;">Mensualité</th>\
                    <th style="text-align: right;">Restant</th>\
                </tr>\
            </thead>';

        var tableBody = $(document.createElement('tbody'));

        var now = new Date();
        var reactive = true;
        for (var i = 0; i < (opts.treats).length; i++) {
            var cursor = new Date(opts.treats[i].date);
            var rowClass = 'editable';
            if (cursor.getTime() < now.getTime()) {
                rowClass = 'info';
            } else if (cursor.getTime() >= now.getTime()) {
                if (reactive) {
                    rowClass = 'active';
                    reactive = false;
                }
            }
            tableBody.append(rowTable(opts.treats[i], rowClass));
        }


        table.append(tableHead);
        table.append(tableBody);
        tableResponsive.append(table);
        TableLoan.append(tableResponsive);

        return TableLoan;
    };

    $.loan = function(loan, opts) {
        $(loan).append(headerHtml(opts.name));
        var informationLoan = informationsLoan('info', opts);
        var detailLoan = detailsLoan(opts);

        var boxBody = $(document.createElement('div'));
        boxBody.addClass('box-body');
        var row = $(document.createElement('div'));
        row.addClass('row');

        row.append(informationLoan);
        row.append(detailLoan);
        boxBody.append(row);

        $(loan).append(boxBody);

        $(loan).find('#loan_' + opts.id).datatable();

        $(loan).find('.change_loan').click(function() {
            var btns = $(this).parents('.box-header').find('.box-tools > .btn');
            var optBtn = $(this).parents('.btn-group');
            btns.show();
            optBtn.hide();
            var $loan = $(this).parents('.box-body');
            var editLoan = informationsLoan('edit', opts);
            informationLoan.replaceWith(editLoan);
            console.log($(this), $loan);

            var tableEditable = $loan.find('table .editable, table .active');
            $loan.find('.dataTables_wrapper > .row').hide();
            tableEditable.each(function() {
                var dateEcheance = $(this).find('td').eq(0);
                var amountEcheance = $(this).find('td').eq(2);
                var dateTxt = dateEcheance.text();
                var amountTxt = parseFloat((amountEcheance.text()).replace(' ', ''));
                dateEcheance.html('<input type="text" class="form-control" value="' + dateTxt + '">');
                amountEcheance.html('<input type="text" class="form-control" value="' + amountTxt + '">');
            });

        });

        $(loan).find('.cancel_loan').click(function() {
            window.location.reload();
        });

        $(loan).find('.valid_loan').click(function() {
            window.location.reload();
        });

    };



// shortcut
    $.fn.loan = function(opts) {
        var settings = $.loanGlobals;
        if (opts !== undefined) {
            // Merge object2 into object1, recursively
            $.extend( true, settings, opts );
        }
        $.loan(this, settings);
        return this;
    };
})( jQuery );

