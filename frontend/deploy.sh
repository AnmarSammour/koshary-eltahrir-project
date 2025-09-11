
set -e


cd build

git init
git add -A
git commit -m 'Deploy to GitHub Pages'

git push -f https://github.com/AnmarSammour/koshary-eltahrir-project.git main:gh-pages

cd -

echo "Deployment to GitHub Pages complete!"