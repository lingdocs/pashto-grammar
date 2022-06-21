import {
    Types as T,
} from "@lingdocs/pashto-inflector";

// @ts-ignore
export const basicVerbs: T.VerbEntry[] = [
    {"ts":1527812856,"i":11630,"p":"لیکل","f":"leekul","g":"leekul","e":"to write, draw","c":"v. trans./gramm. trans.","ec":"write,writes,writing,wrote,written"},
    {"ts":1527815399,"i":14480,"p":"وهل","f":"wahul","g":"wahul","e":"to hit","c":"v. trans.","tppp":"واهه","tppf":"waahu","ec":"hit,hits,hitting,hit,hit"},
    {"ts":1527817750,"i":7843,"p":"سکل","f":"skul","g":"skul","e":"to drink","c":"v. trans.","ec":"drink,drinks,drinking,drank,drank"},
    {"ts":1527812752,"i":10625,"p":"کول","f":"kawul","g":"kawul","e":"to do (an action or activity)","c":"v. trans. irreg.","ssp":"وکړ","ssf":"óokR","prp":"وکړل","prf":"óokRul","pprtp":"کړی","pprtf":"kúRey","diacExcept":true,"ec":"do,does,doing,did,done"},
    {"ts":1527812275,"i":11608,"p":"لیدل","f":"leedul","g":"leedul","e":"to see","c":"v. trans./gramm. trans.","psp":"وین","psf":"ween","tppp":"لید","tppf":"leed","ec":"see,sees,seeing,saw,seen"},
    {"ts":1577049208257,"i":1068,"p":"اورېدل","f":"awredul","g":"awredul","e":"to hear, listen","c":"v. trans./gramm. trans.","psp":"اور","psf":"awr","tppp":"اورېد","tppf":"awred","ec":"hear,hears,hearing,heard"},
    {"ts":1527812790,"i":5795,"p":"خوړل","f":"khoRul","g":"khoRul","e":"to eat, to bite","c":"v. trans.","psp":"خور","psf":"khor","tppp":"خوړ","tppf":"khoR","ec":"eat,eats,eating,ate,eaten"},
    {"ts":1527815216,"i":6630,"p":"راتلل","f":"raatlúl","g":"raatlul","e":"to come","c":"v. intrans. irreg.","psp":"راځ","psf":"raadz","ssp":"راش","ssf":"ráash","prp":"راغلل","prf":"ráaghlul","pprtp":"راغلی","pprtf":"raaghúley","tppp":"راغی","tppf":"ráaghey","noOo":true,"separationAtP":2,"separationAtF":3,"ec":"come,comes,coming,came,come"},
].map(entry => ({ entry }));