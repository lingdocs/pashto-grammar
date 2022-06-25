import {
    Types as T,
    VPDisplay,
    VPPicker,
    vpsReducer,
} from "@lingdocs/pashto-inflector";
import entryFeeder from "../../lib/entry-feeder";
import { useState } from "react";

export function EditIcon() {
    return <i className="fas fa-edit" />;
}

function EditableVPEx({ children, opts, formChoice }: { children: T.VPSelectionState, opts: T.TextOptions, formChoice?: boolean }) {
    const [editing, setEditing] = useState<boolean>(false);
    const [vps, setVps] = useState<T.VPSelectionState>(children);
    function handleReset() {
        setEditing(false);
        setVps(children);
    }
    function handleSetForm(form: T.FormVersion)  {
        setVps(vpsReducer(vps, { type: "set form", payload: form }));
    }
    return <div className="mt-2 mb-4">
        <div
            className="text-left clickable mb-2"
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
            setForm={formChoice ? handleSetForm : "disable"}
        />
    </div>;
}

export default EditableVPEx;