FitFlow je webova aplikacia na vytvaranie personalizovanych workout planov s interaktivnym 3D modelom tela. Pouzivatel si vyberie ciel (schudnut, nabrat, aesthetics, calisthenics), miesto treningu a frekvenciu, aplikacia vygeneruje progresivny plan zaradeny do kalendara a pouzivatel si moze vlastne workouty skladat z tier listu cvikov priamo na 3D muscle mape. Vysledkom je smart fitness nastroj kombinujuci AI planovanie, vizualizaciu pokroku a gamifikaciu pre konzistentny trening a lepsie zdravie.

Hej, toto je v podstate názor tej aplikácie a je to všetko. Ale no čo to vlastne robí?

Hej, že je to v podstate len viewer, alebo, hej, že je to jednoduchá aplikácia, kde vlastne 3D model pôsobí. Keď sa mu klikne na nejakú partiu tela, tak vlastne zobrazí ako keby pop-up vedľa, ktorý následne akože tam budú informácie o tej partii.

Hej, že ako ju predcvičovať a tak. Hej, že v podstate prvým krokom je vlastne, aby sme na web aplikáciu dostali do frontendu nejaké takéto 3D telo.

Hej, že v podstate 3D telo, ktoré sa bude dať pohybovať a bude sa dať klikať na jeho partie. Hej, že takéto niečo. A ja by som od teba potreboval, aby si spravil faktže dôkladný ultra thing a navrhol nejaké riešenie, ktoré by bolo teda vhodné.

technologicky stack 

## 🛠️ Technologický Stack

### Frontend Framework

**React** s **Vite** + **TypeScript**

- React je ideálna voľba pre tento typ aplikácie (komponenty, state management)
- Vite poskytuje rýchly development server a hot reload
- TypeScript pre type safety pri práci s 3D objektmi a komplexnou logikou

### 3D Engine & Rendering

**Three.js** + **React Three Fiber (@react-three/fiber)**

- Three.js je industry standard pre WebGL v browseri
- React Three Fiber je React wrapper pre Three.js - umožňuje deklaratívny prístup
- **@react-three/drei** - helper library s užitočnými komponentami (OrbitControls, Environment, ContactShadows, etc.)
- **@react-three/postprocessing** - pre visual effects a lepší look

### 3D Model Tela - OVERENÉ Možnosti

### ✅ Možnosť 1: Ready-made React Packages (NAJRÝCHLEJŠIE)

