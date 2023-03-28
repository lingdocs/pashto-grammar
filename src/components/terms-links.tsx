import Link from "./Link";

export function NP({ text }: { text: string }) {
    return <Link to="/phrase-structure/np">{text || "NP"}</Link>;
}

export function Complement({ text }: { text: string }) {
    return <Link to="/phrase-structure/complement">{text || "complement"}</Link>;
}

export function AP({ text }: { text: string }) {
    return <Link to="/phrase-structure/ap">{text || "AP"}</Link>;
}

export function VP({ text }: { text: string }) {
    return <Link to="/phrase-structure/vp">{text || "VP"}</Link>;
}

export function EP({ text }: { text: string }) {
    return <Link to="/phrase-structure/ep">{text || "EP"}</Link>;
}

export function Sandwich({ text }: { text: string}) {
    return <Link to="/sandwiches/sandwiches/">{text || "sandwich"}</Link>;
}

export function KidsSection({ text }: { text: string }) {
    return <Link to="/phrase-structure/blocks-and-kids/#the-kids-section">{text || "kids' section"}</Link>;
}

export function MiniPronoun({ text }: { text: string }) {
    return <Link to="/pronouns/pronouns-mini">{text || "mini-pronoun"}</Link>;
}

export function BlockTerm({ text }: { text: string }) {
    return <Link to="/phrase-structure/blocks-and-kids/#blocks">{ text || "block"}</Link>;
}

export function PerfectiveHead({ text }: { text: string }) {
    return <Link to="/verbs/roots-and-stems/#introducing-the-perfective-head">{ text || "perfective head"}</Link>;
}

export function Camera() {
    return <i className="fas fa-camera" />;
}

export function Video() {
    return <i className="fas fa-video" />;
}

export function BlocksIcon() {
    return <i className="fas fa-cubes" />;
}

export function KingIcon() {
    return <i className="mx-1 fas fa-crown" />;
}

export function ServantIcon() {
    return <i className="mx-1 fas fa-male" />;
};

export function Servant({ text }: { text: string }) {
    return <Link to="/phrase-structure/vp/"><ServantIcon />{` `}{text || "servant"}</Link>;
}

export function King({ text }: { text: string }) {
    return <Link to="/phrase-structure/vp/"><KingIcon />{` `}{text || "king"}</Link>;
}

export function Perfective({ text }: { text: string }) {
    return <Link to="/verbs/verb-aspect/#perfective-aspect"><Camera />{` `}{text || "perfective"}</Link>;
}

export function Imperfective({ text }: { text: string }) {
    return <Link to="/verbs/verb-aspect/#imperfective-aspect"><Video />{` `}{text || "imperfective"}</Link>
}