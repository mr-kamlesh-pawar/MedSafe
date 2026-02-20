
# Stop existing processes (Force kill ensures ports are freed)
Get-Process -Name "node", "python" -ErrorAction SilentlyContinue | Stop-Process -Force

# Start Backend (Hidden window)
Start-Process -FilePath "python" -ArgumentList "app.py" -WorkingDirectory "..\server" -WindowStyle Minimized

# Start Frontend (Visible window so user sees output)
Start-Process -FilePath "npm" -ArgumentList "run dev" -WorkingDirectory "..\client"
