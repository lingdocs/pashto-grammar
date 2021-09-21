import {
    AT,
    postTestResults,
} from "@lingdocs/lingdocs-main";

const fullKey = (uid: AT.UUID) => `test-results-${uid}`;

export async function postSavedResults(uid: AT.UUID): Promise<"sent" | "unsent" | "none"> {
    const key = fullKey(uid);
    const results = getSavedResults(key);
    if (results.length === 0) return "none";
    // if the result posting was successful, delete the result from local storage
    // and pull the user
    try {
        const res = await postTestResults(results)
        if (res.ok) {
            deleteTestResults(res.tests, key);
            return "sent";
        }
    } catch(e) {
        console.error(e);
    }
    return "unsent";
}

export function saveResult(result: AT.TestResult, uid: AT.UUID) {
    const key = fullKey(uid);
    const results = getSavedResults(key);
    localStorage.setItem(key, JSON.stringify([...results, result]));
}

function getSavedResults(key: string): AT.TestResult[] {
    return JSON.parse(localStorage.getItem(key) || "[]") as AT.TestResult[];
}

function deleteTestResults(results: AT.TestResult[], key: string) {
    const r = getSavedResults(key);
    const left = r.filter((rs) => !results.some(x => x.time === rs.time));
    localStorage.setItem(key, JSON.stringify(left));
}