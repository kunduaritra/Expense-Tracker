import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import store from "./../Store/index";
import CompleteProfile from "./CompleteProfile";

describe("Complete Profile Page", () => {
  test("renders 'Complete Now.' text", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <CompleteProfile />
        </MemoryRouter>
      </Provider>
    );

    const completeNowElement = screen.getByText("Complete Now.");
    expect(completeNowElement).toBeInTheDocument();
  });
  test("profile completion message displayed for incomplete profile", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <CompleteProfile />
        </MemoryRouter>
      </Provider>
    );
    expect(
      screen.getByText(
        "Your Profile is 64% completed. A Complete Profile has higher chances"
      )
    ).toBeInTheDocument();
  });
});
