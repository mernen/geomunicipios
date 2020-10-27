geomunicipios
==============

Identificação de municípios brasileiros por coordenadas latitude/longitude,
sem depender de serviços externos, e sem precisar carregar megabytes de dados.

Esta biblioteca retorna apenas o código IBGE dos municípios. Para obter outras
informações como largura, use outra base, como o projeto [Municípios Brasileiros][].

Os dados de municípios são baseados nos shapefiles disponibilizados pelo IBGE em:
<https://www.ibge.gov.br/geociencias/organizacao-do-territorio/15774-malhas.html>


## Exemplo com Node

```javascript
const geomunicipios = require('geomunicipios');
const municipiosIndex = require('geomunicipios/dados/divididos/municipios-index.json');

async function municipioParaLocalizacao(coords) {
  let nomeArquivoRegiao = geomunicipios.hitTest(municipiosIndex, coords);
  if (!nomeArquivoRegiao) {
    // Fora do território brasileiro
    return null;
  }
  console.log('Arquivo de dados:', nomeArquivoRegiao);

  let dadosRegiao = require('geomunicipios/dados/divididos/' + nomeArquivoRegiao);
  let codigoIbge = geomunicipios.hitTest(dadosRegiao, coords);

  console.log('Código IBGE:', codigoIbge);
  return codigoIbge;
}
```


## Exemplo na web

Para minimizar a quantidade de dados carregados, vamos usar os dados divididos:

```javascript
import { hitTest } from 'geomunicipios';
// Se você usa um bundler como WebPack, você pode importar o JSON de índice diretamente
import municipiosIndex from 'geomunicipios/dados/divididos/municipios-index.json';

async function determinarLocalizacao() {
  let posicao = await new Promise((resolve, reject) => navigator.geolocation.getCurrentPosition(resolve, reject, {
    // Só precisamos de uma localização aproximada, então podemos aceitar
    // um dado mais antigo que esteja disponível, como de 30 minutos atrás
    maximumAge: 30 * 60 * 1000,
    enableHighAccuracy: false,
    timeout: 10 * 1000,
  }));
  console.log('Coordenadas:', posicao.coords);

  // Determinar em que arquivo estão os dados da região
  let nomeArquivoRegiao = hitTest(municipiosIndex, posicao.coords);
  if (!nomeArquivoRegiao) {
    // Fora do território brasileiro
    return null;
  }
  console.log('Consultando arquivo de dados:', nomeArquivoRegião);

  // Copie os dados de `node_modules/geomunicipios/dados/divididos` para um
  // diretório público no seu projeto
  let response = await fetch('dados-municipios/' + nomeArquivoRegiao);
  let dadosRegiao = await response.json();
  let codigoIbge = hitTest(dadosRegiao, posicao.coords);

  console.log('Código IBGE:', codigoIbge);
  return codigoIbge;
}
```


## Limitações

A eficácia da biblioteca está limitada pela qualidade dos mapas fornecidos pelo
IBGE. Em alguns casos há sobreposição no território informado dos municípios;
nesses casos, foram usadas algumas heurísticas para decidir por qual município
aquele território deveria representar.

Para não gerar arquivos de dados excessivamente grandes, a quadtree pode errar
a delimitação exata dos municípios por até aproximadamente 1200 metros.

O foco da biblioteca não é delimitar o território brasileiro, mas identificar
o município para quem está dentro do território. Isso significa que municípios
que ficam nas fronteiras podem ser "arredondados para cima". Isso significa,
por exemplo, que alguém que está em Ciudad Del Este, no Paraguai, pode ser
erroneamente identificado como localizado em Foz do Iguaçu.


[Municípios Brasileiros]: https://github.com/kelvins/Municipios-Brasileiros
