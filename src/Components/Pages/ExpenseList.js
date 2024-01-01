import React from "react";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ExpenseList = ({ expenseData }) => {
  return (
    <>
      <div className="mt-5 max-w-lg mx-auto">
        <h1 className="text-xl font-bold mb-2 text-center">Expense List</h1>
        <div className="flex justify-center">
          <table className="text-center border border-black w-full">
            <thead>
              <tr className="bg-gray-200 border border-black">
                <th className="p-4 border border-black">Date</th>
                <th className="p-4 border border-black">Amount</th>
                <th className="p-4 border border-black">Description</th>
                <th className="p-4 border border-black">Category</th>
                <th className="p-4 border border-black">Type</th>
                <th className="p-4 border border-black">Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenseData.map((item) => (
                <tr
                  key={item.id}
                  className={`border border-black ${
                    item.type === "Credit" ? "bg-green-100" : "bg-red-100"
                  }`}
                >
                  <td
                    className="p-4 border border-black text-lg"
                    style={{ minWidth: "150px" }}
                  >
                    {item.date}
                  </td>
                  <td className="p-4 border border-black text-lg">
                    ₹{item.expense}
                  </td>
                  <td
                    className="p-4 border border-black text-lg"
                    style={{ minWidth: "150px" }}
                  >
                    {item.description}
                  </td>
                  <td className="p-4 border border-black text-lg">
                    {item.category}
                  </td>
                  <td className="p-4 border border-black text-lg">
                    {item.type}
                  </td>
                  <td className="p-4 flex justify-center space-x-2 ">
                    <button
                      className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
                      // onClick={() => handleDelete(item.id)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                    <button
                      className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                      // onClick={() => handleEdit(item.id)}
                    >
                      <FontAwesomeIcon icon={faPenToSquare} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default ExpenseList;
