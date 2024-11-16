import { useCallback, useEffect, useState } from "react";
import { useYjsAwareness } from "../hooks/useYjsAwareness";
import { useYjsUsers } from "../hooks/useYjsUsers";
import { Cursor } from "./Cursor";

export function Pane() {
  const awareness = useYjsAwareness();

  // TODO: selector, compareFn으로 선언적으로 변경
  // -> compare 함수를 어떻게 작성하지..? 복잡하게 비교해야 할 바에 그냥 일정 주기로 갱신하는 게 낫지 않을까...
  const users = useYjsUsers(awareness);

  // TODO: 우선 일정 주기로 갱신시키도록
  const [, _rerender] = useState(true);
  const rerender = useCallback(() => {
    _rerender((prev) => !prev);
  }, []);

  // TODO: 우선 일정 주기로 갱신시키도록
  useEffect(() => {
    const interval = setInterval(rerender, 100);
    return () => clearInterval(interval);
  }, []);

  const userCursors = Array.from(users.entries()).map(([key, value]) => [key, value?.cursor] as const);

  // 현재 커서 위치
  const handlePointerMove: React.PointerEventHandler = useCallback((e) => {
    awareness.setLocalStateField("cursor", {
      x: e.clientX,
      y: e.clientY,
    });
  }, []);

  return (
    <div style={{ width: "100%", height: "100%" }} onPointerMove={handlePointerMove}>
      {userCursors.map(([key, value]) => {
        if (!value) {
          return null;
        }

        const id = key;
        const { x, y } = value;

        return <Cursor key={key} x={x} y={y} color={"#" + id.toString(16).slice(0, 6)} />;
      })}
    </div>
  );
}
