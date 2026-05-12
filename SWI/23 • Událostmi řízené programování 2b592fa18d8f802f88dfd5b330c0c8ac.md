# 23 • Událostmi řízené programování

událost - na základě ní se něco stane

dvojice Publisher-Subscriber

postaveno na návrhovém vzoru Observer

- **Publisher** (Zdroj): objekt, ve kterém událost vzniká (tlačítko)
- **Subscriber** (Odběratel)**:** objekt, který čeká, až se něco stane, a pak na to reaguje (formulář)
- **Event** (Událost)**:** signál, na základě kterého se něco stane

### implementace (C#)

**delegát** - předpis pro tvar nějaké metody

- definuje, jaké parametry a návratový typ musí mít metoda, která chce událost obsloužit
- interně v sobě může držet odkaz na jednu metodu, nebo na pole metod (invocation list)
- v praxi **proměnná, do které lze uložit metodu**

**event** - obal kolem delegáta 

- klíčové slovo event zaručuje **zapouzdření** - ****mimo třídu jde udělat jen **`+=`(přihlášení)** a
    
    **`-=` (odhlášení)**
    
- zavolat event může **jen ta třída, která ji definovala** (Publisher)

### syntax

```csharp
void Metoda(object sender, EventArgs e)
{
  // reakce na událost 
}
```

- `object sender` - **kdo** událost vyvolal (tlačítko, časovač) - Publisher
- `EventArgs e` - **data události.** např. souřadnice myši u kliknutí… jinak `EventArgs.Empty`

### přihlášení k odběru

```csharp
button.Click += Metoda; // přidá metodu do "pole metod"
button.Click -= Metoda; // odebere ji
```

### další příklady

addEventListener v prohlížeči (JS):

```jsx
button.addEventListener('click', (e) => {
	console.log("odesláno!");
});
```

- uživatel klikne na button
- **Publisher** se podívá do seznamu událostí a spustí “handler” u **eventu** ‘click’

onClick, onChange, onFormSubmit…