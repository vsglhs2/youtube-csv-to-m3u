# Youtube takeout csv format to m3u

## Motivation

OuterTune do not allow importing stuff from youtube takeout. So, having only csv formatted export, this app will able a way to generate m3u file that can be imported with new pr (#378). In future this project might able to implement reexport between various alternative youtube clients

## TODO

- [x] - add data-table component
- [ ] - add cards view to data-table component
- [ ] - add proxy settings
- [ ] - add imports page
- [ ] - add exports page
- [ ] - add collection (?) page
- [ ] - add picker page
- [ ] - store imported information in idb
- [ ] - create m3u file on csv import
- [ ] - add retry logic per item and as whole
- [ ] - implement queue for calls to yt-search
- [x] - make simple ui structure
- [ ] - add searching for alternative in case if video is unavailable (for favorites (?))
- [ ] - make yt-search build based on npm package without repo cloning
- [x] - add linter