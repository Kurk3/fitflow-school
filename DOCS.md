# FitFlow - Projektová dokumentácia

**Webová aplikácia pre plánovanie tréningov s interaktívnym 3D modelom**

---

## 1. Úvod a kontext projektu

### 1.1 Motivácia

FitFlow vznikol z potreby priniesť inovatívny prístup k vyberaniu cvikov v fitness prostredí. Tradičné aplikácie a webové stránky prezentujú cviky formou zoznamov, kategórií alebo vyhľadávania, čo môže byť pre začiatočníkov mätúce a neprehľadné.

**Hlavný problém, ktorý riešime:**
- Nováčikovia v posilňovni často nevedia, aké svaly konkrétne cviky zaťažujú
- Textové popisy anatomických partií sú pre laikov nezrozumiteľné
- Chýba vizuálny a interaktívny spôsob objavovania cvikov

**Naše riešenie:** FitFlow umožňuje používateľom kliknúť priamo na 3D model ľudského tela, vybrať sval, ktorý chcú trénovať, a okamžite získať:
- Informácie o danom svale (anatómia, funkcie, prevencia zranení)
- Najefektívnejšie cviky pre danú partiu
- GIF animácie správneho prevedenia
- Možnosť pridať cviky do vlastného workout plánu

### 1.2 Inovácia

Žiadna existujúca fitness aplikácia nepoužíva interaktívny 3D anatomický model ako primárny navigačný nástroj. FitFlow kombinuje:
- **3D vizualizáciu** (Three.js + React Three Fiber)
- **Intuitívnu interakciu** (hover efekty, klikateľné svaly)
- **Tri tréningové režimy** (Bodybuilding, Calisthenics, Pilates)
- **Gamifikáciu** (levely, achievementy, streaky)
- **Praktický workflow** (export do Notion, kalendár tréningov, ICS export)

---

## 2. Technologický stack a architektúra

### 2.1 Frontend Framework: React.js

**Prečo React?**

React sme zvolili ako základ aplikácie z viacerých dôvodov:

1. **Podpora pre Three.js cez React Three Fiber**
   - React Three Fiber je React renderer pre Three.js
   - Umožňuje deklaratívne vytváranie 3D scén
   - Jednoduchšia integrácia 3D modelu do React komponentov
   - Lepšia správa state a lifecycle pre 3D objekty

2. **Komponentová architektúra**
   - Znovupoužiteľné komponenty (ExerciseCard, MuscleGroup, WorkoutPanel)
   - Jednoduchšia údržba kódu
   - Modulárna štruktúra projektu

3. **Ekosystém a knižnice**
   - React Router pre navigáciu
   - Context API + Zustand pre state management
   - Bohatá komunita a dokumentácia

### 2.2 Technologické komponenty

```
┌─────────────────────────────────────────┐
│            Frontend Stack               │
├─────────────────────────────────────────┤
│  React 19.1.1                           │
│  React Router DOM 7.9.5 (routing)       │
│  React Three Fiber 9.4.0 (3D wrapper)   │
│  @react-three/drei 10.7.6 (3D helpers)  │
│  Tailwind CSS 4.1.17 (styling)          │
│  Lucide React 0.552 (ikony)             │
│  GSAP 3.14.2 (animácie)                 │
│  Vite 7.1.7 (build tool)                │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│          3D Rendering Engine            │
├─────────────────────────────────────────┤
│  Three.js 0.181.0                       │
│  - WebGL renderer                       │
│  - GLB/GLTF model loader                │
│  - PBR materiály                        │
│  - Lighting system                      │
│  - OrbitControls                        │
│  Postprocessing 6.38.2 (efekty)         │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│          State Management               │
├─────────────────────────────────────────┤
│  WorkoutContext (tréningy, streak)      │
│  ToastContext (notifikácie)             │
│  NotificationContext (správy)           │
│  Zustand 5.0.8 (alternatívny state)     │
│  LocalStorage (perzistencia)            │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│          Utility Knižnice               │
├─────────────────────────────────────────┤
│  date-fns 4.1.0 (práca s dátumami)      │
│  html2canvas 1.4.1 (screenshots)        │
│  jsPDF 3.0.3 (PDF export)               │
│  Lenis 1.3.17 (smooth scrolling)        │
└─────────────────────────────────────────┘
```

