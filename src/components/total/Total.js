import React from 'react';

const Total = ({totalIncome, totalExpenses, totalBalance}) => (
    <section className="total">
        <header className="total__header">
            <h3>Баланс</h3>
            <p className="total__balance">{totalBalance} ₽</p>
        </header>
        <div className="total__main">
            <div className="total__main-item total__income">
                <h4>Доходы</h4>
                <p className="total__money total__money-income">
                    {totalIncome} ₽
                </p>
            </div>
            <div className="total__main-item total__expenses">
                <h4>Расходы</h4>
                <p className="total__money total__money-expenses">
                    {totalExpenses} ₽
                </p>
            </div>
        </div>
    </section>
); //всё что в круглых скобках, возвращается (замена return). чтобы не писать в фигурных скобках

export default Total; //если export default, то имя функции при импорте может быть любым