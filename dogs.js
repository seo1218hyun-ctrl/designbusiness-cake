// The neutral face pixels are the source of truth; recoloring always starts from them.
const dogNames=['maltese','poodle','shihtzu'];
const dogCache=new Map();let dogRequest=0;
const dogCanvas=document.createElement('canvas');dogCanvas.width=dogCanvas.height=256;
const dogContext=dogCanvas.getContext('2d',{willReadFrequently:true});
const rgb=hex=>hex.match(/[a-f\d]{2}/gi).map(x=>parseInt(x,16));

// Broad, low-contrast shading, with no specular shine or cast shadow.
function mattePortrait(svg,breed,first,second){
 const mix=(hex,target,amount)=>'#'+rgb(hex).map((v,i)=>Math.round(v+(rgb(target)[i]-v)*amount).toString(16).padStart(2,'0')).join('');
 let definitions='';
 const colors=[...new Set([first,second,'#fff5e5','#cfa27c'])];
 for(const [i,color] of colors.entries()){
  const id='matte-fur-'+i;
  definitions+='<radialGradient id="'+id+'" cx="45%" cy="36%" r="76%"><stop stop-color="'+mix(color,'#fff7e8',.055)+'"/><stop offset=".65" stop-color="'+color+'"/><stop offset="1" stop-color="'+mix(color,'#735d49',.10)+'"/></radialGradient>';
  svg=svg.split('fill="'+color+'"').join('fill="url(#'+id+')"');
 }
 if(breed==='poodle'){
  svg=svg.replace('fill="url(#fur)"','fill="url(#matte-fur-0)"');
  const earId=colors.indexOf(second);svg=svg.split('fill="url(#ear)"').join('fill="url(#matte-fur-'+earId+')"');
 }
 svg=svg.replace(/(<svg[^>]*>)/,'$1<defs>'+definitions+'</defs>');
 const cx=breed==='poodle'?132:128,cy=breed==='poodle'?160:breed==='maltese'?150:146;
 const base=breed==='shihtzu'?'#fff5e5':first;
 const muzzle=breed==='shihtzu'?'':'<ellipse cx="'+cx+'" cy="'+(cy+17)+'" rx="29" ry="8" fill="'+mix(base,'#735d49',.11)+'" opacity=".30"/><ellipse cx="'+cx+'" cy="'+cy+'" rx="32" ry="24" fill="'+mix(base,'#fff7e8',.17)+'" opacity=".72"/>';
 const seams='<g fill="none" stroke="'+mix(second,'#735d49',.22)+'" stroke-opacity=".20" stroke-width="3" stroke-linecap="round"><path d="M70 108 Q62 130 70 151 M186 108 Q194 130 186 151"/></g>';
 const texture=breed==='poodle'?'<g fill="none" stroke="'+mix(first,'#735d49',.18)+'" stroke-opacity=".28" stroke-width="2" stroke-linecap="round"><path d="M91 66 Q98 60 104 66 M125 54 Q132 48 139 54 M157 67 Q164 61 170 68 M86 91 Q92 85 99 91 M156 92 Q163 86 170 92"/></g>':'';
 svg=svg.replace('<g fill="#62482f">',seams+texture+muzzle+'<g fill="#62482f">');
 return 'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);
}

