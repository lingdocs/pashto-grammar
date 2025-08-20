import Link from "../components/Link";
import Footer from "../components/Footer";
import { algoliasearch } from "algoliasearch";
import { useEffect, useState } from "react";
import { createSearchParams, useSearchParams } from "react-router-dom";

// need to use this because the typing from algoliasearch isn't accurate
type Hit = {
  content: string,
  contentLength: number,
  description: string,
  image: string,
  lang: string,
  origin: string,
  pathname: string,
  position: 0,
  title: string,
  type: string,
  url: string,
  urlDepth: number,
  hierarchy: {
    lvl0: string,
    lvl1: string | null,
    lvl2: string | null,
    lvl3: string | null,
    lvl4: string | null,
    lvl5: string | null,
    lvl6: string | null,
  },
  hierarchicalCategories: {
    lvl0?: string,
    lvl1?: string,
    lvl2?: string,
    lvl3?: string,
    lvl4?: string,
    lvl5?: string,
    lvl6?: string,
  },
  _snippetResult: {
    content: {
      matchLevel: string,
      value: string,
    }
  }
}

const client = algoliasearch(
  process.env.ALGOLIA_GRAMMAR_APP_ID || "",
  process.env.ALGOLIA_GRAMMAR_API_KEY || "",
);
const indexName = process.env.ALGOLIA_GRAMMAR_INDEX || "";

const SearchPage = () => {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<Hit[] | "searching" | "none" | []>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  useEffect(() => {
    const inParams = searchParams.get("search");
    if (inParams) {
      setSearch(inParams);
      doSearch(inParams);
    } else {
      setResults([]);
      setSearch("");
    }
  }, [window.location.search]);
  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!search) return;
    setSearchParams(createSearchParams({
      search,
    }));
    doSearch(search);
  }
  async function doSearch(s: string) {
    setResults("searching");
    try {
      const response = await client.search({
        requests: [{
          indexName,
          query: s,
          attributesToSnippet: [
            "content:30",
          ],
          highlightPreTag: '<strong class="search-highlight">',
          highlightPostTag: '</strong>'
        }],
      });
      const result = response.results[0];
      // @ts-ignore
      const hits = "hits" in result ? result.hits as Hit[] : [];
      setResults(hits.length ? hits : "none")
    } catch (e) {
      console.error(e);
      alert("Connect to the internet to search");
    }

  }
  return <>
    <main className="col bg-faded py-3 d-flex flex-column" style={{ maxWidth: "800px" }}>
      <h1>Search</h1>
      <form className="input-group mb-3 mt-2" onSubmit={handleSearch}>
        <input
          className="form-control"
          placeholder="Search in grammar..."
          type="text"
          onChange={e => setSearch(e.target.value)}
          value={search}
        />
        <div className="input-group-append">
          <button className="btn btn-outline-primary" type="submit">
            Search
          </button>
        </div>
      </form>
      {results === "none"
        ? <h5>No results found</h5>
        : results === "searching"
          ? <p>Searching...</p>
          : <>
            {results.length > 0 && <div className="text-muted small mb-3">{`${results.length} result${results.length > 1 ? "s" : ""}`}</div>}
            {results.map(result => <div className="link-unstyled mb-4">
              <Link to={result.url}>
                <div>
                  <h5>{getHiearchy(result.hierarchy)}</h5>
                  <div
                    dangerouslySetInnerHTML={{ __html: result._snippetResult.content.value }}
                  />
                </div>
              </Link>
            </div>)}
          </>}
      <Footer chapter={undefined} />
    </main>
  </>;
};

function getHiearchy(s: Hit["hierarchy"]): string {
  const levels: string[] = [s.lvl0];
  for (let i = 1 as 1 | 2 | 3 | 4 | 5 | 6; i <= 6; i++) {
    const key = `lvl${i}` as const;
    if (s[key]) {
      levels.push(s[key]);
    } else break;
  }
  return levels.join(" • ");
}

export default SearchPage;
