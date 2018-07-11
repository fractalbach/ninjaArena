# Server Goodies

Server Goodies are the odds n' ends that are needed to glue everything together
so that it actually runs successfully.  As the complexity of the goodies
increases, they should be converted away from scripts and rewritten as
full programs.



## How to Update Stuff

Until an fully automated system is in place, there are a couple of steps
to run in the shell to fetch updates from github, reload the service modules,
and get the new version of the server online. Currently, it's very un-sophisicated.


	go get -u github.com/fractalbach/ninjaArena
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