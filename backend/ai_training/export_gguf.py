"""
LinguaFlow — Export Fine-Tuned LoRA Adapter to GGUF for Ollama
================================================================
This script merges your LoRA adapter with the base model and converts
the result to GGUF format, making it loadable by Ollama.

Prerequisites:
    1. Completed fine-tuning (run finetune.py first)
    2. llama.cpp installed and compiled on your system:
       https://github.com/ggerganov/llama.cpp

Usage:
    python export_gguf.py \
        --base_model Qwen/Qwen2.5-7B-Instruct \
        --lora_dir ./lora_adapters \
        --output_dir ./merged_model \
        --llama_cpp_dir /path/to/llama.cpp \
        --quantisation Q4_K_M
"""

import argparse
import subprocess
import sys
from pathlib import Path


def parse_args():
    parser = argparse.ArgumentParser(description="Merge LoRA + Export to GGUF")
    parser.add_argument("--base_model", type=str,
                        default="Qwen/Qwen2.5-7B-Instruct",
                        help="Base HuggingFace model ID")
    parser.add_argument("--lora_dir", type=str,
                        default="./lora_adapters",
                        help="Path to saved LoRA adapter directory")
    parser.add_argument("--output_dir", type=str,
                        default="./merged_model",
                        help="Directory to save merged full model weights")
    parser.add_argument("--gguf_output", type=str,
                        default="./linguabot.gguf",
                        help="Output path for the final GGUF file")
    parser.add_argument("--llama_cpp_dir", type=str,
                        default="./llama.cpp",
                        help="Path to compiled llama.cpp directory")
    parser.add_argument("--quantisation", type=str,
                        default="Q4_K_M",
                        choices=["Q4_K_M", "Q5_K_M", "Q8_0", "F16"],
                        help="Quantisation level (Q4_K_M recommended for 7B models)")
    return parser.parse_args()


def merge_lora_weights(base_model: str, lora_dir: str, output_dir: str):
    """Merges LoRA adapter weights into the base model and saves the full model."""
    print(f"🔗 Merging LoRA adapter into base model...")
    print(f"   Base   : {base_model}")
    print(f"   Adapter: {lora_dir}")
    print(f"   Output : {output_dir}")

    try:
        from transformers import AutoTokenizer, AutoModelForCausalLM
        from peft import PeftModel
        import torch
    except ImportError:
        print("❌ Missing: pip install transformers peft torch")
        sys.exit(1)

    tokenizer = AutoTokenizer.from_pretrained(base_model, trust_remote_code=True)

    print("   Loading base model (this may take a few minutes)...")
    base = AutoModelForCausalLM.from_pretrained(
        base_model,
        torch_dtype=torch.float16,
        device_map="cpu",   # Use CPU for merging to avoid VRAM limits
        trust_remote_code=True,
    )

    print("   Applying LoRA adapter...")
    model = PeftModel.from_pretrained(base, lora_dir)
    model = model.merge_and_unload()   # Bakes adapter weights into the model

    print(f"   Saving merged model to {output_dir}...")
    Path(output_dir).mkdir(parents=True, exist_ok=True)
    model.save_pretrained(output_dir, safe_serialization=True)
    tokenizer.save_pretrained(output_dir)
    print("✅ Merge complete!")


def convert_to_gguf(merged_dir: str, gguf_output: str, llama_cpp_dir: str, quantisation: str):
    """Converts the merged HuggingFace model to quantised GGUF format using llama.cpp."""
    llama_cpp = Path(llama_cpp_dir)
    convert_script = llama_cpp / "convert_hf_to_gguf.py"
    quantise_bin = llama_cpp / "llama-quantize"

    if not convert_script.exists():
        print(f"❌ Cannot find llama.cpp conversion script at: {convert_script}")
        print("   Clone and build llama.cpp: https://github.com/ggerganov/llama.cpp")
        sys.exit(1)

    # Step 1: Convert to unquantised F16 GGUF
    f16_output = gguf_output.replace(".gguf", "_f16.gguf")
    print(f"\n🔄 Converting to F16 GGUF...")
    subprocess.run([
        sys.executable, str(convert_script),
        merged_dir,
        "--outfile", f16_output,
        "--outtype", "f16",
    ], check=True)

    # Step 2: Quantise the GGUF
    if quantisation != "F16":
        print(f"\n📦 Quantising to {quantisation}...")
        subprocess.run([
            str(quantise_bin), f16_output, gguf_output, quantisation
        ], check=True)
        Path(f16_output).unlink(missing_ok=True)   # Remove unquantised file
        print(f"✅ GGUF file ready: {gguf_output}")
    else:
        Path(f16_output).rename(gguf_output)
        print(f"✅ F16 GGUF file ready: {gguf_output}")


def create_ollama_modelfile(gguf_path: str, model_name: str = "linguabot"):
    """Creates an Ollama Modelfile to register the custom model."""
    modelfile_content = f"""# LinguaBot — Custom Fine-Tuned LinguaFlow AI
FROM {gguf_path}

SYSTEM \"\"\"
You are LinguaBot, a premium AI education mentor on the LinguaFlow learning platform.
You specialise in TOEIC English, Japanese (JLPT N5-N1), and programming tutorials.
Always respond with well-structured Markdown. Be warm, encouraging, and educational.
\"\"\"

PARAMETER temperature 0.7
PARAMETER top_p 0.9
PARAMETER num_predict 1024
PARAMETER stop "<|im_end|>"
"""
    modelfile_path = Path(gguf_path).parent / "Modelfile"
    modelfile_path.write_text(modelfile_content, encoding="utf-8")
    print(f"\n📄 Ollama Modelfile created: {modelfile_path}")
    print(f"\n   To load into Ollama, run:")
    print(f"   ollama create {model_name} -f {modelfile_path}")
    print(f"   ollama run {model_name}")
    print(f"\n   Then set in .env:")
    print(f"   AI_PROVIDER=local")
    print(f"   LOCAL_AI_MODEL={model_name}")


def main():
    args = parse_args()

    # Step 1: Merge LoRA into base model
    merge_lora_weights(args.base_model, args.lora_dir, args.output_dir)

    # Step 2: Convert + quantise to GGUF
    convert_to_gguf(args.output_dir, args.gguf_output, args.llama_cpp_dir, args.quantisation)

    # Step 3: Generate Ollama Modelfile
    create_ollama_modelfile(args.gguf_output, model_name="linguabot")

    print("\n🎉 All done! Your custom LinguaBot AI model is ready.")


if __name__ == "__main__":
    main()
