import React, { useEffect, useRef, useState } from "react";
import ExpenseList from "./ExpenseList";

const ExpensePage = () => {
  const [expenseData, setExpenseData] = useState([]);
  const inputExpense = useRef();
  const inputExDescription = useRef();
  const inputExCategory = useRef();
  const inputExpenseTypeCredit = useRef();
  const inputExpenseTypeDebit = useRef();
  const inputExDate = useRef();

  const addExpenseHandler = async (e) => {
    e.preventDefault();
    if (
      inputExpense.current.value &&
      inputExDescription.current.value &&
      inputExCategory.current.value &&
      inputExDate.current.value
    ) {
      if (
        inputExpenseTypeCredit.current.value ||
        inputExpenseTypeDebit.current.value
      ) {
        const newExpense = {
          id: Math.random(),
          date: inputExDate.current.value,
          expense: inputExpense.current.value,
          description: inputExDescription.current.value,
          category: inputExCategory.current.value,
          type: inputExpenseTypeCredit.current.checked ? "Credit" : "Debit",
        };

        const email = localStorage.getItem("userEmail");
        const parts = email.split("@");
        const updatedEmail = parts[0];
        try {
          const res = await fetch(
            `https://expense-tracker-16e2b-default-rtdb.firebaseio.com/expense/${updatedEmail}.json`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                date: inputExDate.current.value,
                expense: inputExpense.current.value,
                description: inputExDescription.current.value,
                category: inputExCategory.current.value,
                type: inputExpenseTypeCredit.current.checked
                  ? "Credit"
                  : "Debit",
              }),
            }
          );
          if (!res.ok) {
            const data = await res.json();
            throw new Error(data.error.message);
          }
          if (res.status === 200) {
            setExpenseData((prevExpenseData) => [
              ...prevExpenseData,
              newExpense,
            ]);
          }
        } catch (err) {
          alert(err.message);
        }

        inputExDate.current.value = "";
        inputExpense.current.value = "";
        inputExDescription.current.value = "";
        inputExCategory.current.value = "";
        inputExpenseTypeCredit.current.checked = true;
      }
    }
  };

  const fetchDataFromServer = async () => {
    const email = localStorage.getItem("userEmail");
    const parts = email.split("@");
    const updatedEmail = parts[0];
    const res = await fetch(
      `https://expense-tracker-16e2b-default-rtdb.firebaseio.com/expense/${updatedEmail}.json`,
      {
        method: "GET",
      }
    );
    const data = await res.json();
    if (data) {
      const expensesArray = Object.values(data);
      setExpenseData(expensesArray);
    }
  };

  useEffect(() => {
    fetchDataFromServer();
  }, [addExpenseHandler]);

  return (
    <>
      <div className="flex justify-center items-center p-5">
        <div className="border border-gray-100 bg-sky-200 p-10 shadow-lg  md:justify-center md:items-center">
          <form
            onSubmit={addExpenseHandler}
            className="flex flex-col md:flex-row items-center justify-center"
          >
            <div className="flex items-center mb-5">
              <label className="italic font-bold mr-2">Date:</label>
              <input
                type="date"
                className="border border-gray-200 mr-4"
                ref={inputExDate}
              />
            </div>
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
                <option>Mobile Recharge</option>
                <option>OTT</option>
                <option>UPI</option>
                <option>Others</option>
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
