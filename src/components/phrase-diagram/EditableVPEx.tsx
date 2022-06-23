import {
    Types as T,
    VPDisplay,
    VPPicker,
} from "@lingdocs/pashto-inflector";
import entryFeeder from "../../lib/entry-feeder";
import { useState } from "react";

export function EditIcon() {
    return <i className="fas fa-edit" />;
}

function EditableVPEx({ children, opts }: { children: T.VPSelectionState, opts: T.TextOptions }) {
    const [editing, setEditing] = useState<boolean>(false);
    const [vps, setVps] = useState<T.VPSelectionState>(children);
    function handleReset() {
        setEditing(false);
        setVps(children);
    }
    return <div className="mt-2 mb-4">
        <div
            className="text-left clickable mb-1"
            style={{ marginBottom: editing ? "0.5rem" : "-0.5rem" }}
            onClick={editing ? handleReset : () => setEditing(true)}
        >
            {!editing ? <EditIcon /> : <i className="fas fa-undo" />}
        </div>
        {editing
            && <VPPicker
                opts={opts}
                entryFeeder={entryFeeder}
                vps={vps}
                onChange={setVps}
            />
        }
        <VPDisplay
            opts={opts}
            VPS={vps}
            justify="left"
            onlyOne="concat"
            setForm="disable"
        />
    </div>;
}

export default EditableVPEx;