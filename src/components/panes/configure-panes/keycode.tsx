import { FC, useEffect } from "react";
import type { VIAKey } from "@the-via/reader";
import { title, component } from "../../icons/keyboard";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { getSelectedKey, updateSelectedKey } from "../../../store/keymapSlice";
import { getSelectedKeyDefinitions } from "../../../store/definitionsSlice";
import { KarabinerActionEditor } from "../../../karabiner/action-editor";

export const Pane: FC = () => {
  const dispatch = useAppDispatch();
  const selectedKey = useAppSelector(getSelectedKey);
  const keys = useAppSelector(getSelectedKeyDefinitions);

  useEffect(
    () => () => {
      dispatch(updateSelectedKey(null));
    },
    [dispatch],
  );

  if (
    selectedKey !== null &&
    (keys[selectedKey] as VIAKey & { displayOnly?: boolean })?.displayOnly
  ) {
    return null;
  }

  return <KarabinerActionEditor />;
};

export { title as Title, component as Icon };
