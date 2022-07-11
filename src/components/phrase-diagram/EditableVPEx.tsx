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

function EditableVPEx({ children, opts, formChoice, noEdit, length, mode }: {
    children: T.VPSelectionState,
    opts: T.TextOptions,
    formChoice?: boolean,
    noEdit?: boolean,
    length?: "long" | "short",
    mode?: "text" | "blocks",
}) {
    const [editing, setEditing] = useState<boolean>(false);
    const [selectedLength, setSelectedLength] = useState<"long" | "short">(length || "short");
    const [vps, setVps] = useState<T.VPSelectionState>({ ...children });
    function handleReset() {
        // TODO: this is crazy, how does children get changed after calling setVps ???
        setVps(children);
        setEditing(false);
    }
    function handleSetForm(form: T.FormVersion)  {
        setVps(vpsReducer(vps, { type: "set form", payload: form }));
    }
    return <div className="mt-2 mb-4">
        {!noEdit && <div
            className="text-left clickable mb-2"
            style={{ marginBottom: editing ? "0.5rem" : "-0.5rem" }}
            onClick={editing ? handleReset : () => setEditing(true)}
        >
            {!editing ? <EditIcon /> : <i className="fas fa-undo" />}
        </div>}
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
            onLengthChange={setSelectedLength}
            length={selectedLength}
            mode={mode}
        />
    </div>;
}

export default EditableVPEx;