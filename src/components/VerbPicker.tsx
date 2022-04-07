import {
    ButtonSelect,
    Types as T,
    RootsAndStems,
    getVerbInfo,
} from "@lingdocs/pashto-inflector";
import Hider from "@lingdocs/pashto-inflector/dist/components/Hider";
import {
    makeVerbSelection,
} from "./phrase-builder/verb-selection";
import EntrySelect from "./EntrySelect";
import useStickyState from "../useStickyState";

// TODO: dark on past tense selecitons

function VerbPicker({ onChange, subject, changeSubject, verb, verbs, opts, verbLocked }: {
    verbs: VerbEntry[],
    verb: VerbSelection | undefined,
    subject: NPSelection | undefined,
    onChange: (p: VerbSelection | undefined) => void,
    changeSubject: (p: NPSelection | undefined) => void,
    opts: T.TextOptions,
    verbLocked: boolean,
}) {
    const [showRootsAndStems, setShowRootsAndStems] = useStickyState<boolean>(false, "showRootsAndStems");
    const infoRaw = verb ? getVerbInfo(verb.verb.entry, verb.verb.complement) : undefined;
    const info = (!infoRaw || !verb)
        ? undefined
        : ("stative" in infoRaw)
        ? infoRaw[verb.isCompound === "stative" ? "stative" : "dynamic"]
        : ("transitive" in infoRaw)
        ? infoRaw[verb.transitivity === "grammatically transitive" ? "grammaticallyTransitive" : "transitive"]
        : infoRaw;
    if (info && ("stative" in info || "transitive" in info)) {
        return <div>ERROR: Verb version should be select first</div>;
    }
    // const [filters, useFilters] = useState<Filters>({
    //     stative: true,
    //     dynamic: true,
    //     transitive: true,
    //     intransitive: true,
    //     grammaticallyTransitive: true,
    // });
    function onVerbSelect(v: VerbEntry | undefined) {
        // TODO: what to do when clearing
        if (!v) {
            return onChange(v);
        }
        onChange(makeVerbSelection(v, changeSubject, verb));
    }
    function onVoiceSelect(value: "active" | "passive") {
        if (verb && verb.changeVoice) {
            if (value === "passive" && (typeof verb.object === "object")) {
                changeSubject(verb.object);
            }
            if (value === "active") {
                changeSubject(undefined);
            }
            onChange(verb.changeVoice(value, value === "active" ? subject : undefined));
        }
    }
    function notInstransitive(t: "transitive" | "intransitive" | "grammatically transitive"): "transitive" | "grammatically transitive" {
        return t === "intransitive" ? "transitive" : t;
    }
    function handleChangeTransitivity(t: "transitive" | "grammatically transitive") {
        if (verb && verb.changeTransitivity) {
            onChange(verb.changeTransitivity(t));
        }
    }
    function handleChangeStatDyn(c: "stative" | "dynamic") {
        if (verb && verb.changeStatDyn) {
            onChange(verb.changeStatDyn(c));
        }
    }
    return <div className="mb-3">
        {!verbLocked && <div style={{ maxWidth: "300px", margin: "0 auto" }}>
            <div className="h5">Verb:</div>
            <EntrySelect
                entries={verbs}
                value={verb?.verb}
                onChange={onVerbSelect}
                name="Verb"
                isVerbSelect
                opts={opts}
            />
        </div>}
        {info && <div className="mt-3 mb-1 text-center">
            <Hider
                showing={showRootsAndStems}
                label="🌳 Roots and Stems"      
                handleChange={() => setShowRootsAndStems(p => !p)}
                hLevel={5}
            >
                <RootsAndStems
                    textOptions={opts}
                    info={info}
                />
            </Hider>
        </div>}
        <div className="d-flex flex-row justify-content-around flex-wrap" style={{ maxWidth: "400px", margin: "0 auto" }}>
            {verb && verb.changeTransitivity && <div className="text-center my-2">
                <ButtonSelect
                    small
                    options={[{
                        label: "gramm. trans.",
                        value: "grammatically transitive",
                    }, {
                        label: "trans.",
                        value: "transitive",
                    }]}
                    value={notInstransitive(verb.transitivity)}
                    handleChange={handleChangeTransitivity}
                />
            </div>}
            {verb && verb.changeVoice && <div className="text-center my-2">
                <ButtonSelect
                    small
                    value={verb.voice}
                    options={[{
                        label: "Active",
                        value: "active",
                    }, {
                        label: "Passive",
                        value: "passive",
                    }]}
                    handleChange={onVoiceSelect}
                />
            </div>}
            {verb && verb.changeStatDyn && <div className="text-center my-2">
                <ButtonSelect
                    small
                    options={[{
                        label: "stative",
                        value: "stative",
                    }, {
                        label: "dynamic",
                        value: "dynamic",
                    }]}
                    value={verb.isCompound ? verb.isCompound : "stative"}
                    handleChange={handleChangeStatDyn}
                />
            </div>}
        </div>
    </div>;
}


export default VerbPicker;