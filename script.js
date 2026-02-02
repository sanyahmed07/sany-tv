const urls=[
"https://raw.githubusercontent.com/sanyahmed07/playlist1/refs/heads/main/playlist.m3u",
"https://raw.githubusercontent.com/biostartvworld/playlist/refs/heads/main/playlist.m3u",
"https://raw.githubusercontent.com/sm-monirulislam/RoarZone-Auto-Update-playlist/refs/heads/main/RoarZone.m3u"
]
let channels=[]
let activeCat="All"
let hls=null
let hideTimer=null
let levels=[]
let currentLevel=-1

const list=document.getElementById("list")
const category=document.getElementById("category")
const left=document.getElementById("left")
const video=document.getElementById("video")
const currentLogo=document.getElementById("currentLogo")
const currentName=document.getElementById("currentName")
const wrap=video.parentElement
video.controls=false
video.volume=1
video.muted=false
video.playsInline=true

const controlsBoard=document.createElement("div")
controlsBoard.style.cssText=`
position:absolute; left:0; right:0; bottom:0;
pointer-events:none;
display:flex; flex-direction:column; gap:6px;
background: transparent;
padding:5px 0;
border-radius:4px;
transition:background 0.3s;
`
const controls=document.createElement("div")
controls.style.cssText=`
padding:5px 10px;
display:flex;
flex-direction:column;
gap:6px;
pointer-events:none;
background:none;
`
const seek=document.createElement("input")
seek.type="range"
seek.min=0
seek.max=100
seek.value=0
seek.style.cssText=`
width:100%;
height:4px;
appearance:none;
border-radius:2px;
pointer-events:auto;
background:linear-gradient(to left, rgba(255,255,255,0.3) 0%, white 0%);
`
const row=document.createElement("div")
row.style.cssText=`
display:flex;
justify-content:space-between;
align-items:center;
pointer-events:auto;
`
const leftControls=document.createElement("div")
leftControls.style.cssText="display:flex;gap:10px"

const play=document.createElement("button")
play.innerHTML="▶"
play.style.cssText="background:none;border:none;color:white;font-weight:bold;font-size:18px;cursor:pointer;transition:color 0.2s"

const stop=document.createElement("button")
stop.innerHTML="■"
stop.style.cssText="background:none;border:none;color:white;font-weight:bold;font-size:18px;cursor:pointer;transition:color 0.2s"

leftControls.append(play,stop)

const rightControls=document.createElement("div")
rightControls.style.cssText="display:flex;gap:10px;align-items:center"

const mute=document.createElement("button")
mute.innerHTML="🔊"
mute.style.cssText="background:none;border:none;color:yellow;font-weight:bold;font-size:16px;cursor:pointer;transition:color 0.2s"

const vol=document.createElement("input")
vol.type="range"
vol.min=0
vol.max=1
vol.step=0.01
vol.value=1
vol.style.cssText="width:70px"

const live=document.createElement("span")
live.innerText="LIVE"
live.style.cssText="color:yellow;font-weight:700;font-size:12px"

const hd=document.createElement("button")
hd.innerText="HD"
hd.style.cssText="background:none;border:none;color:yellow;font-weight:bold;font-size:16px;cursor:pointer;transition:color 0.2s"

const fs=document.createElement("button")
fs.innerHTML="⛶"
fs.style.cssText="background:none;border:none;color:white;font-weight:bold;font-size:16px;cursor:pointer;transition:color 0.2s"

rightControls.append(mute,vol,live,hd,fs)
row.append(leftControls,rightControls)
controls.append(seek,row)
controlsBoard.appendChild(controls)
wrap.appendChild(controlsBoard)

const loader=document.createElement("div")
loader.style.cssText=`
position:absolute; top:50%; left:50%; transform:translate(-50%,-50%);
border:4px solid rgba(255,255,255,0.3);
border-top:4px solid #fff;
border-radius:50%;
width:40px; height:40px;
animation:spin 1s linear infinite;
display:none;
z-index:999;
`
wrap.appendChild(loader)
const style=document.createElement("style")
style.innerHTML=`@keyframes spin{0%{transform:translate(-50%,-50%) rotate(0deg);}100%{transform:translate(-50%,-50%) rotate(360deg);}}`
document.head.appendChild(style)

