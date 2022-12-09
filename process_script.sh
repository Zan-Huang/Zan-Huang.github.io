#!/bin/bash
cd documents
for f in *
do
	output="($f).md"
	pandoc --read=rtf --write=markdown -s $f -o $output
	cp "$output" ../blags/content/posts
done

cd ..

cd blags
blag build
mv -v build/atom.xml ..
mv -v build/tags ..
cd ..
git add .
git commit -m "update site"
git push origin
