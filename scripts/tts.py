#!/usr/bin/env python3
import sys
from pathlib import Path
import torch

# === Обход бага PyTorch 2.6 (weights_only=True по умолчанию) ===
if "weights_only" in torch.load.__code__.co_varnames:
    _orig_load = torch.load

    def safe_torch_load(*args, **kwargs):
        if "weights_only" not in kwargs:
            kwargs["weights_only"] = False
        return _orig_load(*args, **kwargs)

    torch.load = safe_torch_load
    print("⚙️  Patched torch.load(weights_only=False) для совместимости с Coqui TTS")

# === Импорт после фикса ===
from TTS.api import TTS

# --- Проверка аргументов ---
if len(sys.argv) != 4:
    print("Использование: tts.py <текст> <путь_к_файлу.mp3> <язык: ru|en>")
    sys.exit(1)

text = sys.argv[1]
output_file = Path(sys.argv[2])
language = sys.argv[3].lower()

output_file.parent.mkdir(parents=True, exist_ok=True)

# --- Модели ---
if language == "ru":
    print("🔊 Загружаем русскую модель (XTTS)...")
    try:
        model_name = "tts_models/multilingual/multi-dataset/xtts_v2"
        tts = TTS(model_name=model_name, progress_bar=True, gpu=False)
        kwargs = {"language": "ru"}

        if Path("male_voice_sample.wav").exists():
            kwargs["speaker_wav"] = "male_voice_sample.wav"
        else:
            print("⚠️  Файл male_voice_sample.wav не найден, используем стандартного спикера")
            kwargs["speaker"] = "Ana Florence"

        tts.tts_to_file(text=text, file_path=str(output_file), **kwargs)
        print(f"✅ Русское аудио сохранено: {output_file}")

    except Exception as e:
        print(f"❌ Ошибка с XTTS: {e}")
        print("⏳ Пробуем fallback Ruslan...")
        try:
            tts = TTS(model_name="tts_models/ru/ruslan/glow-tts")
            tts.tts_to_file(text=text, file_path=str(output_file))
            print(f"✅ Русское аудио сохранено (Ruslan): {output_file}")
        except Exception as e2:
            print(f"❌ Ошибка fallback: {e2}")

elif language == "en":
    print("🔊 Пробуем английские модели с мужскими голосами...")
    english_models = [
        "tts_models/en/blizzard2013/capacitron-t2-c50",  # Мужской
        "tts_models/en/vctk/vits",  # fallback вариант
    ]

    success = False
    for model_name in english_models:
        try:
            print(f"Пробуем: {model_name}")
            tts = TTS(model_name=model_name, progress_bar=False, gpu=False)
            kwargs = {}
            if "vctk" in model_name:
                kwargs["speaker"] = "p225"
            tts.tts_to_file(text=text, file_path=str(output_file), **kwargs)
            print(f"✅ Английское аудио сохранено ({model_name}): {output_file}")
            success = True
            break
        except Exception as e:
            print(f"❌ {model_name}: {e}")

    if not success:
        print("❌ Все английские модели не сработали.")
        sys.exit(1)

else:
    raise ValueError("Язык должен быть 'ru' или 'en'")
