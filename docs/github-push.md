# GitHub First Push Commands

Run from:
C:\Users\Baash_smwj5c9\Downloads\P2P platform

```powershell
git init
git add .
git commit -m "chore: production monorepo scaffold for alterescrow launch"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

If remote already exists:

```powershell
git remote set-url origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```
