# Youtube takeout csv format to m3u

## Motivation

OuterTune do not allow importing stuff from youtube takeout. So, having only csv formatted export, this app will able a way to generate m3u file that can be imported with new pr (#378)

## TODO

[ ] - create m3u file on csv import
[ ] - add retry logic per item and as whole
[ ] - implement queue for calls to yt-search
[ ] - make simple ui
[ ] - add searching for alternative in case if video is unavailable (for favorites (?))
[ ] - make yt-search build based on npm package without repo cloning