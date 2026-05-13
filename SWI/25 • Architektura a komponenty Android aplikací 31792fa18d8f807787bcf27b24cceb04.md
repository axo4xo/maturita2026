# 25 • Architektura a komponenty Android aplikací

> Architektura, Kernel, ART, Activity, Service, Broadcast Receiver, Content Provider, Sandbox, Manifest, práva, Intent, Compose, MVVM, Lifecycle
> 

---

## Co je Android

**Android** je open-source mobilní operační systém spravovaný **Googlem** a koalicí **Open Handset Alliance**. Postavený na **Linuxovém kernelu**. Běží na telefonech, tabletech, hodinkách (Wear OS), TV (Android TV), autech (Android Auto / Automotive).

První verze 2008 (Android 1.0), aktuálně Android 15 (vydaný 2024) a Android 16 (2025). Verze se dříve pojmenovávaly podle dezertů (Cupcake, Donut, Eclair...), od Androidu 10 už jen čísly.

### Klíčové vlastnosti

|  |  |
| --- | --- |
| **Vývojové jazyky** | Kotlin (preferovaný od 2017), Java (legacy), C/C++ (NDK pro výkon) |
| **IDE** | Android Studio (oficiální, postavený na IntelliJ) |
| **Build systém** | Gradle |
| **Distribuce** | Google Play Store, sideloading APK, F-Droid |
| **Open source** | AOSP (Android Open Source Project), z toho čerpají custom ROMy (LineageOS, GrapheneOS, Evolution X) |

---

## Architektura Android platformy

Android je **zásobník vrstev**. Každá vrstva poskytuje služby vrstvě nad ní a abstrahuje od té pod ní.

![image.png](25%20%E2%80%A2%20Architektura%20a%20komponenty%20Android%20aplikac%C3%AD/image.png)

### Vrstvy zdola nahoru

### 1. Linux Kernel

Základ celé platformy. Spravuje paměť, procesy, drivery hardwaru. Verze kernelu se mírně liší od mainline Linux kernelu (Android přidává specifické úpravy: Binder IPC, wakelocks, atd.). Stará se o **bezpečnost na úrovni procesů** (každá aplikace má vlastní UID, viz Sandbox).

### 2. HAL (Hardware Abstraction Layer)

Standardní rozhraní mezi hardwarem a vyššími vrstvami. Aplikace volá "fotit fotku", HAL přeloží to volání na konkrétní driver kamery.

### 3. Android Runtime + Native Libraries

**ART** spouští bytekód aplikací. Vedle něj C/C++ knihovny: OpenGL pro grafiku, SQLite pro databáze, WebKit pro WebView, libc, SSL.

### 4. Application Framework

Vrstva, se kterou pracují vývojáři aplikací. Java/Kotlin API pro Activity Manager, Notifikace, Location, Content Providers, atd.

### 5. Applications

Samotné aplikace, jak systémové (Kontakty, Telefon, Gmail) tak third-party.

---

## ART (Android Runtime)

**ART** je virtuální stroj Androidu, nástupce **Dalvik VM** (od Android 5.0 Lollipop, 2014). Spouští bytekód aplikací ve specifickém formátu **DEX** (Dalvik Executable).

### Cesta od kódu k běžící aplikaci

```
Zdrojový kód (.kt, .java)
        ↓     Kompilace (kotlinc / javac)
 Java bytecode (.class)
      ↓        D8 / R8 dexer
 DEX soubor (.dex)
      ↓
 Aplikace nainstalovaná (.apk obsahuje DEX)
      ↓         ART
 AOT + JIT kompilace do strojového kódu pro daný CPU
      ↓
 Běžící aplikace
```

### ART vs Dalvik

|  | Dalvik (do Androidu 5.0) | ART (od Androidu 5.0) |
| --- | --- | --- |
| **Kompilace** | JIT (Just-In-Time, za běhu) | Hybrid AOT + JIT |
| **Instalace** | Rychlejší | Pomalejší (AOT kompiluje) |
| **Spuštění aplikace** | Pomalejší (JIT překládá) | Rychlejší (už zkompilováno) |
| **Paměťová stopa** | Menší | Větší (uložený AOT kód) |

