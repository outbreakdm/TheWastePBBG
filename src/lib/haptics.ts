/**
 * Haptic feedback utility — triggers device vibration on supported devices.
 * Gracefully no-ops on unsupported browsers.
 */
export const haptics = {
  /** Light tap — button press, selection */
  light: () => vibrate(10),
  /** Medium tap — confirm action, equip */
  medium: () => vibrate(25),
  /** Heavy tap — error, warning, defeat */
  heavy: () => vibrate([30, 50, 30]),
  /** Success pattern — victory, level up */
  success: () => vibrate([15, 40, 15, 40, 25]),
}

function vibrate(pattern: number | number[]) {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate(pattern)
    } catch {
      // Silently ignore — some browsers block vibration
    }
  }
}
