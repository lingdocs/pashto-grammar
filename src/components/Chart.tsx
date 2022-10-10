import {
    Types as T,
    Examples,
} from "@lingdocs/ps-react";


function Chart({ titleRow, children, opts }: {
    titleRow: string[] | undefined,
    children: T.PsString[][],
    opts: T.TextOptions,
}) {
    return <table className="table">
        <thead>
            {titleRow && <tr>
                {titleRow.map((title) => (
                    <th scope="col" key={title}>{title}</th>
                ))}
            </tr>}
        </thead>
        <tbody>
            {children.map((row) => (
                <tr>
                    {row.map((col) => (
                        <td>
                            <Examples opts={opts}>{col}</Examples>
                        </td>
                    ))}
                </tr>
            ))}
        </tbody>
    </table>;
}

export default Chart;