#!/bin/bash
# Ombudskalkylator - Startskript för macOS
# Dubbelklicka på denna fil i Finder för att starta appen!

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd "$DIR"

PORT=8000
# Hitta en ledig port om 8000 är upptagen
while lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null ; do
    PORT=$((PORT + 1))
done

echo "======================================================="
echo "   Moderata Ungdomsförbundet - Ombudskalkylator"
echo "======================================================="
echo "Startar lokal webbserver på http://localhost:$PORT..."
echo "Öppnar i din standardwebbläsare..."
echo ""
echo "Tryck Ctrl+C i detta fönster när du vill avsluta."
echo "======================================================="

# Öppna webbläsaren efter en kort fördröjning
(sleep 1 && open "http://localhost:$PORT") &

# Starta inbyggd Python-server
python3 -m http.server $PORT
