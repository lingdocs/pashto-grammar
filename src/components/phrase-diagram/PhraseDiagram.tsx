import {
    renderNPSelection,
    Types as T,
    getEnglishFromRendered,
    renderAPSelection,
} from "@lingdocs/pashto-inflector";
import classNames from "classnames";

function PhraseDiagram({ opts, children }: {
    opts: T.TextOptions,
    children: BlockInput[]
}) {
    return <div>
         <div className="d-flex flex-row justify-content-center" style={{ maxWidth: "100%" }}>
            {children.map((block) => (
                <Block key={Math.random()} opts={opts}>{block}</Block>
            ))}
        </div>
    </div>;
}

function Block({ opts, children }: {
    opts: T.TextOptions,
    children: BlockInput,
}) {
    if (children.type === "NP") {
        const rendered = renderNPSelection(children.block, false, false, "subject", "none");
        const english = getEnglishFromRendered(rendered)
        return <div className="text-center mb-2">
            <NP opts={opts} english={english}>{rendered}</NP>
        </div>;
    }
    const rendered = renderAPSelection(children.block);
    const english = getEnglishFromRendered(rendered)
    return <div className="text-center mb-2">
        <AP opts={opts} english={english}>{rendered}</AP>
    </div>;
}

function AP({ opts, children, english }: {
    opts: T.TextOptions,
    children: T.Rendered<T.APSelection>,
    english?: string,
}) {
    const ap = children;
    if (ap.type === "adverb") {
        return <div>
            <div 
                className={classNames("d-flex flex-row justify-content-center align-items-center")}
                style={{
                    border: "2px solid black",
                    padding: "1rem",
                    textAlign: "center",
                }}
            >
                {ap.ps[0].f}
            </div>
            <div>AP</div>
            {english && <div className="small text-muted text-center" style={{
                // TODO: find a better way to keep this limited to the width of the div above
                // don't let this make the div above expand
                margin: "0 auto",
                maxWidth: "300px",
            }}>{english}</div>}
        </div>;
    }
    return <div>
        <div className="text-center">Sandwich 🥪</div>
        <div 
            className={classNames("d-flex flex-row justify-content-center align-items-center")}
            style={{
                border: "2px solid black",
                padding: "0.75rem 0.5rem 0.25rem 0.5rem",
                textAlign: "center",
            }}
        >
            <div className="d-flex flex-row justify-content-between align-items-end">
                <Possesors opts={opts}>{ap.inside.type !== "pronoun" ? ap.inside.possesor : undefined}</Possesors>
                <div className="mr-2 ml-1 mb-1"><strong>{ap.before ? ap.before.f : ""}</strong></div>
                <div>
                    <NP opts={opts} inside>{ap.inside}</NP>
                </div>
                <div className="ml-2 mr-1 mb-1"><strong>{ap.after ? ap.after.f : ""}</strong></div>
            </div>
        </div>
        <div>AP</div>
        {english && <div className="small text-muted text-center" style={{
            // TODO: find a better way to keep this limited to the width of the div above
            // don't let this make the div above expand
            margin: "0 auto",
            maxWidth: "300px",
        }}>{english}</div>}
    </div>;
}

function NP({ opts, children, inside, english }: {
    opts: T.TextOptions,
    children: T.Rendered<T.NPSelection>,
    inside?: boolean,
    english?: string,
}) {
    const np = children;
    const hasPossesor = !!(np.type !== "pronoun" && np.possesor);
    return <div>
        <div 
            className={classNames("d-flex flex-row justify-content-center align-items-center", { "pt-2": !inside && hasPossesor })}
            style={{
                border: "2px solid black",
                padding: inside ? "0.3rem" : hasPossesor ? "0.5rem 1rem 0.25rem 1rem" : "1rem",
                textAlign: "center",
            }}
        >
            {!inside && <Possesors opts={opts}>{np.type !== "pronoun" ? np.possesor : undefined}</Possesors>}
            <Adjectives opts={opts}>{np.adjectives}</Adjectives>
            <div> {np.ps[0].f}</div>
        </div>
        <div className={inside ? "small" : ""}>NP</div>
        {english && <div className="small text-muted text-center" style={{
            // TODO: find a better way to keep this limited to the width of the div above
            // don't let this make the div above expand
            margin: "0 auto",
            maxWidth: "300px",
        }}>{english}</div>}
    </div>
}

function Possesors({ opts, children }: {
    opts: T.TextOptions,
    children: { shrunken: boolean, np: T.Rendered<T.NPSelection> } | undefined,
}) {
    if (!children) {
        return null;
    }
    const contraction = checkForContraction(children.np);
    return <div className="d-flex flex-row mr-1 align-items-end" style={{
        marginBottom: "0.5rem",
        borderBottom: "1px solid grey",
    }}>
        {children.np.type !== "pronoun" && <Possesors opts={opts}>{children.np.possesor}</Possesors>}
        <div>
            {contraction && <div className="mb-1">({contraction})</div>}
            <div className={classNames("d-flex", "flex-row", "align-items-center", { "text-muted": contraction })}> 
                <div className="mr-1 pb-2">du</div>
                <div>
                    <NP opts={opts} inside>{children.np}</NP>
                </div>
            </div>

        </div>
    </div>
}

function checkForContraction(np: T.Rendered<T.NPSelection>): string | undefined {
    if (np.type !== "pronoun") return undefined;
    if (np.person === T.Person.FirstSingMale || np.person === T.Person.FirstSingFemale) {
        return "zmaa"
    }
    if (np.person === T.Person.SecondSingMale || np.person === T.Person.SecondSingFemale) {
        return "staa"
    }
    if (np.person === T.Person.FirstPlurMale || np.person === T.Person.FirstPlurFemale) {
        return "zmoonG"
    }
    if (np.person === T.Person.SecondPlurMale || np.person === T.Person.SecondPlurFemale) {
        return "staaso"
    }
    return undefined;
}

function Adjectives({ opts, children }: {
    opts: T.TextOptions,
    children: T.Rendered<T.AdjectiveSelection>[] | undefined,
}) {
    if (!children) {
        return null;
    }
    return <em className="mr-1">
        {children.map(a => a.ps[0].f).join(" ")}{` `}
    </em>
}

export default PhraseDiagram;