Od Androidu 7.0 ART používá **profile-guided AOT**: nejdřív aplikace běží přes JIT, ART sleduje které části se používají často, a postupně je v klidu (nabíjení v noci) překompiluje AOT. Nejlepší obou světů.

---

## Sandbox

Každá aplikace běží ve vlastním **sandboxu**: izolovaném prostředí. Toto je zděděno z Linuxového user systému.

```
┌─────────────────────────────┐
│  App A (UID 10067)          │
│  ├─ vlastní proces           │
│  ├─ vlastní paměť            │
│  └─ vlastní filesystem       │
│     /data/data/com.app.a/    │
└─────────────────────────────┘

┌─────────────────────────────┐
│  App B (UID 10069)          │
│  ├─ vlastní proces (jiný)    │
│  ├─ vlastní paměť (jiná)     │
│  └─ vlastní filesystem       │
│     /data/data/com.app.b/    │
└─────────────────────────────┘

App A NEMŮŽE číst data App B (jiné UID, Linux ochrana)
```

### Důsledky

- **Bezpečnost**: jedna aplikace nemůže šahat do druhé bez explicitního souhlasu
- **Crash izolace**: pád jedné aplikace neshodí systém
- **Sdílení dat** vyžaduje explicitní mechanismus: Content Provider, Intent, IPC

> **Důležitá poznámka:** root přístup obchází sandbox z pozice systému. Aplikaci s rootem nelze sandboxem omezit. Proto root práva znamenají věřit konkrétní aplikaci, že je nezneužije.
> 

---

## Čtyři základní komponenty Android aplikace

### 1. Activity

**Activity** je jedna obrazovka s UI. Uživatel vidí a interaguje s jednou Activity najednou. Aplikace má typicky několik Activities (LoginActivity, MainActivity, DetailActivity).

```kotlin
class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MaterialTheme {
                MainScreen()
            }
        }
    }
}
```

V moderním Android vývoji se trend posouvá k **Single Activity Architecture**: jedna Activity, navigace mezi obrazovkami pomocí Navigation Component a Fragmentů (nebo Compose composables).

### 2. Service

**Service** běží **na pozadí bez UI**. Slouží pro dlouhotrvající úlohy.

| Typ | Popis | Příklad |
| --- | --- | --- |
| **Foreground Service** | S povinnou viditelnou notifikací | Přehrávání hudby, navigace, fitness tracker |
| **Background Service** | Bez UI (omezené od Android 8+) | Sync dat (krátké úlohy) |
| **Bound Service** | Jiná komponenta se k němu připojí (IPC) | Sdílená logika mezi appkami |

```kotlin
class MusicService : Service() {
    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        // Foreground service vyžaduje notifikaci
        startForeground(NOTIFICATION_ID, buildNotification())
        // přehrávat hudbu
        return START_STICKY  // restart pokud OS service zabije
    }
}
```

### 3. Broadcast Receiver

**Broadcast Receiver** naslouchá **systémovým nebo aplikačním broadcastům**: zprávám, které posílá OS nebo jiná aplikace.

```
Systém Android
    │  "wifi_state_changed"
    │  "battery_low"
    │  "screen_on"
    ▼
Broadcast Receiver → reaguje (sync data, zobrazí notifikaci)
```

```kotlin
class NetworkReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        if (intent.action == ConnectivityManager.CONNECTIVITY_ACTION) {
            val isConnected = checkConnection(context)
            // ...
        }
    }
}
```

### 4. Content Provider

**Content Provider** umožňuje aplikaci **poskytovat data jiným aplikacím** přes standardní rozhraní (URI a CRUD operace).

```
Tvoje App ──── ContentResolver ──── Content Provider ──── Jiná App
                                  (např. Contacts Provider)
                                          │
                                  content://contacts/people
```

Příklady systémových Content Providers:

| Provider | Co poskytuje | URI |
| --- | --- | --- |
| **ContactsContract** | Kontakty | `content://contacts/contacts` |
| **MediaStore** | Fotky, videa, hudba | `content://media/external/images/media` |
| **CalendarContract** | Kalendář | `content://com.android.calendar/events` |
| **Documents** | Soubory | `content://documents/...` |