### 2.3 Architektúra aplikácie

**Štruktúra projektu:**

```
src/
├── components/              # React komponenty
│   ├── 3D/                  # Three.js komponenty
│   │   ├── HumanModel3D.jsx # Hlavný 3D model
│   │   ├── HumanBody.jsx    # Alternatívny loader
│   │   └── MuscleGeometries.jsx
│   ├── 2D/                  # 2D vizualizácie
│   │   └── BodyDiagram.jsx
│   └── UI/                  # UI komponenty (19 súborov)
│       ├── ExercisePanel.jsx
│       ├── ExerciseDetailModal.jsx
│       ├── WorkoutPanel.jsx
│       ├── ProfilePanel.jsx
│       ├── GymPanel.jsx
│       ├── NotificationPanel.jsx
│       ├── OnboardingWizard.jsx
│       ├── XPBar.jsx
│       ├── LevelCircle.jsx
│       ├── AchievementCard.jsx
│       ├── WorkoutCalendar.jsx
│       ├── ExportDropdown.jsx
│       ├── Toast.jsx
│       ├── FloatingLines.jsx
│       └── ...
├── pages/                   # Route komponenty
│   ├── Dashboard.jsx        # Hlavná stránka s 3D modelom
│   ├── DemoDashboard.jsx    # Demo verzia
│   ├── Landing.jsx          # Landing page
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── GoalsWizard.jsx      # 11-krokový wizard
│   └── MyPlan.jsx           # Tréningový plán
├── context/                 # Context providers
│   ├── WorkoutContext.jsx
│   ├── ToastContext.jsx
│   └── NotificationContext.jsx
├── data/                    # Statické dáta
│   ├── exercises.json       # Databáza 227 cvikov
│   ├── muscles.json         # Anatomické informácie
│   └── mockProgress.js      # Mock dáta pre gamifikáciu
├── constants/               # Konštanty
│   └── muscleMapping.js     # Mapovanie svalov
├── utils/                   # Utility funkcie
│   ├── planGenerator.js     # Generátor tréningových plánov
│   └── exportCalendar.js    # Export funkcie
├── hooks/                   # Custom React hooks
├── services/                # Service layer
├── styles/                  # CSS súbory
└── assets/                  # Statické assety
```

**Adresár public:**

```
public/
├── models/                  # 3D modely
│   ├── naselectovany_model_menej_plosok.glb  # Primárny model
│   ├── human-body.glb
│   ├── muscle-anatomy.gltf
│   └── textures/            # PBR textúry
├── gifs/                    # Animácie cvikov (8 GIFov)
│   ├── bp.gif               # Bench Press
│   ├── inclinebp.gif        # Incline Press
│   ├── bicepcurl.gif
│   ├── pullup.gif
│   └── ...
└── icons/                   # Ikony
```

---

## 3. Hlavné funkcionality (Features)

### 3.1 Interaktívny 3D anatomický model

**Technická implementácia:**

Model vytvorený v Blenderi, exportovaný ako GLB formát (optimalizovaný binárny formát).

**Konfigurácia Canvas:**
- Pozícia kamery: `[1, 1, 3]` s FOV 40
- Tiene povolené
- Transparentné pozadie
- Scale modelu: `0.01`

**Interaktívne funkcie:**

1. **Hover efekty**
   - Raycasting pre detekciu myši nad svalmi
   - Emissive material efekty pri hoveri (červená farba, intenzita 0.7)
   - Kurzor sa zmení na pointer

2. **Kliknutie**
   - Otvorí ExercisePanel s cvikmi pre daný sval
   - Extrahuje názov svalu z mesh userData

3. **Orbit Controls**
   - Pan: zakázaný
   - Zoom: povolený (rozsah 3-5 jednotiek)
   - Rotácia: povolená
   - Target: `[0, 1, 0]`

