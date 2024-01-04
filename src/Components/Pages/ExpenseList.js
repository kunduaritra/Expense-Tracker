import React from "react";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ExpenseList = ({ expenseData, onDelete, onEdit }) => {
  const handleDelete = async (item) => {
    const email = localStorage.getItem("userEmail");
    const part = email.split("@");
    const updatedEmail = part[0];
    console.log(updatedEmail);
    console.log(item);
    try {
      const res = await fetch(
        `https://expense-tracker-16e2b-default-rtdb.firebaseio.com/expense/${updatedEmail}/${item.id}.json`,
        {
          method: "DELETE",
        }
      );
      if (res.status === 200) {
        console.log("Data Successfully Deleted!");
        onDelete(item);
      }
    } catch (err) {
      alert("something went wrong");
    }
  };

  const handleEdit = (item) => {
    onEdit(item);
  };

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
                      onClick={() => handleDelete(item)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                    <button
                      className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                      onClick={() => handleEdit(item)}
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