// Paint only the poodle's fur; facial features are separate, fixed-color shapes.
function poodlePortrait(first='#f5eddf',second=first){
 const light=hex=>hex;
 const face='M67 101 C55 85 63 65 80 62 C77 45 91 34 107 38 C116 22 131 28 138 32 C154 23 168 33 172 43 C192 39 205 53 201 68 C219 70 225 88 215 101 C230 115 222 134 211 141 C217 159 206 173 191 175 C190 194 173 202 158 197 C148 214 129 208 122 204 C105 214 88 204 85 192 C66 195 55 180 59 164 C43 155 45 135 54 126 C44 114 52 103 67 101Z';
 const ear='M67 104 C52 91 34 99 31 111 C12 112 7 128 15 141 C9 157 21 171 35 171 C42 187 62 186 72 175 C87 174 93 158 84 147 C93 131 83 113 67 104Z';
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256"><defs><radialGradient id="fur" cx="42%" cy="30%" r="78%"><stop stop-color="${light(first)}"/><stop offset="1" stop-color="${first}"/></radialGradient><radialGradient id="ear"><stop stop-color="${light(second)}"/><stop offset="1" stop-color="${second}"/></radialGradient></defs><g transform="translate(0 9)"><path d="${ear}" fill="url(#ear)"/><path d="${ear}" transform="translate(256 0) scale(-1 1)" fill="url(#ear)"/><path d="${face}" fill="url(#fur)"/><g fill="none" stroke="${second}" stroke-width="4" stroke-linecap="round" opacity=".38"><path d="M61 119 Q68 129 61 139 Q71 151 65 161"/><path d="M195 119 Q188 129 195 139 Q185 151 191 161"/></g><g fill="#62482f"><circle cx="106" cy="129" r="8"/><circle cx="160" cy="129" r="8"/><path d="M123 153 C119 141 143 141 140 153 Q137 162 132 163 Q126 162 123 153Z"/></g><g fill="#fff9ec"><circle cx="103.5" cy="126" r="2.5"/><circle cx="157.5" cy="126" r="2.5"/></g><path d="M132 161 L132 167 M112 167 Q119 180 132 169 Q145 180 153 167" fill="none" stroke="#62482f" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></g></svg>`;
 return mattePortrait(svg,'poodle',first,second);
}
function maltesePortrait(first='#f5eddf',second=first){
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256"><g transform="translate(0 7)"><path d="M72 67 C87 46 108 39 121 42 C111 33 113 30 128 38 C143 28 150 32 138 42 C160 39 182 52 195 70 C215 94 237 125 238 151 C239 173 226 183 209 180 C195 190 181 178 179 164 L77 164 C75 181 59 190 46 180 C28 183 17 170 19 151 C20 125 48 87 72 67Z" fill="${second}"/><path d="M80 72 C91 51 108 44 128 45 C154 43 172 55 182 76 C192 101 192 130 191 153 C190 182 165 200 145 203 L137 199 L129 205 L120 200 L110 203 C88 198 66 180 65 154 C64 122 66 97 80 72Z" fill="${first}"/><g fill="none" stroke="#d9b88d" stroke-width="3" stroke-linecap="round" opacity=".36"><path d="M77 86 C65 107 65 129 66 145 C70 170 59 182 44 179"/><path d="M179 86 C191 107 191 129 190 145 C186 170 197 182 212 179"/><path d="M29 155 Q26 166 33 172 M227 155 Q230 166 223 172"/></g><g fill="#62482f"><circle cx="102" cy="119" r="8"/><circle cx="156" cy="119" r="8"/><path d="M120 145 C115 132 141 132 136 145 Q133 154 128 154 Q123 153 120 145Z"/></g><g fill="#fff9ec"><circle cx="99.5" cy="116" r="2.5"/><circle cx="153.5" cy="116" r="2.5"/></g><path d="M128 152 L128 160 M110 158 Q116 169 128 161 Q140 169 146 158" fill="none" stroke="#62482f" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/></g></svg>`;
 return mattePortrait(svg,'maltese',first,second);
}
function shihtzuPortrait(first='#f5eddf',second=first){
 // The reference has a white blaze and muzzle; only the colored patches change.
 const neutral=first==='#f5eddf',patch=neutral?'#cfa27c':first;
 const ears=second==='#f5eddf'?(neutral?'#cfa27c':patch):second;
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256"><g transform="translate(0 5)"><path d="M87 59 C66 50 43 75 29 100 C15 124 7 154 15 174 C20 184 31 185 38 181 C50 194 68 187 72 173 L91 100Z" fill="${ears}"/><path d="M87 59 C66 50 43 75 29 100 C15 124 7 154 15 174 C20 184 31 185 38 181 C50 194 68 187 72 173 L91 100Z" transform="translate(256 0) scale(-1 1)" fill="${ears}"/><path d="M119 44 C98 40 73 55 65 79 C54 104 56 137 66 159 C70 181 92 198 113 197 L122 201 L129 197 L137 201 L145 196 C169 199 190 180 193 157 C204 129 200 99 191 78 C180 53 157 41 137 44 C153 30 152 23 144 23 C136 22 132 32 129 37 C135 18 132 14 126 14 C116 14 120 29 124 36 C111 20 104 23 105 30 C106 35 114 40 119 44Z" fill="#fff5e5"/><path d="M61 102 C67 83 89 77 106 87 C117 94 119 106 118 120 C97 121 79 134 69 151 C62 140 58 118 61 102Z" fill="${patch}"/><path d="M195 102 C189 83 167 77 150 87 C139 94 137 106 138 120 C159 121 177 134 187 151 C194 140 198 118 195 102Z" fill="${patch}"/><path d="M69 151 C78 133 103 122 128 123 C151 122 179 135 187 151 C193 164 182 181 164 190 C152 196 139 194 128 191 C115 196 101 196 89 189 C73 182 63 166 69 151Z" fill="#fff5e5"/><g fill="none" stroke="#9d7152" stroke-opacity=".26" stroke-width="3" stroke-linecap="round"><path d="M25 159 Q20 174 29 180 M231 159 Q236 174 227 180"/></g><g fill="#62482f"><circle cx="101" cy="110" r="8"/><circle cx="155" cy="110" r="8"/><path d="M119 139 C114 126 142 126 137 139 Q134 149 128 149 Q122 148 119 139Z"/></g><g fill="#fff9ec"><circle cx="98.5" cy="107" r="2.5"/><circle cx="152.5" cy="107" r="2.5"/></g><path d="M128 147 L128 155 M110 153 Q116 165 128 156 Q140 165 146 153" fill="none" stroke="#62482f" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/></g></svg>`;
 return mattePortrait(svg,'shihtzu',first,second);
}
async function updateDog(){
 const request=++dogRequest,index=document.querySelector('#breed').selectedIndex;
 const group=document.querySelector('#dog-design'),portrait=document.querySelector('#dog-portrait');
 if(index<0||index>=dogNames.length){window.dogFaceURL=null;window.dogBaseImage=null;refreshDogGeometry();group.setAttribute('visibility','hidden');portrait.removeAttribute('href');document.querySelector('#avatar').replaceChildren(Object.assign(document.createElement('span'),{textContent:'?'}));document.querySelector('#design-note').textContent='믹스견·직접 입력 견종은 얼굴 이미지 준비 중이에요.';return;}
 const name=dogNames[index];
 try{
  const illustratedPortrait=name==='poodle'?poodlePortrait:name==='maltese'?maltesePortrait:name==='shihtzu'?shihtzuPortrait:null;
  if(!dogCache.has(name)){const img=new Image();img.src=illustratedPortrait?illustratedPortrait():'assets/dogs/'+name+'.png';await img.decode();dogCache.set(name,img);}
  if(request!==dogRequest)return;
  dogContext.clearRect(0,0,256,256);dogContext.drawImage(dogCache.get(name),0,0);
  const pixels=dogContext.getImageData(0,0,256,256),d=pixels.data;
  const two=state.fur==='two',first=rgb(two?document.querySelector('#fur-first').value:state.fur),second=rgb(two?document.querySelector('#fur-second').value:state.fur);
  for(let i=0;i<d.length;i+=4){if(!d[i+3])continue;const r=d[i],g=d[i+1],b=d[i+2],hi=Math.max(r,g,b),lo=Math.min(r,g,b),lum=(r+g+b)/3;
   // Preserve pink ears, charcoal outlines, eyes, nose, and pure white facial markings.
   if(hi-lo>24||lum<65||lum>244)continue;
   const x=(i/4)%256,y=Math.floor(i/4/256),color=two&&((x<75||x>181)||(lum<185&&y<180))?second:first;
   const blend=Math.min(1,(lum-65)/65),shade=Math.max(.72,Math.min(1.05,lum/218));
   for(let k=0;k<3;k++)d[i+k]=Math.round(d[i+k]*(1-blend)+Math.min(255,color[k]*shade)*blend);
  }
  dogContext.putImageData(pixels,0,0);
  if(illustratedPortrait){
   const poodle=new Image();poodle.src=illustratedPortrait(two?document.querySelector('#fur-first').value:state.fur,two?document.querySelector('#fur-second').value:state.fur);await poodle.decode();
   if(request!==dogRequest)return;
   dogContext.clearRect(0,0,256,256);dogContext.drawImage(poodle,0,0,256,256);
  }
  const url=dogCanvas.toDataURL('image/png');
  portrait.setAttribute('href',url);
  window.dogFaceURL=url; window.dogBaseImage=dogCache.get(name);
  const avatar=document.createElement('img');avatar.src=url;avatar.alt=state.breed+' 얼굴';document.querySelector('#avatar').replaceChildren(avatar);
  const wasVisible=group.getAttribute('visibility')==='visible';group.setAttribute('visibility',state.cream&&state.decoration?'visible':'hidden');
  if(state.cream&&state.decoration)animate(group,wasVisible?'replace':'add');
  refreshDogGeometry();
 }catch(error){document.querySelector('#design-note').textContent='얼굴 이미지를 불러오지 못했어요. 새로고침해주세요.';console.error(error);}
}
document.querySelector('#breed').addEventListener('change',updateDog);
for(const id of ['fur','fur-first','fur-second'])document.getElementById(id).addEventListener('change',updateDog);
document.querySelector('#decorations').addEventListener('click',updateDog);
document.querySelector('#sheets').addEventListener('click',updateDog);
document.querySelector('#exclusions').addEventListener('click',updateDog);
document.querySelector('#replay').addEventListener('click',replayDesign);

function silhouette(color){
 const c=document.createElement('canvas');c.width=c.height=256;const ctx=c.getContext('2d');ctx.drawImage(window.dogBaseImage,0,0,256,256);ctx.globalCompositeOperation='source-in';ctx.fillStyle=color;ctx.fillRect(0,0,256,256);return c.toDataURL();
}
function imageLayer(parent,url,y){const image=document.createElementNS('http://www.w3.org/2000/svg','image');for(const [k,v] of Object.entries({href:url,x:180,y,width:340,height:170,preserveAspectRatio:'none'}))image.setAttribute(k,v);parent.append(image);}
function refreshDogGeometry(){
 const valid=!!window.dogFaceURL,decorated=!!(state.cream&&state.decoration),shape=state.design==='shape'&&valid;
 document.querySelector('#sheet-layer').setAttribute('visibility',state.sheet&&!shape?'visible':'hidden');
 document.querySelector('#cream-layer').setAttribute('visibility',state.cream&&!shape?'visible':'hidden');
 document.querySelector('#dog-design').setAttribute('visibility',decorated&&!shape&&valid?'visible':'hidden');
 document.querySelector('#shaped-cake').setAttribute('visibility',shape&&state.sheet?'visible':'hidden');
 const base=document.querySelector('#shaped-sheet'),cream=document.querySelector('#shaped-cream');base.replaceChildren();cream.replaceChildren();cream.setAttribute('visibility','visible');
 if(shape&&state.sheet){const side=silhouette(state.sheet==='rice'?'#c8b18a':'#bc905f'),top=silhouette(ingredients[state.sheet].top);for(let y=245;y>=185;y-=2)imageLayer(base,side,y);imageLayer(base,top,185);
 if(state.cream){const icing=silhouette(ingredients[state.cream].top);for(let y=185;y>=170;y-=2)imageLayer(cream,icing,y);if(decorated)imageLayer(cream,window.dogFaceURL,169);}}
 document.querySelector('#design-note').textContent=!valid?'이 견종은 얼굴 이미지 준비 중이에요.':!decorated?'장식 재료를 고르면 얼굴과 생크림 장식이 완성돼요.':state.breed+' · '+(shape?'얼굴 모양 케이크':'윗면에 얼굴 그리기')+' · '+furLabel();
 document.querySelector('#cake').setAttribute('aria-label',decorated?(shape?'얼굴 윤곽의 케이크':'원형 케이크 윗면의 강아지 얼굴'):'케이크를 만드는 중');
}
window.refreshDogGeometry=refreshDogGeometry;
for(const button of document.querySelectorAll('[data-design]'))button.onclick=()=>{if(state.design===button.dataset.design)return;cancelReplay();state.design=button.dataset.design;for(const b of document.querySelectorAll('[data-design]')){b.classList.toggle('selected',b===button);b.setAttribute('aria-pressed',b===button);}refreshDogGeometry();if(state.sheet)animate(document.querySelector(state.design==='shape'?'#shaped-cake':'#dog-design'),'replace');};
function replayDesign(){refreshDogGeometry();const shape=state.design==='shape'&&window.dogFaceURL;document.querySelector('#dog-design').setAttribute('visibility','hidden');if(shape){animate(document.querySelector('#shaped-sheet'),'add');document.querySelector('#shaped-cream').setAttribute('visibility','hidden');replayTimers.push(setTimeout(()=>{document.querySelector('#shaped-cream').setAttribute('visibility','visible');animate(document.querySelector('#shaped-cream'),'add');document.querySelector('#cream-layer').setAttribute('visibility','hidden');},reduced()?0:680));}replayTimers.push(setTimeout(()=>{document.querySelector('#shaped-cream').setAttribute('visibility','visible');refreshDogGeometry();},reduced()?0:1450));}
updateDog();
