import {
    Types as T,
    EPExplorer,
} from "@lingdocs/pashto-inflector";
import entryFeeder from "../lib/entry-feeder";

function EPBuilder({ opts }: { opts: T.TextOptions }) {
    return <div className="mb-4">
        <EPExplorer
            entryFeeder={entryFeeder}
            opts={opts}
        />
    </div>;
}

export default EPBuilder;
