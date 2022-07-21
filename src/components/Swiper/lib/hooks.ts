import { useRef, useState, RefObject } from "react";

export function getRefValue<T>(ref: RefObject<T>) {
  return ref.current as T;
}

export function useStateRef<S>(
  defaultValue: S
): [S, (value: S) => void, RefObject<S>] {
  const ref = useRef<S>(defaultValue);
  const [state, _setState] = useState<S>(defaultValue);
  const setState = (value: S) => {
    _setState(value);
    ref.current = value;
  };

  return [state, setState, ref];
}
