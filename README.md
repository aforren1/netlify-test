https://adf-netlify-test.netlify.app/

TODO: handle `onunload`, `onbeforeunload`, ... by pausing/shuffling intermediate data

Coin from https://www.gamedeveloperstudio.com/graphics/viewgraphic.php?item=1o4e4x8y6g349n153d
Spritesheet from https://ezgif.com/gif-to-sprite
custom font: https://stackoverflow.com/questions/51217147/how-to-use-a-local-font-in-phaser-3
treasure chest: https://image.freepik.com/free-vector/watercolor-opened-closed-treasure-box-collection_23-2147877105.jpg
Used the above to convert to spritesheet, and https://www.imgonline.com.ua/eng/replace-white-background-with-transparent.php to strip background

Note: mp3 is supported pretty much everywhere- https://caniuse.com/#feat=mp3
Jangle from https://freesound.org/people/sandyrb/sounds/41381/
Thump from https://freesound.org/people/theshaggyfreak/sounds/274934/

Quick turnaround: `npm run build && netlify dev`
More complete (rebuilds lambda functions?): `netlify build && netlify dev`

TODO: pack assets? https://webpack.js.org/guides/asset-management/