```kotlin
// Čtení kontaktů
val cursor = contentResolver.query(
    ContactsContract.Contacts.CONTENT_URI,
    null, null, null, null
)
```

### Souhrn 4 komponent

| Komponenta | UI? | Účel | Příklad |
| --- | --- | --- | --- |
| **Activity** | Ano | Jedna obrazovka | Login, Detail produktu |
| **Service** | Ne | Background práce | Přehrávání hudby, navigace |
| **Broadcast Receiver** | Ne | Reakce na události | Wifi zapnuto, baterie nízká |
| **Content Provider** | Ne | Sdílení dat | Kontakty, Media |

---

## AndroidManifest.xml

**Manifest** je **povinný konfigurační soubor**. Říká systému, jakou má aplikace strukturu, co potřebuje a jak ji spouštět. Bez správné registrace v manifestu komponenta neexistuje.

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.example.myapp">

    <!-- Oprávnění -->
    <uses-permission android:name="android.permission.CAMERA" />
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />

    <!-- Minimální SDK -->
    <uses-sdk
        android:minSdkVersion="24"
        android:targetSdkVersion="34" />

    <application
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:theme="@style/AppTheme">

        <!-- Aktivita s launcher kategorií = vstupní bod -->
        <activity
            android:name=".MainActivity"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>

        <!-- Druhá aktivita, nedostupná zvenku -->
        <activity android:name=".DetailActivity" android:exported="false" />

        <!-- Service -->
        <service android:name=".MusicService" android:foregroundServiceType="mediaPlayback" />

        <!-- Broadcast Receiver -->
        <receiver android:name=".BootReceiver" android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.BOOT_COMPLETED" />
            </intent-filter>
        </receiver>

        <!-- Content Provider -->
        <provider
            android:name=".MyContentProvider"
            android:authorities="com.example.myapp.provider"
            android:exported="false" />

    </application>
</manifest>
```

### Co manifest definuje

- **Všechny 4 komponenty** (Activity, Service, Receiver, Provider)
- **Permissions**: co aplikace potřebuje
- **`minSdkVersion`, `targetSdkVersion`**: rozsah Android verzí
- **Ikona, název, téma**
- **Intent filters**: jaké intenty aplikace umí zpracovat
- **`exported` flag**: jestli komponenta může být spuštěna z jiných aplikací (povinné od Android 12)

---

## Práva (Permissions)

Android používá **permission systém** pro kontrolu přístupu k citlivým API a datům.

### Kategorie permissions

| Typ | Schválení | Příklady |
| --- | --- | --- |
| **Normal** | Automaticky při instalaci | `INTERNET`, `ACCESS_NETWORK_STATE`, `VIBRATE` |
| **Dangerous** | Uživatel musí schválit za běhu | `CAMERA`, `READ_CONTACTS`, `ACCESS_FINE_LOCATION` |
| **Signature** | Jen aplikace podepsané stejným klíčem | Pro suite aplikací jednoho výrobce |
| **Special** | Speciální nastavení v Settings | `SYSTEM_ALERT_WINDOW`, `WRITE_SETTINGS` |

### Runtime permissions (od Android 6, 2015)

Dangerous permissions se neudělují při instalaci, ale **v okamžiku, kdy aplikace funkci potřebuje**. Uživatel vidí dialog a může povolit/odmítnout.

```kotlin
// Kontrola, jestli permission je udělena
if (ContextCompat.checkSelfPermission(this, Manifest.permission.CAMERA)
    != PackageManager.PERMISSION_GRANTED) {

    // Žádost o permission
    ActivityCompat.requestPermissions(
        this,
        arrayOf(Manifest.permission.CAMERA),
        REQUEST_CODE_CAMERA
    )
}

// V moderním Compose:
val permissionLauncher = rememberLauncherForActivityResult(
    ActivityResultContracts.RequestPermission()
) { granted ->
    if (granted) { /* spusť kameru */ }
}

