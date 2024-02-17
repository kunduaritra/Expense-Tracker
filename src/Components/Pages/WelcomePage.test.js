import { render, screen } from "@testing-library/react";
import WelcomePage from "./WelcomePage";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "../Store";

describe("WelcomePage component", () => {
  test("Search Welcome to Expense Tracker! text", () => {
    render(
      <MemoryRouter>
        <Provider store={store}>
          <WelcomePage />
        </Provider>
      </MemoryRouter>
    );

    const welcomeElement = screen.getByText(/Welcome to Expense Tracker!/i);
    expect(welcomeElement).toBeInTheDocument();
  });
});
