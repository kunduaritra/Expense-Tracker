import React, { useEffect, useRef, useState } from "react";
import ExpenseList from "./ExpenseList";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCartData,
  sendCartDataToServer,
  updateDataInServer,
} from "../Store/cart-actions";

const ExpensePage = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [itemId, setItemId] = useState(null);

  const inputExpense = useRef();
  const inputExDescription = useRef();
  const inputExCategory = useRef();
  const inputExpenseTypeCredit = useRef();
  const inputExpenseTypeDebit = useRef();
  const inputExDate = useRef();

  // const isUpdating = useSelector((state) => state.expense.updating);
  const theme = useSelector((state) => state.theme);
  const dispatch = useDispatch();

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
          date: inputExDate.current.value,
          expense: inputExpense.current.value,
          description: inputExDescription.current.value,
          category: inputExCategory.current.value,
          type: inputExpenseTypeCredit.current.checked ? "Credit" : "Debit",
        };
        dispatch(sendCartDataToServer(newExpense));

        inputExDate.current.value = "";
        inputExpense.current.value = "";
        inputExDescription.current.value = "";
        inputExCategory.current.value = "";
        inputExpenseTypeCredit.current.checked = true;
      }
    }
  };

  const fetchDataFromServer = async () => {
    dispatch(fetchCartData());
  };

  const handleUpdate = async (item) => {
    setIsUpdating(true);
    inputExDate.current.value = item.date;
    inputExpense.current.value = item.expense;
    inputExDescription.current.value = item.description;
    inputExCategory.current.value = item.category;
    inputExpenseTypeCredit.current.checked = item.type === "Credit";
    inputExpenseTypeDebit.current.checked = item.type === "Debit";

    setItemId(item.id);
  };

  const updateExpenseHandler = async (e) => {
    e.preventDefault();
    const updateData = {
      id: itemId,
      date: inputExDate.current.value,
      expense: inputExpense.current.value,
      description: inputExDescription.current.value,
      category: inputExCategory.current.value,
      type: inputExpenseTypeCredit.current.checked ? "Credit" : "Debit",
    };
    setIsUpdating(false);
    dispatch(updateDataInServer(updateData));
    inputExDate.current.value = "";
    inputExpense.current.value = "";
    inputExDescription.current.value = "";
    inputExCategory.current.value = "";
    inputExpenseTypeCredit.current.checked = true;
  };

  useEffect(() => {
    fetchDataFromServer();
  });

  const totalExpense = useSelector((state) => state.expense.totalExpense);

  return (
    <>
      <div
        className={`${theme.isDarkTheme ? "dark-theme-table" : "light-theme"}`}
      >
        <div className="flex justify-center items-center p-5">
          <div className="border border-gray-100 bg-sky-200 p-10 shadow-lg  md:justify-center md:items-center">
            <div> expense ₹{totalExpense}</div>
            <form
              onSubmit={isUpdating ? updateExpenseHandler : addExpenseHandler}
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
                {!isUpdating ? "Add Expense" : "Update"}
              </button>
            </form>
          </div>
        </div>
        <ExpenseList onEdit={handleUpdate} />
      </div>
    </>
  );
};

export default ExpensePage;
