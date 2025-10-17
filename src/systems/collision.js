export function intersects(rectA, rectB) {
  return !(
    rectA.x + rectA.w <= rectB.x ||
    rectA.x >= rectB.x + rectB.w ||
    rectA.y + rectA.h <= rectB.y ||
    rectA.y >= rectB.y + rectB.h
  );
}
