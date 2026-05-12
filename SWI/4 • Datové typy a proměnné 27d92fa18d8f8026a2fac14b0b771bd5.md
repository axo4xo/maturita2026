# 4 • Datové typy a proměnné

programovací jazyky, rozřazení

- datový typ = typ dat, co se daj uložit do nějaké proměnné
- proměnná = část paměti, do které se dají uložit svoje hodnoty
- datový typ určuje, jaký druh dat se dá do proměnné uložit

například

- int8
- string
- boolean
- float
- object
- reference

vs JS/TS není float/integer - Number

**staticky typované jazyky - C#**

- jakmile je proměnná číslo, nikdy se do ní nedá dát nic jiného

**dynamicky typovaný jazyk - JS**

- proměnná je definovaná samotnými daty
- let x = 3; ← iniciace
- x = ‘a’;

TS - pokus o statické typování JS - hraje roli compiler, překladač (Babel)

**kompilovaný** (C) vs **interpretovaný** jazyk (Py)

i funkce je normální proměnná

**immutabilita** vs **konstanta**

- konstanta - proměnná, u které se nedá měnit obsah
- natvrdo uložená hodnota

```jsx
const x = 7;
x = 4; // 
```

**immutabilita**:

```jsx
let y = {};
y = {};
z = new {};
```

nelze změnit část objektu, pokaždé se musí vytvořit nový

změna Stringů v C#

React - state management (state, reducer):

```jsx
const [x, setX] = useState({a: 4, b: 4});
x.a = 3; // platný výraz, změní obsah paměti, nevyvolá překreslení
setX({3, ..}) // vyvolá reload
```

zde se x chová immutable

**přetypování**

1. **implicitní** - jazyk si dokáže poradit sám (double ← float) - float je menší než double
2. **explicitní** - float ← double; proměnná se tam nemusí vejít
`float x = (float) y` ← vím, co dělám, když se to nepovede je to moje vina
3. **konverze** - float ← string - není triviální, není jednoznačná
    
    volá se metoda, která to dělá, jazyk tu metodu nezná (convert, toFloat, …)