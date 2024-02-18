import { render, screen } from "@testing-library/react";
import WelcomePage from "./WelcomePage";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "../Store";
import userEvent from "@testing-library/user-event";

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

  test("render 'Your profile is incomplete.' text", () => {
    render(
      <MemoryRouter>
        <Provider store={store}>
          <WelcomePage />
        </Provider>
      </MemoryRouter>
    );

    const buttonElement = screen.getByRole("link");
    userEvent.click(buttonElement);

    const afterClickText = screen.getByText("Your profile is incomplete.", {
      exact: false,
    });
    expect(afterClickText).toBeInTheDocument();
  });
  test("render 'Complete Now.' text", () => {
    render(
      <MemoryRouter>
        <Provider store={store}>
          <WelcomePage />
        </Provider>
      </MemoryRouter>
    );

    const buttonElement = screen.getByRole("link");
    userEvent.click(buttonElement);

    const afterClickText = screen.getByText("Complete Now.", {
      exact: false,
    });
    expect(afterClickText).toBeInTheDocument();
  });
});