Button(onClick = { permissionLauncher.launch(Manifest.permission.CAMERA) }) {
    Text("Otevřít kameru")
}
```

### Specifika novějších Androidu

| Verze | Změna |
| --- | --- |
| **Android 6.0** | Runtime permissions zavedeny |
| **Android 10** | Scoped Storage (omezený přístup k souborům) |
| **Android 11** | One-time permissions (povolit "jen teď") |
| **Android 13** | `POST_NOTIFICATIONS` (notifikace jsou nově dangerous) |
| **Android 14** | Granulární galerie (vybrat jen některé fotky) |

---

## Intent

**Intent** je **zpráva**, která spouští komponentu nebo předává data mezi komponentami. Slovo znamená "záměr" (chci něco udělat).

### Explicitní Intent

Znáš přesnou cílovou komponentu (vlastní Activity, vlastní Service).

```kotlin
val intent = Intent(this, DetailActivity::class.java)
intent.putExtra("user_id", 69)
intent.putExtra("source", "main_screen")
startActivity(intent)
```

V DetailActivity:

```kotlin
val userId = intent.getIntExtra("user_id", -1)
val source = intent.getStringExtra("source")
```

### Implicitní Intent

Nevíš, která aplikace to zvládne. Systém najde **všechny vhodné aplikace** a buď přímo spustí, nebo zobrazí **Intent Chooser** (modální dialog s výběrem).

```kotlin
// Otevřít URL: systém ukáže prohlížeče
val intent = Intent(Intent.ACTION_VIEW, Uri.parse("https://spot.ax4.cz"))
startActivity(intent)

// Sdílet text: systém ukáže aplikace pro sdílení
val shareIntent = Intent(Intent.ACTION_SEND).apply {
    type = "text/plain"
    putExtra(Intent.EXTRA_TEXT, "Mrkni na SpotShare!")
}
startActivity(Intent.createChooser(shareIntent, "Sdílet přes..."))

// Vyfotit fotku: spustí výchozí kameru
val takePicture = Intent(MediaStore.ACTION_IMAGE_CAPTURE)
startActivity(takePicture)
```

### Intent Filters v manifestu

Aplikace v manifestu deklaruje, **jaké intenty umí zpracovat**:

```xml
<activity android:name=".ShareActivity">
    <intent-filter>
        <action android:name="android.intent.action.SEND" />
        <category android:name="android.intent.category.DEFAULT" />
        <data android:mimeType="text/plain" />
    </intent-filter>
</activity>
```

Toto registruje aplikaci jako kandidáta pro "sdílet text".

### Activity Result API (moderní)

Stará metoda `startActivityForResult` + `onActivityResult` je **deprecated**. Moderní přístup:

```kotlin
val cameraLauncher = registerForActivityResult(
    ActivityResultContracts.TakePicturePreview()
) { bitmap: Bitmap? ->
    // zpracuj fotku
}

Button(onClick = { cameraLauncher.launch(null) }) {
    Text("Vyfotit")
}
```

---

## Activity Lifecycle

Activity prochází řadou **callback metod** podle stavu. Pochopení je klíčové pro správnou aplikaci.

| Callback | Kdy se volá | Co dělat |
| --- | --- | --- |
| **`onCreate()`** | Activity se vytvoří | Inicializace UI, dat, ViewModelu |
| **`onStart()`** | Activity je viditelná | Start UI animací |
| **`onResume()`** | Uživatel interaguje | Start kamery, GPS, senzorů |
| **`onPause()`** | Příchozí jiná Activity | Uložit stav, zastavit kameru |
| **`onStop()`** | Activity zcela skrytá | Zastavit těžké operace |
| **`onRestart()`** | Po stopu, před startem | Obnovení dat |
| **`onDestroy()`** | Activity se ničí | Uvolnit zdroje |

### Typické scénáře

```
Spuštění aplikace:    onCreate → onStart → onResume
Minimalizace (Home):  onPause → onStop
Návrat do aplikace:   onRestart → onStart → onResume
Zavření aplikace:     onPause → onStop → onDestroy
Otevření jiné app:    onPause → onStop (a → onResume po návratu)
```

### Configuration changes (rotace, dark mode)

Defaultně se Activity **úplně zničí a vytvoří znovu** při změně konfigurace (rotace, jazyk, dark/light mode).

```
Rotace telefonu:      onPause → onStop → onDestroy → onCreate → onStart → onResume
```

Proto je důležitý **ViewModel**, který tuto destrukci přežije:

```kotlin
class MainViewModel : ViewModel() {
    val data = mutableStateListOf<User>()  // přežije rotaci

