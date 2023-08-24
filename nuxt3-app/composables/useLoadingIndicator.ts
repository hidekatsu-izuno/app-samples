export default function useLoadingIndicator() {
  return inject("useLoadingIndicator") as {
    show(options?: { throttle: number, duration: number }): void,
    hide(): void,
  }
}
