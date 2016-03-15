.PHONY:build watch
build:
	rm -rf build	
	mkdir build
	browserify src/index.js -t babelify -o build/index.js
	cp src/index.html build/index.html
	cp sample/ui.xml build/ui.xml
watch:build
	fswatch -0 src sample| xargs -0 -n 1 $(MAKE) build