**Osvetlenie scény:**
- Ambient Light (intenzita 0.6)
- Directional Light 1 (pozícia `[5, 5, 5]`, intenzita 0.8, vrhá tiene)
- Directional Light 2 (pozícia `[-5, 5, -5]`, intenzita 0.4)
- Point Light (pozícia `[0, 2, 0]`, intenzita 0.3)

**Riešenie hover bugu:**

Počas vývoja sme narazili na problém - viacero svalov zdieľalo rovnaký materiál, čo spôsobovalo, že hover efekt ovplyvnil všetky svaly naraz.

```javascript
// Riešenie: každý mesh dostane vlastnú kópiu materiálu
scene.traverse((child) => {
  if (child.isMesh && child.material) {
    child.material = child.material.clone();
    child.material.transparent = true;
    child.material.opacity = 1;

    const muscleName = getMuscleNameFromMesh(child.name);
    if (muscleName) {
      child.userData.muscleName = muscleName;
    }
  }
});
```

### 3.2 Exercise System

**Databáza cvikov:**

- **227 cvikov** s detailnými popismi v slovenčine
- Kategorizácia podľa **10 svalových skupín**
- Rozdelenie cvikov podľa počtu:

| Svalová skupina | Počet cvikov |
|-----------------|--------------|
| Hrudník (Pectorals) | 28 |
| Chrbát (Back) | 29 |
| Brucho (Abs) | 28 |
| Ramená (Shoulders) | 24 |
| Biceps | 21 |
| Triceps | 21 |
| Stehná (Quads) | 22 |
| Zadok (Glutes) | 22 |
| Zadné stehenné svaly (Hamstrings) | 16 |
| Lýtka (Calves) | 16 |

**Štruktúra cviku:**

```json
{
  "name": "Bench Press",
  "animation": "/gifs/bp.gif",
  "difficulty": "intermediate",
  "equipment": "barbell",
  "description": "Klasický cvik na hrudník s činkou na lavici",
  "modes": ["bodybuilding"],
  "tips": [
    "Drž lopatky stiahnuté dozadu a dole",
    "Nohy pevne na zemi, napni zadok",
    "Spúšťaj činku kontrolovane k dolnej časti hrudníka",
    "Lakte drž v uhle približne 45° od tela"
  ]
}
```

**ExercisePanel:**
- Zobrazuje cviky pre vybraný sval
- Dva taby: Info (anatómia svalu) a Exercises (cviky)
- Filtrovanie podľa tréningového režimu (bodybuilding, calisthenics, pilates)
- Zobrazenie náročnosti a vybavenia
- Pridanie cviku do workout plánu jedným klikom

**ExerciseDetailModal:**
- Detail cviku s GIF animáciou správneho prevedenia
- Popis techniky v slovenčine
- Tipy a časté chyby (4 body pre každý cvik)
- Možnosť pridať do tréningu

### 3.3 Tri tréningové režimy

FitFlow podporuje tri odlišné tréningové metodológie:

1. **Bodybuilding**
   - Klasické cviky s váhami
   - Zameranie na hypertrofiu
   - Činky, stroje, káble

2. **Calisthenics**
   - Cvičenie s vlastnou váhou
   - Zhyby, kliky, dipy
   - Progressívne variácie

3. **Pilates**
   - Kontrolované pohyby
   - Core stabilita
   - Flexibilita a mobilita

Používateľ môže prepínať medzi režimami v headeri Dashboard-u. Cviky sa automaticky filtrujú podľa zvoleného režimu.

### 3.4 Workout Planning System

**WorkoutContext - centralizovaná správa:**

```javascript
// Hlavné state premenné
workoutExercises: []       // Aktuálne cviky v tréningu
workoutName: string        // Názov tréningu (default: 'Môj Tréning')
streak: number             // Počet po sebe idúcich dní
lastWorkoutDate: string    // Dátum posledného tréningu
savedWorkouts: []          // História uložených tréningov
trainingPlan: object       // Konfigurácia tréningového plánu
```

**Hlavné funkcie:**

