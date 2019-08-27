#!/bin/bash
#npm run-script build

# include jquery
#echo "<script type=\"text/javascript\" src=\"https://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js\"></script>" > anno-app-turkle.html
# copy template
#echo "<script type=\"text/javascript\" src=\"https://hltcoe.github.io/concrete-js/thrift.js\"></script>" >> anno-app-turkle.html
#echo "<script type=\"text/javascript\" src=\"https://hltcoe.github.io/concrete-js/concrete.js\"></script>" >> anno-app-turkle.html
echo "<style type=\"text/css\">" > anno-app-turkle.html
cat build/static/css/main.*.css >> anno-app-turkle.html
echo "</style>" >> anno-app-turkle.html

cat skeleton.html >> anno-app-turkle.html
## cat the scripts into the html
echo "<script type=\"text/javascript\">" >> anno-app-turkle.html
cat build/static/js/1.*.js >> anno-app-turkle.html
echo "</script>" >> anno-app-turkle.html
echo "" >> anno-app-turkle.html
echo "<script type=\"text/javascript\">" >> anno-app-turkle.html
cat build/static/js/main.*.js >> anno-app-turkle.html
echo "</script>" >> anno-app-turkle.html
#
echo "DONE"
