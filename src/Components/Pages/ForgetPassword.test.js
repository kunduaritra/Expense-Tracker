import { render, screen, act, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ForgetPassword from "./ForgetPassword";
import userEvent from "@testing-library/user-event";

describe("Forget Password component", () => {
  test("Password Reset", async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <ForgetPassword />
        </MemoryRouter>
      );
    });

    const successMessage = screen.getByText(
      "Enter Your Registered Email to get a Password Reset Link."
    );
    expect(successMessage).toBeInTheDocument();
  });

  test("link to Login/Sign Up page", async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <ForgetPassword />
        </MemoryRouter>
      );
    });

    await waitFor(() => {
      const linkElement = screen.getByText("Login | Sign Up");
      expect(linkElement.closest("a")).toHaveAttribute("href", "/");
    });
  });

  test("render 'send link' text", async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <ForgetPassword />
        </MemoryRouter>
      );
    });

    const buttonElement = screen.getByRole("button");
    await userEvent.click(buttonElement);

    const outputText = screen.getByText("Send Link");
    expect(outputText).toBeInTheDocument();
  });
});
