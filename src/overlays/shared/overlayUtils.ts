export interface OverlayEventBinding {
  eventName: string;
  invoke?: (event: unknown) => void;
}

export function bindOverlayEventListeners(
  target: unknown,
  listenersRef: { current: naver.maps.MapEventListener[] },
  bindings: OverlayEventBinding[]
): void {
  if (listenersRef.current.length > 0) {
    naver.maps.Event.removeListener(listenersRef.current);
    listenersRef.current = [];
  }

  listenersRef.current = bindings
    .filter((binding) => typeof binding.invoke === "function")
    .map((binding) =>
      naver.maps.Event.addListener(target, binding.eventName, (event: unknown) => {
        binding.invoke?.(event);
      })
    );
}

export function removeOverlayEventListeners(listeners: naver.maps.MapEventListener[]): void {
  if (listeners.length > 0) {
    naver.maps.Event.removeListener(listeners);
  }
}
