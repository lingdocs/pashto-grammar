type Progress = {
    total: number,
    current: number,
};

type Current<T> = {
    progress: Progress,
    question: T,
};

type QuestionGenerator<T> = Generator<Current<T>, void, unknown>;

type QuestionDisplayProps<T> = {
    question: T,
    callback: (correct: boolean) => void,
};

type GameRecord = {
    title: string,
    id: string,
    studyLink: string,
    Game: () => JSX.Element,
};