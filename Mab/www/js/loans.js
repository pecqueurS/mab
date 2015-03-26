$(function() {
    var setting = {
        id: 23456,
        name: 'test',
        description: 'description test',
        bank: 'bq',
        recurrence: 1,
        nbOfTreats: 12,
        firstDateTreat: '2015-01-01',
        totalAmount: 10000,
        interest: 2000,
        leftToPay: 10000,
        refunded: 2000,
        treats: [
            {
                date: '2015-01-01',
                nb: 1,
                treatAmount: 1000,
                remaining: 11000
            },
            {
                date: '2015-02-01',
                nb: 2,
                treatAmount: 1000,
                remaining: 10000
            },
            {
                date: '2015-03-01',
                nb: 3,
                treatAmount: 1000,
                remaining: 9000
            },
            {
                date: '2015-04-01',
                nb: 4,
                treatAmount: 1000,
                remaining: 8000
            },
            {
                date: '2015-05-01',
                nb: 5,
                treatAmount: 1000,
                remaining: 7000
            },
            {
                date: '2015-06-01',
                nb: 6,
                treatAmount: 1000,
                remaining: 6000
            },
            {
                date: '2015-07-01',
                nb: 7,
                treatAmount: 1000,
                remaining: 5000
            },
            {
                date: '2015-08-01',
                nb: 8,
                treatAmount: 1000,
                remaining: 4000
            },
            {
                date: '2015-09-01',
                nb: 9,
                treatAmount: 1000,
                remaining: 3000
            },
            {
                date: '2015-10-01',
                nb: 10,
                treatAmount: 1000,
                remaining: 2000
            },
            {
                date: '2015-11-01',
                nb: 11,
                treatAmount: 1000,
                remaining: 1000
            },
            {
                date: '2015-12-01',
                nb: 12,
                treatAmount: 1000,
                remaining: 0
            }
        ]
    };
    $('.box').loan(setting);


});