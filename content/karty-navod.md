# Návod: posuvné karty s tlačítkem „More“

Tenhle návod tě provede stavbou sekce s kartami krok za krokem. Na konci budeš mít:

- řadu menších karet vedle sebe (ModulBit, Fedora, Hackathons, Projects, Homelab),
- na každé kartě **nadpis**, **krátký popis** (KRATSI VERZE z `karty.txt`) a tlačítko **More**,
- po kliknutí na **More** se karta plynule roztáhne **do šířky i do výšky** a ukáže DELSI VERZI,
- karty se **samy posouvají** a vlevo a vpravo jsou **šipky** pro ruční posun.

```
        ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────
  ‹     │ ModulBit │ │ Fedora   │ │ Hackath. │ │ Proj…    ›
        │ krátký   │ │ krátký   │ │ krátký   │ │
        │ popis    │ │ popis    │ │ popis    │ │
        │ [More]   │ │ [More]   │ │ [More]   │ │
        └──────────┘ └──────────┘ └──────────┘ └──────
```

---

## 0. Kdo co dělá (HTML, CSS, JavaScript)

Webová stránka stojí na třech jazycích a každý má svou práci:

| Jazyk | Co dělá | Soubor |
|---|---|---|
| **HTML** | *Co* na stránce je: nadpisy, texty, tlačítka | `index.html` |
| **CSS** | *Jak* to vypadá: barvy, velikosti, animace | `style.css` |
| **JavaScript** | *Co se stane*, když něco uděláš: kliknutí, časovač | `script.js` (vytvoříme) |

Celý trik s kartami stojí na jednoduché myšlence:

> JavaScript **nic neanimuje**. Jen kartě přidá nebo odebere CSS třídu (např. `is-open`).
> CSS má pro kartu s touhle třídou jiná pravidla (je širší, ukazuje delší text) a díky `transition` se změna provede **plynule**.

Tohle je nejdůležitější věc z celého návodu. Když jí porozumíš, zbytek už jsou jen detaily.

---

## 1. HTML: kostra sekce

### 1.1 Kam to dát

Otevři `index.html` a najdi konec sekce About:

```html
        </article>
    </section>

    <div class="footer">
```

Mezi `</section>` a `<div class="footer">` vlož novou sekci (kód je níž).

### 1.2 Kód sekce s jednou kartou

Začni **jen jednou kartou**. Až bude fungovat, zkopíruješ ji pro ostatní.

```html
    <section class="cards-section" id="projects">
        <h2 class="cards-title">What I do</h2>

        <div class="carousel">
            <button class="carousel-btn prev" aria-label="Previous card">&#8249;</button>

            <div class="cards-track">

                <article class="card">
                    <h3>ModulBit</h3>
                    <div class="card-short">
                        <p>I co-run ModulBit, making everyday tech easier for older people.</p>
                        <p>ModulBit is a small open-source project making modern technology usable for people who didn't grow up with it. ...</p>
                    </div>

                    <div class="card-more">
                        <div class="card-more-inner">
                            <p>ModulBit is a small open-source project with one goal: ...</p>
                            <p>I co-founded ModulBit and work across the whole project. ...</p>
                            <p>Behind the scenes, I run and customize our self-hosted Forgejo, ...</p>
                        </div>
                    </div>

                    <button class="card-toggle" aria-expanded="false">More</button>
                </article>

                <!-- sem přijdou další karty -->

            </div>

            <button class="carousel-btn next" aria-label="Next card">&#8250;</button>
        </div>
    </section>
```

Místo `...` vlož celé texty z `content/karty.txt`.

### 1.3 Co který kousek znamená

- `<section ... id="projects">` je celá sekce. `id` umožní na ni skočit odkazem z menu (`href="#projects"`).
- `.carousel` je obal, ve kterém je šipka vlevo, řada karet a šipka vpravo.
- `.cards-track` je „kolejnice“, na které karty stojí vedle sebe. **Posouvá se právě ona**, ne jednotlivé karty.
- `<article class="card">` je jedna karta.
  - `h3` je nadpis.
  - `.card-short` je obal pro KRATSI VERZI. Je vidět pořád.
  - `.card-more` je schovaná DELSI VERZE. Má uvnitř ještě `.card-more-inner`. Ten **musí** existovat kvůli animaci výšky (vysvětlím v CSS).
  - `.card-toggle` je tlačítko More.
- `&#8249;` a `&#8250;` jsou znaky `‹` a `›` (šipky).
- `aria-label` a `aria-expanded` nejsou vidět. Pomáhají lidem se čtečkou obrazovky (nevidomým) pochopit, co tlačítko dělá.

