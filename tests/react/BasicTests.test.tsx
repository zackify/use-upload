import React from "react";
import { screen, render, act } from "@testing-library/react";
import { BasicTestUpload } from "./TestComponents";
import userEvent from "@testing-library/user-event";

test("It uploads a file correctly", async () => {
  global.xhrOpen = jest.fn();
  global.xhrSend = jest.fn();
  render(<BasicTestUpload method="POST" url="github.gov" />);
  //loading is hidden
  expect(screen.queryByText("loading")).toEqual(null);

  //upload a file into the input
  const file = new File(["hello"], "hello.png", { type: "image/png" });
  userEvent.upload(screen.getByLabelText("upload"), file);

  await act(() => new Promise((resolve) => setTimeout(resolve, 0)));
  //loading is now shown
  screen.getByText("loading");

  expect(global.xhrOpen.mock.calls[0][0]).toEqual("POST");
  expect(global.xhrOpen.mock.calls[0][1]).toEqual("github.gov");
  //check the type sent to the server
  expect(global.xhrSend.mock.calls[0][0].name).toEqual("hello.png");
  expect(global.xhrSend.mock.calls[0][0].type).toEqual("image/png");
});

test("Renders done after upload is complete", async () => {
  global.xhrListener = jest.fn();
  render(<BasicTestUpload method="POST" url="github.gov" />);

  //upload a file into the input
  const file = new File(["hello"], "hello.png", { type: "image/png" });
  userEvent.upload(screen.getByLabelText("upload"), file);
  //wait for the next tick
  await act(() => new Promise((resolve) => setTimeout(resolve, 0)));

  expect(global.xhrListener.mock.calls[1][0]).toEqual("load");
  expect(screen.queryByText("done")).toEqual(null);

  //call the load method on the xhr mock
  act(() => global.xhrListener.mock.calls[1][1]());

  expect(screen.getByText("done")).toBeTruthy();
});

test("Renders upload progress", async () => {
  global.xhrListener = jest.fn();
  render(<BasicTestUpload method="POST" url="github.gov" />);

  //upload a file into the input
  const file = new File(["hello"], "hello.png", { type: "image/png" });
  userEvent.upload(screen.getByLabelText("upload"), file);
  //wait for the next tick
  await act(() => new Promise((resolve) => setTimeout(resolve, 0)));

  expect(global.xhrListener.mock.calls[0][0]).toEqual("progress");
  expect(screen.queryByText("done")).toEqual(null);

  //call the load method on the xhr mock
  act(() => global.xhrListener.mock.calls[0][1]({ loaded: 20, total: 100 }));

  expect(screen.getByText("loading")).toBeTruthy();
  expect(screen.getByText("20% progress")).toBeTruthy();
});

test("Renders error message if xhr fails", async () => {
  global.xhrListener = jest.fn();
  render(<BasicTestUpload method="POST" url="github.gov" />);

  //upload a file into the input
  const file = new File(["hello"], "hello.png", { type: "image/png" });
  userEvent.upload(screen.getByLabelText("upload"), file);
  //wait for the next tick
  await act(() => new Promise((resolve) => setTimeout(resolve, 0)));

  expect(global.xhrListener.mock.calls[2][0]).toEqual("error");
  expect(screen.queryByText("bad error!")).toEqual(null);

  //call the load method on the xhr mock
  act(() => global.xhrListener.mock.calls[2][1]("bad error!"));

  expect(screen.getByText("bad error!")).toBeTruthy();
});

test("Renders error message if xhr aborts", async () => {
  global.xhrListener = jest.fn();
  render(<BasicTestUpload method="POST" url="github.gov" />);

  //upload a file into the input
  const file = new File(["hello"], "hello.png", { type: "image/png" });
  userEvent.upload(screen.getByLabelText("upload"), file);
  //wait for the next tick
  await act(() => new Promise((resolve) => setTimeout(resolve, 0)));

  expect(global.xhrListener.mock.calls[3][0]).toEqual("abort");
  expect(screen.queryByText("bad abort!")).toEqual(null);

  //call the load method on the xhr mock
  act(() => global.xhrListener.mock.calls[3][1]("bad abort!"));

  expect(screen.getByText("bad abort!")).toBeTruthy();
});

test("Skips upload if options return null", async () => {
  let skipOptions = jest.fn();
  render(
    <BasicTestUpload
      method="POST"
      url="github.gov"
      skipOptionsCb={skipOptions}
    />
  );

  //upload a file into the input
  const file = new File(["hello"], "hello.png", { type: "image/png" });
  userEvent.upload(screen.getByLabelText("upload"), file);
  //wait for the next tick
  await act(() => new Promise((resolve) => setTimeout(resolve, 0)));

  expect(skipOptions.mock.calls.length).toEqual(1);
});
