npm run build --if-present
git checkout main
git branch -D gh-pages 2>$null
git checkout --orphan gh-pages
git rm -rf . 2>$null
Copy-Item -Path "dist\*" -Destination "." -Recurse -Force
git add -A
git commit -m "deploy"
git push origin gh-pages --force
git checkout main
Write-Host "Deployed to https://mustafe-abdirahman.github.io/quiz/"
