import Link from "./Link";

export function NP({ text }: { text: string}) {
    return <Link to="/phrase-structure/np">{text || "NP"}</Link>;
}

export function AP({ text }: { text: string}) {
    return <Link to="/phrase-structure/ap">{text || "AP"}</Link>;
}

export function VP({ text }: { text: string}) {
    return <Link to="/phrase-structure/vp">{text || "VP"}</Link>;
}

export function EP({ text }: { text: string}) {
    return <Link to="/phrase-structure/ep">{text || "EP"}</Link>;
}

export function KidsSection({ text }: { text: string}) {
    return <Link to="/phrase-structure/kids-section">{text || "kids' section"}</Link>;
}

export function MiniPronoun({ text }: { text: string}) {
    return <Link to="/pronouns/pronouns-mini">{text || "mini-pronoun"}</Link>;
}