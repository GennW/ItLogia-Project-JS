export class GetBalance {
    static getCommonBalance(operations) {
        const balanceElement = document.getElementById('common-balance');
        let totalIncome = 0;
        let totalExpenses = 0;

        operations.forEach(item => {
            if (item.type === 'income') {
                totalIncome += item.amount;
            } else if (item.type === 'expense') {
                totalExpenses += item.amount;
            }
        });

        // Вычислить баланс
        const balance = totalIncome - totalExpenses;
        const formattedBalance = balance.toLocaleString();  // Применение форматирования разделителя разрядов
        balanceElement.innerText = formattedBalance + '$';
    }
}