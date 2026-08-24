import fnmatch
import os
import subprocess
import sys

# ANSI Color Codes for Terminal Output (Zero Dependencies)
COLOR_HEADER = "\033[95m"
COLOR_BLUE = "\033[94m"
COLOR_GREEN = "\033[92m"
COLOR_YELLOW = "\033[93m"
COLOR_RED = "\033[91m"
COLOR_BOLD = "\033[1m"
COLOR_RESET = "\033[0m"

# Token-reducing exclusions
EXCLUDED_EXTENSIONS = {
    ".db",
    ".sqlite",
    ".sqlite3",
    ".png",
    ".jpg",
    ".jpeg",
    ".webp",
    ".ico",
    ".map",
    ".lock",
    ".log",
}

EXCLUDED_DIRS = {"node_modules", "dist", ".git", ".idea", ".vscode", "meta"}

EXCLUDED_FILES = {
    "package-lock.json",
    "pnpm-lock.yaml",
    "yarn.lock",
    "bun.lockb",
    "copy_project.py",
    ".env",
    ".env.example",
    ".env.test",
    ".DS_Store",
    "Thumbs.db",
}


def load_gitignore_patterns(root_dir):
    patterns = []
    gitignore_path = os.path.join(root_dir, ".gitignore")
    if os.path.exists(gitignore_path):
        with open(gitignore_path, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#"):
                    if line.startswith("/"):
                        line = line[1:]
                    patterns.append(line)
    return patterns


def is_ignored(rel_path, is_dir, gitignore_patterns):
    parts = rel_path.split(os.sep)
    if any(part in EXCLUDED_DIRS for part in parts):
        return True
    if not is_dir:
        filename = parts[-1]
        ext = os.path.splitext(filename)[1].lower()
        if filename in EXCLUDED_FILES or ext in EXCLUDED_EXTENSIONS:
            return True

    rel_path_normalized = rel_path.replace(os.sep, "/")
    for pattern in gitignore_patterns:
        clean_pattern = pattern.rstrip("/")
        if (
            fnmatch.fnmatch(rel_path_normalized, clean_pattern)
            or fnmatch.fnmatch(rel_path_normalized, f"*/{clean_pattern}")
            or fnmatch.fnmatch(rel_path_normalized, f"{clean_pattern}/*")
        ):
            return True
    return False


def copy_to_clipboard_native(text):
    """Sends text directly to Linux system clipboard using native commands."""
    try:
        # Check Wayland first
        process = subprocess.Popen(["wl-copy"], stdin=subprocess.PIPE)
        process.communicate(input=text.encode("utf-8"))
        if process.returncode == 0:
            return True
    except FileNotFoundError:
        pass

    try:
        # Check X11 xclip
        process = subprocess.Popen(
            ["xclip", "-selection", "clipboard"], stdin=subprocess.PIPE
        )
        process.communicate(input=text.encode("utf-8"))
        if process.returncode == 0:
            return True
    except FileNotFoundError:
        pass

    try:
        # Check X11 xsel
        process = subprocess.Popen(
            ["xsel", "--clipboard", "--input"], stdin=subprocess.PIPE
        )
        process.communicate(input=text.encode("utf-8"))
        if process.returncode == 0:
            return True
    except FileNotFoundError:
        pass

    return False


def main():
    root_dir = os.path.dirname(os.path.abspath(__file__))
    gitignore_patterns = load_gitignore_patterns(root_dir)
    buffer = []
    processed_files = []
    skipped_files = []

    print(
        f"\n{COLOR_HEADER}{COLOR_BOLD}=== ChowkSpot Backend Context Copy Engine ==={COLOR_RESET}\n"
    )
    print(f"{COLOR_BLUE}🔍 Scanning directory:{COLOR_RESET} {root_dir}")
    print(
        f"{COLOR_BLUE}⚙️  Applying ignore rules & token optimizations...{COLOR_RESET}\n"
    )

    for root, dirs, files in os.walk(root_dir):
        rel_root = os.path.relpath(root, root_dir)
        if rel_root == ".":
            rel_root = ""

        dirs[:] = sorted(
            [
                d
                for d in dirs
                if not is_ignored(os.path.join(rel_root, d), True, gitignore_patterns)
            ]
        )

        for file in sorted(files):
            rel_file_path = os.path.join(rel_root, file) if rel_root else file
            formatted_path = rel_file_path.replace(os.sep, "/")

            if is_ignored(rel_file_path, False, gitignore_patterns):
                skipped_files.append(formatted_path)
                continue

            abs_file_path = os.path.join(root, file)
            try:
                with open(abs_file_path, "r", encoding="utf-8") as f:
                    content = f.read()

                buffer.append(
                    f"{'=' * 100}\nFILE: {formatted_path}\n{'=' * 100}\n```\n{content}\n```\n\n"
                )
                processed_files.append(formatted_path)
                print(
                    f"  {COLOR_GREEN}✔ [{len(processed_files):03d}]{COLOR_RESET} {formatted_path}"
                )
            except Exception as e:
                skipped_files.append(formatted_path)
                print(f"  {COLOR_YELLOW}⚠ [SKIP]{COLOR_RESET} {formatted_path} ({e})")

    full_text = "".join(buffer)
    total_bytes = len(full_text.encode("utf-8"))

    print(
        f"\n{COLOR_BOLD}--------------------------------------------------{COLOR_RESET}"
    )
    print(f"{COLOR_GREEN}✔ Processed Files:{COLOR_RESET} {len(processed_files)}")
    print(f"{COLOR_YELLOW}🚫 Skipped Files:{COLOR_RESET}   {len(skipped_files)}")
    print(
        f"{COLOR_BLUE}📦 Payload Size:{COLOR_RESET}    {total_bytes / 1024:.2f} KB (~{int(total_bytes / 4)} Tokens)"
    )
    print(
        f"{COLOR_BOLD}--------------------------------------------------{COLOR_RESET}\n"
    )

    print(
        f"{COLOR_BLUE}📋 Attempting to write directly to system clipboard...{COLOR_RESET}"
    )
    if copy_to_clipboard_native(full_text):
        print(
            f"{COLOR_GREEN}{COLOR_BOLD}🚀 SUCCESS! {len(processed_files)} backend files copied directly to clipboard.{COLOR_RESET}\n"
        )
    else:
        print(
            f"{COLOR_RED}❌ Clipboard error! Install xclip or wl-clipboard using:{COLOR_RESET}"
        )
        print(
            f"{COLOR_BOLD}   sudo pacman -S xclip{COLOR_RESET}  or  {COLOR_BOLD}sudo pacman -S wl-clipboard{COLOR_RESET}\n"
        )


if __name__ == "__main__":
    main()
