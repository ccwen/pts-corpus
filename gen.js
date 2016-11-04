/*
generate pts.cor from pts-dhammakaya
*/
const createCorpus=require("ksana-corpus-builder").createCorpus;
const fs=require("fs");
const sourcepath="../pts-dhammakaya/htll/";
const files=fs.readFileSync(sourcepath+"file.lst","utf8").split(/\r?\n/);
var prevpage;
var inlineNotes={};
const fileStart=function(fn,i){
	console.log(fn);
	var at=fn.lastIndexOf("/");
	const f=fn.substr(at+1);
	this.putField("file",f);
	this.putField("article",f);//file name as article
}
const onFinalizeFields=function(fields){

}
const onTag=function(tag){
	const first=tag[0], payload=tag.substr(1);
	if (first==="~") {
		const r=payload.split(".");
		const vol=parseInt(r[0],10);
		const page=parseInt(r[1],10)-1;
		const kpos=this.makeKPos( vol, page, 0,0);
		this.newLine(kpos, this.tPos);
	} else if (first==="^") {
		this.putBookField("p",payload);
	} else if (first==="#") {

	} else if (first==="@") {

	} else {
		throw "unknown tag "+tag;
	}
}
const onContent=function(content){ //remove dhammakaya correction mark
	return content.replace(/[{}]/g,"");
}
const options={inputFormat:"htll",bitPat:"pts", language:"pali",
autoStart:true, textOnly:true,name:"pts"
}; //set textOnly not to build inverted
const corpus=createCorpus(options);
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