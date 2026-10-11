import { DOCK_MAX_SCALE, DOCK_RANGE, DOCK_SIZE, hoverScale, restingCenters } from './magnify';

test('the icon under the pointer reaches full magnification and far icons stay at rest', () => {
  expect(hoverScale(100, 100)).toBeCloseTo(DOCK_MAX_SCALE, 1);
  expect(hoverScale(100, 100 + DOCK_RANGE)).toBe(1);
});

test('magnification falls off smoothly with distance', () => {
  const near = hoverScale(0, DOCK_SIZE);
  const far = hoverScale(0, DOCK_SIZE * 3);
  expect(near).toBeGreaterThan(far);
  expect(far).toBeGreaterThan(1);
});

test('resting centers are symmetric around the dock center', () => {
  const centers = restingCenters(['a', 'b', 'separator', 'c'], 500);
  expect(centers[0] + centers[3]).toBeCloseTo(1000);
});
