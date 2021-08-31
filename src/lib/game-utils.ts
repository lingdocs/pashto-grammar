export function makeRandomQs<Q>(
    amount: number,
    makeQuestion: () => Q
): () => QuestionGenerator<Q> {
    function makeProgress(i: number, total: number): Progress {
        return { current: i + 1, total };
    }
    return function* () {
        for (let i = 0; i < amount; i++) {
            yield {
                progress: makeProgress(i, amount),
                question: makeQuestion(),
            };
        }
    }
}

export function getPercentageDone(progress: Progress): number {
    return Math.round(
        (progress.current / (progress.total + 1)) * 100
    );
}

export function getRandomFromList<T>(list: T[]): T {
    return list[Math.floor((Math.random()*list.length))];
}

export function makeProgress(i: number, total: number): Progress {
    return { current: i + 1, total };
}