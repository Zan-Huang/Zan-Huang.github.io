#!/bin/bash
cd blags
blag build
mv -v build/atom.xml ..
mv -v build/tags ..
cd ..
cd blags/build
insertVAR='<link rel="stylesheet" href="style.css" type="text/css">'
echo $(insertVar) >> index.html
cd ..
cd ..
git add .
git commit -m "update site"
git push origin
