from transformers import AutoTokenizer, AutoModelForCausalLM
import torch

# 🧠 Load model ONCE at import
model_id = "deepseek-ai/deepseek-llm-7b-chat"

# ✅ Device setup (GPU if available, else CPU)
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# ✅ Load tokenizer + model ONCE and move to device
tokenizer = AutoTokenizer.from_pretrained(model_id)
model = AutoModelForCausalLM.from_pretrained(model_id, torch_dtype=torch.float16 if torch.cuda.is_available() else torch.float32)
model.to(device)
model.eval()  # 🧠 Ensure eval mode (faster + no dropout)

# ✅ Optimized inference wrapper
def anubis_decide(prompt: str) -> str:
    try:
        inputs = tokenizer(prompt, return_tensors="pt").to(device)
        with torch.no_grad():  # 🚀 Much faster inference
            outputs = model.generate(
                **inputs,
                max_new_tokens=256,       # ⏩ Faster response
                do_sample=True,
                temperature=0.8,
                top_p=0.95,
                top_k=50
            )
        return tokenizer.decode(outputs[0], skip_special_tokens=True)
    except Exception as e:
        print("❌ Anubis generation error:", e)
        return "Sorry, I couldn't process that prompt."
