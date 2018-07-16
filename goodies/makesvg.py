# Just a script to generate svg snippets and place them into an html document.
from string import Template
from sys import argv
import math

# Use the given file as a template for the generated document.
if len(argv) < 2:
    print("needs an argument: filename")
    exit(1)
filename = argv[1]
with open(filename, 'r') as f:
    document = Template(f.read())
    
# Define the Generated Map.
mapw = 1000
maph = 1000
rangex = 50
rangey = 50
tilew = mapw / rangex
tileh = maph / rangey

# Define the Template Elements.
body = ""
row = Template("<g class='row$num'>")
box = Template("<polygon points='$x1,$y1 $x2,$y2 $x3,$y3 $x4,$y4'/>")

# Define the name of the graphics nodes used for doing transforms
gNames = ['Translate', 'SkewX', 'SkewY', 'Matrix']

# Generate the Frontmatter Graphics nodes.
for name in gNames:
    body += ("<g id='grid"+name+"'>")

# Generate the Values for each of the Polygons
for j in range(0, rangey):
    body += row.substitute(num=j)
    for i in range(0, rangex):
        w0 = tilew * i
        h0 = tileh * j
        w1 = tilew * (i+1)
        h1 = tileh * (j+1)
        d = dict(
            x1 = w0, y1 = h0,
            x2 = w0, y2 = h1,
            x3 = w1, y3 = h1,
            x4 = w1, y4 = h0,
        )
        body += box.substitute(d)
    body += "</g>"

# Close off the graphics nodes.
for _ in gNames:
    body += "</g>"

print(document.substitute(body=body))