### 1.3.1 Jak rozdělit text na odstavce

Pravidlo je jednoduché: **co je v `karty.txt` oddělené prázdným řádkem, to dostane vlastní `<p>`**.

Prohlížeč totiž ignoruje prázdné řádky a odřádkování v HTML. Všechno bere jako jednu mezeru. Kdybys vložil tři odstavce do jednoho `<p>`, na stránce by se slily do jednoho dlouhého bloku.

**Špatně** (na stránce jeden blok textu):

```html
<div class="card-more-inner">
    <p>První odstavec...

    Druhý odstavec...

    Třetí odstavec...</p>
</div>
```

**Dobře** (tři odstavce s mezerami):

```html
<div class="card-more-inner">
    <p>První odstavec...</p>
    <p>Druhý odstavec...</p>
    <p>Třetí odstavec...</p>
</div>
```

Platí to pro obě verze:

- **KRATSI VERZE** jde do `.card-short`. Má-li jeden odstavec, bude tam jedno `<p>`, má-li dva, budou dvě.
- **DELSI VERZE** jde do `.card-more-inner`. Kolik odstavců, tolik `<p>`.

Proto jsou `.card-short` i `.card-more-inner` obaly (`<div>`), a ne samotné `<p>`. Do `<p>` se další `<p>` vložit nedá, do `<div>` jich můžeš dát kolik chceš.

### 1.4 Další karty

Až první karta funguje (po kroku 3), zkopíruj celý blok `<article class="card"> ... </article>` čtyřikrát pod sebe a vyměň texty:

1. ModulBit
2. Fedora
3. Hackathons (v `karty.txt` je to „Hackathony“, KRAT./DELS)
4. Projects
5. Homelab

### 1.5 Odkaz v menu a připojení JavaScriptu

V menu nahoře přidej odkaz:

```html
<li><a href="#projects">Projects</a></li>
```

A v `<head>` hned pod řádek se `style.css` přidej:

```html
<script src="script.js" defer></script>
```

`defer` znamená: „stáhni skript hned, ale spusť ho až po načtení celého HTML“. Bez něj by skript hledal karty, které ještě neexistují, a nic by nefungovalo.

---

## 2. CSS: vzhled a animace

Všechno z tohohle kroku přidej na **konec** souboru `style.css`. Barvy jsou ty, které už na webu používáš (`#1A1A18`, `#2E2D29`, oranžová `#F2A93B`…), takže karty budou ladit s kartami Skills a Contacts.

### 2.1 Sekce a nadpis

```css
/* ---------- Cards ---------- */
.cards-section {
    max-width: 1100px;
    margin: 0 auto;
    padding: 48px 24px 112px;
    text-align: left;           /* celá stránka je v <center>, tady to vypneme */
}

.cards-title {
    margin: 0 0 32px;
    font-family: "JetBrains Mono", monospace;
    font-size: 2rem;
    color: #ECEBE6;
}

#projects {
    scroll-margin-top: 20vh;    /* stejně jako u #about, ať ji nezakryje menu */
}
```

### 2.2 Karusel a kolejnice s kartami

```css
.carousel {
    display: flex;              /* šipka | karty | šipka vedle sebe */
    align-items: center;
    gap: 12px;
}

.cards-track {
    display: flex;              /* karty vedle sebe */
    gap: 24px;                  /* mezera mezi kartami */
    align-items: flex-start;    /* karty nemusí být stejně vysoké */
    overflow-x: auto;           /* co se nevejde, jde posouvat do strany */
    scroll-snap-type: x mandatory;  /* po posunu "zacvakne" na kartu */
    scroll-behavior: smooth;    /* posun je plynulý */
    padding: 8px 4px 16px;
    scrollbar-width: none;      /* schová posuvník (Firefox) */
}

.cards-track::-webkit-scrollbar {
    display: none;              /* schová posuvník (Chrome, Edge, Safari) */
}
```

Co se tu děje:

- `display: flex` postaví karty vedle sebe do řádku.
- `overflow-x: auto` říká: když jsou karty dohromady širší než prostor, nezalamuj je, ale udělej z řady **posuvný pruh**. Tohle je celé tajemství karuselu.
- `scroll-snap-type` zajistí, že se řada nezastaví „v půlce karty“, ale vždycky zarovná začátek karty.
- `align-items: flex-start` je důležité. Bez něj by se při otevření jedné karty natáhly do výšky **všechny** karty.

### 2.3 Karta

