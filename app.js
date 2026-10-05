const SUPABASE_URL = "https://gxlnmbhegqtkbuyftzwq.supabase.co";
const SUPABASE_KEY = "sb_publishable_b64wuzUEniCibtvB6ETaKw_a5GknEMe";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const songs=[
{id:"amazing-grace",title:"Amazing Grace",key:"G",bpm:72,time:"3/4",style:"Hymn • Gentle",capo:"—",sunday:true,
 blocks:[
 {cue:"SOFT",group:"WOMEN",chords:"G              C        G",text:"Amazing grace, how sweet the sound"},
 {cue:"BUILD",group:"ALL",chords:"G                    D",text:"That saved a soul like me"},
 {cue:"LOUD",group:"ALL",chords:"G              C        G",text:"I once was lost, but now am found"},
 {cue:"SOFT",group:"ALL",chords:"G        D             G",text:"Was blind, but now I see"}
]},
{id:"here-i-am-lord",title:"Here I Am, Lord",key:"G",bpm:76,time:"4/4",style:"Worship • Prayerful",capo:"—",sunday:true,
 blocks:[
 {cue:"SOFT",group:"SOLO",chords:"G       C       G",text:"Verse — begin gently and prayerfully"},
 {cue:"BUILD",group:"ALL",chords:"Em      C       D",text:"Build into the response"},
 {cue:"LOUD",group:"ALL",chords:"G       D       C",text:"Chorus — full choir, warm and confident"}
]},
{id:"practice-song",title:"Choir Practice Song",key:"C",bpm:92,time:"4/4",style:"Contemporary",capo:"—",sunday:false,
 blocks:[
 {cue:"SOFT",group:"ALL",chords:"C       Am      F       G",text:"Start together, light and controlled"},
 {cue:"BUILD",group:"MEN",chords:"C       G       Am",text:"Add energy without rushing"},
 {cue:"LOUD",group:"ALL",chords:"F       G       C",text:"Full choir finish"}
]}];

let currentTab="songs",current=null,mode="singer",transpose=0,fontSize=20;
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const favs=()=>JSON.parse(localStorage.getItem("ws-favs")||"[]");
function setFavs(v){localStorage.setItem("ws-favs",JSON.stringify(v))}
function renderList(){
 const q=$("#search").value.toLowerCase().trim(); let arr=songs;
 if(currentTab==="setlist")arr=arr.filter(s=>s.sunday);
 if(currentTab==="favs")arr=arr.filter(s=>favs().includes(s.id));
 arr=arr.filter(s=>[s.title,s.key,s.style].join(" ").toLowerCase().includes(q));
 $("#listTitle").textContent=currentTab==="setlist"?"This Sunday":currentTab==="favs"?"Favourites":"Song Library";
 $("#songCount").textContent=`${arr.length} song${arr.length===1?"":"s"}`;
 $("#songList").innerHTML=arr.length?arr.map(s=>`<article class="card" data-id="${s.id}">
 <h3>${s.title}</h3><div class="smallmeta">Key ${s.key} · ${s.bpm} BPM · ${s.time}</div>
 <div class="chips"><span class="chip">${s.style}</span>${s.sunday?'<span class="chip">Sunday Mass</span>':""}</div></article>`).join(""):`<div class="card">No songs found.</div>`;
 $$(".card[data-id]").forEach(c=>c.onclick=()=>openSong(c.dataset.id));
}
function openSong(id){
 current=songs.find(s=>s.id===id);transpose=0;mode="singer";
 $("#homeView").classList.add("hidden");$("#songView").classList.remove("hidden");
 $("#songTitle").textContent=current.title; $("#transposeVal").textContent=0;
 $("#meta").innerHTML=`<span>Key <b>${current.key}</b></span><span>Tempo <b>${current.bpm} BPM</b></span><span>Style <b>${current.style}</b></span><span>Time <b>${current.time}</b></span><span>Capo <b>${current.capo}</b></span>`;
 updateFav(); $$(".mode").forEach(x=>x.classList.toggle("active",x.dataset.mode==="singer")); renderSong(); scrollTo(0,0);
}
function cueClass(c){return c==="SOFT"?"soft":c==="BUILD"?"build":c==="LOUD"?"loud":"solo"}
function renderSong(){
 $("#lyrics").style.fontSize=fontSize+"px";
 $("#lyrics").innerHTML=current.blocks.map(b=>`<div class="block"><div class="cueRow"><span class="cue ${cueClass(b.cue)}">${b.cue}</span> <span class="cue group">${b.group}</span></div>${mode!=="singer"?`<div class="chords">${b.chords}</div>`:""}<div class="lyricline">${b.text}</div></div>`).join("");
 const panel=$("#chordPanel");
 if(mode==="singer"){panel.classList.add("hidden");return}
 panel.classList.remove("hidden");
 const chordNames=[...new Set(current.blocks.flatMap(b=>b.chords.trim().split(/\s+/)))].slice(0,6);
 panel.innerHTML=`<h3>${mode==="guitar"?"🎸 Guitar chord shapes":"🎹 Piano chord shapes"}</h3><div class="diagramgrid">${chordNames.map(ch=>mode==="guitar"?guitar(ch):piano(ch)).join("")}</div>`;
}
const guitarShapes={G:["●○○●●●","320003"],C:["○●○●●○","x32010"],D:["○○○●●●","xx0232"],Em:["○●●○○○","022000"],Am:["○○●●●○","x02210"],F:["●●●●●●","133211"]};
function guitar(ch){let x=guitarShapes[ch]||["○ ○ ○ ○ ○ ○","Chord shape"];return `<div class="diagram"><b>${ch}</b><div class="fret">${x[0]}<br>${x[1]}</div></div>`}
function piano(ch){let roots={C:0,D:1,E:2,F:3,G:4,A:5,B:6},r=roots[ch.replace("m","")]??0;return `<div class="diagram"><b>${ch}</b><div class="piano">${[0,1,2,3,4,5,6].map(i=>`<span class="key ${(i===r||i===(r+2)%7||i===(r+4)%7)?"on":""}"></span>`).join("")}</div></div>`}
function updateFav(){let on=favs().includes(current.id);$("#favBtn").textContent=on?"♥":"♡"}
$("#favBtn").onclick=()=>{let f=favs(),i=f.indexOf(current.id);i>=0?f.splice(i,1):f.push(current.id);setFavs(f);updateFav()}
$("#backBtn").onclick=()=>{$("#songView").classList.add("hidden");$("#homeView").classList.remove("hidden");renderList()}
$("#search").oninput=renderList;
$$(".tab").forEach(b=>b.onclick=()=>{currentTab=b.dataset.tab;$$(".tab").forEach(x=>x.classList.toggle("active",x===b));renderList()});
$$(".mode").forEach(b=>b.onclick=()=>{mode=b.dataset.mode;$$(".mode").forEach(x=>x.classList.toggle("active",x===b));renderSong()});
$("#plus").onclick=()=>{$("#transposeVal").textContent=++transpose};$("#minus").onclick=()=>{$("#transposeVal").textContent=--transpose};
$("#larger").onclick=()=>{fontSize=Math.min(30,fontSize+2);renderSong()};$("#smaller").onclick=()=>{fontSize=Math.max(16,fontSize-2);renderSong()};
function online(){ $("#offlineState").textContent=navigator.onLine?"• Online":"• Offline mode" } addEventListener("online",online);addEventListener("offline",online);online();renderList();
if("serviceWorker" in navigator)navigator.serviceWorker.register("./sw.js");
