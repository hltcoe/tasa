#!/bin/bash

echo "<style type=\"text/css\">" > anno-app-mturk.html
cat build/static/css/main.*.css >> anno-app-mturk.html
echo "</style>" >> anno-app-mturk.html

cat skeleton.html >> anno-app-mturk.html

## cat the scripts into the html
echo "<script type=\"text/javascript\">" >> anno-app-mturk.html
cat build/static/js/2.*.js >> anno-app-mturk.html
echo "</script>" >> anno-app-mturk.html
echo "" >> anno-app-mturk.html

echo "<script type=\"text/javascript\">" >> anno-app-mturk.html
cat build/static/js/main.*.js >> anno-app-mturk.html
echo "</script>" >> anno-app-mturk.html
echo "" >> anno-app-turkle.html

echo "<script type=\"text/javascript\">" >> anno-app-turkle.html
cat build/static/js/runtime-main.*.js >> anno-app-turkle.html
echo "</script>" >> anno-app-turkle.html

echo "DONE"
