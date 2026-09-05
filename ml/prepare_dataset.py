from pathlib import Path
import random
import shutil

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "Pothole Dataset"
OUTPUT = ROOT / "pothole_yolo"

random.seed(42)

images = list(SOURCE.glob("*.jpg"))
pairs = []

for img in images:
    label = img.with_suffix(".txt")
    if label.exists():
        pairs.append((img, label))

random.shuffle(pairs)

split = int(len(pairs) * 0.8)
train = pairs[:split]
val = pairs[split:]

for folder in ["images/train", "images/val", "labels/train", "labels/val"]:
    (OUTPUT / folder).mkdir(parents=True, exist_ok=True)

for items, name in [(train, "train"), (val, "val")]:
    for img, label in items:
        shutil.copy2(img, OUTPUT / "images" / name / img.name)
        shutil.copy2(label, OUTPUT / "labels" / name / label.name)

yaml = f"""path: {OUTPUT.as_posix()}
train: images/train
val: images/val

names:
  0: pothole
"""

(OUTPUT / "data.yaml").write_text(yaml)

print(f"Total images: {len(pairs)}")
print(f"Training images: {len(train)}")
print(f"Validation images: {len(val)}")
print(f"Dataset ready: {OUTPUT}")