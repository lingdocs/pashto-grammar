import NPPicker from "../np-picker/NPPicker";

function ObjectDisplay({ object, onChange }: { object: Exclude<VerbObject, "none">, onChange: (o: NPSelection | undefined) => void }) {
    return (typeof object === "number")
        ? <div className="text-muted">Unspoken 3rd Pers. Masc. Plur.</div>
        : <NPPicker np={object} onChange={onChange} />;
}

export default ObjectDisplay;

