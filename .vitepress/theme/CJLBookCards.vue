<script setup lang="ts">
import { withBase } from 'vitepress'

type Book = {
  num: number
  title: string
  author: string
  druh: string
  motivy: string
  tema: string
  href: string
}

type Period = {
  name: string
  books: Book[]
}

const periods: Period[] = [
  {
    name: 'Renesance',
    books: [
      {
        num: 1,
        title: 'Romeo a Julie',
        author: 'W. Shakespeare',
        druh: 'drama · tragédie',
        motivy: 'láska, nenávist znepřátelených rodů, osud, mládí',
        tema: 'tragická láska v rozdělené společnosti',
        href: '/cjl/1-20-w-shakespeare-romeo-a-julie'
      },
      {
        num: 2,
        title: 'Hamlet',
        author: 'W. Shakespeare',
        druh: 'drama · tragédie',
        motivy: 'pomsta, šílenství, smrt, morální dilema',
        tema: 'vnitřní rozpor jedince mezi povinností a svědomím',
        href: '/cjl/2-20-w-shakespeare-hamlet'
      }
    ]
  },
  {
    name: 'Klasicismus',
    books: [
      {
        num: 3,
        title: 'Lakomec',
        author: 'Molière',
        druh: 'drama · charakterová komedie',
        motivy: 'lakota, peníze, rodinné vztahy, přetvářka',
        tema: 'kritika lidské vady — lakota deformuje vše kolem',
        href: '/cjl/3-20-moliere-lakomec'
      }
    ]
  },
  {
    name: 'Romantismus',
    books: [
      {
        num: 8,
        title: 'Kytice',
        author: 'K. J. Erben',
        druh: 'lyricko-epická sbírka balad',
        motivy: 'vina a trest, vztah matka–dítě, nadpřirozeno, lidová mytologie',
        tema: 'lidská provinění a neúprosný řád světa',
        href: '/cjl/8-20-karel-jaromir-erben-kytice'
      }
    ]
  },
  {
    name: 'Realismus a naturalismus',
    books: [
      {
        num: 5,
        title: 'Revizor',
        author: 'N. V. Gogol',
        druh: 'drama · satirická komedie',
        motivy: 'korupce, záměna identity, úplatkářství, strach z autority',
        tema: 'satira na maloměstskou byrokracii a její mravní úpadek',
        href: '/cjl/5-20-n-v-gogol-revizor'
      },
      {
        num: 17,
        title: 'Kulička',
        author: 'Guy de Maupassant',
        druh: 'epika · povídka (naturalismus)',
        motivy: 'prusko-francouzská válka, společenské pokrytectví, oběť, předsudky',
        tema: 'morální zbabělost „slušné" společnosti vůči obětované outsiderce',
        href: '/cjl/17-20-guy-de-maupassant-kulicka'
      }
    ]
  },
  {
    name: 'Dekadence a symbolismus',
    books: [
      {
        num: 6,
        title: 'Obraz Doriana Graye',
        author: 'Oscar Wilde',
        druh: 'epika · román (dekadence, estetismus)',
        motivy: 'krása, mládí, hřích, dvojí život, umění vs. morálka',
        tema: 'cena hédonismu — kult krásy končí mravním rozkladem',
        href: '/cjl/6-20-oscar-wilde-obraz-doriana-graye'
      },
      {
        num: 13,
        title: 'Krysař',
        author: 'Viktor Dyk',
        druh: 'epika · novela (novoromantismus, symbolismus)',
        motivy: 'pomsta, láska, kolektivní vina, zrada města',
        tema: 'střet idealismu jednotlivce s malostí společnosti',
        href: '/cjl/13-20-v-dyk-krysar'
      }
    ]
  },
  {
    name: 'Moderna a meziválečná literatura',
    books: [
      {
        num: 4,
        title: 'Pygmalion',
        author: 'G. B. Shaw',
        druh: 'drama · společenská komedie',
        motivy: 'třídní rozdíly, jazyk jako moc, proměna člověka',
        tema: 'vliv vzdělání a řeči na společenské postavení',
        href: '/cjl/4-20-g-b-shaw-pygmalion'
      },
      {
        num: 7,
        title: 'Proměna',
        author: 'Franz Kafka',
        druh: 'epika · novela (expresionismus, modernismus)',
        motivy: 'odcizení, dehumanizace, rodina, vina, práce',
        tema: 'rozpad identity člověka v moderním světě',
        href: '/cjl/7-20-f-kafka-promena'
      },
      {
        num: 14,
        title: 'R.U.R.',
        author: 'Karel Čapek',
        druh: 'drama · utopické / vědeckofantastické',
        motivy: 'roboti, technický pokrok, dehumanizace práce, vzpoura',
        tema: 'varování před zneužitím vědy a ztrátou lidskosti',
        href: '/cjl/14-20-k-capek-r-u-r'
      },
      {
        num: 19,
        title: 'Těžká hodina',
        author: 'Jiří Wolker',
        druh: 'lyrika · sbírka básní (proletářská poezie)',
        motivy: 'práce, sociální tíha, kolektiv, smrt, dospívání',
        tema: 'přechod od dětské lyriky k sociálnímu apelu',
        href: '/cjl/19-20-jiri-wolker-tezka-hodina'
      }
    ]
  },
  {
    name: 'Filozofická próza 20. století',
    books: [
      {
        num: 10,
        title: 'Malý princ',
        author: 'A. de Saint-Exupéry',
        druh: 'epika · alegorická pohádka pro dospělé',
        motivy: 'přátelství, odpovědnost, dětský pohled, krotnutí',
        tema: 'co je v životě opravdu důležité — viděno srdcem, ne rozumem',
        href: '/cjl/10-20-a-de-saint-exupery-maly-princ'
      }
    ]
  },
  {
    name: 'Antiutopie',
    books: [
      {
        num: 11,
        title: '1984',
        author: 'George Orwell',
        druh: 'epika · antiutopický román',
        motivy: 'totalita, sledování, manipulace jazyka (newspeak), strach',
        tema: 'zničení individuality v dokonale opresivním režimu',
        href: '/cjl/11-20-g-orwell-1984'
      }
    ]
  },
  {
    name: 'Česká próza 60. let',
    books: [
      {
        num: 9,
        title: 'Ostře sledované vlaky',
        author: 'Bohumil Hrabal',
        druh: 'epika · novela',
        motivy: 'dospívání, válka, sexuální iniciace, malé hrdinství',
        tema: 'osobní zrání v období okupace — od ostudy k odvaze',
        href: '/cjl/9-20-b-hrabal-ostre-sledovane-vlaky'
      },
      {
        num: 15,
        title: 'Spalovač mrtvol',
        author: 'Ladislav Fuks',
        druh: 'epika · psychologická novela',
        motivy: 'nacismus, manipulace, smrt, postupné šílenství, krematorium',
        tema: 'jak ideologie ovládne průměrného člověka a vede ke zlu',
        href: '/cjl/15-20-l-fuks-spalovac-mrtvol'
      }
    ]
  },
  {
    name: 'Autorské divadlo',
    books: [
      {
        num: 16,
        title: 'České nebe',
        author: 'Cimrman / Svěrák / Smoljak',
        druh: 'drama · satirická hra (Divadlo J. Cimrmana)',
        motivy: 'český národní mýtus, dějiny, humor, mystifikace',
        tema: 'ironický pohled na českou identitu a její „velikány"',
        href: '/cjl/16-20-sverak-smoljak-cimrman-ceske-nebe'
      }
    ]
  },
  {
    name: 'Literatura faktu',
    books: [
      {
        num: 12,
        title: 'My děti ze stanice ZOO',
        author: 'Christiane F.',
        druh: 'epika · autobiografická zpověď',
        motivy: 'drogová závislost, mládí na ulici, prostituce, Západní Berlín 70. let',
        tema: 'sestup do závislosti jako varování pro mladou generaci',
        href: '/cjl/12-20-my-deti-ze-stanice-zoo'
      }
    ]
  },
  {
    name: 'Současná česká próza',
    books: [
      {
        num: 18,
        title: 'Memento',
        author: 'Radek John',
        druh: 'epika · román (varovný, dokumentárně laděný)',
        motivy: 'drogová závislost (heroin), ztráta, party, varování',
        tema: 'dopad závislosti na jednotlivce a okolí — protidrogové memento',
        href: '/cjl/18-20-r-john-memento'
      },
      {
        num: 20,
        title: 'Hrdý Budžes',
        author: 'Irena Dousková',
        druh: 'epika · novela (humoristická, retro)',
        motivy: 'dětský pohled, normalizace 70. let, rodina, ironie',
        tema: 'absurdita totality viděná naivními očima dítěte',
        href: '/cjl/20-20-i-douskova-hrdy-budzes'
      }
    ]
  }
]
</script>

