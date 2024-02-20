import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import store from "./../Store/index";
import CompleteProfile from "./CompleteProfile";
import userEvent from "@testing-library/user-event";
import { act } from "react-dom/test-utils";

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

  test("Tesing complete now button after click", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <CompleteProfile />
        </MemoryRouter>
      </Provider>
    );
    window.fetch = jest.fn();
    window.fetch.mockResolvedValueOnce({
      json: async () => [
        {
          displayName: "Aritra",
          profileUrl: "xyt/testing.jpg",
        },
      ],
    });

    const completeNowElement = screen.getByRole("link");
    act(() => {
      userEvent.click(completeNowElement);
    });
  });
});
