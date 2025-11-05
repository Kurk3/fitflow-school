# 3D Models Folder

Tento priečinok je určený pre 3D modely používané v aplikácii.

## 📥 Ako pridať model

### Krok 1: Stiahni model zo Sketchfab

Odporúčaný model:
```
https://sketchfab.com/3d-models/male-body-c27d1cf59678408399ae36e7141f228c
```

### Krok 2: Stiahnutie

1. Klikni na "Download 3D Model"
2. Registruj sa (free účet)
3. Vyber formát: **glTF** (najlepšie `.glb`)
4. Stiahni model

### Krok 3: Umiestnenie súboru

**Presun stiahnutý model SEM (do tohto priečinka):**

```bash
# Z príkazového riadku (Terminal):
# Nahraď cestu podľa toho, kde máš stiahnutý súbor

# Príklad 1: Ak je model v Downloads ako scene.glb
mv ~/Downloads/scene.glb /Users/adamkurek/Desktop/fitflow/public/models/human-body.glb

# Príklad 2: Ak stiahnutý ZIP obsahuje model
# 1. Rozbaľ ZIP v Downloads
# 2. Nájdi .glb súbor
# 3. Presun ho sem a premenuj na human-body.glb
```

**ALEBO manuálne:**

1. Otvor Finder
2. Choď do Downloads
3. Nájdi stiahnutý model (môže byť v ZIP súbore - rozbaľ ho)
4. Nájdi súbor `.glb` alebo `.gltf`
5. Skopíruj ho sem: `/Users/adamkurek/Desktop/fitflow/public/models/`
6. **Premenuj ho na:** `human-body.glb`

### Krok 4: Overenie

Po pridaní modelu by tu mal byť súbor:
```
/Users/adamkurek/Desktop/fitflow/public/models/human-body.glb
```

Potom aplikácia automaticky načíta model namiesto placeholder figúrky!

## 📝 Podporované formáty

- ✅ **GLB** (odporúčané - všetko v jednom súbore)
- ✅ **GLTF** (+ .bin a textúry)
- ⚠️ **OBJ** (funguje, ale potrebuje konverziu)
- ⚠️ **FBX** (potrebuje konverziu)

## ❓ Potrebuješ pomoc?

Ak model nefunguje, skontroluj:
1. Či sa súbor volá presne `human-body.glb`
2. Či je v správnom priečinku (`public/models/`)
3. Či development server beží (`npm run dev`)
4. Refreshni prehliadač (Cmd+R alebo F5)
