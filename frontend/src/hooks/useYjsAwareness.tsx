import { useYDocStore } from "../store/ydoc";

export function useYjsAwareness() {
  const provider = useYDocStore((s) => s.provider);

  return provider.awareness;
}
