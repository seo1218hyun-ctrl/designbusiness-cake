const $=s=>document.querySelector(s);
const ingredients={potato:{name:'감자',icon:'🥔',top:'#fff5e4'},sweetpotato:{name:'고구마',icon:'🍠',top:'#efcf92'},oat:{name:'오트밀',icon:'🌾',top:'#ddbd91'},rice:{name:'쌀',icon:'🍚',top:'#ebdab9'},salmon:{name:'연어',icon:'🐟',top:'#f3c9b4'},tuna:{name:'참치',icon:'🐟',top:'#e8d5c5'},chicken:{name:'닭',icon:'🐓',top:'#fff1d7'}};
const state={design:'surface',breed:'말티즈',breedCustom:'',fur:'#f5eddf',allergy:null,excluded:[],other:'',size:null,sheet:null,cream:null,decoration:null,petName:'',message:''};
let replayTimers=[];
let allergyDetailsOpen=false;
const reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
function animate(el,mode){el.getAnimations().forEach(a=>a.cancel());if(reduced())return;el.animate(mode==='add'?[{transform:'translateY(-110px)',opacity:0},{transform:'translateY(5px)',opacity:1,offset:.8},{transform:'translateY(0)',opacity:1}]:[{opacity:.35,transform:'translateY(-5px)'},{opacity:1,transform:'translateY(0)'}],{duration:mode==='add'?750:380,easing:'cubic-bezier(.22,1,.36,1)'});}
function cancelReplay(){replayTimers.forEach(clearTimeout);replayTimers=[];}
function choose(key,value){cancelReplay();const previous=state[key];if(previous===value)return;state[key]=value;render();if(key==='sheet'||key==='cream'){animate($(state.design==='shape'&&window.dogFaceURL?'#shaped-'+key:'#'+key+'-layer'),previous?'replace':'add');$('#announcement').textContent=ingredients[value].name+' '+(key==='sheet'?'시트':'크림')+(previous?'으로 바뀌었어요.':'이 쌓였어요.');}}
function render(){
 document.querySelectorAll('#allergy button').forEach(b=>{b.classList.toggle('selected',b.dataset.value===state.allergy);b.setAttribute('aria-pressed',b.dataset.value===state.allergy);});
 $('#allergy-details').hidden=state.allergy!=='yes'||!allergyDetailsOpen;$('#allergy-note').textContent=state.allergy==='unknown'?'각 옵션의 재료를 확인해주세요. 현재 옵션은 시연용이에요.':state.allergy==='yes'?'고른 재료가 들어간 옵션은 선택할 수 없어요.':'먼저 알려주시면 재료를 고를 때 반영할게요.';
 for(const [container,key,keys] of [['#sheets','sheet',['oat','rice']],['#creams','cream',['salmon','tuna','chicken']],['#decorations','decoration',['potato','sweetpotato']]]){
  $(container).replaceChildren(...keys.map(id=>{const item=ingredients[id],b=document.createElement('button');b.disabled=state.excluded.includes(id)||(key==='cream'&&!state.sheet)||(key==='decoration'&&!state.cream);b.className=state[key]===id?'selected':'';b.setAttribute('aria-pressed',state[key]===id);b.innerHTML=`<span class="ingredient">${item.icon}</span><b>${item.name}</b><small>${state.excluded.includes(id)?'피할 재료예요':key==='cream'&&!state.sheet?'시트를 먼저 골라주세요':key==='sheet'?'케이크의 첫 번째 층':'부드럽게 더하는 한 층'}</small>`;b.onclick=()=>choose(key,id);return b;}));
 }
 document.querySelectorAll('#sizes button').forEach(b=>{b.classList.toggle('selected',b.dataset.value===state.size);b.setAttribute('aria-pressed',b.dataset.value===state.size);});
 document.querySelectorAll('#exclusions button').forEach(b=>{b.classList.toggle('selected',state.excluded.includes(b.dataset.value));b.setAttribute('aria-pressed',state.excluded.includes(b.dataset.value));});
 $('#cream-piping').setAttribute('visibility',state.cream&&state.decoration?'visible':'hidden');
 if(state.decoration)document.querySelectorAll('#piping-white stop').forEach(stop=>stop.setAttribute('stop-color',ingredients[state.decoration].top));
 $('#cake-scale').style.transform=`scale(${({small:.75,medium:.9,large:1.05}[state.size]||1)})`;
 $('#sheet-layer').setAttribute('visibility',state.sheet?'visible':'hidden');$('#cream-layer').setAttribute('visibility',state.cream?'visible':'hidden');
 if(state.sheet)$('#sheet-top').setAttribute('fill',ingredients[state.sheet].top);
 if(state.cream){const color=ingredients[state.cream].top;$('#cream-top').setAttribute('fill',color);document.querySelectorAll('#icing stop').forEach((stop,i)=>{stop.setAttribute('stop-color',color);stop.setAttribute('stop-opacity',1);});}
 const title=state.cream?'우리 아이의 케이크가 쌓였어요.':state.sheet?'첫 번째 층이 자리 잡았어요.':'아직은 빈 판이에요.';
 $('#scene-title').textContent=title;$('#scene-step').textContent=state.cream?'A LITTLE CELEBRATION':state.sheet?'ONE LAYER OF LOVE':'READY WHEN YOU ARE';$('#scene-description').textContent=state.cream?'다른 재료가 궁금하면 골라보세요. 그 부분만 바뀌어요.':state.sheet?'이제 부드러운 크림을 더해볼까요?':'좋아하는 재료로 첫 번째 층을 채워주세요.';
 $('#cake').setAttribute('aria-label',title);$('#selection-summary').textContent=[state.size&&({small:'소형견',medium:'중형견',large:'대형견'}[state.size]),state.sheet&&ingredients[state.sheet].name+' 시트',state.cream&&ingredients[state.cream].name+' 크림',state.decoration&&ingredients[state.decoration].name+' 장식'].filter(Boolean).join(' · ')||'아직 고른 재료가 없어요.';$('#replay').disabled=!state.sheet;
 if(window.refreshDogGeometry)window.refreshDogGeometry();
 $('#validation').textContent=state.allergy&&state.size&&state.sheet&&state.cream&&state.decoration?'좋아요. 이제 받는 날을 정하러 가볼까요?':'알러지 여부와 크기, 시트, 크림, 장식을 골라주세요.';
}
$('.close-details').onclick=()=>{allergyDetailsOpen=false;$('#allergy-details').hidden=true;};
$('#allergy').onclick=e=>{const b=e.target.closest('button');if(!b)return;state.allergy=b.dataset.value;allergyDetailsOpen=state.allergy==='yes';if(state.allergy!=='yes'){state.excluded=[];state.other='';$('#other-allergy').value='';}render();};
$('#sizes').onclick=e=>{const b=e.target.closest('button');if(b)choose('size',b.dataset.value);};
for(const [id,item] of Object.entries(ingredients)){const b=document.createElement('button');b.textContent=item.name;b.dataset.value=id;b.onclick=()=>{cancelReplay();state.excluded=state.excluded.includes(id)?state.excluded.filter(x=>x!==id):[...state.excluded,id];if(state.excluded.includes(state.sheet)){state.sheet=null;state.cream=null;}if(state.excluded.includes(state.cream))state.cream=null;if(!state.cream||state.excluded.includes(state.decoration))state.decoration=null;render();};$('#exclusions').append(b);}
$('#breed').onchange=e=>{state.breed=e.target.value;$('#breed-custom-wrap').hidden=!['믹스견','목록에 없어요'].includes(state.breed);};
$('#pet-name').oninput=e=>state.petName=e.target.value;
$('#breed-custom').oninput=e=>state.breedCustom=e.target.value;
$('#fur-second').value='#aa7954';
function updateFur(){state.fur=$('#fur').value;$('#fur-pair').hidden=state.fur!=='two';$('#avatar').style.background=state.fur==='two'?`linear-gradient(120deg, ${$('#fur-first').value} 50%, ${$('#fur-second').value} 50%)`:state.fur;}
function breedLabel(){return ['믹스견','목록에 없어요'].includes(state.breed)&&state.breedCustom.trim()?state.breed+' · '+state.breedCustom.trim():state.breed;}
function furLabel(){return state.fur==='two'?[$('#fur-first').selectedOptions[0].textContent,$('#fur-second').selectedOptions[0].textContent].join(' + '):$('#fur').selectedOptions[0].textContent;}
$('#fur').onchange=updateFur;$('#fur-first').onchange=updateFur;$('#fur-second').onchange=updateFur;$('#message').oninput=e=>{state.message=e.target.value;$('#counter').textContent=state.message.length+' / 20';updatePlateMessage();};$('#other-allergy').oninput=e=>state.other=e.target.value;
$('#replay').onclick=()=>{cancelReplay();$('#sheet-layer').setAttribute('visibility','visible');animate($('#sheet-layer'),'add');if(state.cream){$('#cream-layer').setAttribute('visibility','hidden');replayTimers.push(setTimeout(()=>{$('#cream-layer').setAttribute('visibility','visible');animate($('#cream-layer'),'add');},reduced()?0:650));}};
$('#next').onclick=()=>{if(!state.allergy||!state.size||!state.sheet||!state.cream||!state.decoration){$('#validation').textContent='아직 고르지 않은 옵션이 있어요. 알러지, 크기, 시트, 크림, 장식을 확인해주세요.';return;}if(state.allergy==='yes'&&!state.excluded.length&&!state.other.trim()){$('#validation').textContent='피해야 할 재료를 선택하거나 직접 적어주세요.';$('#other-allergy').focus();return;}const rows=[['강아지 이름',state.petName.trim()||'입력 안 함'],['장식 재료',ingredients[state.decoration].name],['견종',breedLabel()],['털 색',furLabel()],['케이크',$('#selection-summary').textContent],['피할 재료',state.allergy==='yes'?[...state.excluded.map(id=>ingredients[id].name),state.other].filter(Boolean).join(', '):state.allergy==='none'?'없음':'아직 모름'],['문구',state.message||'문구 없음']];$('#summary').replaceChildren(...rows.map(([k,v])=>{const row=document.createElement('div');row.className='summary-row';const label=document.createElement('span'),value=document.createElement('b');label.textContent=k;value.textContent=v;row.append(label,value);return row;}));$('#editor').hidden=true;$('#next-door').hidden=false;$('aside').scrollTop=0;};$('#back').onclick=()=>{$('#next-door').hidden=true;$('#editor').hidden=false;};render();

function updatePlateMessage(){const message=state.message.trim();$('#plate-message-text').textContent=message;$('#plate-message').setAttribute('visibility',message?'visible':'hidden');$('#plate-message').setAttribute('font-size',message.length>16?'11':'13');}
updatePlateMessage();