```css
.card {
    flex: 0 0 min(300px, 80vw);     /* šířka zavřené karty */
    scroll-snap-align: start;       /* na tenhle okraj se "zacvakává" */
    background: #1A1A18;
    border: 1px solid #2E2D29;
    border-radius: 14px;
    padding: 28px;
    transition: flex-basis 400ms ease, border-color 200ms ease;
}

.card:hover {
    border-color: #F2A93B;
}

.card.is-open {
    flex-basis: min(600px, 85vw);   /* šířka otevřené karty */
}

.card h3 {
    margin: 0 0 12px;
    font-family: "JetBrains Mono", monospace;
    font-size: 1.3rem;
    color: #ECEBE6;
}

.card p {
    margin: 0 0 1em;            /* mezera pod každým odstavcem */
    color: #A3A199;
    line-height: 1.6;
}
```

Vysvětlení:

- `flex: 0 0 300px` je zkratka za tři věci: „neroztahuj se (0), nezmenšuj se (0), základní šířka je 300px“. Ta třetí hodnota se jmenuje **`flex-basis`**.
- `min(300px, 80vw)` znamená „300px, ale nikdy víc než 80 % šířky obrazovky“. Díky tomu se karta vejde i na mobil.
- `.card.is-open` platí **jen pro kartu, která má zároveň třídu `is-open`**. Tu jí přidá JavaScript po kliknutí na More. Karta pak má šířku 600px.
- `transition: flex-basis 400ms ease` říká: „když se změní šířka, neskákej, ale plynule ji změň během 400 milisekund“. **Tady vzniká horizontální animace.**

### 2.4 Schovaný delší text a animace výšky

Tohle je nejtěžší kousek, tak pomalu.

**Problém:** animovat výšku z `0` na `auto` („tak vysoké, jak je potřeba“) CSS neumí. Výška by jen skočila.

**Trik:** použijeme CSS Grid. Řádek mřížky s výškou `0fr` je zmáčknutý na nulu, řádek s `1fr` je tak vysoký, jak potřebuje obsah. A přechod mezi `0fr` a `1fr` už prohlížeč animovat umí.

```css
.card-more {
    display: grid;
    grid-template-rows: 0fr;              /* zavřeno: výška 0 */
    transition: grid-template-rows 400ms ease;
}

.card-more-inner {
    overflow: hidden;                     /* text, který se nevejde, nebude vidět */
}

.card.is-open .card-more {
    grid-template-rows: 1fr;              /* otevřeno: plná výška */
}
```

- `.card-more` je mřížka s jedním řádkem.
- `.card-more-inner` je jediný obsah toho řádku. `overflow: hidden` způsobí, že když je řádek nulový, text se schová, místo aby přetékal ven.
- `.card.is-open .card-more` (s mezerou!) znamená „`.card-more`, který je **uvnitř** otevřené karty“.

Protože se roztahuje text uvnitř karty, roztahuje se plynule i karta samotná. **Tady vzniká vertikální animace.**

> Proto jsme v HTML potřebovali dva obaly (`.card-more` a `.card-more-inner`). S jedním by trik nefungoval.

### 2.5 Tlačítko More

```css
.card-toggle {
    margin-top: 8px;
    padding: 8px 16px;
    background: none;
    border: 1px solid #F2A93B;
    border-radius: 8px;
    color: #F2A93B;
    font-family: "JetBrains Mono", monospace;
    font-size: 0.9rem;
    cursor: pointer;                       /* ručička při najetí myší */
    transition: background 200ms ease, color 200ms ease;
}

.card-toggle:hover,
.card-toggle:focus-visible {
    background: #F2A93B;
    color: #121211;
}
```

`:focus-visible` je stav, kdy na tlačítko přejdeš klávesou Tab. Tím se tlačítko zvýrazní i lidem, kteří neovládají stránku myší.

### 2.6 Šipky

```css
.carousel-btn {
    flex: 0 0 auto;
    width: 44px;
    height: 44px;
    border-radius: 50%;                    /* kolečko */
    border: 1px solid #2E2D29;
    background: #1A1A18;
    color: #ECEBE6;
    font-size: 1.6rem;
    line-height: 1;
    cursor: pointer;
    transition: border-color 200ms ease, color 200ms ease;
}

.carousel-btn:hover,
.carousel-btn:focus-visible {
    border-color: #F2A93B;
    color: #F2A93B;
}

@media (max-width: 520px) {
    .carousel-btn {
        display: none;    /* na mobilu se posouvá prstem, šipky jen zabírají místo */
    }
}
```

