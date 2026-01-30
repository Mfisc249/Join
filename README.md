# Join

## Git-Befehle für das Team (Git Commands for the Team)

### Autor der letzten Änderungen an einer Datei finden (Find author of last changes to a file)

Um herauszufinden, wer die letzten Änderungen an einer Datei vorgenommen hat, gibt es mehrere nützliche Git-Befehle:

#### 1. Commit-Historie für eine bestimmte Datei anzeigen
```bash
git log --follow --pretty=format:"%h - %an - %ad - %s" --date=short <dateiname>
```

Beispiel für `style/standard.css`:
```bash
git log --follow --pretty=format:"%h - %an - %ad - %s" --date=short style/standard.css
```

#### 2. Git Blame verwenden (zeigt Autor für jede Zeile)
```bash
git blame <dateiname>
```

Beispiel:
```bash
git blame style/standard.css
```

#### 3. Nur die letzte Änderung anzeigen
```bash
git log -1 --pretty=format:"%an <%ae> - %ad - %s" --date=short <dateiname>
```

#### 4. Helper-Script verwenden (siehe unten)
```bash
./scripts/find-author.sh style/standard.css
```

---

## Git Commands for the Team

### Find author of last changes to a file

To find out who made the last changes to a file, there are several useful Git commands:

#### 1. Show commit history for a specific file
```bash
git log --follow --pretty=format:"%h - %an - %ad - %s" --date=short <filename>
```

Example for `style/standard.css`:
```bash
git log --follow --pretty=format:"%h - %an - %ad - %s" --date=short style/standard.css
```

#### 2. Use git blame (shows author for each line)
```bash
git blame <filename>
```

Example:
```bash
git blame style/standard.css
```

#### 3. Show only the last change
```bash
git log -1 --pretty=format:"%an <%ae> - %ad - %s" --date=short <filename>
```

#### 4. Use helper script (see below)
```bash
./scripts/find-author.sh style/standard.css
```