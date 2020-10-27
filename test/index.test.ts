import { hitTest } from '../src';
import municipiosIndex from '../dados/divididos/municipios-index.json';

test('Hit test out of bounds', () => {
  expect(hitTest(municipiosIndex, [0, 0])).toBeUndefined();
});

test('Hit test on each region', () => {
  expect(hitTest(municipiosIndex, [-62.9, -0.9])).toBe('municipios-1.json');
  expect(hitTest(municipiosIndex, [-38.5, -3.81])).toBe('municipios-2.json');
  expect(hitTest(municipiosIndex, [-56.0, -15.7])).toBe('municipios-3.json');
  expect(hitTest(municipiosIndex, [-49.2, -25.5])).toBe('municipios-4.json');
});
