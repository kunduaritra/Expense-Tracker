import React, { useRef, useState } from "react";
import ExpenseList from "./ExpenseList";

const ExpensePage = () => {
  const [expenseData, setExpenseData] = useState([]);
  const inputExpense = useRef();
  const inputExDescription = useRef();
  const inputExCategory = useRef();
  const inputExpenseTypeCredit = useRef();
  const inputExpenseTypeDebit = useRef();

  const addExpenseHandler = (e) => {
    e.preventDefault();
    const newExpense = {
      id: Math.random(),
      expense: inputExpense.current.value,
      description: inputExDescription.current.value,
      category: inputExCategory.current.value,
      type: inputExpenseTypeCredit.current.checked ? "Credit" : "Debit",
    };

    setExpenseData((prevExpenseData) => [...prevExpenseData, newExpense]);

    inputExpense.current.value = "";
    inputExDescription.current.value = "";
    inputExCategory.current.value = "";
    inputExpenseTypeCredit.current.checked = true;
  };

  return (
    <>
      <div className="flex justify-center items-center p-5">
        <div className="border border-gray-100 bg-sky-200 p-10 shadow-lg">
          <form onSubmit={addExpenseHandler} className="flex flex-row">
            <div className="flex items-center mb-5">
              <label className="italic font-bold mr-2">Expense:</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-2 text-gray-500">
                  ₹
                </span>
                <input
                  type="number"
                  className="pl-8 border border-gray-200 mr-4"
                  ref={inputExpense}
                />
              </div>
            </div>
            <div className="flex items-center mb-5">
              <label className="italic font-bold mr-2">Description:</label>
              <input
                type="text"
                className="border border-gray-200 mr-4"
                ref={inputExDescription}
              />
            </div>

            <div className="flex items-center mb-5">
              <label className="italic font-bold mr-2">Category:</label>
              <select
                className="border border-gray-200 italic rounded-full mr-4"
                ref={inputExCategory}
              >
                <option>Food</option>
                <option>Petrol</option>
                <option>Salary</option>
                <option>Travel</option>
              </select>
            </div>
            <div className="flex items-center mb-5">
              <label className="italic font-bold mr-2">Expense Type:</label>
              <input
                type="radio"
                name="ExpenseType"
                value="Credit"
                ref={inputExpenseTypeCredit}
                defaultChecked
              />
              <label htmlFor="Credit" className="mr-4 ml-2">
                Credit
              </label>
              <input
                type="radio"
                name="ExpenseType"
                value="Debit"
                ref={inputExpenseTypeDebit}
              />
              <label htmlFor="Debit" className="ml-2 mr-4">
                Debit
              </label>
            </div>
            <button
              type="submit"
              className="bg-pink-600 rounded-full p-3 text-white hover:bg-pink-800"
            >
              Add Expense
            </button>
          </form>
        </div>
      </div>
      <ExpenseList expenseData={expenseData} />
    </>
  );
};

export default ExpensePage;
