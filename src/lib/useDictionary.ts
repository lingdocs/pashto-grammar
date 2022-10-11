import {
    dictionary,
    DT,
    entryFeeder,
} from "@lingdocs/lingdocs-main";
import { useEffect, useState } from "react";

function useDictionary() {
    const [dictionaryStatus, setDictionaryStatus] = useState<DT.DictionaryStatus>("loading");
    useEffect(() => {
        setDictionaryStatus("loading");
        dictionary.initialize().then(() => {
            setDictionaryStatus("ready");
        }).catch((err) => {
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