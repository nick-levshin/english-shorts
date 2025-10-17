from gtts import gTTS
import sys

if len(sys.argv) < 4:
    print("Usage: python3 tts.py <lang> <text> <output>")
    sys.exit(1)

lang = sys.argv[1]
text = sys.argv[2]
output = sys.argv[3]

tts = gTTS(text=text, lang=lang)
tts.save(output)
