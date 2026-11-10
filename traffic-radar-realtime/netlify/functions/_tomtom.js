const base='https://api.tomtom.com';
function respond(statusCode,body,headers={}){return {statusCode,headers:{'Cache-Control':'no-store','Content-Type':'application/json; charset=utf-8',...headers},body:typeof body==='string'?body:JSON.stringify(body)}}
function getKey(){return process.env.TOMTOM_API_KEY||''}
function failIfUnconfigured(){return !getKey()?respond(503,{error:'TomTom API belum diatur pada Netlify Environment Variables'}):null}
async function request(path,params={},type='json'){const u=new URL(base+path);u.searchParams.set('key',getKey());for(const [k,v] of Object.entries(params))if(v!==undefined&&v!==null&&String(v)!=='')u.searchParams.set(k,String(v));const r=await fetch(u,{headers:{'Accept':type==='image'?'image/png':'application/json'},signal:AbortSignal.timeout(12000)});if(!r.ok)return respond(r.status,{error:'TomTom request gagal ('+r.status+')'});if(type==='image'){return {statusCode:200,isBase64Encoded:true,headers:{'Content-Type':'image/png','Cache-Control':'public, max-age=35'},body:Buffer.from(await r.arrayBuffer()).toString('base64')}}return respond(200,await r.text(),{'Cache-Control':'public, max-age=5'})}
const bounded=(v,min,max)=>{const n=Number(v);return Number.isFinite(n)&&n>=min&&n<=max?n:null};
module.exports={respond,getKey,failIfUnconfigured,request,bounded};
