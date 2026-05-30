"""
LinguaFlow — LoRA Fine-Tuning Script
=====================================
Fine-tunes an open-source base model on TOEIC/Japanese Q&A data using LoRA (PEFT).

Requirements (install separately in a training venv):
    pip install torch transformers peft trl datasets accelerate bitsandbytes

Hardware recommendations:
    - GPU ≥12GB VRAM : Fine-tune qwen2.5-7b or mistral-7b with Q4 quantisation
    - GPU  8-12GB    : Fine-tune a 3B model (e.g., qwen2.5-3b) full precision
    - CPU only       : Not recommended for fine-tuning; use prompt engineering instead

Usage:
    python finetune.py \
        --base_model Qwen/Qwen2.5-7B-Instruct \
        --dataset_path dataset/sample_toeic_japanese.jsonl \
        --output_dir ./lora_adapters \
        --num_train_epochs 3

After training, load the adapter with Ollama via export_gguf.py.
"""

import argparse
import json
from pathlib import Path


def parse_args():
    parser = argparse.ArgumentParser(description="LinguaFlow LoRA Fine-Tuner")
    parser.add_argument("--base_model", type=str,
                        default="Qwen/Qwen2.5-7B-Instruct",
                        help="HuggingFace model ID or local path")
    parser.add_argument("--dataset_path", type=str,
                        default="dataset/sample_toeic_japanese.jsonl",
                        help="Path to JSONL training dataset")
    parser.add_argument("--output_dir", type=str,
                        default="./lora_adapters",
                        help="Directory to save LoRA adapter weights")
    parser.add_argument("--num_train_epochs", type=int, default=3)
    parser.add_argument("--per_device_train_batch_size", type=int, default=2)
    parser.add_argument("--learning_rate", type=float, default=2e-4)
    parser.add_argument("--lora_r", type=int, default=16,
                        help="LoRA rank (higher = more parameters, higher quality)")
    parser.add_argument("--lora_alpha", type=int, default=32)
    parser.add_argument("--lora_dropout", type=float, default=0.05)
    parser.add_argument("--max_seq_length", type=int, default=2048)
    parser.add_argument("--load_in_4bit", action="store_true", default=True,
                        help="Load base model in 4-bit quantisation (saves VRAM)")
    return parser.parse_args()


def load_dataset_from_jsonl(path: str):
    """Loads the JSONL chat dataset and converts it to HuggingFace Dataset format."""
    try:
        from datasets import Dataset
    except ImportError:
        raise ImportError("Run: pip install datasets")

    records = []
    with open(path, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if line:
                records.append(json.loads(line))

    print(f"✅ Loaded {len(records)} training examples from '{path}'")
    return Dataset.from_list(records)


def format_chat_for_training(example, tokenizer):
    """Applies the model's built-in chat template to format each training example."""
    messages = example["messages"]
    text = tokenizer.apply_chat_template(
        messages,
        tokenize=False,
        add_generation_prompt=False
    )
    return {"text": text}


def main():
    args = parse_args()

    try:
        import torch
        from transformers import AutoTokenizer, AutoModelForCausalLM, BitsAndBytesConfig
        from peft import LoraConfig, get_peft_model, TaskType
        from trl import SFTTrainer, SFTConfig
    except ImportError as e:
        print(f"❌ Missing dependency: {e}")
        print("Install with: pip install torch transformers peft trl datasets accelerate bitsandbytes")
        return

    print(f"🚀 Starting LoRA fine-tuning")
    print(f"   Base model : {args.base_model}")
    print(f"   Dataset    : {args.dataset_path}")
    print(f"   Output     : {args.output_dir}")
    print(f"   Epochs     : {args.num_train_epochs}")
    print(f"   4-bit QNT  : {args.load_in_4bit}")
    print()

    # ── Load tokeniser ─────────────────────────────────────────────────────────
    tokenizer = AutoTokenizer.from_pretrained(args.base_model, trust_remote_code=True)
    if tokenizer.pad_token is None:
        tokenizer.pad_token = tokenizer.eos_token

    # ── Load model (optionally in 4-bit for VRAM efficiency) ───────────────────
    bnb_config = None
    if args.load_in_4bit:
        bnb_config = BitsAndBytesConfig(
            load_in_4bit=True,
            bnb_4bit_quant_type="nf4",
            bnb_4bit_compute_dtype=torch.bfloat16,
            bnb_4bit_use_double_quant=True,
        )

    model = AutoModelForCausalLM.from_pretrained(
        args.base_model,
        quantization_config=bnb_config,
        device_map="auto",
        trust_remote_code=True,
    )
    model.config.use_cache = False

    # ── Configure LoRA ─────────────────────────────────────────────────────────
    lora_config = LoraConfig(
        task_type=TaskType.CAUSAL_LM,
        r=args.lora_r,
        lora_alpha=args.lora_alpha,
        lora_dropout=args.lora_dropout,
        # Target the attention projection layers (common across most LLMs)
        target_modules=["q_proj", "k_proj", "v_proj", "o_proj",
                        "gate_proj", "up_proj", "down_proj"],
        bias="none",
    )

    model = get_peft_model(model, lora_config)
    model.print_trainable_parameters()

    # ── Prepare dataset ────────────────────────────────────────────────────────
    dataset = load_dataset_from_jsonl(args.dataset_path)
    dataset = dataset.map(
        lambda ex: format_chat_for_training(ex, tokenizer),
        remove_columns=dataset.column_names,
    )

    # ── Training config ────────────────────────────────────────────────────────
    sft_config = SFTConfig(
        output_dir=args.output_dir,
        num_train_epochs=args.num_train_epochs,
        per_device_train_batch_size=args.per_device_train_batch_size,
        gradient_accumulation_steps=4,
        learning_rate=args.learning_rate,
        lr_scheduler_type="cosine",
        warmup_ratio=0.05,
        logging_steps=10,
        save_strategy="epoch",
        bf16=torch.cuda.is_bf16_supported(),
        fp16=not torch.cuda.is_bf16_supported(),
        max_seq_length=args.max_seq_length,
        packing=False,
        report_to="none",
    )

    trainer = SFTTrainer(
        model=model,
        args=sft_config,
        train_dataset=dataset,
        tokenizer=tokenizer,
    )

    print("🏋️  Starting training...")
    trainer.train()

    # ── Save adapter ───────────────────────────────────────────────────────────
    output_path = Path(args.output_dir)
    output_path.mkdir(parents=True, exist_ok=True)
    trainer.model.save_pretrained(output_path)
    tokenizer.save_pretrained(output_path)

    print(f"\n✅ Fine-tuning complete! Adapter saved to: {output_path}")
    print("   Next step: run `python export_gguf.py` to convert for Ollama.")


if __name__ == "__main__":
    main()
