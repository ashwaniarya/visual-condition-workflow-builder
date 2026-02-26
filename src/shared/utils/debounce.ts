type DebouncedFunction<TArgs extends unknown[]> = ((...args: TArgs) => void) & {
  cancel: () => void
}

export function debounce<TArgs extends unknown[]>(
  callback: (...args: TArgs) => void,
  delayMs: number,
): DebouncedFunction<TArgs> {
  let activeTimeoutId: ReturnType<typeof setTimeout> | undefined

  const debouncedFunction = (...args: TArgs) => {
    if (activeTimeoutId) {
      clearTimeout(activeTimeoutId)
    }

    activeTimeoutId = setTimeout(() => {
      callback(...args)
    }, delayMs)
  }

  debouncedFunction.cancel = () => {
    if (activeTimeoutId) {
      clearTimeout(activeTimeoutId)
      activeTimeoutId = undefined
    }
  }

  return debouncedFunction
}