    init {
        loadData()
    }
}
```

---

## Fragment (stručně)

**Fragment** je "mini Activity" - kus UI s vlastním lifecycle, který lze vložit do Activity. Klasicky se používal pro:

- Tablet UI (dva fragmenty vedle sebe)
- Recyklace UI komponent v různých Activity
- Navigaci mezi obrazovkami v Single Activity Architecture

Dnes v Compose éře se používá méně, ale ještě existuje. Má vlastní lifecycle podobný Activity.

```kotlin
class UserListFragment : Fragment(R.layout.fragment_user_list) {
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        // ...
    }
}
```

---

## MVVM architektura

**MVVM** (Model-View-ViewModel) je **doporučená architektura Googlu** pro Android aplikace.

### Vrstvy

```
┌─────────────────────────────────────────┐
│             VIEW (UI)                   │
│      Activity / Compose / Fragment      │
│      "Co se zobrazuje uživateli"        │
└─────────────────────┬───────────────────┘
                      │ observuje state
                      ▼
┌─────────────────────────────────────────┐
│           VIEWMODEL                     │
│   - Drží UI state                       │
│   - Zpracovává user actions             │
│   - Volá Repository                     │
└─────────────────────┬───────────────────┘
                      │ volá
                      ▼
┌─────────────────────────────────────────┐
│              MODEL                      │
│   - Repository (abstrakce)              │
│   - Data sources:                       │
│     • API (Retrofit)                    │
│     • Database (Room)                   │
│     • Cache, SharedPrefs                │
└─────────────────────────────────────────┘
```

### Kompletní příklad

```kotlin
// MODEL (Repository)
class UserRepository(
    private val api: UserApi,
    private val dao: UserDao
) {
    suspend fun getUsers(): List<User> {
        return try {
            val users = api.fetchUsers()
            dao.insertAll(users)  // cache
            users
        } catch (e: Exception) {
            dao.getAll()  // fallback na lokální data
        }
    }
}

// VIEWMODEL
class UserViewModel(
    private val repository: UserRepository
) : ViewModel() {

    private val _users = MutableStateFlow<List<User>>(emptyList())
    val users: StateFlow<List<User>> = _users.asStateFlow()

    private val _loading = MutableStateFlow(false)
    val loading: StateFlow<Boolean> = _loading.asStateFlow()

    init {
        loadUsers()
    }

    fun loadUsers() {
        viewModelScope.launch {
            _loading.value = true
            _users.value = repository.getUsers()
            _loading.value = false
        }
    }
}

// VIEW (Compose)
@Composable
fun UserScreen(viewModel: UserViewModel = hiltViewModel()) {
    val users by viewModel.users.collectAsStateWithLifecycle()
    val loading by viewModel.loading.collectAsStateWithLifecycle()

    if (loading) {
        CircularProgressIndicator()
    } else {
        LazyColumn {
            items(users) { user ->
                Text(user.name)
            }
        }
    }
}
```

### Klíčové výhody MVVM

- **ViewModel přežije rotaci** obrazovky (Activity zničena, ViewModel zůstává)
- **Oddělení concerns**: UI logika oddělená od business logiky
- **Testovatelnost**: ViewModel a Repository lze unit testovat bez Android frameworku
- **Unidirectional Data Flow**: stav teče dolů (do View), události nahoru (do ViewModelu)

---

## Jetpack Compose

**Jetpack Compose** je **moderní deklarativní UI framework** pro Android od Googlu (stable od 2021).

### Compose vs tradiční XML

|  | XML + Views (legacy) | Jetpack Compose |
| --- | --- | --- |
| **Paradigma** | Imperativní | Deklarativní |
| **UI definice** | XML soubory + Kotlin/Java kód | Pouze Kotlin (`@Composable` funkce) |
| **State management** | LiveData, manuální updates | Reactive (recomposition) |
| **Boilerplate** | Hodně (findViewById, adapters) | Málo |
| **Animace** | XML animations, complex | Built-in, jednoduché |
| **Testování** | Espresso, těžkopádné | Snadné, kompozní testy |

### Základy Compose

```kotlin
// Composable funkce
@Composable
fun Greeting(name: String) {
    Column(
        modifier = Modifier.padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(8.dp)
    ) {
        Text(
            text = "Ahoj, $name!",
            style = MaterialTheme.typography.headlineLarge
        )
        Button(onClick = { /* akce */ }) {
            Text("Klikni mě")
        }
    }
}
```

### State v Compose

```kotlin
@Composable
fun Counter() {
    // remember: zachová hodnotu napříč recomposition
    // mutableStateOf: reaktivní stav
    var count by remember { mutableStateOf(0) }

    Column {
        Text("Kliknuto: $count×")
        Button(onClick = { count++ }) {
            Text("+1")
        }
    }
}
```

### State hoisting

Best practice: stav drž **co nejvýše** v hierarchii, předávej dolů:

```kotlin
// Stateful (drží vlastní stav)
@Composable
fun CounterScreen() {
    var count by remember { mutableStateOf(0) }

    // Stateless komponenta dostává stav i callback
    CounterDisplay(count = count, onIncrement = { count++ })
}

