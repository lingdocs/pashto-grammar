import GameCore from "../GameCore";
import type { JSX } from "react";
import type { Types as T } from "@lingdocs/ps-react";
import {
  randFromArray,
  removeAccents,
} from "@lingdocs/ps-react";
import minimalPairs from "../../content/writing/minimal-pairs";
import { makePool } from "../../lib/pool";
import { useEffect, useRef } from "react";
import type { MinimalPairsSection } from "../../content/writing/minimal-pairs-type";

// is it removing from the pool properly ? or is it a problem with strict mode doing double?

const amount = 20;
type EntryWF = { f: string; entry: T.DictionaryEntry };
type MinimalPair = [EntryWF, EntryWF];
type Question = {
  pair: MinimalPair;
  selected: 0 | 1;
};

export default function MinimalPairsGame({
  level,
  id,
  link,
  inChapter,
}: {
  inChapter: boolean;
  level: MinimalPairsSection;
  id: string;
  link: string;
}) {
  const getPair = makePool<MinimalPair>(
    // @ts-ignore
    minimalPairs.find((x) => x.title === level)?.pairs || []
  );
  function getQuestion(): Question {
    const pair = getPair();
    const selected: 0 | 1 = randFromArray([0, 1]);
    return { pair, selected };
  }
  function Display({ question, callback }: QuestionDisplayProps<Question>) {
    const audioRef = useRef<HTMLAudioElement>(null);
    useEffect(() => {
      if (audioRef && audioRef.current) {
        audioRef.current.play();
      }
    }, [question]);
    const selected = getSelected(question);
    const audioSrc = getAudioSrc(selected);
    function playAudio() {
      if (audioRef && audioRef.current) {
        audioRef.current.play();
      }
    }
    function check(guess: 0 | 1) {
      return () => callback(question.selected === guess);
    }
    return (
      <div>
        <audio
          src={audioSrc}
          ref={audioRef}
        />
        <div>
          <button className="btn btn-lg btn-primary mt-3" onClick={playAudio}>
            <i className="fas fa-play" />
          </button>
        </div>
        <PairButtons
          renderButton={(n) => (
            <WordButton
              entry={question.pair[n]}
              handleClick={check(n)}
              type="guess"
              hideAccents={true}
            />
          )}
        />
      </div>
    );
  }

  function Instructions() {
    return (
      <div>
        <h5>Listen and identify the correct word in a minimal pair</h5>
      </div>
    );
  }

  function DisplayCorrectAnswer({ question }: { question: Question }) {
    const audioRef0 = useRef<HTMLAudioElement>(null);
    const audioRef1 = useRef<HTMLAudioElement>(null);
    const [audioSrc0, audioSrc1] = question.pair.map(getAudioSrc);
    const playAudio = (n: 0 | 1) => () => {
      const audio = n === 0 ? audioRef0 : audioRef1;
      audio.current?.play();
    };
    return (
      <div>
        <audio
          src={audioSrc0}
          ref={audioRef0}
          preload="auto"
        />
        <audio
          src={audioSrc1}
          ref={audioRef1}
          preload="auto"
        />
        <PairButtons
          renderButton={(n) => (
            <WordButton
              entry={question.pair[n]}
              handleClick={playAudio(n)}
              key={`answer-${n}`}
              type={question.selected === n ? "correct" : "incorrect"}
              hideAccents={false}
            />
          )}
        />
      </div>
    );
  }

  return (
    <GameCore
      inChapter={inChapter}
      studyLink={link}
      getQuestion={getQuestion}
      id={id}
      Display={Display}
      DisplayCorrectAnswer={DisplayCorrectAnswer}
      amount={amount}
      timeLimit={90}
      Instructions={Instructions}
    />
  );
}

function PairButtons({
  renderButton,
}: {
  renderButton: (n: 0 | 1) => JSX.Element;
}) {
  return (
    <div
      className="mt-4 d-flex justify-content-center"
      style={{ margin: "0 auto", gap: "2.5rem" }}
    >
      {([0, 1] as const).map(renderButton)}
    </div>
  );
}

function WordButton({
  entry,
  handleClick,
  type,
  hideAccents,
}: {
  entry: EntryWF;
  handleClick: () => void;
  type: "guess" | "correct" | "incorrect";
  hideAccents: boolean;
}) {
  const btnColor =
    type === "guess" ? "light" : type === "correct" ? "success" : "danger";
  return (
    <button
      className={`btn btn-lg btn-${btnColor} mr-3`}
      style={{ minWidth: "8rem" }}
      onClick={handleClick}
    >
      <div className="d-flex justify-content-around">
        {type === "guess" ? null : (
          <div className="mr-3 d-flex flex-column justify-content-around">
            <i className={`fas fa-${type === "correct" ? "check" : "times"}`} />
            <i className="fas fa-play" />
          </div>
        )}
        <div>
          <div>{hideAccents ? removeAccents(entry.f) : entry.f}</div>
          <div>{entry.entry.p}</div>
        </div>
      </div>
    </button>
  );
}

function getAudioSrc(entry: EntryWF): string {
  const tag = entry.entry.a === 1 ? "" : "f";
  return `https://storage.lingdocs.com/audio/${entry.entry.ts}${tag}.mp3`;
}

function getSelected(question: Question): {
  f: string;
  entry: T.DictionaryEntry;
} {
  return question.pair[question.selected];
}
