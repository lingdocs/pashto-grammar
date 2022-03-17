import {
    Types as T,
    concatPsString,
    removeAccents,
} from "@lingdocs/pashto-inflector";

export function compileVP(VP: VPRendered): { ps: T.SingleOrLengthOpts<T.PsString[]>, e?: string [] } {
    console.log(VP);
    const { head, rest } = VP.verb.ps;
    const subj = VP.subject.ps;
    const obj = typeof VP.object === "object" ? VP.object.ps : undefined;
    // better: feed in array of NPs [subj, obj, etc...]
    return {
        ps: arrangePs(subj, obj, head, rest, VP.verb.negative),
        e: compileEnglish(VP),
    };
}

function arrangePs(
    subj: T.PsString[],
    obj: T.PsString[] | undefined,
    head: T.PsString | undefined,
    rest: T.PsString[],
    negative: boolean,
): T.PsString[];
function arrangePs(
    subj: T.PsString[],
    obj: T.PsString[] | undefined,
    head: T.PsString | undefined,
    rest: T.SingleOrLengthOpts<T.PsString[]>,
    negative: boolean,
): T.SingleOrLengthOpts<T.PsString[]>;
function arrangePs(
    subj: T.PsString[],
    obj: T.PsString[] | undefined,
    head: T.PsString | undefined,
    rest: T.SingleOrLengthOpts<T.PsString[]>,
    negative: boolean,
): T.SingleOrLengthOpts<T.PsString[]> {
    if ("long" in rest) {
        return {
            long: arrangePs(subj, obj, head, rest.long, negative),
            short: arrangePs(subj, obj, head, rest.short, negative),
            ...rest.mini ? {
                mini: arrangePs(subj, obj, head, rest.mini, negative),
            } : {},
        };
    }
    const verbWNeg = arrangeVerbWNeg(head, rest, negative);
    if (obj) {
        return subj.flatMap(s => (
            obj.flatMap(o => 
                verbWNeg.flatMap(v => (
                    concatPsString(s, " ", o, " ", v)
                    // concatPsString(o, " ", s, " ", v),
                ))
            ))
        );
    }
    return subj.flatMap(s => (
        verbWNeg.flatMap(v => (
            concatPsString(s, " ", v)
        ))
    ));
}

function arrangeVerbWNeg(head: T.PsString | undefined, rest: T.PsString[], negative: boolean): T.PsString[] {
    if (!negative) {
        return rest.map(ps => concatPsString(head || "", ps));
    }

    const nu: T.PsString = { p: "نه", f: "nú" };
    if (!head) {
        return rest.map(r => concatPsString(nu, " ", removeAccents(r)));
    }
    const regularPrefix = head.p === "و" || head.p === "وا";
    const withNuAfterHead = rest.map(r => concatPsString(
        removeAccents(head),
        { p: "", f: "-" },
        nu,
        " ",
        removeAccents(r),
    ));
    if (regularPrefix) {
        return withNuAfterHead;
    }
    const withNuBeforeHead = rest.map(r => concatPsString(
        nu,
        " ",
        removeAccents(head),
        removeAccents(r),
    ));
    return [
        ...withNuAfterHead,
        ...withNuBeforeHead,
    ];
}

function compileEnglish(VP: VPRendered): string[] | undefined {
    function insertEWords(e: string, { subject, object }: { subject: string, object?: string }): string {
        return e.replace("$SUBJ", subject).replace("$OBJ", object || "");
    }
    const engSubj = VP.subject.e || undefined;
    const engObj = (typeof VP.object === "object" && VP.object.e) ? VP.object.e : undefined;
    // require all English parts for making the English phrase
    return (VP.englishBase && engSubj && engObj) ? VP.englishBase.map(e => insertEWords(e, {
        subject: engSubj,
        object: engObj,
    })) : undefined;
}