| Funkcia | Popis |
|---------|-------|
| `addExercise(exercise, mode)` | Pridá cvik do aktuálneho tréningu |
| `removeExercise(id)` | Odstráni cvik podľa ID |
| `updateExercise(id, updates)` | Upraví série/opakovania/váhu |
| `saveWorkout()` | Uloží tréning do histórie, aktualizuje streak |
| `loadWorkout(workout)` | Načíta uložený tréning |
| `deleteWorkout(id)` | Vymaže tréning z histórie |
| `updateSavedWorkout(id)` | Aktualizuje existujúci uložený tréning |
| `getWorkoutById(id)` | Vráti tréning podľa ID |
| `getWorkoutStats()` | Vráti štatistiky tréningu |
| `updateStreak(customDate)` | Aktualizuje streak (voliteľne s vlastným dátumom) |
| `exportForNotion()` | Export do Notion (podrobný markdown) |

**WorkoutPanel:**
- Tri taby: Saved Workouts, Training Plan, Export
- Vytváranie týždenných tréningových plánov
- PPL (Push/Pull/Legs) štruktúra alebo vlastná
- Zobrazenie dnešného tréningu
- Export do viacerých formátov

### 3.5 Export funkcionality

FitFlow podporuje export tréningov do viacerých formátov:

| Formát | Popis | Použitie |
|--------|-------|----------|
| **JSON** | Kompletný backup | Zálohovanie a obnovenie |
| **CSV** | Tabuľkový formát | Excel/Google Sheets |
| **ICS** | Kalendárový formát | Google Calendar, Outlook |
| **Text** | Čitateľný text | Zdieľanie |
| **Notion** | Markdown formát | Vloženie do Notion |
| **PDF** | Dokument | Tlač |
| **PNG** | Obrázok | Screenshot |

**Notion Integration:**

Namiesto zložitej OAuth integrácie používame Copy-to-clipboard workflow:

```javascript
const exportToNotion = () => {
  const markdown = generateWorkoutMarkdown(workout);
  navigator.clipboard.writeText(markdown);
  showToast('Skopírované do schránky! Vložte do Notion', 'success');
};
```

### 3.6 GymPanel - Preddefinované programy

Obsahuje hotový Push/Pull/Legs tréningový program:

- **Push deň:** Hrudník, ramená, triceps
- **Pull deň:** Chrbát, biceps
- **Legs deň:** Stehná, zadok, lýtka

**Funkcie:**
- Mesačný kalendár s PPL rotáciou
- Zvýraznenie dnešného tréningu
- Štatistiky (6 tréningových dní + 1 odpočinok)
- Prehľad pokrytia svalov

### 3.7 Gamifikácia a motivácia

**Systém levelov a XP:**

- Level 1-25+ na základe XP
- XP potrebné pre ďalší level rastie
- Vizuálny kruhový indikátor (LevelCircle)
- Animovaný XP bar (XPBar)

**ProfilePanel obsahuje:**
- Štyri taby: Overview, Achievements, Calendar, Statistics
- Quick stats: celkové tréningy, streak, achievementy
- 12-týždňový heatmap kalendár
- Detailné štatistiky (objem, trvanie, najtrénovanejší sval)

**Achievementy (45 celkom, 6 kategórií):**

| Kategória | Príklady |
|-----------|----------|
| Workouts | First Step (1), Getting Started (5), Dedicated (25), Iron Man (100) |
| Streaks | On Fire (7 dní), Consistent (14 dní), Unstoppable (30 dní) |
| Variety | Muscle Master, Equipment Expert |
| Strength | Personal Records |
| Progression | Progressive Overload |
| Special | Milestone badges |

**Streak tracking:**
- Počítanie po sebe idúcich dní s tréningom
- Reset pri vynechaní dňa
- Automatická aktualizácia pri uložení tréningu

### 3.8 Onboarding systém

**OnboardingWizard (7 krokov):**
1. Vitajte vo FitFlow
2. Ako funguje 3D model
3. Exercise Panel vysvetlenie
4. Prepínanie tréningových režimov
5. Gym Panel predstavenie
6. Správa tréningov
7. Dokončenie

**GoalsWizard (11 krokov):**

