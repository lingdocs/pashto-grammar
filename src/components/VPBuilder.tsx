import {
    defaultTextOptions,
    VPExplorer,
    EntrySelect,
    Types as T,
} from "@lingdocs/pashto-inflector";
import { useStickyState } from "@lingdocs/pashto-inflector";
import entryFeeder from "../lib/entry-feeder";

function VPBuilder() {
    const [entry, setEntry] = useStickyState<T.VerbEntry | undefined>(undefined, "vEntrySelect");
    return <div>
        <div style={{ maxWidth: "300px" }}>
            <div className="h5">Verb:</div>
            <EntrySelect
                value={entry}
                onChange={setEntry}
                entryFeeder={entryFeeder.verbs}
                opts={defaultTextOptions}
                isVerbSelect
                name="Verb"
            />
        </div>
        <div style={{ margin: "0 auto" }}>
        {entry
            ? <VPExplorer
                verb={entry}
                opts={defaultTextOptions}
                entryFeeder={entryFeeder}
                handleLinkClick="none"
            />
            : <div className="lead">
                Choose a verb to start building
            </div>}
        </div>
    </div>;

}

export default VPBuilder;
