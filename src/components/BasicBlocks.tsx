function BasicBlocks({ blocks, showKidsSection, large }: {
    blocks: (string | { top?: string | JSX.Element, inside?: string | JSX.Element, bottom?: string | JSX.Element })[],
    showKidsSection?: boolean,
    large?: boolean,
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
            <div className="d-flex flex-row justify-content-center mb-4 align-items-end">
                {blocks.map((block, i) => (
                    <div className="text-center mr-2" key={`blockr-${i}`}>
                        <div>{typeof block === "object" ? block.top : <div></div>}</div>
                        <div
                            className="d-flex flex-row justify-content-center align-items-center"
                            style={{
                                border: "2px solid black",
                                height: large ? "3.5rem" : "2.5rem",
                                width: large ? "6rem" : "4rem",
                            }}
                        >
                            {(typeof block === "object" && block.inside) ? block.inside : ""}
                        </div>
                        <div>{typeof block === "object" ? block.bottom : block}</div>
                    </div>
                ))}
            </div>
        </div>
    </div>;
}

export default BasicBlocks;