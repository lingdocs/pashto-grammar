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

type GameInput<T> = {
    label: string,
    studyLink: string,
    Instructions: (props: { opts?: import("@lingdocs/pashto-inflector").Types.TextOptions }) => JSX.Element,
    questions: () => QuestionGenerator<T>,
    Display: (props: QuestionDisplayProps<T>) => JSX.Element,
    timeLimit: number;
}