function showControls(){controls.style.opacity=1;controlsBoard.style.background="rgba(0,0,0,0.4)";clearTimeout(hideTimer);hideTimer=setTimeout(()=>{controls.style.opacity=0;controlsBoard.style.background="transparent"},3000)}
wrap.onmousemove=wrap.onclick=wrap.ontouchstart=showControls

function updatePlayStopIcon(){if(video.paused||video.ended){play.innerHTML="▶";stop.style.display="none"}else{play.innerHTML="❚❚";stop.style.display="inline"}}
video.onplay=updatePlayStopIcon
video.onpause=updatePlayStopIcon
video.onended=updatePlayStopIcon
play.onclick=()=>{if(video.paused||video.ended){video.play()}else{video.pause()};updatePlayStopIcon()}
stop.onclick=()=>{video.pause();video.currentTime=0;updatePlayStopIcon()}
mute.onclick=()=>{video.muted=!video.muted;mute.innerHTML=video.muted?"🔇":"🔊"}
vol.oninput=e=>{video.volume=e.target.value;video.muted=false;mute.innerHTML="🔊"}
fs.onclick=()=>{if(!document.fullscreenElement)wrap.requestFullscreen?.();else document.exitFullscreen?.()}
hd.onclick=()=>{
if(!hls||!levels.length)return
currentLevel++
if(currentLevel>=levels.length){hls.currentLevel=-1;hd.innerText="AUTO";currentLevel=-1}
else{hls.currentLevel=levels[currentLevel].index;hd.innerText=levels[currentLevel].height+"p"}
}
video.ontimeupdate=()=>{if(video.duration){seek.value=(video.currentTime/video.duration)*100;seek.style.background=`linear-gradient(to left, rgba(255,255,255,0.3) ${seek.value}%, white ${seek.value}%)`}}
seek.oninput=e=>{if(video.duration){video.currentTime=(e.target.value/100)*video.duration;seek.style.background=`linear-gradient(to left, rgba(255,255,255,0.3) ${e.target.value}%, white ${e.target.value}%)`}}

function parseM3U(t){t.split(/\r?\n/).forEach((l,i,a)=>{if(l.startsWith("#EXTINF")){const name=l.split(",").pop().trim();const logo=(l.match(/tvg-logo="(.*?)"/)||[])[1]||"";const cat=(l.match(/group-title="(.*?)"/)||[])[1]||"Others";const stream=(a[i+1]||"").trim();if(stream.startsWith("http"))channels.push({name,logo,cat,stream})}})}

function renderCategory(){const cats=["All",...new Set(channels.map(c=>c.cat))];category.innerHTML="";cats.forEach(c=>{const d=document.createElement("div");d.className="catBtn"+(c===activeCat?" active":"");d.innerText=c;d.onclick=()=>{activeCat=c;renderCategory();renderList(c==="All"?channels:channels.filter(x=>x.cat===c))};category.appendChild(d)})}

function renderList(arr){list.innerHTML="";arr.forEach(c=>{const d=document.createElement("div");d.className="channelItem";d.innerHTML=`<img src="${c.logo}">`;d.onclick=()=>playChannel(c,d);list.appendChild(d)})}

function destroyPlayer(){if(hls){hls.destroy();hls=null}video.pause();video.removeAttribute("src");video.load()}

