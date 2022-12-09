#!/bin/bash
cd blags
blag build
mv -v build/atom.xml ..
mv -v build/tags ..
