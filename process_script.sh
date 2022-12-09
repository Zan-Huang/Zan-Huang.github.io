#!/bin/bash
cd blags
blag build
mv -v build/atom.xml ..
mv -v build/tags ..
cd ..
git add .
git commit -m "update site"
git push origin
