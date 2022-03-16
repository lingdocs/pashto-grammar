import {
    Types as T,
    concatPsString,
} from "@lingdocs/pashto-inflector";

const nu: T.PsString = { p: "نه", f: "nu" };

export function compileVP(VP: VPRendered): { ps: T.SingleOrLengthOpts<T.PsString[]>, e?: string [] } {
    function insertEWords(e: string, { subject, object }: { subject: string, object?: string }): string {
        return e.replace("$SUBJ", subject).replace("$OBJ", object || "");
    }
    // TODO: display of short and long options etc.
    const vPs = "long" in VP.verb.ps ? VP.verb.ps.long : VP.verb.ps;
    const engSubj = VP.subject.e || undefined;
    const engObj = (typeof VP.object === "object" && VP.object.e) ? VP.object.e : undefined;
    // require all English parts for making the English phrase
    const e = (VP.englishBase && engSubj && engObj) ? VP.englishBase.map(e => insertEWords(e, {
        subject: engSubj,
        object: engObj,
    })) : undefined;
    const obj = typeof VP.object === "object" ? VP.object : undefined;
    const ps = VP.subject.ps.flatMap(s => (
        obj ? obj.ps.flatMap(o => (
            vPs.flatMap(v => (
                VP.verb.negative
                    // this will not work yet for perfectives etc - super rough start
                    ? concatPsString(s, " ", o, " ", nu, " ", v)
                    : concatPsString(s, " ", o, " ", v)
            ))
        )) : vPs.flatMap(v => (
            VP.verb.negative
                ? concatPsString(s, " ", nu, " ", v)
                : concatPsString(s, " ", v)
        ))
    ));
    return { ps, e };
}