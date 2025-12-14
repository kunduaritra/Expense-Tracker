import React from "react";
import { useExpense } from "../hooks/useExpenses";
import CreditCardManager from "../components/cards/CreditCardManager";

const CreditCards = () => {
  const { cards, transactions, addCard, removeCard, settleCard } = useExpense();

  return (
    <div>
      <CreditCardManager
        cards={cards}
        transactions={transactions}
        onAddCard={addCard}
        onDeleteCard={removeCard}
        onSettleCard={settleCard}
      />
    </div>
  );
};

export default CreditCards;
