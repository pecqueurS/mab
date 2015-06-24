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

    var dateToUs = function(dateObj, delimiter) {
        if (delimiter == undefined) delimiter = '-';
        var year = dateObj.getFullYear();
        var month = (dateObj.getMonth() < 9 ? '0' : '') + (dateObj.getMonth() + 1);
        var day = (dateObj.getDate() <= 9 ? '0' : '') + (dateObj.getDate());

        return year + delimiter + month + delimiter + day;
    };

    var dateToFr = function(dateObj, delimiter) {
        return usToFrDate(dateToUs(dateObj, delimiter), delimiter);
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

        var isBigAqua = name === 'description'
                      || name === 'remainingToDispatch';

        return '<div class="col-xs-12 ' + (isBigAqua ? ' ' : 'col-sm-6 ') + name + '">' +
            '<div style="' + (isBigAqua ? 'padding: 15px;' : '') + '" class="callout ' + (isBigAqua ? 'calloutinfo bg-aqua' : 'callout-danger bg-red') + '">' +
                '<h4 style="' + (isBigAqua ? 'text-align: left;' : '') + '">' + description + '</h4>' +
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
        informationLoan.addClass('row-fluid col-xs-12 col-sm-6 col-lg-7 description_loan');
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
                <td class="amountTreat" style="white-space: nowrap;text-align: right;">' + formatAmount(treats.treatAmount) + '</td>\
                <td style="white-space: nowrap;text-align: right;">' + formatAmount(treats.remaining) + '</td>\
            </tr>';
    };

    var remainingToDispatch = function() {
        return '<div class="row">' + descriptionHtml('Reste à répartir', 'p', 'remainingToDispatch', '0') + '</div>';
    };

    var getRemainingToDispatch = function(loan) {
        return parseFloat($(loan).find('.remainingToDispatch p').text().trim());
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

    var findRowsInput = function(table) {
        table.fnSort( [ [1,'asc'] ] );
        return table.$('tr.editable, tr.active');
    };

    var isValidLoan = function(loan) {
        var btn = $(loan).find('.valid_loan');
        if (getRemainingToDispatch(loan) == 0) {
            btn.show();
        } else {
            btn.hide();
        }
    };

    var sendData = function (data) {
        $.post('url', data, function (response) {
            if (response.response.status == 'ok') {
                //window.location.reload();
            } else {
                // une erreur est survenue
            }
        });
    };

    $.loan = function(loan, opts) {
        // HTML Construction
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

        // Datatable
        var settings = {
            iDisplayLength: 12,
            oLanguage: {
                sLengthMenu: '<div style="margin-right:10px;display: inline-block;margin-bottom: 0;" class="form-group">'+
                '<select class="form-control">'+
                '<option value="12">12</option>'+
                '<option value="24">24</option>'+
                '<option value="48">48</option>'+
                '<option value="60">60</option>'+
                '<option value="72">72</option>'+
                '<option value="-1">Toutes</option>'+
                '</select>'+
                '</div> lignes',
                sSearch: ''
            }
        };
        var dataTable = $(loan).find('#loan_' + opts.id).datatable(settings);

        $(loan).find('.delete_loan').click(function() {
            $.get('url' + opts.id, function (response) {
                if (response.response.status == 'ok') {
                    //window.location.reload();
                } else {
                    // une erreur est survenue
                }
            });
        });

        // Editable
        $(loan).find('.change_loan').click(function() {
            var btns = $(this).parents('.box-header').find('.box-tools > .btn');
            var optBtn = $(this).parents('.btn-group');
            btns.show();
            optBtn.hide();
            var $loan = $(this).parents('.box');
            var editLoan = informationsLoan('edit', opts);
            informationLoan.replaceWith(editLoan);

            var pastRows = dataTable.$('tr.info');
            if (pastRows.length > 0) {
                $(loan).find('.firstDateTreat input').attr('disabled', true);
            }

            dataTable.fnFilter('');
            $loan.find('.dataTables_wrapper > .row:first-child').hide();

            findRowsInput(dataTable).each(function() {
                $(this).each(function() {
                    var dateEcheance = $(this).find('td').eq(0);
                    var amountEcheance = $(this).find('td').eq(2);
                    var dateTxt = dateEcheance.text();
                    var amountTxt = parseFloat((amountEcheance.text()).replace(' ', ''));
                    dateEcheance.html('<input type="text" class="form-control" value="' + dateTxt + '">');
                    amountEcheance.html('<input type="text" class="form-control" value="' + amountTxt + '">');
                });
            });

            $loan.find('.table-responsive').parent().prepend(remainingToDispatch());
        });

        // Cancel btn
        $(loan).find('.cancel_loan').click(function() {
            window.location.reload();
        });

        // Valid btn
        $(loan).find('.valid_loan').click(function() {
            //alert('test');
            var descriptionLoan = $(loan).find('.description_loan input, .description_loan select, .description_loan textarea');
            var dataLoan = dataTable.$('tr');
            var lengthDetailsLoan = descriptionLoan.length;
            for (var i = 0; i < lengthDetailsLoan; i++) {
                opts[$(descriptionLoan[i]).attr('name')] = $(descriptionLoan[i]).val();
            }
            var lengthTreats = dataLoan.length;
            var lengthOptTreats = $(opts.treats).length;
            for (var i = 0; i < lengthTreats; i++) {
                var dateTreat = $(dataLoan[i]).find('td').eq(0).find('input').val();
                var nbTreat = $(dataLoan[i]).find('td').eq(1).html().trim();
                var amountTreat = $(dataLoan[i]).find('td').eq(2).find('input').val();
                if (dateTreat !== undefined) {
                    dateTreat = frToUsDate(dateTreat);
                    for (var j = 0; j < lengthOptTreats; j++) {
                        if (opts.treats[j].nb == nbTreat) {
                            opts.treats[j].date = dateTreat;
                            opts.treats[j].treatAmount = amountTreat;
                            break;
                        }
                    }

                    if (j == lengthOptTreats) {
                        opts.treats.push({
                            date: dateTreat,
                            nb: nbTreat,
                            treatAmount: amountTreat,
                            remaining: 0
                        });
                    }
                }

                sendData(opts);
            }
        });

        // actions
        // recurrence
        $(loan).on('change', '[name="recurrence"]', function() {
            var step = $(this).val();
            var i = 0;
            var dateStart = null;
            findRowsInput(dataTable).each(function() {
                var input = $(this).find('td').eq(0).find('input');
                if (i === 0) {
                    dateStart = new Date(frToUsDate(input.val()));
                    i++;
                } else {
                    dateStart.setMonth(parseInt(dateStart.getMonth()) + parseInt(step));
                    input.val(dateToFr(dateStart));
                }
            });
            isValidLoan(loan);
        });

        // Treats numbers
        $(loan).on('change', '[name="nbOfTreats"]', function() {
            var nbOfTreats = $(this).val();
            var i = 0;
            var tr = dataTable.$('tr');
            var trActive = dataTable.$('tr.active');
            var trEditable = dataTable.$('tr.editable');
            var trPastLength = (tr.length) - (trActive.length) - (trEditable.length);
            if (trPastLength > nbOfTreats) {
                $(this).val(tr.length);
            } else {
                if (tr.length > nbOfTreats) {
                    var remainToDispatch = getRemainingToDispatch(loan);
                    tr.each(function() {
                        var value = $(this).find('td').eq(2).find('input').val();
                        if (value !== undefined && nbOfTreats <= i) {
                            remainToDispatch += parseFloat(value);
                            dataTable.fnDeleteRow($(this)[0]);
                        }
                        i++;
                    });
                    $(loan).find('.remainingToDispatch p').html(remainToDispatch);
                } else if (tr.length < nbOfTreats) {
                    var lastRow = dataTable.$('tr:last-child');
                    var isEditable = lastRow.hasClass('editable');
                    var date = new Date(
                        isEditable
                            ? frToUsDate(lastRow.find('td').eq(0).find('input').val())
                            : frToUsDate(lastRow.find('td').eq(0).text().trim())
                    );
                    for (var j = tr.length; j < nbOfTreats; j++) {
                        var newRow = lastRow.clone();
                        var recurrence = $('[name="recurrence"]').val();
                        date.setMonth(parseInt(date.getMonth()) + parseInt(recurrence));
                        if (isEditable) {
                            newRow.find('td').eq(0).find('input').attr('value', dateToFr(date));
                            newRow.find('td').eq(2).find('input').attr('value', 0);
                        } else {
                            newRow.find('td').eq(0).html(dateToFr(date));
                            newRow.find('td').eq(2).html(0);
                        }
                        var rowToAdd = new Array(4);
                        rowToAdd[0] = newRow.find('td').eq(0).html();
                        rowToAdd[1] =  j + 1;
                        rowToAdd[2] = newRow.find('td').eq(2).html();
                        rowToAdd[3] = newRow.find('td').eq(3).html();
                        dataTable.fnAddData(rowToAdd);

                        var newTr = dataTable.$('tr').last();
                        newTr.addClass(isEditable ? 'editable' : 'info');
                        newTr.find('td').css({whiteSpace:'nowrap'});
                        newTr.find('td').eq(2).css({textAlign:'right'}).addClass('amountTreat');
                        newTr.find('td').eq(3).css({textAlign:'right'});
                    }
                }
            }
            isValidLoan(loan);
        });

        // firstDateTreat
        $(loan).on('change', '[name="firstDateTreat"]', function() {
            var newDate = $(this).val();
            var recurrence = $('[name="recurrence"]').val();
            var i = 0;
            var dateStart = new Date(frToUsDate(newDate));
            findRowsInput(dataTable).each(function() {
                i === 0
                    ? i = 1
                    : dateStart.setMonth(parseInt(dateStart.getMonth()) + parseInt(recurrence));

                var input = $(this).find('td').eq(0).find('input');
                input.val(dateToFr(dateStart));
            });
            isValidLoan(loan);
        });

        // Total Amount, interest, treats, left to pay
        $(loan).on('change', '[name="totalAmount"], [name="interest"], [name="leftToPay"], .amountTreat input', function() {
            var totalLoan = $(loan).find('[name="totalAmount"]').val();
            var interestLoan = $(loan).find('[name="interest"]').val();
            var leftToPayLoan = $(loan).find('[name="leftToPay"]').val();
            var treatsLoan = dataTable.$('tr');
            var dispatch = getRemainingToDispatch(loan);
            var oldValue = $(this).attr('value');
            var newValue = $(this).val();
            var diff = parseFloat(newValue - oldValue);
            $(this).attr('value', $(this).val());
            switch ($(this).attr('name')) {
                case 'totalAmount':
                case 'interest':
                    $(loan).find('.remainingToDispatch p').html(dispatch + diff);
                    $(loan).find('[name="leftToPay"]').attr('value', parseFloat(leftToPayLoan) + diff);
                    break;
                case 'leftToPay':
                    $(loan).find('.remainingToDispatch p').html(dispatch + diff);
                    $(loan).find('[name="totalAmount"]').attr('value', parseFloat(totalLoan) + diff);
                    break;
                default:
                    $(loan).find('.remainingToDispatch p').html(dispatch - diff);
            }
            isValidLoan(loan);
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

