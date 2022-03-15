import NPPicker from "../np-picker/NPPicker";

function ObjectDisplay({ object, onChange, counterPart }: { object: Exclude<VerbObject, "none">, onChange: (o: NPSelection | undefined) => void, counterPart: NPSelection | undefined }) {
    return (typeof object === "number")
        ? <div className="text-muted">Unspoken 3rd Pers. Masc. Plur.</div>
        : <NPPicker np={object} counterPart={counterPart} onChange={onChange} />;
}

export default ObjectDisplay;

