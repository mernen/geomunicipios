/**
 * Unfortunately, the inferred type for the JSON files isn't fully compatible
 * with the more strict definition. To ease interfacing with JSON imports,
 * the public interface will instead use this more lax definition.
 */
interface QuadTreeish<T> {
  bounds: number[][];
  data: T[];
  tree: QuadNodeish<number>;
}

export interface QuadTree<T> extends QuadTreeish<T> {
  bounds: BoundsRect;
  tree: QuadNode<number>;
}

/** Axis-aligned bounding box. */
export type BoundsRect = [LngLatTuple, LngLatTuple];
/** A pair of coordinates representing longitude and latitude, in this order. */
export type LngLatTuple = [number, number];

export type LatLng =
  | LngLatTuple
  | {lat: number, lng: number}
  | {latitude: number, longitude: number};

type QuadNodeish<T> = T | QuadNodeish<T>[];
export type QuadNode<T> = T | [QuadNode<T>, QuadNode<T>, QuadNode<T>, QuadNode<T>];

export function hitTest<T>(tree: QuadTreeish<T>, coords: LatLng): T | undefined {
  assertQuadTree(tree);
  coords = normalizeCoords(coords);
  if (!withinBounds(tree.bounds, coords)) {
    return undefined;
  }
  let index = hitTestNode(tree.tree, tree.bounds, coords);
  return index == null ? undefined : tree.data[index];
}

function assertQuadTree<T>(tree: QuadTreeish<T>): asserts tree is QuadTree<T> {}

function normalizeCoords(coords: LatLng): LngLatTuple {
  if ('lat' in coords) {
    return [coords.lng, coords.lat];
  }
  if ('latitude' in coords) {
    return [coords.longitude, coords.latitude];
  }
  return coords;
}

function withinBounds(bounds: BoundsRect, coords: LngLatTuple) {
  let [lng, lat] = coords;
  let [min, max] = bounds;
  return lng >= min[0] && lng <= max[0] && lat >= min[1] && lat <= max[1];
}

function hitTestNode<T>(node: QuadNode<T>, bounds: BoundsRect, coords: LngLatTuple): T | undefined {
  if (!isQuad(node)) {
    return node;
  }
  let [[minLng, minLat], [maxLng, maxLat]] = bounds;
  let midLng = (minLng + maxLng) / 2;
  let midLat = (minLat + maxLat) / 2;
  let [lng, lat] = coords;
  let n = lat > midLat;
  let e = lng < midLng;
  if (n && e) {
    return hitTestNode(node[0], [[minLng, midLat], [midLng, maxLat]], coords);
  } else if (n) {
    return hitTestNode(node[1], [[midLng, midLat], [maxLng, maxLat]], coords);
  } else if (e) {
    return hitTestNode(node[2], [[minLng, minLat], [midLng, midLat]], coords);
  } else {
    return hitTestNode(node[3], [[midLng, minLat], [maxLng, midLat]], coords);
  }
}

function isQuad(value: QuadNode<unknown>): value is [unknown, unknown, unknown, unknown] {
  return Array.isArray(value) && value.length === 4;
}
