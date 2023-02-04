import Carousel from "../../components/Carousel";
import {
    defaultTextOptions as opts,
    InlinePs,
    RootsAndStems,
    getVerbInfo,
    getAbilityRootsAndStems,
    removeFVarients,
    ensureNonComboVerbInfo,
} from "@lingdocs/ps-react";

export default function GoingStems() {
    const items = [
      {"ts":1527815348,"i":3666,"p":"تلل","f":"tlul","g":"tlul","e":"to go","c":"v. intrans. irreg.","psp":"ځ","psf":"dz","ssp":"لاړ ش","ssf":"láaR sh","prp":"لاړ","prf":"láaR","ec":"go,goes,going,went,gone"},
      {"ts":1527815216,"i":6642,"p":"راتلل","f":"raatlúl","g":"raatlul","e":"to come","c":"v. intrans. irreg.","psp":"راځ","psf":"raadz","ssp":"راش","ssf":"ráash","prp":"راغلل","prf":"ráaghlul","pprtp":"راغلی","pprtf":"raaghúley","tppp":"راغی","tppf":"ráaghey","noOo":true,"separationAtP":2,"separationAtF":3,"ec":"come,comes,coming,came,come"},
      {"ts":1585228551150,"i":6062,"p":"درتلل","f":"dărtlul","g":"dartlul","e":"to come (to you / second person)","c":"v. intrans. irreg.","psp":"درځ","psf":"dărdz","ssp":"درش","ssf":"dársh","prp":"درغلل","prf":"dáraghlul","pprtp":"درغلی","pprtf":"dăraghúley","tppp":"درغی","tppf":"dáraghey","noOo":true,"separationAtP":2,"separationAtF":3,"ec":"come,comes,coming,came,come"},
      {"ts":1585228579997,"i":14282,"p":"ورتلل","f":"wărtlul","g":"wartlul","e":"to come / go over to (third person or place)","c":"v. intrans. irreg.","psp":"ورځ","psf":"wărdz","ssp":"ورش","ssf":"wársh","prp":"ورغلل","prf":"wáraghlul","pprtp":"ورغلی","pprtf":"wăraghúley","tppp":"ورغی","tppf":"wáraghey","noOo":true,"separationAtP":2,"separationAtF":3,"ec":"come,comes,coming,came,come"},
    ].map(entry => ({ entry }));
    return <Carousel stickyTitle items={items} render={(item) => {
          const rs = getAbilityRootsAndStems(
            ensureNonComboVerbInfo(getVerbInfo(item.entry))
            );
          return {
              title: <InlinePs opts={opts}>
                {{
                  ...removeFVarients(item.entry),
                  e: undefined,
                }}
              </InlinePs>,
              body: <RootsAndStems
                textOptions={opts}
                info={rs}
              />,
          };
    }}/>
}