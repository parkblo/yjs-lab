import { useCallback, useRef, useSyncExternalStore } from "react";
import { WebsocketProvider } from "y-websocket";

type Awareness = WebsocketProvider["awareness"];
type YjsUsers = ReturnType<Awareness["getStates"]>;

export function useYjsUsers(awareness: Awareness): YjsUsers;
export function useYjsUsers<S>(
  awareness: Awareness,
  selector?: (s: YjsUsers) => S,
  compare?: (a: S, b: S) => boolean
): S;

export function useYjsUsers<S>(
  awareness: Awareness,
  selector: (s: YjsUsers) => S = (s) => s as S
) {
  const stateRef = useRef<YjsUsers>();

  if (!stateRef.current) {
    stateRef.current = awareness.getStates();
  }

  const subscribe = useCallback(
    (rerender: () => void) => {
      const handleAwarenessChange = () => {
        stateRef.current = awareness.getStates();
        rerender();
      };

      awareness.on("change", handleAwarenessChange);
      return () => void awareness.off("change", handleAwarenessChange);
    },
    [awareness]
  );

  const getSnapshot = () => selector(stateRef.current || new Map());

  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