Komplexné nastavenie používateľského profilu:

1. **Pohlavie** - muž, žena, iné
2. **Veková kategória** - 7 možností (15-20 až 50+)
3. **Výška a váha** - slidery
4. **Úroveň aktivity** - 4 kategórie
5. **Dostupné vybavenie** - none/home-basic/full gym
6. **Dĺžka tréningu** - 15-20 min až 60+ min
7. **Zdravotné obmedzenia** - chrbát/kolená/ramená/žiadne
8. **Primárny cieľ** - chudnutie, svaly, kondícia, sila, zdravie
9. **Úroveň skúseností** - začiatočník/pokročilý/expert
10. **Frekvencia** - 2-3 až 6-7 dní týždenne
11. **Tréningový štýl** - bodybuilding/calisthenics/pilates

### 3.9 Generátor tréningových plánov

**planGenerator.js** vytvára personalizované plány na základe:

- **Split typy:** Full Body (2-3 dni), Upper/Lower (4-5 dní), Push/Pull/Legs (6-7 dní)
- **Svalové skupiny:** Logické kombinácie
- **Filtrovanie cvikov:** Podľa vybavenia, skúseností, zdravotných obmedzení, cieľov

**Vekové modifikátory:**
- 50+: 0.7x sérií, 1.5x odpočinok
- 40-50: 0.85x sérií, 1.25x odpočinok

---

## 4. UX/UI Design

### 4.1 Dizajnová filozofia

**Princípy:**
- **Intuitivita** - 3D model ako hlavná navigácia
- **Minimalizmus** - čisté rozhranie bez zbytočných elementov
- **Dark mode first** - tmavá farebná schéma pre posilňovne
- **Responzivita** - optimalizácia pre desktop aj mobil

### 4.2 Farebná schéma

```css
/* Tailwind custom colors */
fit-*: energetická modrá (50-900 odtiene)
primary-*: slate/modrá šedá
neutral-*: hlavná škála šedej

/* Špecifické farby */
Primary: #3B82F6 (modrá)
Secondary: #10B981 (zelená)
Background: #0F172A (tmavo modrá)
Surface: #1E293B
Text: #F1F5F9
Accent: #F59E0B (oranžová)
```

**Custom animácie:**
- shimmer - efekt trblietania na progress baroch
- bounce-slow - pomalé odskakovanie
- fade-in - plynulé zobrazenie
- slide-in - vsunutie

### 4.3 Komponentová štruktúra UI

**Landing Page:**
- Hero sekcia s call-to-action
- 6 hlavných features s ikonami
- How-it-works sekcia (3 kroky)
- Benefits list
- Footer s odkazmi
- Smooth scrolling (Lenis)

**Dashboard:**
- Centrálny 3D model
- Floating header s ovládacími prvkami:
  - FitFlow logo/menu
  - Quick workout dropdown
  - Mode switcher (3 režimy)
  - Notification bell s badge
  - Profile/achievements tlačidlo
  - Workout/plan tlačidlo
  - Gym tlačidlo
- Bočné panely (slide-in/out animácie)
- Toast notifikácie
- Help tlačidlo

**Panely:**
- Jednotný dizajn všetkých bočných panelov
- Tab navigácia
- Smooth animácie
- Scroll v prípade dlhého obsahu

---

## 5. State Management a Perzistencia

### 5.1 Context API

**WorkoutContext** - hlavný state manager:

```javascript
const WorkoutContext = createContext();

export const WorkoutProvider = ({ children }) => {
  const [workoutExercises, setWorkoutExercises] = useState([]);
  const [workoutName, setWorkoutName] = useState('Môj Tréning');
  const [streak, setStreak] = useState(1);  // default 1
  const [lastWorkoutDate, setLastWorkoutDate] = useState(null);
  const [savedWorkouts, setSavedWorkouts] = useState([]);
  const [trainingPlan, setTrainingPlan] = useState(null);

  // ... funkcie

  return (
    <WorkoutContext.Provider value={{
      workoutExercises, workoutName, streak,
      setStreak, lastWorkoutDate, setLastWorkoutDate,
      savedWorkouts, trainingPlan,
      addExercise, removeExercise, updateExercise,
      saveWorkout, loadWorkout, deleteWorkout,
      updateSavedWorkout, getWorkoutById,
      exportToJSON, exportToCSV, exportToICS,
      exportToText, exportForNotion, exportToNotion, shareWorkout,
      createPlan, updatePlan, deletePlan, getTodayWorkout,
      getWorkoutStats, getWorkoutCalendarData
    }}>
      {children}
    </WorkoutContext.Provider>
  );
};
```

