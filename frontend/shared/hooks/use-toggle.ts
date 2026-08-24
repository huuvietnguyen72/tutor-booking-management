import { useCallback, useState } from "react";

export function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);

  const open = useCallback(() => setValue(true), []);
  const close = useCallback(() => setValue(false), []);
  const toggle = useCallback(() => setValue((current) => !current), []);

  return {
    value,
    setValue,
    open,
    close,
    toggle,
  };
}