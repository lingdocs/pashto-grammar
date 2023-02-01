import {
    Types as T,
    VPDisplay,
    VPPicker,
    vpsReducer,
} from "@lingdocs/ps-react";
import entryFeeder from "../../lib/entry-feeder";
import { useState } from "react";
import ReactGA from "react-ga";
import { isProd } from "../../lib/isProd";
import { useUser } from "../../user-context";

export function EditIcon() {
    return <i className="fas fa-edit" />;
}

// TODO: Ability to show all variations

function EditableVPEx({ children, opts, formChoice, noEdit, length, mode, sub, allVariations }: {
    children: T.VPSelectionState,
    opts: T.TextOptions,
    formChoice?: boolean,
    noEdit?: boolean,
    length?: "long" | "short",
    mode?: "text" | "blocks",
    sub?: string | JSX.Element,
    allVariations?: boolean,
}) {
    const [editing, setEditing] = useState<boolean>(false);
    const [selectedLength, setSelectedLength] = useState<"long" | "short">(length || "short");
    const [vps, setVps] = useState<T.VPSelectionState>({ ...children });
    const { user } = useUser();
    function logEdit() {
        if (isProd && !(user?.admin)) {
            ReactGA.event({
                category: "Example",
                action: `edit VPex - ${window.location.pathname}`,
                label: "edit VPex"
            });
        }
    }
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
            onClick={editing ? handleReset : () => {
                setEditing(true);
                logEdit();
            }}
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
            onlyOne={allVariations ? false : "concat"}
            setForm={handleSetForm}
            onLengthChange={setSelectedLength}
            length={allVariations ? undefined : selectedLength}
            mode={mode}
            inlineFormChoice
        />
        {sub && <div className="text-muted small">{sub}</div>}
    </div>;
}

export default EditableVPEx;