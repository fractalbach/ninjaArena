# Just a script to generate svg snippets and place them into an html document.
from string import Template
from sys import argv

# Use the given file as a template for the generated document.
if len(argv) < 2:
    print("needs an argument: filename")
    exit(1)
filename = argv[1]
with open(filename, 'r') as f:
    document = Template(f.read())
    
# Generate the document svg body.
mapw = 1000
maph = 1000
rangex = 50
rangey = 50
tilew = mapw / rangex
tileh = maph / rangey
        
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

print(document.substitute(body=body))
