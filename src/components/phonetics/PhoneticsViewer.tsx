import React from "react";
import classNames from "classnames";
import highlightExample from "./highlight-example";
import {
  phonemes,
  Phoneme,
  PhonemeExample,
} from "./phonemes";
import playAudio from "../../lib/play-audio";
import views from "./views";

export type ViewOptions = "all" | "shortVowel" | "longVowel" | "fiveYs" | "specialConsonant";

interface IAppState {
  view: ViewOptions;
}

class PhoneticsViewer extends React.Component<any, IAppState> {
  constructor(props: any) {
    super(props);
    this.state = {
      view: "all",
    };
  }

  render() {
    const phonemesShowing =
      this.state.view === "all"
        ? phonemes
        // @ts-ignore
        : phonemes.filter((p) => p[this.state.view]);
    const selectedOption = views.find((v) => v.value === this.state.view);
    const generatePlayerFunction = (item: Phoneme | PhonemeExample) => {
      if ("phoneme" in item && item.a) {
        return () => { playAudio(item.a || ""); };
      }
      if ("f" in item && item.a) {
                                 // dumb typescript
        return () => { playAudio(item.a || ""); };
      }
      return () => null;
    }
    return <>
      <div className="text-center mt-4">
        <div className="btn-group mb-3">
          {views.map(({ label, value }) => (
            <button
              key={value}
              type="button"
              className={classNames("btn", "btn-outline-secondary", {
                active: this.state.view === value,
              })}
              onClick={() => this.setState({ view: value })}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="small mb-2"><i className="fas fa-volume-down"></i> click the phonetic letter or examples to hear - not all sounds are available</div>
      </div>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Phonetic Letter</th>
            {/* <th>IPA Letter</th> */}
            <th>Short Explanation</th>
            <th>Example</th>
            <th>Pashto Letter(s)</th>
          </tr>
        </thead>
        <tbody>
          {phonemesShowing.map((phoneme) => (
            <tr key={phoneme.phoneme}>
              <td onClick={generatePlayerFunction(phoneme)}>
                {phoneme.phoneme}
              </td>
              {/* <td>{phoneme.ipa.letter} </td> */}
              <td>
                {phoneme.quickExplanation}{" "}
                {phoneme.ipa.video && (
                  <a href={phoneme.ipa.video} target="_blank" rel="noopener noreferrer">
                    <i className="fa fa-video" />
                  </a>
                )}
              </td>
              <td onClick={generatePlayerFunction(phoneme.examples[0])}>
                {highlightExample(
                  phoneme.examples[0].f,
                  phoneme.examples[0].fHighlight
                )}
                {` - `}
                {highlightExample(
                  phoneme.examples[0].p,
                  phoneme.examples[0].pHighlight
                )}
              </td>
              <td>
                {phoneme.possibleLetters
                  ? phoneme.possibleLetters.reduce(
                      (s, l) =>
                        `${s}${l.letter}  ${
                          l.alternate ? ` (${l.alternate}) ` : ""
                        }`,
                      ""
                    )
                  : ""}
                {/* phoneme.diacritic && `(diacritic ◌${phoneme.diacritic})` */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedOption?.notes && <div>
        <p><strong>Notes about {selectedOption.label.toLowerCase()}:</strong></p>
        {selectedOption.notes}
      </div>}
    </>;
  }
}

export default PhoneticsViewer;