**ToastContext** - notifikácie:

```javascript
showToast(message, type = 'success')  // Pridá toast, auto-dismiss po 3s
dismissToast(id)                       // Manuálne odstránenie
```

**NotificationContext** - správy aplikácie:

```javascript
addNotification(title, message)    // Pridanie notifikácie
removeNotification(id)              // Odstránenie podľa ID
clearAllNotifications()             // Vymazanie všetkých
```

### 5.2 LocalStorage Perzistencia

**Kľúče v LocalStorage:**

```javascript
// Workout Management
'fitflow_workout'              // Aktuálny tréning: { exercises, name, createdAt }
'fitflow_streak'               // Streak dáta: { streak, lastWorkoutDate }
'fitflow_saved_workouts'       // Pole uložených tréningov
'fitflow_plan'                 // Konfigurácia tréningového plánu

// Notifikácie
'fitflow_notifications'        // Pole notifikácií

// Autentifikácia & Onboarding
'isAuthenticated'              // Boolean string
'onboardingCompleted'          // Boolean string
'fitflow_onboarding_complete'  // Alternatívny flag

// User Profile
'userProfile'                  // JSON: gender, age, weight, height, activity
'userGoals'                    // JSON: goal, experience, frequency, style, equipment
'generatedPlan'                // JSON: vygenerovaný tréningový plán
```

---

## 6. Routing

**Štruktúra routes (React Router 7.9.5):**

```javascript
<BrowserRouter>
  <Routes>
    <Route path="/" element={<Navigate to="/landing" />} />
    <Route path="/landing" element={<Landing />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/goals" element={<WizardRoute><GoalsWizard /></WizardRoute>} />
    <Route path="/my-plan" element={<ProtectedRoute><MyPlan /></ProtectedRoute>} />
    <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
    <Route path="/demo" element={<DemoDashboard />} />
  </Routes>
</BrowserRouter>
```

**Route Protection:**
- `ProtectedRoute` - vyžaduje `isAuthenticated` flag
- `WizardRoute` - vyžaduje auth + presmeruje na dashboard ak je onboarding dokončený

---

## 7. Dátové štruktúry

### 7.1 Exercise Object

```javascript
{
  id: Date.now() + Math.random(),
  name: string,
  muscleName: string,
  difficulty: 'beginner' | 'intermediate' | 'advanced',
  equipment: string,
  description: string,
  mode: 'bodybuilding' | 'calisthenics' | 'pilates',
  animation: string,  // cesta k GIF
  tips: string[],
  sets: number,       // default 3
  reps: number,       // default 10
  weight: number,     // default 0
  unit: 'kg' | 'lbs' | 'BW'
}
```

### 7.2 Saved Workout

```javascript
{
  id: number,
  name: string,
  exercises: Exercise[],
  savedAt: ISO_date_string
}
```

### 7.3 Training Plan

```javascript
{
  name: string,
  schedule: [{
    dayIndex: number,      // 0-6
    workoutId: number | null,
    workoutName: string
  }],
  createdAt: ISO_date_string
}
```

### 7.4 Achievement

```javascript
{
  id: string,
  title: string,
  description: string,
  icon: string,           // názov ikony z lucide-react
  unlocked: boolean,
  progress: number,
  target: number,
  rarity: string,
  category: 'workouts' | 'streaks' | 'variety' | 'strength' | 'special' | 'progression'
}
```

### 7.5 Muscle Mapping