<template>
  <section class="cjl-cards">
    <div v-for="period in periods" :key="period.name" class="cjl-cards__period">
      <h2 class="cjl-cards__period-title">{{ period.name }}</h2>
      <div class="cjl-cards__grid">
        <a
          v-for="book in period.books"
          :key="book.num"
          :href="withBase(book.href)"
          class="cjl-cards__card"
        >
          <h3 class="cjl-cards__card-title">
            <span class="cjl-cards__card-num">{{ book.num }}.</span>
            {{ book.title }}
          </h3>
          <p class="cjl-cards__card-author">{{ book.author }}</p>
          <dl class="cjl-cards__card-meta">
            <dt>Druh / žánr</dt>
            <dd>{{ book.druh }}</dd>
            <dt>Motivy</dt>
            <dd>{{ book.motivy }}</dd>
            <dt>Téma</dt>
            <dd>{{ book.tema }}</dd>
          </dl>
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.cjl-cards {
  margin: 8px 0 24px;
}

.cjl-cards__period + .cjl-cards__period {
  margin-top: 28px;
}

.cjl-cards__period-title {
  margin: 0 0 12px;
  padding-bottom: 6px;
  border-bottom: 1px solid var(--vp-c-divider);
  font-size: 20px;
  font-weight: 600;
  letter-spacing: -0.01em;
}

.cjl-cards__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 14px;
}

.cjl-cards__card {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 16px 18px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  text-decoration: none;
  transition:
    border-color 0.15s ease,
    background-color 0.15s ease,
    transform 0.15s ease,
    box-shadow 0.15s ease;
}

.cjl-cards__card:hover {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-bg-alt);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
}

.cjl-cards__card-title {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  line-height: 1.3;
  color: var(--vp-c-text-1);
}

.cjl-cards__card-num {
  color: var(--vp-c-text-3);
  margin-right: 4px;
  font-variant-numeric: tabular-nums;
}

.cjl-cards__card-author {
  margin: -6px 0 0;
  font-size: 13px;
  color: var(--vp-c-text-2);
  font-style: italic;
}

.cjl-cards__card-meta {
  margin: 0;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 4px 10px;
  font-size: 12.5px;
  line-height: 1.45;
}

.cjl-cards__card-meta dt {
  color: var(--vp-c-text-3);
  font-weight: 500;
  white-space: nowrap;
}

.cjl-cards__card-meta dd {
  margin: 0;
  color: var(--vp-c-text-2);
}
</style>
