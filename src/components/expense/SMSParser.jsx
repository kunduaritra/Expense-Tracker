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
      {/* Scrollable container */}
      <div className="flex flex-col max-h-[80vh] overflow-hidden">
        <div className="overflow-y-auto px-4 pt-4 pb-[100px] space-y-6">
          {step === 1 ? (
            <div className="space-y-4">
              {/* SMS Textarea */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Paste Transaction SMS
                </label>
                <textarea
                  value={smsText}
                  onChange={(e) => setSmsText(e.target.value)}
                  placeholder="Paste your bank transaction SMS here..."
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
            <>
              {/* Parsed Data Form */}
              {/* ... all the parsedData inputs ... */}
              {/* Example Amount */}
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

              {/* Add all other fields: Merchant, Category, Date, Payment Method */}
            </>
          )}
        </div>

        {/* Sticky button container */}
        {step === 2 && (
          <div className="fixed bottom-[60px] left-0 right-0 px-4 pb-4 bg-dark-bg border-t border-dark-border flex gap-3">
            <Button variant="secondary" onClick={handleBack} fullWidth>
              Back
            </Button>
            <Button onClick={handleConfirm} fullWidth>
              Confirm & Add
            </Button>
          </div>
        )}
      </div>
    </BottomSheet>
  );
};

export default SMSParser;
