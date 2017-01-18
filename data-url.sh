#!/bin/sh
mimetype=$(file -bN --mime-type "overlay.png")
content=$(base64 -w0 < "overlay.png")
output="module.exports = 'data:$mimetype;base64,$content'; // eslint-disable-line max-len"
echo $output > src/scripts/overlay-data.js
echo 'All done!'