// Stateless (jen zobrazuje a deleguje akce)
@Composable
fun CounterDisplay(count: Int, onIncrement: () -> Unit) {
    Button(onClick = onIncrement) {
        Text("$count")
    }
}
```

---

## Coroutines a Flow (asynchronní programování)

### Coroutines

Lightweight threads pro asynchronní kód v Kotlinu. Nahrazují callbacky a thread management.

```kotlin
class UserViewModel : ViewModel() {
    fun loadUsers() {
        viewModelScope.launch {
            val users = repository.getUsers()  // suspend funkce
            _users.value = users
        }
    }
}

// V Repository
class UserRepository {
    suspend fun getUsers(): List<User> {
        return withContext(Dispatchers.IO) {
            api.fetchUsers()  // síťový request
        }
    }
}
```

| Pojem | Význam |
| --- | --- |
| **`suspend`** | Funkce, která lze pauzovat a obnovit |
| **`launch`** | Spustí coroutine "fire and forget" |
| **`async / await`** | Spustí coroutine vracející hodnotu |
| **`Dispatchers.IO`** | Pool vláken pro IO operace |
| **`Dispatchers.Main`** | Hlavní (UI) vlákno |
| **`viewModelScope`** | Coroutine scope vázaný na lifecycle ViewModelu |

### Flow (reaktivní streamy)

Flow je **asynchronní stream hodnot** v čase. Podobné Promise, ale může vrátit víc hodnot postupně.

```kotlin
class UserRepository {
    fun observeUsers(): Flow<List<User>> = flow {
        while (true) {
            emit(api.fetchUsers())
            delay(60_000)  // každou minutu
        }
    }
}

// V ViewModelu
val users: StateFlow<List<User>> = repository.observeUsers()
    .stateIn(viewModelScope, SharingStarted.Lazily, emptyList())
```

Typy:

- **`Flow<T>`**: cold stream, spouští se při collect
- **`StateFlow<T>`**: hot stream s aktuální hodnotou (jako LiveData)
- **`SharedFlow<T>`**: hot stream pro multi-subscriber

---

## Gradle: build systém

**Gradle** je build systém Androidu. Konfiguruje se v souborech `build.gradle.kts` (Kotlin DSL) nebo `build.gradle` (Groovy DSL).

### Struktura projektu

```
MyApp/
├── settings.gradle.kts     ← seznam modulů
├── build.gradle.kts        ← root config (verze pluginů)
├── gradle.properties       ← properties
└── app/
    ├── build.gradle.kts    ← config aplikace
    ├── src/
    │   ├── main/
    │   │   ├── AndroidManifest.xml
    │   │   ├── java/com/example/myapp/  ← Kotlin kód
    │   │   └── res/                      ← drawable, strings, layouts
    │   └── test/                          ← unit testy
    └── proguard-rules.pro                 ← R8/ProGuard pravidla
```

### Příklad `app/build.gradle.kts`

```kotlin
plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
    id("com.google.dagger.hilt.android")
}

