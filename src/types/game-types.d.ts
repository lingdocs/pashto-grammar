type Progress = {
    total: number,
    current: number,
};

type GameSubCore<T> = (props: {
    inChapter: boolean,
    id: string,
    level: T,
    link: string;
}) => JSX.Element;

type QuestionDisplayProps<T> = {
    question: T,
    callback: (correct: boolean) => void,
};

type GameRecord = {
    title: string,
    id: string,
    Game: (props: { inChapter: boolean }) => JSX.Element,
};
