from transformers import pipeline
from app.config.voice import settings
import json

pipe = pipeline(
    "text-generation",
    model=settings.LLM_MODEL
)

def analyze_text(text):
    prompt = f"""
    Extract:
    - intent
    - place

    intents:
    - navigation
    - place_info
    - unsupported

    Text: {text}

    JSON only.
    """

    result = pipe(prompt, max_new_tokens=100)

    output = result[0]["generated_text"]

    return json.loads(output)