function KidsSectionIllustration({ blocks, showKidsSection }: {
    blocks: ("NP" | "AP" | "comp." | "verb" | "equative")[],
    showKidsSection?: boolean,
}) {
    return <div className="d-flex flex-row justify-content-center">
        <div>
            {showKidsSection && <div className="d-flex flex-row justify-content-left">
                {blocks.length > 1 && <div className="text-center mr-2">
                    <div className="d-flex justify-content-center align-items-center" style={{
                        width: "4rem",
                    }}/>
                </div>}
                <div className="mr-2" style={{ marginLeft: blocks.length === 1 ? "9rem" : "-0.75rem" }}>
                    <div className="" style={{
                        width: "4rem",
                    }}/>
                    <div>
                        <div style={{ marginLeft: "-1.5rem" }}>Kid's Section 👦</div>
                        <div>▼</div>
                    </div>
                </div>
            </div>}
            <div className="d-flex flex-row justify-content-center mb-4">
                {blocks.map((block, i) => (
                    <div className="text-center mr-2" key={`blockr-${i}`}>
                        <div style={{
                            border: "2px solid black",
                            height: "2.5rem",
                            width: "4rem",
                        }}/>
                        <div>{block}</div>
                    </div>
                ))}
            </div>
        </div>
    </div>;
}

export default KidsSectionIllustration;