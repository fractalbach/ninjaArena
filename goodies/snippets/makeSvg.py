# Just a script to generate svg or html snippets that would be otherwise
# annoying to type.

from string import Template
                
mapw = 1000
maph = 1000
rangex = 50
rangey = 50

tilew = mapw // rangex
tileh = maph // rangey
        
box = Template('''<rect x='$x' y='$y' width='$tilew' height='$tilew' />''')
body = ""
         
for i in range(0, rangex):
    for j in range(0, rangey):
        d = dict(
            x = tilew * i,
            y = tileh * j,
            tilew = tilew,
            tileh = tileh,
        )
        body += box.substitute(d) + "\n"

print(Template('''
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Game Grid</title>
  </head>

  <style>
    rect {
	fill: #595;
	stroke: #000;
    }
  </style>

<body>  
<svg id="map" viewbox="0 0 500 500" preserveAspectRatio="none">
$body
</svg>
</body>
</html>
''').substitute(body=body))
