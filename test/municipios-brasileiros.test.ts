import * as fs from 'fs';
import { hitTest, QuadTree } from '../src';
import indexQt from '../dados/divididos/municipios-index.json';

const MUNICIPIOS_BRASILEIROS_PATH = __dirname + '/municipios-brasileiros/json/municipios.json';

/**
 * Estes municípios estão descritos no Municipios-Brasileiros com coordenadas
 * que sequer estão dentro dos polígonos descritos pelo IBGE
 */
const MUNICIPIOS_COM_LOCALIZACAO_ERRADA = new Set([
  1505551,
  2209153,
  2403756,
  2514701,
  2515401,
  2603603,
  2608255,
  2609204,
  2613107,
  2706208,
  3104452,
  3149952,
  3164431,
  3204252,
  3300233,
  3302452,
  4105201,
  4128625,
]);

test('Test coordinates out of Municipios-Brasileiros', () => {
  let municipiosContent = fs.readFileSync(MUNICIPIOS_BRASILEIROS_PATH, 'utf-8').replace('\u{feff}', '');
  let municipios = JSON.parse(municipiosContent);

  let dataQts = new Map<string, QuadTree<number>>();

  for (let municipio of municipios) {
    if (MUNICIPIOS_COM_LOCALIZACAO_ERRADA.has(municipio.codigo_ibge)) {
      // Ignorar este município
      continue;
    }

    let filename = hitTest(indexQt, municipio);
    expect(filename).toBeTruthy();

    let quadtree = dataQts.get(filename!);
    if (!quadtree) {
      quadtree = JSON.parse(fs.readFileSync(__dirname + '/../dados/divididos/' + filename, 'utf-8')) as QuadTree<number>;
      dataQts.set(filename!, quadtree);
    }

    expect(hitTest(quadtree, municipio)).toBe(municipio.codigo_ibge);
  }
});
