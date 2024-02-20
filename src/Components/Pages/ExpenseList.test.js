import ExpenseList from "./ExpenseList";
import { render, screen, waitFor } from "@testing-library/react";
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

  test("test expense data", async () => {
    render(
      <Provider store={store}>
        <ExpenseList />
      </Provider>
    );

    window.fetch = jest.fn();
    window.fetch.mockResolvedValueOnce({
      json: async () => [
        {
          id: 1,
          date: "12-01-24",
          expense: 2000,
          description: "testing purpose",
          category: "test",
          type: "test",
        },
      ],
    });

    const tableItemsElement = await screen.findAllByRole("table");
    expect(tableItemsElement).not.toHaveLength(0);
  });
});
