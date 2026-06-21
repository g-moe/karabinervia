import { useEffect, useState } from "react";
import { TestKeyState } from "src/types/types";
import { getIndexByEvent } from "./key-event";

type TestKeys = { [code: number]: TestKeyState };
export const useGlobalKeys = (enableGlobalKeys: boolean) => {
  const selectedKeysState = useState<TestKeys>({});
  const [, setSelectedKeys] = selectedKeysState;

  useEffect(() => {
    if (!enableGlobalKeys) {
      return;
    }

    const setKeyState = (evt: KeyboardEvent, state: TestKeyState) => {
      const index = getIndexByEvent(evt);
      if (index < 0) {
        return;
      }

      evt.preventDefault();
      setSelectedKeys((selectedKeys) =>
        selectedKeys[index] === state
          ? selectedKeys
          : {
              ...selectedKeys,
              [index]: state,
            },
      );
    };

    const downHandler = (evt: KeyboardEvent) => {
      if (!evt.repeat) {
        setKeyState(evt, TestKeyState.KeyDown);
      }
    };

    const upHandler = (evt: KeyboardEvent) => {
      setKeyState(evt, TestKeyState.KeyUp);
    };

    window.addEventListener("keydown", downHandler);
    window.addEventListener("keyup", upHandler);

    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener("keydown", downHandler);
      window.removeEventListener("keyup", upHandler);
    };
  }, [enableGlobalKeys]); // Empty array ensures that effect is only run on mount and unmount
  return selectedKeysState;
};
