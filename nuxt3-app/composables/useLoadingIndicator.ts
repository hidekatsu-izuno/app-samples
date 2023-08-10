export default function useLoadingIndicator() {
  return inject("useLoadingIndicator") as {
    open(options?: { throttle: number, duration: number }): void,
    close(): void,
  }
}
