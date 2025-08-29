import { useState } from "react";
import {
  ButtonSelect,
} from "@lingdocs/pashto-inflector";

export function EquativeIllustration() {
  const [choice, setChoice] = useState<"p" | "f" | "e">("f");
  return (
    <div>
      <div className="text-center my-3">
        <ButtonSelect
          options={[
            { label: "Phonetics", value: "f" },
            { label: "Pashto", value: "p" },
            { label: "English", value: "e" },
          ]}
          value={choice}
          handleChange={(p) => setChoice(p)}
        />
      </div>
      {choice === "f" ?
        <div className="d-flex justify-content-around mx-auto mb-3" style={{ maxWidth: "400px" }}>
          <div className="text-center p-2">
            <div className="display-3">A</div>
            <div>subject</div>
            <div className="h4 mt-3">zu</div>
            <div className="h4 mt-3">haghá</div>
            <div className="h4 mt-3">moonG</div>
          </div>
          <div className="text-center p-2">
            <div className="display-3">B</div>
            <div>predicate</div>
            <div className="h4 mt-3">stuRey</div>
            <div className="h4 mt-3">dălta</div>
            <div className="h4 mt-3">zdakawóonkee</div>
          </div>
          <div className="text-center p-2" style={{ border: "1px solid black", borderRadius: "10px" }}>
            <div className="display-3">=</div>
            <div>equative</div>
            <div className="h4 mt-3">yum.</div>
            <div className="h4 mt-3">dey.</div>
            <div className="h4 mt-3">yoo.</div>
          </div>
        </div>
        : choice === "p" ?
          <div className="d-flex justify-content-around mx-auto mb-3" style={{ direction: "rtl", maxWidth: "400px" }}>
            <div className="text-center p-2">
              <div className="display-3">ا</div>
              <div>subject</div>
              <div className="h4 mt-3">زه</div>
              <div className="h4 mt-3">هغه</div>
              <div className="h4 mt-3">مونږ</div>
            </div>
            <div className="text-center p-2">
              <div className="display-3">ب</div>
              <div>predicate</div>
              <div className="h4 mt-3">ستړی</div>
              <div className="h4 mt-3">دلته</div>
              <div className="h4 mt-3">زدکوونکي</div>
            </div>
            <div className="text-center p-2" style={{ border: "1px solid black", borderRadius: "10px" }}>
              <div className="display-3">=</div>
              <div>equative</div>
              <div className="h4 mt-3">یم.</div>
              <div className="h4 mt-3">دی.</div>
              <div className="h4 mt-3">یو.</div>
            </div>
          </div>
          : <div className="d-flex justify-content-around mx-auto mb-3" style={{ maxWidth: "400px" }}>
            <div className="text-center p-2">
              <div className="display-3">A</div>
              <div>subject</div>
              <div className="h4 mt-3">I</div>
              <div className="h4 mt-3">He</div>
              <div className="h4 mt-3">We</div>
            </div>
            <div className="text-center p-2" style={{ border: "1px solid black", borderRadius: "10px" }}>
              <div className="display-3">=</div>
              <div>equative</div>
              <div className="h4 mt-3">am</div>
              <div className="h4 mt-3">is</div>
              <div className="h4 mt-3">are</div>
            </div>
            <div className="text-center p-2">
              <div className="display-3">B</div>
              <div>predicate</div>
              <div className="h4 mt-3">tired.</div>
              <div className="h4 mt-3">here.</div>
              <div className="h4 mt-3">students.</div>
            </div>
          </div>}
    </div>
  );
};

export default EquativeIllustration;

