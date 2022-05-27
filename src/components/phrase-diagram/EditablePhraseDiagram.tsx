import {
    Types as T,
    NPPicker,
    APPicker,
} from "@lingdocs/pashto-inflector";
import {
    useEffect,
    useRef,
} from "react";
import { useState } from "react";
import PhraseDiagram from "./PhraseDiagram";
import entryFeeder from "../../lib/entry-feeder";
import autoAnimate from "@formkit/auto-animate";

export function EditIcon() {
    return <i className="fas fa-edit" />;
}

function EditablePhraseDiagram({ opts, children }: {
    opts: T.TextOptions,
    children: BlockInput[],
}) {
    const block = children[0];
    const parent = useRef<HTMLDivElement>(null);
    useEffect(() => {
        parent.current && autoAnimate(parent.current)
    }, [parent]);
    const [editing, setEditing] = useState<boolean>(false);
    const [edited, setEdited] = useState<{
        type: "NP",
        block: T.NPSelection | undefined,
    } | {
        type: "AP",
        block: T.APSelection | undefined,
    }>(block);
    console.log({ block });
    if (children.length === 0) return null;
    function handleNPChange(np: T.NPSelection | undefined) {
        setEdited({ type: "NP", block: np });
    }
    function handleAPChange(ap: T.APSelection | undefined) {
        setEdited({ type: "AP", block: ap });
    }
    function handleReset() {
        setEdited(block);
        setEditing(false);
    }
    return <div>
        <div
            className="text-right clickable"
            onClick={editing ? handleReset : () => setEditing(true)}
        >
            {!editing ? <EditIcon /> : <i className="fas fa-undo" />}
        </div>
        <div ref={parent} className="d-flex flex-column align-items-center">
            {editing && <div style={{ maxWidth: "225px", marginBottom: "2rem" }}>
                {edited.type === "NP"
                    ? <NPPicker
                        opts={opts}
                        np={edited.block}
                        onChange={handleNPChange}
                        entryFeeder={entryFeeder}
                        role="subject"
                        counterPart={undefined}
                        phraseIsComplete={false}
                    />
                    : <APPicker
                        opts={opts}
                        AP={edited.block}
                        onChange={handleAPChange}
                        entryFeeder={entryFeeder}
                        phraseIsComplete={false}
                        onRemove={() => null}
                    />
                }
            </div>}
            {edited.block
                && <PhraseDiagram opts={opts}>
                    {[edited] as BlockInput[]}
                </PhraseDiagram>}
        </div>
    </div>;
}

export default EditablePhraseDiagram;