function startStream(url){
loader.style.display="block"
destroyPlayer()
if(video.canPlayType("application/vnd.apple.mpegurl")){
video.src=url
video.play()
video.oncanplay=()=>{loader.style.display="none";video.play()}
}else if(Hls.isSupported()){
hls=new Hls({autoStartLoad:true,capLevelToPlayerSize:true,maxBufferLength:30,enableWorker:true,progressive:true})
hls.loadSource(url)
hls.attachMedia(video)
hls.on(Hls.Events.MANIFEST_PARSED,()=>{
levels=hls.levels.filter(l=>l.height).sort((a,b)=>b.height-a.height).map((l,i)=>({...l,index:i}))
hls.currentLevel=-1
hd.innerText="AUTO"
currentLevel=-1
video.play()
loader.style.display="none"
})
}
}

function playChannel(c,el){
document.querySelectorAll(".channelItem").forEach(x=>x.classList.remove("active"))
el.classList.add("active")
left.style.display="flex"
currentLogo.src=c.logo
currentName.innerText=c.name
startStream(c.stream)
showControls()
updatePlayStopIcon()
}

const timeBox=document.createElement("div")
timeBox.id="timeBox"
Object.assign(timeBox.style,{position:"absolute",top:"5px",right:"5px",background:"rgba(0,0,0,0.5)",color:"#fff",padding:"5px 9px",borderRadius:"10px",fontFamily:"Arial,sans-serif",fontSize:"12px",fontWeight:"bold",zIndex:"9999",whiteSpace:"nowrap",textAlign:"center"})
wrap.appendChild(timeBox)
setInterval(()=>{
const now=new Date();let hours=now.getHours();const minutes=now.getMinutes().toString().padStart(2,'0');const seconds=now.getSeconds().toString().padStart(2,'0');const ampm=hours>=12?'PM':'AM';hours=hours%12||12;const timeStr=`${hours.toString().padStart(2,'0')}:${minutes}:${seconds} ${ampm}`;const day=now.toLocaleDateString('en-US',{weekday:'long'});const date=now.toLocaleDateString('en-US',{year:'numeric',month:'short',day:'numeric'});timeBox.innerText=`${timeStr} | ${day} | ${date}`
},1000)

const tg=document.createElement("a")
tg.href="https://t.me/bslpabna"
tg.target="_blank"
tg.id="telegramChat"
tg.innerHTML=`<svg viewBox="0 0 24 24" width="26" height="26" fill="#fff"><path d="M9.04 15.84 8.7 19.6c.49 0 .7-.21.96-.46l2.3-2.2 4.77 3.49c.87.48 1.49.23 1.7-.8l3.08-14.44h0c.26-1.22-.44-1.7-1.28-1.39L1.62 9.2c-1.18.46-1.16 1.12-.2 1.42l4.7 1.47L17.4 5.9c.55-.36 1.06-.16.64.2"/></svg>`
Object.assign(tg.style,{position:"fixed",bottom:"20px",right:"20px",width:"52px",height:"52px",background:"#229ED9",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 12px rgba(0,0,0,.3)",zIndex:"99999",textDecoration:"none"})
document.body.appendChild(tg)

if(typeof searchBtn!=='undefined' && typeof searchBox!=='undefined' && typeof searchInput!=='undefined'){
searchBtn.onclick=()=>{searchBox.style.display=searchBox.style.display==='block'?'none':'block';if(searchBox.style.display==='block') searchInput.focus()}
searchInput.addEventListener("keyup",()=>{const q=searchInput.value.trim().toLowerCase();const base=activeCat==='All'?channels:channels.filter(x=>x.cat===activeCat);renderList(q?base.filter(c=>c.name.toLowerCase().includes(q)):base)})
}

const icons=[play,stop,mute,hd,fs]
icons.forEach(icon=>{
icon.addEventListener("mouseenter",()=>{controlsBoard.style.background="rgba(0,0,0,0.6)";icon.style.color="#ff0"})
icon.addEventListener("mouseleave",()=>{controlsBoard.style.background="transparent";icon.style.color=(icon===hd||icon===mute||icon===live)?"yellow":"white"})
})

Promise.all(urls.map(u=>fetch(u).then(r=>r.text()).catch(()=>null))).then(r=>{r.filter(Boolean).forEach(parseM3U);renderCategory();renderList(channels)})

