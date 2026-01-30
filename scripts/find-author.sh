#!/bin/bash

# Script to find the author(s) of changes to a file
# Usage: ./scripts/find-author.sh <filename>

if [ -z "$1" ]; then
    echo "Usage: $0 <filename>"
    echo "Example: $0 style/standard.css"
    exit 1
fi

FILE="$1"

if [ ! -f "$FILE" ]; then
    echo "Error: File '$FILE' does not exist"
    exit 1
fi

echo "=========================================="
echo "Autor-Informationen für: $FILE"
echo "Author information for: $FILE"
echo "=========================================="
echo ""

echo "Letzte Änderung / Last Change:"
echo "------------------------------"
git log -1 --pretty=format:"Autor / Author: %an <%ae>%nDatum / Date: %ad%nCommit: %h%nNachricht / Message: %s%n" --date=format:"%Y-%m-%d %H:%M:%S" "$FILE"
echo ""
echo ""

echo "Letzte 5 Änderungen / Last 5 Changes:"
echo "-------------------------------------"
git log -5 --follow --pretty=format:"%h - %an - %ad - %s" --date=short "$FILE"
echo ""
echo ""

echo "Für detaillierte Zeilen-Informationen verwenden Sie:"
echo "For detailed line-by-line information use:"
echo "  git blame \"$FILE\""
echo ""
