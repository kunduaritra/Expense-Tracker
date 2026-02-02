export const parseSMS = (smsText) => {
  const patterns = {
    amount: /(?:Rs\.?|INR|₹)\s*(\d+(?:,\d+)*(?:\.\d{2})?)/i,
    date: /(\d{1,2})[-\/](\d{1,2})[-\/](\d{2,4})/,
    // Enhanced merchant patterns for different bank formats
    merchantCredited:
      /(?:credited|paid to|transferred to)\s+(?:Mr|Mrs|Ms|M\/s)?\s*([A-Z][A-Za-z\s&\.]+?)(?:\s+credited|\s+UPI|\s+RRN|\s+Ref|\.|$)/i,
    merchantDebited:
      /(?:at|to|from|paid at)\s+([A-Z][A-Za-z\s&\.]+?)(?:\s+on|\s+via|\s+UPI|\s+\*|\s+A\/c|$)/i,
    upi: /UPI[\/:\s]*(\d+)/i,
    rrn: /RRN[:\s]*(\d+)/i,
    cardLast4: /(?:card|a\/c).*?\*+(\d{4})/i,
    upiId: /[a-zA-Z0-9._-]+@[a-zA-Z]+/,
    // Credit card patterns
    creditCard: /credit\s*card/i,
    debitCard: /debit\s*card/i,
  };

  const amountMatch = smsText.match(patterns.amount);
  const dateMatch = smsText.match(patterns.date);
  const upiMatch = smsText.match(patterns.upi);
  const rrnMatch = smsText.match(patterns.rrn);
  const cardMatch = smsText.match(patterns.cardLast4);
  const upiIdMatch = smsText.match(patterns.upiId);

  const amount = amountMatch ? parseFloat(amountMatch[1].replace(/,/g, "")) : 0;

  // Enhanced merchant detection
  let merchant = "";

  // Try credited pattern first (for person-to-person transfers)
  const creditedMatch = smsText.match(patterns.merchantCredited);
  if (creditedMatch) {
    merchant = creditedMatch[1].trim();
  } else {
    // Try debited pattern (for purchases)
    const debitedMatch = smsText.match(patterns.merchantDebited);
    if (debitedMatch) {
      merchant = debitedMatch[1].trim();
    }
  }

  // If merchant still empty, try to extract from UPI ID
  if (!merchant && upiIdMatch) {
    const upiParts = upiIdMatch[0].split("@")[0];
    merchant = upiParts.replace(/[._-]/g, " ").trim();
  }

  // Clean up merchant name
  if (merchant) {
    // Remove extra spaces and special characters
    merchant = merchant.replace(/\s+/g, " ").trim();
    // Capitalize first letter of each word
    merchant = merchant
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  }

  // Parse date properly
  let parsedDate = new Date().toISOString().split("T")[0];
  if (dateMatch) {
    const day = dateMatch[1].padStart(2, "0");
    const month = dateMatch[2].padStart(2, "0");
    let year = dateMatch[3];

    // Handle 2-digit year
    if (year.length === 2) {
      year = "20" + year;
    }

    parsedDate = `${year}-${month}-${day}`;
  }

  const transactionId = rrnMatch
    ? rrnMatch[1]
    : upiMatch
      ? upiMatch[1]
      : cardMatch
        ? cardMatch[1]
        : "";

  // Enhanced payment method detection
  let paymentMethod = "Cash";
  const lowerText = smsText.toLowerCase();

  if (patterns.creditCard.test(smsText)) {
    paymentMethod = "Credit Card";
  } else if (patterns.debitCard.test(smsText)) {
    paymentMethod = "Card";
  } else if (lowerText.includes("upi") || upiIdMatch || rrnMatch) {
    paymentMethod = "UPI";
  } else if (
    lowerText.includes("netbanking") ||
    lowerText.includes("net banking") ||
    lowerText.includes("neft") ||
    lowerText.includes("imps") ||
    lowerText.includes("rtgs")
  ) {
    paymentMethod = "Net Banking";
  } else if (cardMatch) {
    paymentMethod = "Card";
  }

  // Auto-categorize based on merchant/keywords
  let category = "others";
  const text = smsText.toLowerCase();

  if (
    text.includes("swiggy") ||
    text.includes("zomato") ||
    text.includes("restaurant") ||
    text.includes("food")
  ) {
    category = "food";
  } else if (
    text.includes("uber") ||
    text.includes("ola") ||
    text.includes("petrol") ||
    text.includes("fuel")
  ) {
    category = "transport";
  } else if (
    text.includes("amazon") ||
    text.includes("flipkart") ||
    text.includes("myntra")
  ) {
    category = "shopping";
  } else if (
    text.includes("netflix") ||
    text.includes("spotify") ||
    text.includes("hotstar") ||
    text.includes("prime")
  ) {
    category = "entertainment";
  } else if (
    text.includes("electricity") ||
    text.includes("water") ||
    text.includes("gas") ||
    text.includes("bill")
  ) {
    category = "bills";
  } else if (
    text.includes("hospital") ||
    text.includes("pharmacy") ||
    text.includes("medicine")
  ) {
    category = "health";
  }

  return {
    amount,
    merchant: merchant || "Unknown Merchant",
    category,
    date: parsedDate,
    transactionId,
    paymentMethod,
  };
};
