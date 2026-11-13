REPO    := arbetsmiljo/arbetsmiljo.github.io
RELEASE := data
YEAR    ?= $(shell date +%Y)

.PHONY: build dev ingest upload pull clean-db

db.sqlite:
	gh release download $(RELEASE) --repo $(REPO) --pattern db.sqlite.gz --output $@.gz --clobber
	gunzip -c $@.gz > $@.tmp
	rm $@.gz
	mv $@.tmp $@

build: db.sqlite
	pnpm build

dev: db.sqlite
	pnpm dev

ingest: db.sqlite
	pnpm diarium ingest -f db.sqlite $(YEAR)

upload: db.sqlite
	gzip -c db.sqlite > db.sqlite.gz
	gh release upload $(RELEASE) db.sqlite.gz --repo $(REPO) --clobber
	rm db.sqlite.gz

pull: clean-db db.sqlite

clean-db:
	rm -f db.sqlite
