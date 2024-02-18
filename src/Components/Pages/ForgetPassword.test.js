import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ForgetPassword from "./ForgetPassword";
import userEvent from "@testing-library/user-event";

describe("Forget Password component", () => {
  test("Password Reset", () => {
    render(
      <MemoryRouter>
        <ForgetPassword />
      </MemoryRouter>
    );

    const successMessage = screen.getByText(
      "Enter Your Registered Email to get a Password Reset Link."
    );
    expect(successMessage).toBeInTheDocument();
  });
  test("link to Login/Sign Up page", () => {
    render(
      <MemoryRouter>
        <ForgetPassword />
      </MemoryRouter>
    );

    expect(screen.getByText("Login | Sign Up").closest("a")).toHaveAttribute(
      "href",
      "/"
    );
  });

  test("render 'send link' text", () => {
    render(
      <MemoryRouter>
        <ForgetPassword />
      </MemoryRouter>
    );

    const buttonElement = screen.getByRole("button");
    userEvent.click(buttonElement);

    const outputText = screen.getByText("Send Link");
    expect(outputText).toBeInTheDocument();
  });
});
