type TableOfContents = {
    depth: number,
    value: string,
    id: string,
    children?: TableOfContents,
}[];