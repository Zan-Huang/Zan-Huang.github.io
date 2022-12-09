#!/bin/bash
cd blags
blag build
mv -v build/atom.xml ..
mv -v build/tags ..
cd ..
for insert in /blags/build/*.html; do
    sed -i '3 i <link rel="stylesheet" href="/style.css" type="text/css">' "insert"
done
git add .
git commit -m "update site"
git push origin
