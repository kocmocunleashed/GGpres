/** Fiber reports pointer travel on clicks, but still dispatches mesh clicks
 * after OrbitControls drags. Match its own two-pixel missed-click tolerance. */
export function isWorkstationClick(event: { delta: number }): boolean {
  return Number.isFinite(event.delta) && event.delta >= 0 && event.delta <= 2;
}
