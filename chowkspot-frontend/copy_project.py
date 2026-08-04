#!/usr/bin/env python3

import platform
import shutil
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parent

# Target files and folders relevant to Vite + React + TypeScript setups
TARGET_PATHS = [
    ROOT / "src",
    ROOT / "vite.config.ts",
    ROOT / "vite.config.js",
    ROOT / "package.json",
    ROOT / "tsconfig.json",
    ROOT / "tsconfig.node.json",
    ROOT / "index.html",
]

# Standard directories to skip during recursion
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
    "coverage",
}

# Ignore binary assets to avoid pasting binary text/garbage into prompts
IGNORE_EXTENSIONS = {
    ".png",
    ".jpg",
    ".jpeg",
    ".gif",
    ".ico",
    ".webp",
    ".woff",
    ".woff2",
    ".ttf",
    ".eot",
    ".mp4",
    ".mp3",
    ".pdf",
    ".zip",
    ".gz",
    ".tar",
}

# Language identifier mapping for Markdown block formatting
LANGUAGE_MAP = {
    ".ts": "ts",
    ".tsx": "tsx",
    ".js": "js",
    ".jsx": "jsx",
    ".css": "css",
    ".scss": "scss",
    ".sass": "sass",
    ".less": "less",
    ".html": "html",
    ".json": "json",
    ".md": "md",
    ".yaml": "yaml",
    ".yml": "yaml",
    ".svg": "xml",
    ".env": "",
    ".env.example": "",
    ".env.local": "",
    ".env.development": "",
    ".env.production": "",
}


def get_files_to_process():
    """Collects and returns sorted list of relevant project files."""
    files = set()
    for target in TARGET_PATHS:
        if not target.exists():
            continue
        if target.is_file():
            files.add(target)
        elif target.is_dir():
            for file in target.rglob("*"):
                if file.is_file():
                    files.add(file)
    return sorted(files)


output = []

for file in get_files_to_process():
    # Skip ignored directories (e.g., node_modules, dist)
    if any(part in IGNORE_DIRS for part in file.parts):
        continue

    # Skip binary media files
    if file.suffix.lower() in IGNORE_EXTENSIONS:
        continue

    # Special language mapping for CSS Modules (*.module.css)
    filename = file.name.lower()
    if filename.endswith(".module.css"):
        lang = "css"
    elif filename.endswith(".module.scss"):
        lang = "scss"
    elif filename.endswith(".module.sass"):
        lang = "sass"
    elif filename.endswith(".module.less"):
        lang = "less"
    else:
        lang = LANGUAGE_MAP.get(file.suffix.lower(), "")

    relative = file.relative_to(ROOT)

    output.append("=" * 100)
    output.append(f"FILE: {relative.as_posix()}")
    output.append("=" * 100)
    output.append(f"```{lang}")

    try:
        output.append(file.read_text(encoding="utf-8"))
    except UnicodeDecodeError:
        output.append(file.read_text(encoding="utf-8", errors="replace"))

    output.append("```")
    output.append("")

text = "\n".join(output)


def copy_to_clipboard(data: str):
    """Copies output string to OS system clipboard."""
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
        if shutil.which("wl-copy"):
            subprocess.run(
                ["wl-copy"],
                input=data.encode("utf-8"),
                check=True,
            )
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
    print(f"✅ Copied {len(text):,} characters from React/Vite project to clipboard.")
except Exception as e:
    output_file = ROOT / "frontend_project_dump.md"
    output_file.write_text(text, encoding="utf-8")

    print("⚠️ Clipboard copy failed.")
    print(e)
    print(f"📄 Output written to: {output_file}")
