
Stop-Process -Name "python", "node" -Force -ErrorAction SilentlyContinue

Start-Process -FilePath "python" -ArgumentList "app.py" -WorkingDirectory "server" -WindowStyle Minimized
Start-Process -FilePath "npm" -ArgumentList "run dev" -WorkingDirectory "client"
