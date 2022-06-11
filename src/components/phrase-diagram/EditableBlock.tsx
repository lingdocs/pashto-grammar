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
import BlockDiagram from "./BlockDiagram";
import entryFeeder from "../../lib/entry-feeder";
import autoAnimate from "@formkit/auto-animate";

export function EditIcon() {
    return <i className="fas fa-edit" />;
}

function selectionToBlock(s: T.NPSelection | T.APSelection): { type: "NP", block: T.NPSelection | undefined } | { type: "AP", block: T.APSelection | undefined } {
    return (s.type === "AP")
        ? { type: "AP", block: s }
        : { type: "NP", block: s };
}

function EditableBlock({ opts, children: block }: {
    opts: T.TextOptions,
    children: T.NPSelection | T.APSelection,
}) {
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
    }>(selectionToBlock(block));
    function handleNPChange(np: T.NPSelection | undefined) {
        setEdited({ type: "NP", block: np });
    }
    function handleAPChange(ap: T.APSelection | undefined) {
        setEdited({ type: "AP", block: ap });
    }
    function handleReset() {
        setEdited(selectionToBlock(block));
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
                && <BlockDiagram opts={opts}>
                    {edited.block}
                </BlockDiagram>}
        </div>
    </div>;
}

export default EditableBlock;