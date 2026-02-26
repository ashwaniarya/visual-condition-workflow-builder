import type { CanvasEventType, CanvasEventPayloadMap } from "./canvasEventTypes";

type EventHandler<T> = (payload: T) => void;

const subscribers = new Map<
  CanvasEventType,
  Set<EventHandler<CanvasEventPayloadMap[CanvasEventType]>>
>();

export function emitCanvasEvent<T extends CanvasEventType>(
  type: T,
  payload: CanvasEventPayloadMap[T]
): void {
  subscribers.get(type)?.forEach((handler) => handler(payload as never));
}

export function subscribeCanvasEvent<T extends CanvasEventType>(
  type: T,
  handler: EventHandler<CanvasEventPayloadMap[T]>
): () => void {
  const set =
    subscribers.get(type) ??
    new Set<EventHandler<CanvasEventPayloadMap[CanvasEventType]>>();
  set.add(handler as EventHandler<CanvasEventPayloadMap[CanvasEventType]>);
  subscribers.set(type, set);
  return () => {
    set.delete(handler as EventHandler<CanvasEventPayloadMap[CanvasEventType]>);
    if (set.size === 0) subscribers.delete(type);
  };
}