**Teď si stránku ulož a obnov.** Karty už by měly stát vedle sebe a jít posouvat kolečkem myši se Shiftem (nebo touchpadem). Tlačítka zatím nic nedělají, to přijde teď.

---

## 3. JavaScript: kliknutí, šipky, automatický posun

Ve složce `personal-web` (vedle `index.html`) vytvoř nový soubor **`script.js`**. Všechny části níž do něj vkládej postupně pod sebe.

### 3.1 Najdeme prvky na stránce

```js
// Najdeme si věci, se kterými budeme pracovat
const track = document.querySelector('.cards-track');
const prevBtn = document.querySelector('.carousel-btn.prev');
const nextBtn = document.querySelector('.carousel-btn.next');
const cards = document.querySelectorAll('.card');
```

- `document.querySelector('...')` najde **první** prvek, který odpovídá CSS selektoru. Selektory píšeš stejně jako v CSS.
- `document.querySelectorAll('...')` najde **všechny** (u nás všech pět karet).
- `const` je „krabička se jménem“, do které si něco uložíš, abys to nemusel hledat znovu.

### 3.2 Tlačítko More

```js
// Je zrovna nějaká karta otevřená?
function anyCardOpen() {
    return document.querySelector('.card.is-open') !== null;
}

// Každé kartě "naučíme" její tlačítko More
cards.forEach(function (card) {
    const button = card.querySelector('.card-toggle');

    button.addEventListener('click', function () {
        // přidá třídu is-open, nebo ji odebere, pokud už tam je
        const isOpen = card.classList.toggle('is-open');

        button.textContent = isOpen ? 'Less' : 'More';
        button.setAttribute('aria-expanded', isOpen);

        if (isOpen) {
            stopAuto();   // při čtení se karty nesmí ujíždět
            // až se karta roztáhne (400 ms), posuneme ji celou do zorného pole
            setTimeout(function () {
                card.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
            }, 400);
        } else if (!anyCardOpen()) {
            startAuto();  // všechny karty zavřené → zase se točí
        }
    });
});
```

Postupně:

- `cards.forEach(function (card) { ... })` znamená „pro každou kartu udělej tohle“. Uvnitř je v proměnné `card` vždy ta jedna karta.
- `addEventListener('click', ...)` je posluchač: „až někdo klikne, spusť tuhle funkci“.
- `classList.toggle('is-open')` je ten hlavní moment. Přidá kartě třídu `is-open` a **CSS se postará o animaci**. Při druhém kliknutí třídu odebere a karta se zavře. Vrátí `true`, když je karta teď otevřená.
- `isOpen ? 'Less' : 'More'` je zkrácený zápis podmínky: „když `isOpen`, tak `'Less'`, jinak `'More'`“.
- `scrollIntoView` zajistí, že roztažená karta nebude useknutá na kraji obrazovky.
- `stopAuto()` a `startAuto()` zatím neexistují, napíšeme je v 3.4. Pořadí funkcí v souboru nevadí.

### 3.3 Šipky

```js
// O kolik posunout = šířka jedné (zavřené) karty + mezera
function stepSize() {
    const card = document.querySelector('.card:not(.is-open)') || cards[0];
    const gap = parseFloat(getComputedStyle(track).gap) || 0;
    return card.offsetWidth + gap;
}

function goNext() {
    const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 5;
    if (atEnd) {
        track.scrollTo({ left: 0, behavior: 'smooth' });          // zpátky na začátek
    } else {
        track.scrollBy({ left: stepSize(), behavior: 'smooth' }); // o kartu doprava
    }
}

function goPrev() {
    const atStart = track.scrollLeft <= 5;
    if (atStart) {
        track.scrollTo({ left: track.scrollWidth, behavior: 'smooth' }); // skok na konec
    } else {
        track.scrollBy({ left: -stepSize(), behavior: 'smooth' });       // o kartu doleva
    }
}

nextBtn.addEventListener('click', function () {
    goNext();
    restartAuto();
});

prevBtn.addEventListener('click', function () {
    goPrev();
    restartAuto();
});
```

Pojmy, které potřebuješ znát:

- `track.scrollLeft`: o kolik pixelů je řada posunutá doleva (na začátku 0).
- `track.clientWidth`: kolik pixelů řady je **vidět**.
- `track.scrollWidth`: jak je řada široká **celá**, i s tím, co je schované.
- Takže `scrollLeft + clientWidth >= scrollWidth` znamená „vidím až na konec“. Tolerance `- 5` je tam proto, že prohlížeče občas počítají s desetinnými pixely.
- `scrollBy` posune **o** kus, `scrollTo` posune **na** přesné místo.
- `restartAuto()` po ručním kliknutí vynuluje časovač, aby karta hned po tvém kliknutí neujela sama.

