import React, { useState } from "react";
import BottomSheet from "../common/BottomSheet";
import Button from "../common/Button";
import { Upload, Sparkles } from "lucide-react";
import { parseSMS } from "../../services/smsParser";
import CategoryPicker from "./CategoryPicker";

const SMSParser = ({ isOpen, onClose, onSubmit }) => {
  const [smsText, setSmsText] = useState("");
  const [parsedData, setParsedData] = useState(null);
  const [step, setStep] = useState(1); // 1: paste SMS, 2: review & edit

  const handleParse = () => {
    const data = parseSMS(smsText);
    setParsedData(data);
    setStep(2);
  };

  const handleConfirm = () => {
    onSubmit({
      ...parsedData,
      type: "expense",
      description: parsedData.merchant || "SMS Transaction",
    });

    // Reset
    setSmsText("");
    setParsedData(null);
    setStep(1);
    onClose();
  };

  const handleBack = () => {
    setStep(1);
    setParsedData(null);
  };

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={() => {
        onClose();
        setSmsText("");
        setParsedData(null);
        setStep(1);
      }}
      title="Parse SMS Transaction"
    >
      {step === 1 ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Paste Transaction SMS
            </label>
            <textarea
              value={smsText}
              onChange={(e) => setSmsText(e.target.value)}
              placeholder="Paste your bank transaction SMS here...&#10;&#10;Example:&#10;Rs 500.00 debited from A/c XX1234 on 15-Dec-24 at Swiggy Mumbai via UPI/123456789"
              className="w-full h-48 px-4 py-3 bg-dark-card rounded-xl border border-dark-border text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 resize-none"
            />
          </div>

          <Button
            onClick={handleParse}
            disabled={!smsText.trim()}
            fullWidth
            icon={Sparkles}
          >
            Parse SMS
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
            <p className="text-sm text-green-400 flex items-center gap-2">
              <Sparkles size={16} />
              SMS parsed successfully! Review the details below.
            </p>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Amount
            </label>
            <input
              type="number"
              value={parsedData.amount}
              onChange={(e) =>
                setParsedData({
                  ...parsedData,
                  amount: parseFloat(e.target.value),
                })
              }
              className="w-full px-4 py-3 bg-dark-card rounded-xl border border-dark-border text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Merchant */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Merchant / Description
            </label>
            <input
              type="text"
              value={parsedData.merchant}
              onChange={(e) =>
                setParsedData({ ...parsedData, merchant: e.target.value })
              }
              className="w-full px-4 py-3 bg-dark-card rounded-xl border border-dark-border text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Category
            </label>
            <CategoryPicker
              selected={parsedData.category}
              onSelect={(category) =>
                setParsedData({ ...parsedData, category })
              }
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Date
            </label>
            <input
              type="date"
              value={parsedData.date}
              onChange={(e) =>
                setParsedData({ ...parsedData, date: e.target.value })
              }
              className="w-full px-4 py-3 bg-dark-card rounded-xl border border-dark-border text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Payment Method
            </label>
            <input
              type="text"
              value={parsedData.paymentMethod}
              onChange={(e) =>
                setParsedData({ ...parsedData, paymentMethod: e.target.value })
              }
              className="w-full px-4 py-3 bg-dark-card rounded-xl border border-dark-border text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <Button variant="secondary" onClick={handleBack} fullWidth>
              Back
            </Button>
            <Button onClick={handleConfirm} fullWidth>
              Confirm & Add
            </Button>
          </div>
        </div>
      )}
    </BottomSheet>
  );
};

export default SMSParser;
