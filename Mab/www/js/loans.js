$(function() {
    $('.change_loan').click(function() {
        var loan = $(this).parents('.box');
        var editable = loan.find('.editable');
        editable.each(function() {
            var type = $(this).data('type');
            var name = $(this).data('name');
            var formElement = $(document.createElement(type));
            formElement.attr('name', name);
            $(this).find('p').replaceWith(formElement);
        });
    });
});