import { Types as T, EPDisplay, EPPicker } from "@lingdocs/ps-react";
import entryFeeder from "../../lib/entry-feeder";
import { useState } from "react";
import ReactGA from "react-ga4";
import { isProd } from "../../lib/isProd";
import { useUser } from "../../user-context";

export function EditIcon() {
  return <i className="fas fa-edit" />;
}

function EditableEPEx({
  children,
  opts,
  hideOmitSubject,
  noEdit,
}: {
  children: T.EPSelectionState;
  opts: T.TextOptions;
  hideOmitSubject?: boolean;
  noEdit?: boolean;
}) {
  const [editing, setEditing] = useState<boolean>(false);
  const [eps, setEps] = useState<T.EPSelectionState>(children);
  const { user } = useUser();
  function handleReset() {
    setEditing(false);
    setEps(children);
  }
  function logEdit() {
    if (isProd && !user?.admin) {
      ReactGA.event({
        category: "Example",
        action: `edit EPex - ${window.location.pathname}`,
        label: "edit EPex",
      });
    }
  }
  return (
    <div className="mt-2 mb-4">
      {!noEdit && (
        <div
          className="text-left clickable"
          style={{ marginBottom: editing ? "0.5rem" : "-0.5rem" }}
          onClick={
            editing
              ? handleReset
              : () => {
                  setEditing(true);
                  logEdit();
                }
          }
        >
          {!editing ? <EditIcon /> : <i className="fas fa-undo" />}
        </div>
      )}
      {editing && (
        <EPPicker
          opts={opts}
          entryFeeder={entryFeeder}
          eps={eps}
          onChange={setEps}
        />
      )}
      <EPDisplay
        opts={opts}
        eps={eps}
        setOmitSubject={
          hideOmitSubject
            ? false
            : (value) =>
                setEps((o) => ({
                  ...o,
                  omitSubject: value === "true",
                }))
        }
        justify="left"
        onlyOne
      />
    </div>
  );
}

export default EditableEPEx;
