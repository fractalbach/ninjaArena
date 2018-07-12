# Goodies

The "goodies" directory holds extra code scripts or snippets that have useful
functionality, but aren't neccesarily critical code for the client or server.
(or ,at least, shouldn't be critical code).

Client Goodies are usually experimental in nature, or are scripts to generate
bits of code that needn't be handwritten.  For example, goodies/snippets started
out with a python script used to generate a grid out of svg elements.  It didn't
need to be a whole program the first time it was written.  Therefore, it was
just a "goodie"

Server Goodies are the odds n' ends that are needed to glue everything together
so that it actually runs successfully.  As the complexity of the goodies
increases, they should be converted away from scripts and rewritten as
full programs.



# Client Goodies

## Generating svg in html pages

Sometimes, you need a lot of rectangles, and you want them in very specific places.
You can use a script to generate them, because writing out each one would be
far more work for a human than a computer. A human is good at coming up with a
mathematical equation, which can be fed into a computer as instructions.  These
instructions can do awesome things: like generating a ton of verbose svg rectangle
elements. See [snippets/makeSvg.py](snippets/makeSvg.py).





# Server Goodies

## How to Update Stuff

Until an fully automated system is in place, there are a couple of steps
to run in the shell to fetch updates from github, reload the service modules,
and get the new version of the server online. Currently, it's very un-sophisicated.


To fetch new changes to the repo, re-install the server software, and then
restart the servers:

	go get -u github.com/fractalbach/ninjaArena
	go get -u github.com/fractalbach/ninjaArena/ninjaServer
	sudo systemctl restart ninjaServer



When the .service module for systemctl is changed, more steps need to be taken,
which are in a script in the goodies section:

	cd ~/go/src/github.com/fractalbach/ninjaArena/goodies
	chmod u=rx startup.sh
	./startup.sh




## Future Goals

Ideally, this should be entirely automated, and should minimize the
usage of bash scripts as much as possible.  Updating a specific branch
of the repo should trigger the update process.

One possibility is to a program that handles the graceful startup and shutdown
of the various components of the ninjaServer.  At the time of this writing,
there aren't enough components in existence for this to matter.
But when there are, it would be wise to have something able to manage them.