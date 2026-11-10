const {respond,getKey}=require('./_tomtom');exports.handler=async()=>respond(200,{configured:!!getKey()});
