import React from "react";
import { screen, render, act } from "@testing-library/svelte";
import BasicTestUpload from "./TestComponent.svelte";
import userEvent from "@testing-library/user-event";

test("Sets response headers into an object", async () => {
  global.xhrListener = jest.fn();
  render(BasicTestUpload, { method: "POST", url: "github.gov" });

  //upload a file into the input
  const file = new File(["hello"], "hello.png", { type: "image/png" });
  userEvent.upload(screen.getByLabelText("upload"), file);
  //wait for the next tick
  await act(() => new Promise((resolve) => setTimeout(resolve, 0)));

  expect(global.xhrListener.mock.calls[1][0]).toEqual("load");
  expect(screen.queryByText("done")).toEqual(null);

  //call the load method on the xhr mock
  act(() => global.xhrListener.mock.calls[1][1]());
  //wait for the next tick
  await act(() => new Promise((resolve) => setTimeout(resolve, 0)));

  expect(screen.getByText("The test response header")).toBeTruthy();
});

test("Sets request headers from options object", async () => {
  global.xhrRequestHeader = jest.fn();
  render(BasicTestUpload, {
    method: "POST",
    url: "github.gov",
    headers: { yo: "awesome", another: "cool" },
  });

  //upload a file into the input
  const file = new File(["hello"], "hello.png", { type: "image/png" });
  userEvent.upload(screen.getByLabelText("upload"), file);
  //wait for the next tick
  await act(() => new Promise((resolve) => setTimeout(resolve, 0)));

  expect(global.xhrRequestHeader.mock.calls[0][0]).toEqual("yo");
  expect(global.xhrRequestHeader.mock.calls[0][1]).toEqual("awesome");
  expect(global.xhrRequestHeader.mock.calls[1][0]).toEqual("another");
  expect(global.xhrRequestHeader.mock.calls[1][1]).toEqual("cool");
});
