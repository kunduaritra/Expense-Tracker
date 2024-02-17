import { render, screen } from "@testing-library/react";
import ExpensePage from "./ExpensePage";
import { Provider } from "react-redux";
import store from "../Store";

describe("ExpensePage component", () => {
  test("Search 'Expense Type:' as a text", () => {
    render(
      <Provider store={store}>
        <ExpensePage />
      </Provider>
    );

    const expenseTypeElement = screen.getByText(/Salary/i);
    expect(expenseTypeElement).toBeInTheDocument();
  });
});
