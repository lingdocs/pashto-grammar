import {
    Types as T,
} from "@lingdocs/pashto-inflector";
import { useState } from "react";
import PhraseDiagram from "./PhraseDiagram";
import NPPlayground from "../NPPlayground";

export function EditIcon() {
    return <i className="fas fa-edit" />;
}

function EditablePhraseDiagram({ opts, children }: {
    opts: T.TextOptions,
    children: BlockInput[],
}) {
    const np = children[0].block;
    const [editing, setEditing] = useState<boolean>(false);
    if (children.length === 0) return null;
    return <div>
        <div className="text-right clickable" onClick={() => setEditing(e => !e)}>
            {!editing ? <EditIcon /> : <i className="fas fa-undo" />}
        </div>
        <div>
            {editing
                ? <NPPlayground opts={opts} npIn={np} />
                : <PhraseDiagram opts={opts}>{[
                    { type: "NP", block: np },
                ]}</PhraseDiagram>}
        </div>
    </div>;
}

export default EditablePhraseDiagram;