#!/bin/bash
cd blags
blag build
mv -v build/atom.xml ..
mv -v build/tags ..
cd ..
cd blags/build
sed '3 i <link rel="stylesheet" href="style.css" type="text/css">' "insert"
cd ..
cd ..
git add .
git commit -m "update site"
git push origin
