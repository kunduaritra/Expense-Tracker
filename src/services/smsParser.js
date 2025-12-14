// export const parseSMS = (smsText) => {
//   const patterns = {
//     amount: /(?:Rs\.?|INR|₹)\s*(\d+(?:,\d+)*(?:\.\d{2})?)/i,
//     date: /(\d{1,2}[-/]\d{1,2}[-/]\d{2,4})/,
//     merchant: /(?:at|to|from)\s+([A-Z][A-Za-z\s&]+)/i,
//     upi: /UPI\/(\d+)/,
//     cardLast4: /\*+(\d{4})/,
//   };

//   const amountMatch = smsText.match(patterns.amount);
//   const dateMatch = smsText.match(patterns.date);
//   const merchantMatch = smsText.match(patterns.merchant);
//   const upiMatch = smsText.match(patterns.upi);
//   const cardMatch = smsText.match(patterns.cardLast4);

//   const amount = amountMatch ? parseFloat(amountMatch[1].replace(/,/g, "")) : 0;
//   const merchant = merchantMatch ? merchantMatch[1].trim() : "";
//   const transactionId = upiMatch ? upiMatch[1] : cardMatch ? cardMatch[1] : "";

//   // Auto-categorize based on merchant/keywords
//   let category = "others";
//   const text = smsText.toLowerCase();

//   if (
//     text.includes("swiggy") ||
//     text.includes("zomato") ||
//     text.includes("restaurant") ||
//     text.includes("food")
//   ) {
//     category = "food";
//   } else if (
//     text.includes("uber") ||
//     text.includes("ola") ||
//     text.includes("petrol") ||
//     text.includes("fuel")
//   ) {
//     category = "transport";
//   } else if (
//     text.includes("amazon") ||
//     text.includes("flipkart") ||
//     text.includes("myntra")
//   ) {
//     category = "shopping";
//   } else if (
//     text.includes("netflix") ||
//     text.includes("spotify") ||
//     text.includes("hotstar") ||
//     text.includes("prime")
//   ) {
//     category = "entertainment";
//   } else if (
//     text.includes("electricity") ||
//     text.includes("water") ||
//     text.includes("gas") ||
//     text.includes("bill")
//   ) {
//     category = "bills";
//   } else if (
//     text.includes("hospital") ||
//     text.includes("pharmacy") ||
//     text.includes("medicine")
//   ) {
//     category = "health";
//   }

//   return {
//     amount,
//     merchant,
//     category,
//     date: dateMatch ? dateMatch[1] : new Date().toISOString().split("T")[0],
//     transactionId,
//     paymentMethod: upiMatch ? "UPI" : cardMatch ? "Card" : "Unknown",
//   };
// };

// export const categorizeMerchant = (merchant) => {
//   const merchantLower = merchant.toLowerCase();

//   const categories = {
//     food: [
//       "swiggy",
//       "zomato",
//       "restaurant",
//       "cafe",
//       "dominos",
//       "pizza",
//       "mcdonald",
//     ],
//     transport: ["uber", "ola", "rapido", "petrol", "fuel", "parking"],
//     shopping: ["amazon", "flipkart", "myntra", "ajio", "nykaa", "mall"],
//     entertainment: [
//       "netflix",
//       "spotify",
//       "hotstar",
//       "prime",
//       "movie",
//       "pvr",
//       "inox",
//     ],
//     bills: ["electricity", "water", "gas", "broadband", "mobile", "recharge"],
//     health: ["hospital", "pharmacy", "apollo", "medicine", "clinic"],
//   };

//   for (const [category, keywords] of Object.entries(categories)) {
//     if (keywords.some((keyword) => merchantLower.includes(keyword))) {
//       return category;
//     }
//   }

//   return "others";
// };
export const parseSMS = (smsText) => {
  const patterns = {
    amount: /(?:Rs\.?|INR|₹)\s*(\d+(?:,\d+)*(?:\.\d{2})?)/i,
    date: /(\d{1,2})[-\/](\d{1,2})[-\/](\d{2,4})/,
    merchant:
      /(?:at|to|from|paid to)\s+([A-Z][A-Za-z\s&\.]+?)(?:\s+on|\s+via|\s+UPI|\s+\*|\s+A\/c|$)/i,
    upi: /UPI[\/:]?\s*(\d+)/i,
    cardLast4: /\*+(\d{4})/,
    upiId: /[a-zA-Z0-9._-]+@[a-zA-Z]+/,
  };

  const amountMatch = smsText.match(patterns.amount);
  const dateMatch = smsText.match(patterns.date);
  const merchantMatch = smsText.match(patterns.merchant);
  const upiMatch = smsText.match(patterns.upi);
  const cardMatch = smsText.match(patterns.cardLast4);
  const upiIdMatch = smsText.match(patterns.upiId);

  const amount = amountMatch ? parseFloat(amountMatch[1].replace(/,/g, "")) : 0;
  let merchant = merchantMatch ? merchantMatch[1].trim() : "";

  // If merchant is still empty, try to extract from UPI ID
  if (!merchant && upiIdMatch) {
    const upiParts = upiIdMatch[0].split("@")[0];
    merchant = upiParts.replace(/[._-]/g, " ").trim();
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

  const transactionId = upiMatch ? upiMatch[1] : cardMatch ? cardMatch[1] : "";

  // Determine payment method
  let paymentMethod = "Unknown";
  const lowerText = smsText.toLowerCase();
  if (lowerText.includes("upi") || upiIdMatch) {
    paymentMethod = "UPI";
  } else if (cardMatch || lowerText.includes("card")) {
    paymentMethod = "Card";
  } else if (
    lowerText.includes("netbanking") ||
    lowerText.includes("net banking")
  ) {
    paymentMethod = "Net Banking";
  } else if (lowerText.includes("cash")) {
    paymentMethod = "Cash";
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
