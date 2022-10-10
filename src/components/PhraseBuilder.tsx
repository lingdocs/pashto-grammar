import { useStickyState } from "@lingdocs/ps-react";
import {
    Types as T,
    ButtonSelect,
    EPExplorer,
    defaultTextOptions as opts,
    EntrySelect,
    VPExplorer,
} from "@lingdocs/ps-react";
import { useEffect } from "react";
import entryFeeder from "../lib/entry-feeder";

function PhraseBuilder() {
    const [type, setType] = useStickyState<"EP" | "VP">("VP", "phraseBuilderType");
    const [entry, setEntry] = useStickyState<T.VerbEntry | undefined>(
        undefined,
        "vEntrySelect",
    );
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const vp = params.get("vp");
        const ep = params.get("ep");
        if (vp) {
            setType("VP");
        } else if (ep) {
            setType("EP");
        }
    }, [setType]);
    return <div style={{ maxWidth: "1250px", margin: "0 auto 200px auto" }}>
        <div className="text-center mb-3 mt-3">
            <ButtonSelect
                options={[
                    { label: "Verb Phrase", value: "VP" },
                    { label: "Equative Phrase", value: "EP" },
                ]}
                value={type}
                handleChange={setType}
            />
        </div>
        {type === "EP" ? <div>
            <h3 className="mb-4">Equative Phrase Builder</h3>
            <EPExplorer
                opts={opts}
                entryFeeder={entryFeeder}
            />
        </div>
        : <div>
            <h3 className="mb-4">Verb Phrase Builder</h3>
            <div style={{ maxWidth: "300px" }}>
                <div className="h5">Verb:</div>
                <EntrySelect
                    value={entry}
                    onChange={setEntry}
                    entryFeeder={entryFeeder.verbs}
                    opts={opts}
                    isVerbSelect
                    name="Verb"
                />
            </div>
            <div style={{ margin: "0 auto" }}>
                {entry
                    ? <VPExplorer
                        verb={entry}
                        opts={opts}
                        entryFeeder={entryFeeder}
                        handleLinkClick="none"
                    />
                    : <div className="lead">
                        Choose a verb to start building
                    </div>}
            </div>
        </div>}
    </div>
}

export default PhraseBuilder;