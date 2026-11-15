import { chromium } from 'playwright';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const dir=fileURLToPath(new URL('../',import.meta.url));
const files=process.argv.slice(2);
const b=await chromium.launch({channel:'chrome'});
// usage: node make-thumbs.mjs page.html other.html@light   (@light captures the light scheme; default dark). Four pages are captured at a time
const shoot=async arg=>{
  const [f,scheme='dark']=arg.split('@');
  if(!existsSync(dir+'pages/'+f)){console.log('skip',f);return;}
  const ctx=await b.newContext({viewport:{width:1440,height:900},deviceScaleFactor:0.5,colorScheme:scheme});
  const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
  await p.goto('file://'+dir+'pages/'+f,{waitUntil:'load'});
  await p.waitForTimeout(f.startsWith('terminal')?6000:1500);
  // smooth scrolling keeps animating after the pass and leaves the page off-top; force instant and re-assert
  await p.addStyleTag({content:'html,body{scroll-behavior:auto!important}'});
  await p.evaluate(async()=>{for(let y=0;y<Math.min(document.body.scrollHeight,6000);y+=400){scrollTo(0,y);await new Promise(r=>setTimeout(r,120));}scrollTo(0,0);});
  for(let i=0;i<10;i++){await p.waitForTimeout(300);if(await p.evaluate(()=>{const y=scrollY;scrollTo(0,0);return y===0;}))break;}
  await p.waitForTimeout(600);
  const out=dir+'thumbs/'+f.replace(/\.html$/,'.png');
  await p.screenshot({path:out});
  console.log(JSON.stringify({f,errs}));
  await ctx.close();
};
await Promise.all(Array.from({length:4},async()=>{while(files.length)await shoot(files.shift());}));
await b.close();
