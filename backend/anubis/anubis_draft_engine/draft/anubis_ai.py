from transformers import AutoTokenizer, AutoModelForCausalLM
import torch
import time

model_id = "deepseek-ai/deepseek-llm-7b-chat"
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

tokenizer = AutoTokenizer.from_pretrained(model_id, trust_remote_code=True)
model = AutoModelForCausalLM.from_pretrained(
    model_id,
    torch_dtype=torch.float16 if torch.cuda.is_available() else torch.float32,
    trust_remote_code=True
)
model.to(device)
model.eval()

# ✅ Build chat input with attention mask
def build_chat_inputs(prompt: str):
    messages = [
        {"role": "system", "content": "You are a fantasy football expert."},
        {"role": "user", "content": prompt},
    ]

    # Step 1: Generate plain text prompt from chat template
    prompt_text = tokenizer.apply_chat_template(
        messages,
        add_generation_prompt=True,
        tokenize=False  # ✅ return raw text only
    )

    # Step 2: Tokenize into input_ids + attention_mask
    return tokenizer(
        prompt_text,
        return_tensors="pt",
        padding=True,
        truncation=True
    ).to(device)

# ✅ Run model inference
def anubis_decide(prompt: str) -> str:
    print("⚡ Calling DeepSeek inference...")
    start = time.time()

    try:
        inputs = build_chat_inputs(prompt)
        input_ids = inputs['input_ids']
        attention_mask = inputs['attention_mask']

        output = model.generate(
            input_ids=input_ids,
            attention_mask=attention_mask,
            max_new_tokens=200,
            temperature=0.7,
            top_p=0.95,
            do_sample=True,
            pad_token_id=tokenizer.eos_token_id  # 👈 fixes the warning
        )

        generated_tokens = output[0][inputs['input_ids'].shape[-1]:]
        result = tokenizer.decode(generated_tokens, skip_special_tokens=True)

        print(f"✅ DeepSeek returned in {time.time() - start:.2f}s")
        print("🧠 AI Result:", result)
        return result

    except Exception as e:
        print("❌ Error during DeepSeek call:", str(e))
        return "Player Name: Marvin Harrison\nExplanation: Fallback pick due to error."