**reactjs-human-body** (NPM package)[[1]](https://jsdelivr.com/package/npm/reactjs-human-body)

```bash
npm install reactjs-human-body
```

- React komponenta s clickable body parts
- Funguje presne na princípe, ktorý potrebuješ (klik na časť tela)
- **PROBLÉM:** Posledný update pred 2 rokmi, 2D SVG (nie 3D)
- Môže byť dobrý pre rýchly prototyp, ale nie 3D

**@darshanpatel2608/human-body-react**[[2]](https://www.npmjs.com/package/@darshanpatel2608/human-body-react)

```bash
npm install @darshanpatel2608/human-body-react
```

- React komponenta pre ľudské telo
- onChange a onClick eventy
- **PROBLÉM:** Starý package (3 roky), pravdepodobne 2D

### ✅ Možnosť 2: Open Source 3D Muscle Selector (NAJLEPŠIE PRE TVOJ USE CASE)

**3DMuscleSelector** (GitHub)[[3]](https://github.com/cadenmarinozzi/3dmuscleselector)

- 🎯 **Presne to, čo potrebuješ!**
- Open source GitHub repo: `cadenmarinozzi/3DMuscleSelector`
- Live demo: [cadenmarinozzi.github.io/3DMuscleSelector](http://cadenmarinozzi.github.io/3DMuscleSelector)
- Three.js based 3D muscle selector
- Clickable muscle groups
- **Odporúčam:** Pozri si demo a forkni repo, použiješ ho ako základ

**Ako použiť:**

```bash
git clone https://github.com/cadenmarinozzi/3DMuscleSelector
# Preštuduj kód, extrahuj 3D model a logiku
# Integruj do svojej React aplikácie
```

### ✅ Možnosť 3: Physiome Project - Open Science 3D Model

**A 3D human whole-body model**[[4]](https://discover.pennsieve.io/datasets/307)[[5]](https://models.physiomeproject.org/workspace/add/file/0e87cfe22ee373402a1db5d73b82383e8bd34fba/mapclient%20workflow/webGL/human_body_0824.json)

- Open source vedecký projekt
- Kompletný 3D model s orgánmi, svalmi, nervami
- Formát: GLTF/JSON
- **Download:** [models.physiomeproject.org](http://models.physiomeproject.org) - hľadaj "human_body_0824.json"
- Akademická kvalita, free na použitie

**Bodylight.js 2.0**[[6]](https://bodylight.physiome.cz/Bodylight-docs/)

- WebGL anatómia engine
- 3D interactive anatomy
- Web Components
- **PROBLÉM:** Komplexnejšie na integráciu, ale kvalitné

### ✅ Možnosť 4: mannequin.js (Jednoduché 3D Figúrky)

**mannequin.js**[[7]](https://boytchev.github.io/mannequin.js/)

```bash
# Three.js based posable mannequins
```

- Jednoduchá knižnica pre 3D figúrky
- Vhodné na ukážku póz a cvičení
- **NIE** anatomicky detailné, ale ľahko použiteľné
- Docs: [boytchev.github.io/mannequin.js](http://boytchev.github.io/mannequin.js)

### ❌ Možnosť 5: Premium Riešenia (Pre info)

**BioDigital Human**[[8]](https://biodigital.com/product/human-studio)

- Profesionálna anatomická platforma
- JavaScript SDK
- **PROBLÉM:** Platené, SDK vyžaduje licenciu
- Top kvalita, ale nie pre školský projekt

**Zygote Body SDK**[[9]](https://go.zygote.com/sdk-1)

- Developer SDK pre anatómiu
- **PROBLÉM:** Platené ($$$)

---

## 🎯 ODPORÚČANÝ PLÁN (Revidovaný)

### Fáza 0: Research & Decision (TERAZ)

1. ✅ **Pozri si LIVE DEMO:** [3DMuscleSelector demo](https://cadenmarinozzi.github.io/3DMuscleSelector/)
2. ✅ **Forkni repo:** [`github.com/cadenmarinozzi/3DMuscleSelector`](http://github.com/cadenmarinozzi/3DMuscleSelector)
3. Preštuduj kód - ako riešia raycasting a muscle selection
4. Extrahuj 3D model (ak je voľne použiteľný) alebo nájdi alternatívu

### Fáza 1: Získanie 3D Modelu

**Najlepšia cesta (v poradí priority):**

**A) Použiť model z 3DMuscleSelector**

- Ak má open source licenciu, použi priamo
- Už má rozdelené muscle groups a clickable logic

**B) Physiome Project model**

- Download z [models.physiomeproject.org](http://models.physiomeproject.org)
- Vedecky presný, free
- Bude potrebovať manuálne nastavenie mesh names

**C) Sketchfab free models**

- Hľadaj: "human anatomy muscle GLTF"
- Filter: CC licencia
- Download vo formáte GLTF/GLB

**D) Mixamo**

- Adobe Mixamo - free rigged models
- Nie anatomicky detailné, ale čisté a funkčné

### Fáza 2: Setup projektu

```bash
npm create vite@latest fitflow -- --template react-ts
cd fitflow
npm install three @react-three/fiber @react-three/drei
npm install tailwindcss zustand
```

### Fáza 3: Integrácia (Inšpirovaná 3DMuscleSelector)

1. Load GLTF model pomocou `useGLTF`
2. Raycast setup pre click detection
3. Muscle groups mapping (názvy meshov → info o svaloch)
4. Popup UI pre exercise list

### Fáza 4+: Podľa pôvodného plánu

---

## 📝 Upravený Package.json

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "three": "^0.160.0",
    "@react-three/fiber": "^8.15.0",
    "@react-three/drei": "^9.92.0",
    "zustand": "^4.4.7",
    "tailwindcss": "^3.4.0"
  }
}
```

**Poznámka:** Nepotrebuješ `@react-three/postprocessing` na začiatok - začni jednoducho!

### UI Framework

**Tailwind CSS** (už ho poznáš z práce)

- Rýchly prototyping
- Konzistentný dizajn
- Responsive out of the box

**Shadcn/ui** alebo **Headless UI**

- Pre pop-upy, dialogy, kalendár komponenty
- Prístupné a kvalitné komponenty

### State Management

**Zustand** (lightweight) alebo **Redux Toolkit**

- Pre správu workout plánov
- Selected muscle group
- User preferences (cieľ, frekvencia, miesto)
- Kalendár a progress tracking

### Kalendár

**FullCalendar** alebo **React Big Calendar**

- Zobrazenie workout plánu v kalendári
- Drag & drop workoutov
- Recurring events pre workout rutiny

### Detekcia Kliknutia na 3D Model

**Raycasting** (Three.js built-in)

```jsx
// Pseudo-kód
const raycaster = new THREE.Raycaster();
const handleClick = (event) => {
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(bodyParts);
  if (intersects.length > 0) {
    const clickedMuscle = intersects[0].[object.name](http://object.name); // napr. "chest"
    showMuscleInfo(clickedMuscle);
  }
};
```

### Data & Content

**JSON súbory** (keďže žiadny backend)

```jsx
// exercises.json
{
  "chest": {
    "name": "Hrudník",
    "exercises": [
      {
        "name": "Bench Press",
        "difficulty": "intermediate",
        "equipment": "barbell",
        "description": "..."
      }
    ]
  }
}
```

**Lokálne storage** pre user data:

- `localStorage` alebo `IndexedDB` pre workout plány
- User progress
- Custom workouts

### Vizualizácia Muscle Groups

**Highlight efekty:**

```jsx
// Hover/Click efekty
- Emissive material na hovered muscle
- Outline shader pre selected muscle
- Color coding pre muscle activation
```

**@react-three/postprocessing** pre outline effect:

```jsx
<EffectComposer>
  <Outline selection={selectedMuscle} edgeStrength={10} />
</EffectComposer>
```

### AI/Smart Features (opcionalné bez backendu)

**OpenAI API** direct z frontendu (riziká s API key):

- Alternatíva: použiť **TensorFlow.js** pre offline recommendations
- Alebo predpripravené algoritmy v JS pre workout planning

### Gamifikácia

**Confetti effects:** `canvas-confetti`

**Progress bars & animations:** `framer-motion`

**Achievement system:** local JSON tracking

---

## 📦 Kompletný Package.json Setup

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "three": "^0.160.0",
    "@react-three/fiber": "^8.15.0",
    "@react-three/drei": "^9.92.0",
    "@react-three/postprocessing": "^2.16.0",
    "zustand": "^4.4.7",
    "tailwindcss": "^3.4.0",
    "framer-motion": "^10.16.0",
    "react-big-calendar": "^1.8.0",
    "canvas-confetti": "^1.9.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.0",
    "vite": "^5.0.0",
    "typescript": "^5.3.0"
  }
}
```

---

## 🏗️ Architektúra Projektu

```
fitflow/
├── public/
│   └── models/
│       └── human-body.glb          # 3D model tela
├── src/
│   ├── components/
│   │   ├── 3D/
│   │   │   ├── HumanBody.tsx       # Main 3D component
│   │   │   ├── MuscleGroup.tsx     # Individual muscle meshes
│   │   │   └── Scene.tsx           # Three.js scene setup
│   │   ├── UI/
│   │   │   ├── MuscleInfoPopup.tsx # Info popup po kliknutí
│   │   │   ├── WorkoutCalendar.tsx # Kalendár
│   │   │   └── ExerciseList.tsx    # List cvikov
│   │   └── Onboarding/
│   │       └── GoalSelector.tsx    # Výber cieľa, frekvencie
│   ├── data/
│   │   ├── exercises.json          # Databáza cvikov
│   │   └── muscleGroups.json       # Info o svalových skupinách
│   ├── store/
│   │   └── useWorkoutStore.ts      # Zustand store
│   ├── utils/
│   │   ├── workoutGenerator.ts     # Logika generovania plánov
│   │   └── progressTracker.ts      # Progress tracking
│   └── App.tsx
```

---

## 🎯 Implementačné Kroky (Fázy)

### Fáza 1: Základný 3D Viewer

1. Setup React + Vite + Three.js
2. Načítanie 3D modelu tela (GLTF)
3. OrbitControls pre rotáciu a zoom
4. Basic lighting a shadows

### Fáza 2: Interaktivita

1. Raycasting pre detekciu kliku
2. Highlight efekty na hover
3. Popup component pre muscle info
4. JSON data pre exercise database

### Fáza 3: Workout Builder

1. Exercise library UI
2. Drag & drop cvikov na body parts
3. Custom workout creation
4. Local storage persistence

### Fáza 4: Kalendár & Planning

1. Kalendár integrácia
2. Workout scheduling
3. Progresívne zaťažovanie logika
4. Weekly/monthly views

### Fáza 5: Gamifikácia & Polish

1. Progress tracking
2. Achievement system
3. Visual feedback (confetti, animations)
4. Dark mode
5. Responsive design

---

## 🎨 Design & UX Tipy

**3D Scene:**

- Neutrálne pozadie (gradient sky blue → white)
- Soft shadows pre depth
- Ambient + directional lighting
- Smooth camera transitions

**Muscle Highlighting:**

- Idle: neutral skin tone
- Hover: slight glow (emissive)
- Selected: vibrant color (red/orange) + outline
- Trained muscles: green tint (progress visualization)

**Pop-up UI:**

- Slide-in z pravej strany (ako slide-over)
- Muscle name + ilustrácia
- Top 5-10 exercises pre tú partiu
- Filter by equipment/difficulty
- "Add to workout" button

---

## ⚡ Performance Tipy

1. **LOD (Level of Detail)** - jednoduchší model pre mobile
2. **Frustum culling** - Three.js default
3. **Lazy loading** exercises data
4. **Memoization** React components (`React.memo`, `useMemo`)
5. **Asset optimization** - compress GLTF models (gltf-pipeline)

---

## 🔍 Kde Začať?

**Najrýchlejší štart:**

1. `npm create vite@latest fitflow -- --template react-ts`
2. `npm install three @react-three/fiber @react-three/drei`
3. Stiahni si free human body model zo **Sketchfab** (licencia CC)
4. Vytvor `<Canvas>` a načítaj model pomocou `useGLTF`
5. Pridaj OrbitControls

**Tutorial zdroje:**

- React Three Fiber docs: https://docs.pmnd.rs/react-three-fiber
- Drei helpers: https://github.com/pmndrs/drei
- Three.js Journey (Bruno Simon) - platený ale top kurz

---

## 🚀 Alternative: No-Code 3D Tools

Ak chceš ultra rýchly prototyp:

- **Spline** ([spline.design](http://spline.design)) - no-code 3D web design, React export
- **PlayCanvas** - web-first 3D engine s visual editorom

Ale pre tvoj use case odporúčam **React + Three.js** - máš plnú kontrolu a je to production-ready.

---

# ⚡ DÔLEŽITÉ: 3D TELO V PRIESTORE (NIE 2D)

**Máš absolútnu pravdu! reactjs-human-body a podobné sú 2D SVG diagramy, nie 3D modely v priestore.**

## ✅ SKUTOČNÉ 3D Modely (GLTF/GLB) - Rotovateľné v 3D Priestore

### 1. **Sketchfab - Simplified Male Muscular System** ⭐ TOP VOĽBA[[1]](https://sketchfab.com/3d-models/simplified-male-muscular-system-4f258907dfb6477aa9bf4dfb5833a797)

```
URL: [sketchfab.com/3d-models/simplified-male-muscular-system](http://sketchfab.com/3d-models/simplified-male-muscular-system)
Formát: GLTF/GLB (Three.js ready)
Licencia: CC Attribution (free)
```

- Kompletný 3D svalový systém v plnom 3D priestore
- Anatomicky správny, zjednodušený (vonkajšie svaly)
- Separované mesh časti pre každý sval
- **Rotovateľné myšou, zoomovateľné, clickable**
- Download: "Download 3D Model" → GLTF

### 2. **RigModels - Muscle System**[[2]](https://rigmodels.com/model.php?view=Muscle-system-in-human-body-3d-model__7ea21567ff9942bf9511e2d99efe85d9)

```
URL: [rigmodels.com/model/muscle-system-in-human-body](http://rigmodels.com/model/muscle-system-in-human-body)
Formát: OBJ, FBX, GLB, JSON
FREE (registrácia)
487k faces - high detail
```

### 3. **RigModels - Muscle Anatomy Lightweight**[[3]](https://rigmodels.com/model.php?view=Muscle_Anatomy-3d-model__0ICSMTLIULK98Q9ZU2XK3KGTD&manualsearch=1)

```
URL: [rigmodels.com/model/muscle-anatomy](http://rigmodels.com/model/muscle-anatomy)  
18k faces - rýchly loading pre web
FREE download
```

---

## 🚀 PRAKTICKÝ QUICK START

### 1️⃣ Stiahni Model

- Choď na **Sketchfab** → "Simplified Male Muscular System"
- Download → **GLTF formát**
- Ulož do `fitflow/public/models/human-body.glb`

### 2️⃣ Setup

```bash
npm create vite@latest fitflow -- --template react-ts
cd fitflow
npm install three @react-three/fiber @react-three/drei
```

### 3️⃣ Load 3D Model v Priestore

```tsx
import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF } from '@react-three/drei'

function Model() {
  const { scene } = useGLTF('/models/human-body.glb')
  return <primitive object={scene} />
}

function App() {
  return (
    <Canvas camera= position: [0, 0, 5], fov: 50 >
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} />
      <Model />
      <OrbitControls /> {/* ← Toto umožní rotáciu */}
    </Canvas>
  )
}
```

### 4️⃣ Pridaj Click Detection

```tsx
function Model({ onMuscleClick }) {
  const { scene } = useGLTF('/models/human-body.glb')
  
  return (
    <primitive 
      object={scene} 
      onClick={(e) => {
        const muscleName = [e.object.name](http://e.object.name) // "chest", "biceps"...
        onMuscleClick(muscleName) // Otvor popup
      }}
    />
  )
}
```

---

## 🎮 ČO TO DÁ

✅ **Plnohodnotné 3D telo v 3D priestore**

- Drag myšou = rotácia tela
- Scroll = zoom in/out
- Klik na sval = otvor info popup

✅ **WebGL rendering v prehliadači**

- 60 FPS performance
- Realistic lighting & shadows
- Funguje na mobile

✅ **Zero backend**

- GLTF model sa načíta rýchlo
- Všetko vo frontende

---

## 📦 Minimálny Package.json Pre Start

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "three": "^0.160.0",
    "@react-three/fiber": "^8.15.0",
    "@react-three/drei": "^9.92.0"
  }
}
```

**Výsledok: Skutočné 3D telo rotovateľné v 3D priestore 🎯**