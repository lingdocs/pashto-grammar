// TODO: DEPRECATE THIS AND USE THE PASHTO INFLECTER NP PRONOUN PICKER!

import {
    Types as T,
    ButtonSelect,
    useStickyState,
} from "@lingdocs/ps-react";

const gColors = {
    masc: "LightSkyBlue",
    fem: "pink",
};

const labels = {
    persons: [
        ["1st", "1st pl."],
        ["2nd", "2nd pl."],
        ["3rd", "3rd pl."],
    ],
    e: [
        ["I", "We"],
        ["You", "You pl."],
        [{ masc: "He/It", fem: "She/It"}, "They"],
    ],
    eObject: [
        ["I", "us"],
        ["you", "you (pl.)"],
        [{ masc: "him/it", fem: "her/it"}, "them"],
    ],
    p: {
        far: [
            ["زه", "مونږ"],
            ["ته", "تاسو"],
            ["هغه", "هغوي"],
        ],
        near: [
            ["زه", "مونږ"],
            ["ته", "تاسو"],
            [{ masc: "دی", fem: "دا" }, "دوي"],
        ],
    },
};


type PickerState = { row: number, col: number, gender: T.Gender };

function personToPickerState(person: T.Person): PickerState {
    const col = person > 5 ? 1 : 0;
    const row = Math.floor((person > 5 ? (person - 6) : person) / 2);
    const gender: T.Gender = (person % 2) ? "fem" : "masc";
    return { col, row, gender };
}

function pickerStateToPerson(s: PickerState): T.Person {
    return (s.row * 2)
        + (s.gender === "masc" ? 0 : 1)
        + (6 * s.col);
}

function PronounPicker({ onChange, pronoun, isObject }: {
    pronoun: Pronoun,
    onChange: (p: Pronoun) => void,
    isObject?: boolean,
}) {
    const [display, setDisplay] = useStickyState<"persons" | "p" | "e">("persons", "prounoun-picker-display"); 

    const p = personToPickerState(pronoun.person);
    function handleClick(row: number, col: number) {
        onChange({
            ...pronoun,
            person: pickerStateToPerson({
                ...p,
                row,
                col,
            }),
        });
    }
    function handleGenderChange(gender: T.Gender) {
        onChange({
            ...pronoun,
            person: pickerStateToPerson({
                ...p,
                gender,
            }),
        });
    }
    function handlePronounTypeChange(pronounType: "far" | "near") {
        onChange({
            ...pronoun,
            pronounType,
        });
    }
    function handleDisplayChange() {
        const newPerson = display === "persons"
            ? "p"
            : display === "p"
            ? "e"
            : "persons";
        setDisplay(newPerson);
    }
    const prs = labels[(display === "e" && isObject) ? "eObject" : display];
    const pSpec = "near" in prs ? prs[pronoun.pronounType] : prs;
    return <div>
        <div className="d-flex flex-row justify-content-around mb-3">
            <ButtonSelect
                xSmall
                options={[
                    { label: "Far", value: "far" },
                    { label: "Near", value: "near" },
                ]}
                value={pronoun.pronounType}
                handleChange={(g) => handlePronounTypeChange(g as "far" | "near")}
            />
            <button className="btn btn-sm btn-outline-secondary" onClick={handleDisplayChange}>{display === "persons" ? "#" : display === "p" ? "PS" : "EN"}</button>
        </div>
        <table className="table table-bordered" style={{ textAlign: "center", minWidth: "125px", tableLayout: "fixed" }}>
            <tbody>
                {pSpec.map((rw, i) => (
                    <tr>
                        {rw.map((r, j) => {
                            const active = (p.row === i && p.col === j)
                            return <td
                                onClick={() => handleClick(i, j)}
                                className={active ? "table-active" : ""}
                                style={active ? { backgroundColor: gColors[p.gender] } : {}}
                            >
                                {typeof r === "string" ? r : r[p.gender]}
                            </td>;
                        })}
                    </tr>
                ))}
            </tbody>
        </table>
        <div className="text-center">
            <ButtonSelect
                options={[
                    { label: "Masc.", value: "masc", color: gColors.masc },
                    { label: "Fem.", value: "fem", color: gColors.fem },
                ]}
                value={p.gender}
                handleChange={(g) => handleGenderChange(g as T.Gender)}
            />
        </div>
   </div>;
};

export default PronounPicker;
