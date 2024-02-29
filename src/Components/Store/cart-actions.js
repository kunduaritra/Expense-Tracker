import { expenseActions } from "./expenseRedux";

export const sendCartDataToServer = (newExpense) => {
  return async (dispatch) => {
    try {
      const email = localStorage.getItem("userEmail");
      const part = email && email.split("@");
      const updatedEmail = part[0];

      const res = await fetch(
        `https://expense-tracker-16e2b-default-rtdb.firebaseio.com/expense/${updatedEmail}.json`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            date: newExpense.date,
            expense: newExpense.expense,
            description: newExpense.description,
            category: newExpense.category,
            type: newExpense.type,
          }),
        }
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error.message);
      }

      if (res.status === 200) {
        const data = await res.json();
        dispatch(expenseActions.addExpense({ newExpense, data }));
      }
    } catch (err) {
      alert(err);
    }
  };
};

export const fetchCartData = () => {
  return async (dispatch) => {
    const sendRequest = async () => {
      const email = localStorage.getItem("userEmail");
      const parts = email ? email.split("@") : [];
      const updatedEmail = parts[0];
      const res = await fetch(
        `https://expense-tracker-16e2b-default-rtdb.firebaseio.com/expense/${updatedEmail}.json`,
        {
          method: "GET",
        }
      );

      if (!res.ok) {
        throw new Error("Fetching data went wrong!");
      }

      const data = await res.json();
      if (data) {
        dispatch(expenseActions.setCartData(data));
      }
    };

    try {
      await sendRequest();
    } catch (err) {
      alert(err);
    }
  };
};

export const deleteDataFromServer = (item) => {
  return async (dispatch) => {
    const sendRequext = async () => {
      const email = localStorage.getItem("userEmail");
      const part = email.split("@");
      const updatedEmail = part[0];

      const res = await fetch(
        `https://expense-tracker-16e2b-default-rtdb.firebaseio.com/expense/${updatedEmail}/${item.id}.json`,
        {
          method: "DELETE",
        }
      );

      if (res.status === 200) {
        console.log("Data Successfully Deleted!");
        dispatch(expenseActions.deleteExpense(item));
      } else {
        const data = await res.json();
        throw new Error(data);
      }
    };
    try {
      await sendRequext();
    } catch (err) {
      alert(err);
    }
  };
};

export const updateDataInServer = (item) => {
  return async (dispatch) => {
    const sendRequest = async () => {
      const email = localStorage.getItem("userEmail");
      const part = email ? email.split("@") : [];
      const updatedEmail = part[0];
      const res = await fetch(
        `https://expense-tracker-16e2b-default-rtdb.firebaseio.com/expense/${updatedEmail}/${item.id}.json`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            date: item.date,
            expense: item.expense,
            description: item.description,
            category: item.category,
            type: item.type,
          }),
        }
      );
      if (res.ok) {
        console.log("data updated successfully");
        const data = await res.json();
        dispatch(expenseActions.setCartData(data));
      } else {
        throw new Error(res.statusText);
      }
    };
    try {
      await sendRequest();
    } catch (error) {
      console.error("Error during fetch:", error.message);
    }
  };
};