android {
    namespace = "com.example.myapp"
    compileSdk = 34

    defaultConfig {
        applicationId = "com.example.myapp"
        minSdk = 24
        targetSdk = 34
        versionCode = 1
        versionName = "1.0"
    }

    buildFeatures {
        compose = true
    }
}

dependencies {
    implementation("androidx.core:core-ktx:1.12.0")
    implementation("androidx.compose.material3:material3:1.2.0")
    implementation("androidx.lifecycle:lifecycle-viewmodel-compose:2.7.0")
    implementation("io.coil-kt:coil-compose:2.5.0")
}
```

---

## Klíčové Jetpack knihovny

**Jetpack** je sada Googlem oficiálně podporovaných knihoven, které tvoří moderní Android ekosystém.

| Knihovna | K čemu |
| --- | --- |
| **Compose** | Moderní UI framework |
| **ViewModel** | Stav UI, přežívá rotaci |
| **LiveData / StateFlow** | Reaktivní data |
| **Room** | SQLite ORM, jednoduché DB API |
| **Retrofit**  | HTTP client pro REST API |
| **Navigation** | Navigace mezi obrazovkami |
| **WorkManager** | Spolehlivá background práce |
| **DataStore** | Náhrada SharedPreferences (typesafe) |
| **Hilt** | Dependency Injection |
| **Coil** | Načítání obrázků |

### Room příklad

```kotlin
@Entity
data class User(
    @PrimaryKey val id: Int,
    val name: String,
    val email: String
)

@Dao
interface UserDao {
    @Query("SELECT * FROM user")
    fun getAll(): Flow<List<User>>

    @Insert
    suspend fun insert(user: User)
}

@Database(entities = [User::class], version = 1)
abstract class AppDatabase : RoomDatabase() {
    abstract fun userDao(): UserDao
}
```

### Retrofit příklad

```kotlin
interface UserApi {
    @GET("users")
    suspend fun getUsers(): List<User>

    @POST("users")
    suspend fun createUser(@Body user: User): User
}

val retrofit = Retrofit.Builder()
    .baseUrl("https://api.example.com/")
    .addConverterFactory(GsonConverterFactory.create())
    .build()

val api = retrofit.create(UserApi::class.java)
```

### WorkManager příklad

```kotlin
class UploadWorker(context: Context, params: WorkerParameters) :
    CoroutineWorker(context, params) {

    override suspend fun doWork(): Result {
        return try {
            uploadFile()
            Result.success()
        } catch (e: Exception) {
            Result.retry()
        }
    }
}

// Spuštění
val request = OneTimeWorkRequestBuilder<UploadWorker>()
    .setConstraints(Constraints.Builder()
        .setRequiredNetworkType(NetworkType.UNMETERED)
        .build())
    .build()

