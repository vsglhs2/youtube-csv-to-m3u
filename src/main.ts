import { wrap } from "comlink";
import type { YTSearch } from "./yt-search";
import type { Session as RemoteSession } from "./worker";

class Session {
    private remote: RemoteSession;

    constructor() {
        const worker = new Worker('/src/worker.ts', { type: "module" });
        this.remote = wrap<RemoteSession>(worker);
    }

    public async setupYTSearch() {
        const port = await this.remote.getYTSearchPort();

        // wrap<YTSearch> breaks correct parameters and return type infer
        return wrap(port) as unknown as YTSearch;
    }
}

const session = new Session();
const yts = await session.setupYTSearch();

const video = await yts({ videoId: 'h-7uu3mQ3cg' })
console.log(video.title + ` (${video.duration.timestamp})`)
