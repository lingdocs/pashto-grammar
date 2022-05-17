import {
    dictionary,
    DT,
    entryFeeder,
} from "@lingdocs/lingdocs-main";
import { useEffect, useState } from "react";

function useDictionary() {
    const [dictionaryStatus, setDictionaryStatus] = useState<DT.DictionaryStatus>("loading");
    useEffect(() => {
        console.log("starting here");
        setDictionaryStatus("loading");
        dictionary.initialize().then(() => {
            setDictionaryStatus("ready");
        }).catch((err) => {
            console.log("out of fetch", err);
            console.error(err);
            setDictionaryStatus("error loading");
        });
    }, []);
    return {
        dictionary,
        dictionaryStatus,
        entryFeeder,
    };
}

export default useDictionary;