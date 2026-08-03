#!/usr/bin/env python3

import platform
import shutil
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parent
SRC = ROOT / "src"

IGNORE_DIRS = {
    ".git",
    "node_modules",
    "dist",
    "build",
    ".next",
    ".turbo",
    ".idea",
    ".vscode",
    "__pycache__",
}

LANGUAGE_MAP = {
    ".ts": "ts",
    ".tsx": "tsx",
    ".js": "js",
    ".jsx": "jsx",
    ".json": "json",
    ".sql": "sql",
    ".md": "md",
    ".yaml": "yaml",
    ".yml": "yaml",
    ".env": "",
    ".prisma": "prisma",
}

output = []

for file in sorted(SRC.rglob("*")):
    if not file.is_file():
        continue

    if any(part in IGNORE_DIRS for part in file.parts):
        continue

    relative = file.relative_to(ROOT)

    output.append("=" * 100)
    output.append(f"FILE: {relative.as_posix()}")
    output.append("=" * 100)

    lang = LANGUAGE_MAP.get(file.suffix.lower(), "")

    output.append(f"```{lang}")

    try:
        output.append(file.read_text(encoding="utf-8"))
    except UnicodeDecodeError:
        output.append(file.read_text(encoding="utf-8", errors="replace"))

    output.append("```")
    output.append("")

text = "\n".join(output)


def copy_to_clipboard(data: str):
    system = platform.system()

    if system == "Windows":
        subprocess.run(
            ["clip"],
            input=data.encode("utf-8"),
            check=True,
        )

    elif system == "Darwin":
        subprocess.run(
            ["pbcopy"],
            input=data.encode("utf-8"),
            check=True,
        )

    elif system == "Linux":
        # Wayland (Sway, Hyprland, GNOME Wayland, KDE Wayland)
        if shutil.which("wl-copy"):
            subprocess.run(
                ["wl-copy"],
                input=data.encode("utf-8"),
                check=True,
            )

        # X11
        elif shutil.which("xclip"):
            subprocess.run(
                ["xclip", "-selection", "clipboard"],
                input=data.encode("utf-8"),
                check=True,
            )

        elif shutil.which("xsel"):
            subprocess.run(
                ["xsel", "--clipboard", "--input"],
                input=data.encode("utf-8"),
                check=True,
            )

        else:
            raise RuntimeError(
                "No clipboard utility found. Install wl-clipboard, xclip, or xsel."
            )

    else:
        raise RuntimeError(f"Unsupported platform: {system}")


try:
    copy_to_clipboard(text)
    print(f"✅ Copied {len(text):,} characters from src/ to the clipboard.")
except Exception as e:
    output_file = ROOT / "project_dump.md"
    output_file.write_text(text, encoding="utf-8")

    print("⚠️ Clipboard copy failed.")
    print(e)
    print(f"📄 Output written to: {output_file}")