WorkManager.getInstance(context).enqueue(request)
```

---

## Rychlý tahák

| Pojem | Klíčová fakta |
| --- | --- |
| **Android** | Linux-based OS od Googlu, jazyk Kotlin |
| **Architektura** | Linux Kernel → HAL → Libraries/ART → Framework → Apps |
| **Linux Kernel** | Procesy, paměť, drivers, bezpečnost (UID) |
| **HAL** | Standardní rozhraní pro HW |
| **ART** | Android Runtime, nástupce Dalvik, hybrid AOT+JIT |
| **DEX** | Bytecode formát ART (Dalvik Executable) |
| **Sandbox** | Každá aplikace = vlastní UID, izolovaná |
| **Activity** | Jedna obrazovka s UI |
| **Service** | Background komponenta bez UI |
| **Foreground Service** | S povinnou notifikací (od Android 8) |
| **Broadcast Receiver** | Reaguje na systémové broadcasty |
| **Content Provider** | Sdílí data s jinými aplikacemi přes URI |
| **AndroidManifest.xml** | Povinný config, registrace komponent + práva |
| **Permission Normal** | Auto schválené při instalaci |
| **Permission Dangerous** | Runtime, uživatel schvaluje za běhu |
| **Intent** | Zpráva spouštějící komponentu nebo předávající data |
| **Explicitní Intent** | Znám konkrétní cíl |
| **Implicitní Intent** | Systém najde vhodnou aplikaci (chooser) |
| **Intent Filter** | Deklaruje, jaké intenty komponenta zpracuje |
| **Activity Lifecycle** | onCreate → onStart → onResume → onPause → onStop → onDestroy |
| **ViewModel** | Drží UI state, přežije rotaci |
| **MVVM** | View → ViewModel → Model (Repository) |
| **Compose** | Deklarativní UI framework, `@Composable` funkce |
| **`remember`** | Zachovat stav přes recompositions |
| **`mutableStateOf`** | Reaktivní stav |
| **State hoisting** | Stav nahoru, callbacks dolů |
| **Coroutines** | Kotlin async, `suspend`, `viewModelScope` |
| **Flow** | Asynchronní stream hodnot |
| **StateFlow** | Hot stream s aktuální hodnotou |
| **Gradle** | Build systém Androidu |
| **Jetpack** | Sada moderních knihoven od Googlu |
| **Room** | SQLite ORM |
| **Retrofit** | HTTP client pro REST API |
| **WorkManager** | Spolehlivá background práce |
| **Hilt** | Dependency injection |

---

## Tipy pro ústní zkoušku

### Jak začít

> *"Android je open-source mobilní operační systém od Googlu postavený na Linuxovém kernelu. Architektonicky je to zásobník vrstev: Linux kernel, HAL, Android Runtime (ART) s nativními knihovnami, Application Framework a samotné aplikace. Aplikace běží v sandboxu pro bezpečnost a izolaci. Skládá se ze čtyř základních komponent: Activity, Service, Broadcast Receiver a Content Provider, které jsou registrované v Manifestu."*
> 

### Co komise typicky chce slyšet

- **5 vrstev architektury** (Linux Kernel, HAL, ART, Framework, Apps)
- **ART vs Dalvik** rozdíl
- **Sandbox** a jeho účel (bezpečnost, izolace)
- **4 komponenty** s konkrétními příklady
- **AndroidManifest.xml** jako povinný config
- **Runtime permissions** (dangerous se schvalují za běhu)
- **Intent** explicit vs implicit + chooser
- **Activity lifecycle** v základních krocích
- **MVVM** a proč ViewModel přežije rotaci

### Doplňky, které komisi potěší

- **Hybrid AOT+JIT** v moderním ART
- **AOSP a custom ROMy** (LineageOS, GrapheneOS)
- **Background restrictions** od Android 8 (Foreground Service místo Background)
- **Compose** vs XML (deklarativní vs imperativní)
- **State hoisting** v Compose
- **Coroutines a Flow** pro async
- **Hilt** pro DI
- **WorkManager** pro deferred background work
- **Single Activity Architecture** jako moderní trend

### Časté chytáky

| Otázka | Odpověď |
| --- | --- |
| *Rozdíl ART vs Dalvik?* | Dalvik byl JIT (kompilace za běhu). ART je hybrid AOT+JIT: kompiluje při instalaci a profile-guided při nečinnosti. |
| *Co se stane při rotaci telefonu?* | Activity se zničí a znovu vytvoří (onDestroy → onCreate). ViewModel přežije, proto se používá pro stav. |
| *Rozdíl explicitního a implicitního Intentu?* | Explicitní zná konkrétní cílovou Activity/Service. Implicitní deklaruje záměr a systém vybere vhodnou aplikaci. |
| *Proč Manifest?* | Povinný config soubor. OS bez něj neví, jaké komponenty aplikace má, jaká práva chce, jakou má hlavní Activity. |
| *Co je Sandbox?* | Izolace každé aplikace přes vlastní Linux UID, vlastní proces, vlastní filesystem. App A nečte data App B. |
| *Co je Content Provider?* | Komponenta, která exponuje data aplikace jiným aplikacím přes standardizované URI a CRUD rozhraní. |
| *Proč MVVM a ne MVC?* | MVVM odděluje state (ViewModel) od View, ViewModel přežívá konfigurační změny (rotace). |
| *Jak funguje Compose recomposition?* | Když se mění `State`, Compose automaticky znovu vyrenderuje komponenty, které ten state čtou. |