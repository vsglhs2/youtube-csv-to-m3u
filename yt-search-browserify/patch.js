// without this line will throw
process.versions.node = '16.0.0';

// dasu use tries to use node mode
// if there is no window object
if (!self.window) {
	self.window = self;
}

const index = require('../yt-search-repo/src/index.js');
self.yts = index;
