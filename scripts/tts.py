#!/usr/bin/env python3
import sys
from pathlib import Path
import asyncio
import edge_tts

# --- Проверка аргументов ---
if len(sys.argv) != 4:
    print("Использование: tts.py <текст> <путь_к_файлу.mp3> <язык: ru|en>")
    sys.exit(1)

text = sys.argv[1]
output_file = Path(sys.argv[2])
language = sys.argv[3].lower()

output_file.parent.mkdir(parents=True, exist_ok=True)

# --- Голоса для разных языков ---
# Можно выбрать разные голоса, вот хорошие варианты:
# Русский: ru-RU-SvetlanaNeural (женский), ru-RU-DmitryNeural (мужской)
# Английский: en-US-GuyNeural (мужской), en-US-AriaNeural (женский), en-GB-RyanNeural (британский мужской)
VOICES = {
    "ru": "ru-RU-DmitryNeural",  # Мужской русский голос
    "en": "en-US-GuyNeural",     # Мужской американский английский
}

async def generate_speech():
    """Генерирует речь с помощью edge-tts"""
    voice = VOICES.get(language)
    
    if not voice:
        raise ValueError(f"Неподдерживаемый язык: {language}. Используйте 'ru' или 'en'")
    
    print(f"🔊 Генерируем аудио ({language}) с голосом {voice}...")
    
    try:
        # Генерируем речь и сохраняем в файл
        communicate = edge_tts.Communicate(text, voice)
        await communicate.save(str(output_file))
        print(f"✅ Аудио сохранено: {output_file}")
    except Exception as e:
        print(f"❌ Ошибка при генерации аудио: {e}")
        sys.exit(1)

# Запускаем асинхронную функцию
if __name__ == "__main__":
    asyncio.run(generate_speech())
