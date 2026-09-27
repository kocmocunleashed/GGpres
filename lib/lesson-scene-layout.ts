export interface SceneObjectExtent { width: number; height: number }
export interface SceneLayoutItem {
  id: string;
  extent: SceneObjectExtent;
  labelHeight?: number;
}
export interface SceneCell {
  id: string;
  column: number;
  row: number;
  centerX: number;
  centerY: number;
  objectWidth: number;
  objectHeight: number;
  scale: number;
  labelLeft: number;
  labelTop: number;
  labelWidth: number;
  labelHeight: number;
}

/** One world unit is 100 CSS pixels; the camera faces the XY plane directly.
 * Extents are measured AFTER each object's own rotation, from its real meshes.
 * Labels have their own reserved space and never depend on a texture's size. */
export function layoutLessonScene(width: number, height: number, items: readonly SceneLayoutItem[], collection = false): SceneCell[] {
  if (!items.length || width <= 0 || height <= 0) return [];
  const columns = items.length === 4 && width < 520 ? 2 : items.length;
  const rows = Math.ceil(items.length / columns);
  const side = width < 400 ? 8 : 16;
  const top = collection ? 40 : 12;
  const bottom = 12;
  const gap = rows > 1 ? 8 : 12;
  const cellWidth = (width - side * 2) / columns;
  const rowHeight = (height - top - bottom) / rows;
  return items.map((item, index) => {
    const row = Math.floor(index / columns);
    const column = index % columns;
    const peers = items.slice(row * columns, (row + 1) * columns);
    const labelHeight = Math.max(...peers.map(peer => peer.labelHeight ?? (rows > 1 ? 62 : 82)));
    const objectLimitHeight = Math.max(1, Math.min(rows > 1 ? 84 : 160, rowHeight - labelHeight - gap - 8));
    const objectLimitWidth = Math.max(1, Math.min(190, cellWidth - (rows > 1 ? 26 : 20)));
    const scale = Math.min(objectLimitWidth / item.extent.width, objectLimitHeight / item.extent.height) / 100;
    const objectWidth = item.extent.width * scale * 100;
    const objectHeight = item.extent.height * scale * 100;
    const tallestObject = Math.max(...peers.map(peer => Math.min(objectLimitHeight, objectLimitWidth * peer.extent.height / peer.extent.width)));
    const blockHeight = tallestObject + gap + labelHeight;
    const blockTop = top + row * rowHeight + Math.max(0, (rowHeight - blockHeight) / 2);
    const baseline = blockTop + tallestObject;
    return {
      id: item.id, row, column,
      centerX: side + (column + .5) * cellWidth,
      centerY: baseline - objectHeight / 2,
      objectWidth, objectHeight, scale,
      labelLeft: side + column * cellWidth + 3,
      labelTop: baseline + gap,
      labelWidth: cellWidth - 6,
      labelHeight,
    };
  });
}

/** A relation joins the facing object edges, never their labels or contents. */
export function sceneRelationPath(from: SceneCell, to: SceneCell, cells: readonly SceneCell[] = [from, to]): string {
  if (from.row === to.row) {
    if (Math.abs(from.column - to.column) > 1) {
      const lane = Math.max(8, Math.min(...cells.filter(cell => cell.row === from.row).map(cell => cell.centerY - cell.objectHeight / 2)) - 14);
      return `M ${from.centerX} ${from.centerY - from.objectHeight / 2 - 4} L ${from.centerX} ${lane} L ${to.centerX} ${lane} L ${to.centerX} ${to.centerY - to.objectHeight / 2 - 7}`;
    }
    const direction = to.centerX > from.centerX ? 1 : -1;
    const start = from.centerX + direction * (from.objectWidth / 2 + 4);
    const end = to.centerX - direction * (to.objectWidth / 2 + 7);
    const middle = (start + end) / 2;
    return `M ${start} ${from.centerY} C ${middle} ${from.centerY} ${middle} ${to.centerY} ${end} ${to.centerY}`;
  }
  // The centre gutter stays clear of the label rectangles in a two-column view.
  const lane = from.column === to.column
    ? from.column === 0 ? from.labelLeft - 5 : from.labelLeft + from.labelWidth + 5
    : (from.centerX + to.centerX) / 2;
  const sourceX = from.centerX + (lane > from.centerX ? 1 : -1) * (from.objectWidth / 2 + 4);
  const targetX = to.centerX + (lane > to.centerX ? 1 : -1) * (to.objectWidth / 2 + 7);
  return `M ${sourceX} ${from.centerY} L ${lane} ${from.centerY} L ${lane} ${to.centerY} L ${targetX} ${to.centerY}`;
}
