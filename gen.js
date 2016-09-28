/*
generate pts.cor from pts-dhammakaya
*/
const Ksanapos=require("ksana-corpus/ksanapos");
const createCorpus=require("ksana-corpus-builder").createCorpus;
const fs=require("fs");
const sourcepath="../pts-dhammakaya/htll/";
const files=fs.readFileSync(sourcepath+"file.lst","utf8").split(/\r?\n/);
//files.length=7;
var prevpage;
var inlineNotes={};
const fileStart=function(fn,i){
	console.log(fn,i)
}
const onFinalizeFields=function(fields){

}
const onTag=function(tag){
	const first=tag[0], payload=tag.substr(1);
	if (first==="~") {
		const r=payload.split(".");
		const vol=parseInt(r[0],10)-1;
		const page=parseInt(r[1],10)-1;
		const kpos=this.makeKPos( vol, page, 0,0);
		this.newLine(kpos, this.tPos);
	} else if (first==="^") {
		this.putField("p",payload);
	} else if (first==="#") {

	} else if (first==="@") {

	} else {
		throw "unknown tag "+tag;
	}
}
const onContent=function(content){ //remove dhammakaya correction mark
	return content.replace(/[{}]/g,"");
}
const options={inputFormat:"htll",bitPat:"pts", 
autoStart:true, textOnly:true
}; //set textOnly not to build inverted
const corpus=createCorpus("pts",options);
corpus.setHandlers(
	{}, //open tag handlers
	{},  //end tag handlers
	{onContent,onTag,fileStart}  //other handlers
);


files.forEach(fn=>corpus.addFile(sourcepath+fn));

corpus.writeKDB("pts.cor",function(byteswritten){
	console.log(byteswritten,"bytes written")
});
//console.log(corpus.romable.buildROM({date:(new Date()).toString()}));
console.log(corpus.totalPosting,corpus.tPos);