import {
    Types as T,
    EPDisplay,
    EPPicker,
} from "@lingdocs/pashto-inflector";
import entryFeeder from "../../lib/entry-feeder";
import { useState } from "react";


export function EditIcon() {
    return <i className="fas fa-edit" />;
}

function EditableEPEx({ children, opts }: { children: T.EPSelectionState, opts: T.TextOptions }) {
    const [editing, setEditing] = useState<boolean>(false);
    const [eps, setEps] = useState<T.EPSelectionState>(children);
    function handleReset() {
        setEditing(false);
        setEps(children);
    }
    return <div className="mt-2 mb-4">
        <div
            className="text-left clickable"
            style={{ marginBottom: editing ? "0.5rem" : "-0.5rem" }}
            onClick={editing ? handleReset : () => setEditing(true)}
        >
            {!editing ? <EditIcon /> : <i className="fas fa-undo" />}
        </div>
        {editing
            && <EPPicker
                opts={opts}
                entryFeeder={entryFeeder}
                eps={eps}
                onChange={setEps}
            />}
        <EPDisplay
            opts={opts}
            eps={eps}
            setOmitSubject={false}
            justify="left"
            onlyOne
        />
    </div>;
}

export default EditableEPEx;