```javascript
const MUSCLE_MAPPING = {
  'chest': 'Hrudník (Pectorals)',
  'pectorals': 'Hrudník (Pectorals)',
  'biceps': 'Biceps',
  'triceps': 'Triceps',
  'shoulders': 'Ramená (Shoulders)',
  'deltoids': 'Ramená (Shoulders)',
  'abs': 'Brucho (Abs)',
  'core': 'Brucho (Abs)',
  'back': 'Chrbát (Back)',
  'lats': 'Široké svaly chrbta (Lats)',
  'traps': 'Trapézy (Traps)',
  'quads': 'Stehná (Quads)',
  'hamstrings': 'Zadné stehenné svaly (Hamstrings)',
  'calves': 'Lýtka (Calves)',
  'glutes': 'Zadok (Glutes)',
  'forearms': 'Predlaktia (Forearms)'
};
```

---

## 8. Technická špecifikácia

### 8.1 Požiadavky na prehliadač

- Moderné prehliadače s WebGL 2.0 podporou
- Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- Minimum 4GB RAM
- GPU s OpenGL 3.0+

### 8.2 Veľkosť assetsov

| Asset | Veľkosť |
|-------|---------|
| 3D model (GLB) | ~2.5 MB |
| Textúry spolu | ~1.2 MB |
| GIF animácie (9 súborov) | ~500 KB každý |
| JavaScript bundle | ~8 MB |

### 8.3 Vývojové prostredie

```bash
# Inštalácia závislostí
npm install

# Spustenie dev servera
npm run dev

# Build pre produkciu
npm run build

# Preview produkčného buildu
npm run preview
```

---

## 9. package.json závislosti

```json
{
  "dependencies": {
    "react": "^19.1.1",
    "react-dom": "^19.1.1",
    "react-router-dom": "^7.9.5",
    "@react-three/fiber": "^9.4.0",
    "@react-three/drei": "^10.7.6",
    "@tailwindcss/vite": "^4.1.17",
    "three": "^0.181.0",
    "zustand": "^5.0.8",
    "lucide-react": "^0.552.0",
    "gsap": "^3.14.2",
    "date-fns": "^4.1.0",
    "html2canvas": "^1.4.1",
    "jspdf": "^3.0.3",
    "lenis": "^1.3.17",
    "postprocessing": "^6.38.2",
    "react-body-highlighter": "^2.0.5",
    "tailwindcss": "^4.1.17",
    "face-api.js": "^0.22.2"
  },
  "devDependencies": {
    "vite": "^7.1.7",
    "@vitejs/plugin-react": "^5.0.4",
    "eslint": "^9.36.0"
  }
}
```

---

## 10. Zhrnutie funkcionalít

### Plne implementované:

- Interaktívny 3D model s hover a click interakciami
- Databáza 227 cvikov s GIF animáciami
- Tri tréningové režimy (Bodybuilding, Calisthenics, Pilates)
- Workout planning systém s LocalStorage perzistenciou
- Export do 7 formátov (JSON, CSV, ICS, PDF, PNG, Text, Notion)
- Gamifikácia s levelmi, XP a achievementmi
- Streak tracking systém
- 12-týždňový workout kalendár (heatmap)
- 11-krokový GoalsWizard pre personalizáciu
- 7-krokový OnboardingWizard pre nových používateľov
- Responzívne UI s animáciami
- Push/Pull/Legs preddefinovaný program
- Generátor tréningových plánov

### Demo/Mock dáta:

- Achievement odomykanie (UI ready, logika s mock dátami)
- Notifikácie (8 demo notifikácií)
- Profil používateľa (mockProgress dáta)

---

## 11. GitHub Repository

**URL:** https://github.com/Kurk3/fitflow-school

---

## 12. Kontakt na tím

- **Samuel** - 3D Artist & Designer (Blender, Figma, textúry, GIF animácie)
- **Adam** - Frontend Developer (3D integrácia, UI komponenty, interaktivita)
- **Andrej** - Frontend Developer (State management, databáza cvikov, WorkoutContext)
- **Simon** - Frontend Developer (Gamifikácia, export funkcie, kalendár)

---

*Dokumentácia vytvorená pre predmet Multimediálne systémy*
