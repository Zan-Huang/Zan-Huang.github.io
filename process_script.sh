#!/bin/bash
cd blags
blag build
mv -v build/atom.xml ..
mv -v build/tags ..
cd ..
cd blags/build
#echo '<link rel="stylesheet" href="style.css" type="text/css">' >> index.html
echo '<link rel="stylesheet" href="https://latex.now.sh/style.css">' >> index.html
cd posts
for f in *
do
  #echo '<link rel="stylesheet" href="../style.css" type="text/css">' >> $f
  echo '<link rel="stylesheet" href="https://latex.now.sh/style.css">' >> $f
done
cd ..
cd ..
cd ..
git add .
git commit -m "update site"
git push origin
