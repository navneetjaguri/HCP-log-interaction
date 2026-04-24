import subprocess
import sys
import os

# Use venv python
python_exe = os.path.join(os.getcwd(), "venv", "Scripts", "python.exe")
cmd = [python_exe, "-m", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]

print(f"Starting uvicorn with: {cmd}")
process = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
print(f"Process started with PID: {process.pid}")
