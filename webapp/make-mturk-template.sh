#!/bin/bash
#npm run-script build

# include jquery
#echo "<script type=\"text/javascript\" src=\"https://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js\"></script>" > anno-app-mturk.html
# copy template
#echo "<script type=\"text/javascript\" src=\"https://hltcoe.github.io/concrete-js/thrift.js\"></script>" >> anno-app-mturk.html
#echo "<script type=\"text/javascript\" src=\"https://hltcoe.github.io/concrete-js/concrete.js\"></script>" >> anno-app-mturk.html
echo "<style type=\"text/css\">" > anno-app-mturk.html
cat build/static/css/main.*.css >> anno-app-mturk.html
echo "</style>" >> anno-app-mturk.html

cat skeleton.html >> anno-app-mturk.html
## cat the scripts into the html
echo "<script type=\"text/javascript\">" >> anno-app-mturk.html
cat build/static/js/1.*.js >> anno-app-mturk.html
echo "</script>" >> anno-app-mturk.html
echo "" >> anno-app-mturk.html
echo "<script type=\"text/javascript\">" >> anno-app-mturk.html
cat build/static/js/main.*.js >> anno-app-mturk.html
echo "</script>" >> anno-app-mturk.html
#
echo "DONE"
