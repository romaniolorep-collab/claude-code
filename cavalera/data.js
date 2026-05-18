(function () {
  window.CAVALERA = {
    products: [
      {
        id: 'BR-2995',
        name: 'RUBBER SOUL',
        series: 'Industrial Craft',
        price: 589,
        category: 'tactical',
        tags: ['BORRACHA', 'LIMITED'],
        image: 'uploads/WhatsApp Image 2026-05-13 at 08.37.17.jpeg',
        specs: {
          'CABEDAL':  'BORRACHA TEXTURIZADA 2mm',
          'SOLADO':   'BORRACHA VULCANIZADA 14mm',
          'TIRAS':    '3 TIRAS BORRACHA AJUSTÁVEL',
          'ACABAMENTO': 'PRETO FOSCO'
        },
        origin: 'SÃO PAULO',
        lat: '-23.5505',
        description: 'Três tiras. Três pontos de ancoragem. Uma atitude.',
        longDescription: 'O RUBBER SOUL é a peça de maior integridade técnica da coleção. Cabedal em borracha texturizada de dupla camada, solado vulcanizado com sulcos de drenagem lateral de 14mm. Três tiras independentes com ajuste individual permitem encaixe preciso no pé. Cada componente justifica sua existência — nada foi colocado por estética.',
        stock: 3,
        ref: 'CAV_SECTOR_07',
        callouts: ['TIRA TRIPLA AJUSTÁVEL', 'SOLADO SULCADO 14MM', 'BORRACHA VULCANIZADA']
      },
      {
        id: 'BR-1201',
        name: 'SLIDES',
        series: 'Rubber Soul Series',
        price: 489,
        category: 'urban',
        tags: ['MONOBLOCO', 'STREET'],
        image: 'uploads/WhatsApp Image 2026-05-13 at 10.23.10.jpeg',
        specs: {
          'MATERIAL':    'BORRACHA SINTÉTICA INJETADA',
          'SOLADO':      'PVC ANTIDERRAPANTE 10mm',
          'CONSTRUÇÃO':  'MONOBLOCO POR INJEÇÃO',
          'ALÇA':        'ANATÔMICA INTEGRADA'
        },
        origin: 'SÃO PAULO',
        lat: '-23.5505',
        description: 'Uma peça. Sem costuras. Sem desculpa.',
        longDescription: 'O SLIDES é o calçado mais honesto que já fizemos. Sem costura, sem fivela, sem componente desnecessário. Produzido em processo de injeção monobloco — o cabedal e a sola são a mesma peça. Borracha sintética que absorve impacto e não deforma com calor de asfalto.',
        stock: 12,
        ref: 'CAV_SECTOR_12',
        callouts: ['MONOBLOCO INJETADO', 'ALÇA ANATÔMICA', 'PVC ANTIDERRAPANTE']
      },
      {
        id: 'BR-0744',
        name: 'BIRKEN',
        series: 'Street Heritage',
        price: 649,
        category: 'heritage',
        tags: ['STREET', 'UNISSEX'],
        image: 'uploads/WhatsApp Image 2026-05-13 at 10.23.14.jpeg',
        specs: {
          'PALMILHA':   'BORRACHA EVA ANATÔMICA 6mm',
          'CABEDAL':    'BORRACHA MACIA TEXTURIZADA',
          'SOLADO':     'BORRACHA RECICLADA ANTIDERRAPANTE',
          'TIRAS':      'DUPLA TIRA AJUSTÁVEL'
        },
        origin: 'SÃO PAULO',
        lat: '-23.5505',
        description: 'Clássico de rua. Construído sem pedir licença.',
        longDescription: 'O BIRKEN reconstrói a silhueta da sandália de dupla tira partindo do material para dentro: palmilha em borracha EVA anatômica de 6mm que molda ao pé com o uso, cabedal em borracha macia texturizada, solado em borracha reciclada com textura antiderrapante. Duas tiras independentes com ajuste preciso.',
        stock: 5,
        ref: 'CAV_SECTOR_03',
        callouts: ['PALMILHA EVA ANATÔMICA', 'DUPLA TIRA AJUSTÁVEL', 'BORRACHA RECICLADA']
      },
      {
        id: 'BR-3300',
        name: 'CLOUD',
        series: 'Float Engineering',
        price: 719,
        category: 'tactical',
        tags: ['COMFORT', 'EVA 22mm'],
        image: 'uploads/WhatsApp Image 2026-05-13 at 10.23.09.jpeg',
        specs: {
          'BASE':        'EVA MULTICAMADA 22mm',
          'SOLADO':      'BORRACHA TPR ANTIDERRAPANTE',
          'CONSTRUÇÃO':  'MOLDAGEM POR COMPRESSÃO',
          'ALÇA':        'NEOPRENE INJETADO MACIO'
        },
        origin: 'SÃO PAULO',
        lat: '-23.5505',
        description: 'Engenharia de flutuação. Pisada de zero impacto.',
        longDescription: 'O CLOUD inverte a lógica do calçado urbano. Base de EVA multicamada de 22mm fresada anatomicamente — três densidades diferentes para amortecimento no calcanhar, suporte no arco e flexibilidade no metatarso. Solado em borracha TPR que agarra o concreto molhado sem deslizar. Alça em neoprene que não pressiona nem arranha.',
        stock: 7,
        ref: 'CAV_SECTOR_09',
        callouts: ['EVA 22mm TRI-DENSIDADE', 'PALMILHA FRESADA CNC', 'BORRACHA TPR ÚMIDA']
      },
      {
        id: 'BR-0522',
        name: 'GIRLY',
        series: 'Eagle Print Series',
        price: 449,
        category: 'urban',
        tags: ['FEMININO', 'EAGLE PRINT'],
        image: 'uploads/WhatsApp Image 2026-05-13 at 10.23.11.jpeg',
        specs: {
          'BASE':        'BORRACHA EVA LEVE E FLEXÍVEL',
          'SOLADO':      'BORRACHA PLANA GRIP 8mm',
          'ALÇA':        'METALIZADA DOURADA PVD',
          'CONSTRUÇÃO':  'PALMILHA EAGLE PRINT HD'
        },
        origin: 'SÃO PAULO',
        lat: '-23.5505',
        description: 'A águia em cada passo. Atitude inegociável.',
        longDescription: 'O GIRLY carrega o brasão da águia bicéfala repetido em baixo relevo em toda a palmilha — visível somente para quem olha de perto, como deve ser. Alça dourada com revestimento PVD (Physical Vapour Deposition) — o mesmo processo de douramento usado em joias de qualidade. Base em EVA leve que não pesa, não cansa.',
        stock: 18,
        ref: 'CAV_SECTOR_01',
        callouts: ['EAGLE PRINT BAIXO RELEVO', 'ALÇA PVD DOURADO', 'EVA BASE ULTRA LEVE']
      },
      {
        id: 'BR-1888',
        name: 'COLLAB',
        series: 'Charlie Brown Jr. × Cavalera',
        price: 559,
        category: 'heritage',
        tags: ['LIMITED', 'NUMERADO'],
        image: 'uploads/IMG_2217-d3a053c1.jpg',
        specs: {
          'BASE':        'BORRACHA PREMIUM PRETA',
          'SOLADO':      'XADREZ EM RELEVO — PADRÃO CBJ',
          'ALÇA':        'TIRA PRETA FOSCA BORDADA',
          'EDIÇÃO':      'NUMERADA — 500 PARES'
        },
        origin: 'SÃO PAULO',
        lat: '-23.5505',
        description: 'As pessoas ao redor nunca me entendem.',
        longDescription: 'Collab exclusiva com o legado do Charlie Brown Jr. Cada par carrega número de série gravado no solado interno. Sola com o xadrez característico da banda em alto relevo — o mesmo padrão dos estúdios de ensaio do grupo. Fotografia impressa em processo de sublimação de alta resolução diretamente na palmilha. Uma edição que não volta.',
        stock: 9,
        ref: 'CAV_SECTOR_05',
        callouts: ['NUMERAÇÃO INDIVIDUAL', 'XADREZ RELEVO CBJ', 'SUBLIMAÇÃO HD NA PALMILHA']
      }
    ],
    categories: [
      { id: 'all',      label: 'TODOS'    },
      { id: 'tactical', label: 'TACTICAL' },
      { id: 'urban',    label: 'URBAN'    },
      { id: 'heritage', label: 'HERITAGE' }
    ]
  };
})();
