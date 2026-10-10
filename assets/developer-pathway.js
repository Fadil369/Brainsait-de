(() => {
 const $=id=>document.getElementById(id);
 const labels={en:{loading:'Checking the live endpoint…',complete:'Response received from the IDN service.',error:'The endpoint is unavailable. Try again later.',copied:'Request copied.',failed:'Clipboard unavailable. The request remains visible above.'},ar:{loading:'جارٍ فحص نقطة الاتصال المباشرة…',complete:'تم استلام الاستجابة من خدمة IDN.',error:'نقطة الاتصال غير متاحة. أعد المحاولة لاحقًا.',copied:'تم نسخ الطلب.',failed:'الحافظة غير متاحة. الطلب ظاهر أعلاه.'}};
 const text=key=>labels[document.documentElement.lang][key];
 const endpoint=()=>{const url=new URL('https://idn.brainsait.de/api/verify');url.searchParams.set('label',$('label').value.trim());return url.href};
 const update=()=>{$('request').textContent="curl --fail '"+endpoint()+"'"};
 $('label').addEventListener('input',update);update();
 $('run').onclick=async()=>{
  if(!$('label').reportValidity())return;
  $('run').disabled=true;$('response').hidden=true;$('result-status').textContent=text('loading');
  try{const response=await fetch(endpoint(),{signal:AbortSignal.timeout(12000)});if(!response.ok)throw new Error('HTTP '+response.status);const data=await response.json();if(typeof data.eligible!=='boolean')throw new Error('Unexpected response');$('response').textContent=JSON.stringify(data,null,2);$('response').hidden=false;$('result-status').textContent=text('complete')}catch{$('result-status').textContent=text('error')}finally{$('run').disabled=false}
 };
 $('copy').onclick=async()=>{try{await navigator.clipboard.writeText($('request').textContent);$('result-status').textContent=text('copied')}catch{$('result-status').textContent=text('failed')}};
 window.addEventListener('brainsait-language',()=>{$('result-status').textContent=''});
})();
