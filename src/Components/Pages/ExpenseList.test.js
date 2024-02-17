import ExpenseList from "./ExpenseList";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import store from "./../Store";

describe("Expense List component", () => {
  test("search 'Expense List' text", () => {
    render(
      <Provider store={store}>
        <ExpenseList />
      </Provider>
    );

    const expenseListTextElement = screen.getByText(/Expense List/i);
    expect(expenseListTextElement).toBeInTheDocument();
  });
});
