type Progress = {
    total: number,
    current: number,
};

type Current<T> = {
    progress: Progress,
    question: T,
};

type GameSubCore<T> = (props: {
    inChapter: boolean,
    id: string,
    level: T,
    link: string;
}) => JSX.Element;

type QuestionGenerator<T> = Generator<Current<T>, void, unknown>;

type QuestionDisplayProps<T> = {
    question: T,
    callback: (correct: true | JSX.Element) => void,
};

type GameRecord = {
    title: string,
    id: string,
    Game: (props: { inChapter: boolean }) => JSX.Element,
};