### 3.4 Automatický posun

```js
let timer = null;   // 'let', protože se hodnota bude měnit

// Lidé, kteří mají v systému vypnuté animace, nechtějí ani samovolný posun
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function startAuto() {
    if (reduceMotion || anyCardOpen()) return;  // za těchto podmínek nespouštět
    stopAuto();                                 // pojistka: nikdy dva časovače naráz
    timer = setInterval(goNext, 4000);          // každé 4 s o kartu dál
}

function stopAuto() {
    clearInterval(timer);
    timer = null;
}

function restartAuto() {
    stopAuto();
    startAuto();
}

// Když je myš nad kartami, zastav se (ať se dá číst)
track.addEventListener('mouseenter', stopAuto);
track.addEventListener('mouseleave', startAuto);

// Spustit hned po načtení stránky
startAuto();
```

- `setInterval(goNext, 4000)` znamená „volej `goNext` každých 4000 ms“. Vrátí číslo časovače, které si uložíme do `timer`.
- `clearInterval(timer)` časovač zastaví.
- `return` uvnitř funkce znamená „tady skonči a dál nepokračuj“.
- Proč `stopAuto()` uvnitř `startAuto()`? Kdyby se `startAuto` zavolalo dvakrát, běžely by dva časovače a karty by se posouvaly dvakrát rychleji. Tohle je častá začátečnická chyba.

---

## 4. Vyzkoušej, že všechno funguje

Ulož všechny tři soubory, otevři stránku a projdi tenhle seznam:

- [ ] Karty stojí vedle sebe a mají stejný styl jako zbytek webu.
- [ ] Po 4 sekundách se samy posunou o jednu kartu, na konci skočí na začátek.
- [ ] Když najedeš myší na karty, posun se zastaví. Když myš odjedeš, pokračuje.
- [ ] Šipka `›` posune doprava, `‹` doleva. Na začátku `‹` skočí na konec.
- [ ] **More** kartu plynule roztáhne do šířky i výšky a text tlačítka se změní na **Less**.
- [ ] Dokud je karta otevřená, nic se samo neposouvá.
- [ ] **Less** kartu plynule zavře a po zavření poslední karty se posun zase rozjede.
- [ ] Na úzkém okně (zmenši prohlížeč nebo F12 → ikonka mobilu) se karty vejdou a jdou posouvat.

---

## 5. Když něco nefunguje

**Nejdřív vždycky:** zmáčkni **F12** a otevři záložku **Console**. Červený text je chyba a obvykle říká i číslo řádku v `script.js`.

| Co se děje | Pravděpodobná příčina |
|---|---|
| Tlačítka nedělají vůbec nic | Chybí `<script src="script.js" defer>`, nebo `script.js` není ve stejné složce jako `index.html`. |
| `Cannot read properties of null` | `querySelector` nic nenašel. Zkontroluj, že název třídy v HTML a v JS je **přesně** stejný (překlep, tečka navíc/chybí). |
| Karty jsou pod sebou, ne vedle sebe | Chybí `display: flex` u `.cards-track`, nebo karty nejsou uvnitř `.cards-track`. |
| Karta se otevře, ale skokem | Chybí `transition`, nebo chybí obal `.card-more-inner`. |
| Delší text je vidět pořád | Chybí `overflow: hidden` u `.card-more-inner`. |
| Při otevření se natáhnou všechny karty | Chybí `align-items: flex-start` u `.cards-track`. |
| Text v kartách je na střed | Chybí `text-align: left` u `.cards-section` (celý web je obalený v `<center>`). |
| Změna v CSS se neprojeví | Tvrdé obnovení stránky **Ctrl+F5** (prohlížeč si pamatuje starou verzi). |

---

## 6. Až to bude fungovat: nápady na vylepšení

- **Tečky pod karty** (●○○○○), které ukazují, kde v řadě jsi.
- Zastavit posun i při ovládání klávesnicí: stejně jako `mouseenter`/`mouseleave` přidej posluchače `focusin` a `focusout`.
- Zavřít ostatní karty, když se otevře nová (projdeš `cards.forEach` a odebereš `is-open` všem kromě té kliknuté).
- Načítat texty karet z jednoho souboru (JSON) místo opisování do HTML. Hodí se, až budeš texty často měnit.
