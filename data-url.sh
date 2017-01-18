#!/bin/sh
mimetype=$(file -bN --mime-type "overlay.png")
content=$(base64 -w0 < "overlay.png")
output="const OVERLAY_URL = 'data:$mimetype;base64,$content'; // eslint-disable-line max-len"
sed -i '2s~.*~'"$output"'~' ext/src/inject/inject.js
