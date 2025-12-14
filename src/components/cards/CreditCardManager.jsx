import React, { useState } from "react";
import Card from "../common/Card";
import Button from "../common/Button";
import Input from "../common/Input";
import BottomSheet from "../common/BottomSheet";
import {
  CreditCard,
  Plus,
  Check,
  AlertCircle,
  Trash2,
  Eye,
} from "lucide-react";
import { formatCurrency } from "../../utils/formatters";

const CreditCardManager = ({
  cards,
  onAddCard,
  onDeleteCard,
  onSettleCard,
  transactions,
}) => {
  const [showAddCard, setShowAddCard] = useState(false);
  const [showTransactions, setShowTransactions] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [cardForm, setCardForm] = useState({
    name: "",
    last4: "",
    color: "#8B5CF6",
  });

  const CARD_COLORS = [
    "#8B5CF6",
    "#EC4899",
    "#3B82F6",
    "#10B981",
    "#F59E0B",
    "#EF4444",
    "#6366F1",
    "#14B8A6",
  ];

  const handleAddCard = () => {
    if (!cardForm.name || !cardForm.last4 || cardForm.last4.length !== 4) {
      alert("Please enter card name and last 4 digits");
      return;
    }

    onAddCard({
      ...cardForm,
      totalAmount: 0,
      settled: false,
      createdAt: new Date().toISOString(),
    });

    setCardForm({ name: "", last4: "", color: "#8B5CF6" });
    setShowAddCard(false);
  };

  const getCardTransactions = (cardId) => {
    return transactions.filter((t) => t.cardId === cardId);
  };

  const getCardTotal = (cardId) => {
    return getCardTransactions(cardId).reduce((sum, t) => sum + t.amount, 0);
  };

  const handleViewTransactions = (card) => {
    setSelectedCard(card);
    setShowTransactions(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Credit Cards & EMI</h2>
          <p className="text-gray-400">Manage your credit card expenses</p>
        </div>
        <Button onClick={() => setShowAddCard(true)} icon={Plus} size="sm">
          Add Card
        </Button>
      </div>

      {/* Cards Grid */}
      {cards.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <CreditCard className="mx-auto mb-4 text-gray-400" size={48} />
            <h3 className="text-lg font-semibold mb-2">
              No Credit Cards Added
            </h3>
            <p className="text-gray-400 mb-4">
              Add your credit cards to track EMI and expenses
            </p>
            <Button onClick={() => setShowAddCard(true)} icon={Plus}>
              Add Your First Card
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cards.map((card) => {
            const cardTransactions = getCardTransactions(card.id);
            const totalAmount = getCardTotal(card.id);

            return (
              <div
                key={card.id}
                className="relative overflow-hidden rounded-2xl p-6 text-white"
                style={{
                  background: `linear-gradient(135deg, ${card.color} 0%, ${card.color}CC 100%)`,
                }}
              >
                {/* Card Pattern */}
                <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
                  <div className="absolute inset-0 bg-white rounded-full transform translate-x-16 -translate-y-16"></div>
                </div>

                <div className="relative z-10">
                  {/* Card Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <CreditCard size={32} />
                      <h3 className="text-xl font-bold mt-2">{card.name}</h3>
                    </div>
                    <div className="flex gap-2">
                      {card.settled && (
                        <div className="bg-green-500/20 p-2 rounded-lg">
                          <Check size={20} />
                        </div>
                      )}
                      {!card.settled && totalAmount > 0 && (
                        <div className="bg-orange-500/20 p-2 rounded-lg">
                          <AlertCircle size={20} />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Number */}
                  <p className="text-2xl font-mono mb-6 tracking-wider">
                    •••• •••• •••• {card.last4}
                  </p>

                  {/* Amount */}
                  <div className="mb-4">
                    <p className="text-sm opacity-80">Outstanding Amount</p>
                    <p className="text-3xl font-bold">
                      {formatCurrency(totalAmount)}
                    </p>
                  </div>

                  {/* Transactions Count */}
                  <p className="text-sm opacity-80 mb-4">
                    {cardTransactions.length} transaction
                    {cardTransactions.length !== 1 ? "s" : ""}
                  </p>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleViewTransactions(card)}
                      className="flex-1 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2"
                    >
                      <Eye size={16} />
                      View
                    </button>
                    {!card.settled && totalAmount > 0 && (
                      <button
                        onClick={() => {
                          if (confirm("Mark this card as settled?")) {
                            onSettleCard(card.id);
                          }
                        }}
                        className="flex-1 py-2 bg-green-500/20 hover:bg-green-500/30 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2"
                      >
                        <Check size={16} />
                        Settle
                      </button>
                    )}
                    <button
                      onClick={() => {
                        if (
                          confirm(
                            "Delete this card? All transactions will remain."
                          )
                        ) {
                          onDeleteCard(card.id);
                        }
                      }}
                      className="py-2 px-3 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-sm font-medium transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Card Modal */}
      <BottomSheet
        isOpen={showAddCard}
        onClose={() => setShowAddCard(false)}
        title="Add Credit Card"
      >
        <div className="space-y-6">
          <Input
            label="Card Name"
            value={cardForm.name}
            onChange={(e) => setCardForm({ ...cardForm, name: e.target.value })}
            placeholder="e.g., Kotak Platinum"
          />

          <Input
            label="Last 4 Digits"
            value={cardForm.last4}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, "").slice(0, 4);
              setCardForm({ ...cardForm, last4: val });
            }}
            placeholder="1234"
            maxLength={4}
          />

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Card Color
            </label>
            <div className="grid grid-cols-4 gap-3">
              {CARD_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setCardForm({ ...cardForm, color })}
                  className={`w-full aspect-square rounded-xl transition-all ${
                    cardForm.color === color
                      ? "ring-2 ring-white scale-110"
                      : ""
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <Button onClick={handleAddCard} fullWidth>
            Add Card
          </Button>
        </div>
      </BottomSheet>

      {/* View Transactions Modal */}
      <BottomSheet
        isOpen={showTransactions}
        onClose={() => {
          setShowTransactions(false);
          setSelectedCard(null);
        }}
        title={
          selectedCard ? `${selectedCard.name} Transactions` : "Transactions"
        }
      >
        {selectedCard && (
          <div className="space-y-4">
            {getCardTransactions(selectedCard.id).length === 0 ? (
              <p className="text-center text-gray-400 py-8">
                No transactions yet
              </p>
            ) : (
              getCardTransactions(selectedCard.id).map((transaction) => (
                <div key={transaction.id} className="p-4 bg-dark-bg rounded-xl">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">
                        {transaction.description || "Transaction"}
                      </p>
                      <p className="text-sm text-gray-400">
                        {new Date(transaction.date).toLocaleDateString()}
                      </p>
                    </div>
                    <p className="text-lg font-semibold">
                      {formatCurrency(transaction.amount)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </BottomSheet>
    </div>
  );
};

export default CreditCardManager;
