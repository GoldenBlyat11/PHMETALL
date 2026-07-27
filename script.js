(function(){
  const jar = document.getElementById('jar');
  const strip = document.getElementById('strip');
  const slots = Array.from(document.querySelectorAll('.slot'));

  // color a natural blueberry / red-cabbage / turmeric blend would show
  // across 9 slots, acidic -> basic
  const reactionColors = {
    1: '#E88E73',
    2: '#E7A680',
    3: '#E5B58A',
    4: '#E2C598',
    5: '#DCC79C',
    6: '#BDAE75',
    7: '#948A4A',
    8: '#69652F',
    9: '#5B5225' 
  };

  let dragging = false;
  let offsetX = 0, offsetY = 0;
  let homeParent, homeNext;

  function getPoint(e){
    if(e.touches && e.touches.length) return {x:e.touches[0].clientX, y:e.touches[0].clientY};
    if(e.changedTouches && e.changedTouches.length) return {x:e.changedTouches[0].clientX, y:e.changedTouches[0].clientY};
    return {x:e.clientX, y:e.clientY};
  }

  function startDrag(e){
    e.preventDefault();
    const rect = jar.getBoundingClientRect();
    const p = getPoint(e);
    offsetX = p.x - rect.left;
    offsetY = p.y - rect.top;

    homeParent = jar.parentNode;
    homeNext = jar.nextSibling;

    document.body.appendChild(jar);
    jar.style.left = rect.left + 'px';
    jar.style.top = rect.top + 'px';
    jar.style.width = rect.width + 'px';
    jar.style.height = rect.height + 'px';
    jar.classList.add('dragging');
    dragging = true;

    window.addEventListener('mousemove', onMove);
    window.addEventListener('touchmove', onMove, {passive:false});
    window.addEventListener('mouseup', endDrag);
    window.addEventListener('touchend', endDrag);
  }

  function onMove(e){
    if(!dragging) return;
    e.preventDefault();
    const p = getPoint(e);
    jar.style.left = (p.x - offsetX) + 'px';
    jar.style.top = (p.y - offsetY) + 'px';

    const hit = slotUnderJar();
    slots.forEach(s => { if(s !== hit) s.style.outline = 'none'; });
    if(hit) hit.style.outline = '2px dashed #3d5a80';
  }

  function slotUnderJar(){
    const jarRect = jar.getBoundingClientRect();
    const cx = jarRect.left + jarRect.width/2;
    const cy = jarRect.top + jarRect.height/2;
    for(const s of slots){
      const r = s.getBoundingClientRect();
      if(cx >= r.left && cx <= r.right && cy >= r.top && cy <= r.bottom){
        return s;
      }
    }
    return null;
  }

  function endDrag(e){
    if(!dragging) return;
    dragging = false;
    window.removeEventListener('mousemove', onMove);
    window.removeEventListener('touchmove', onMove);
    window.removeEventListener('mouseup', endDrag);
    window.removeEventListener('touchend', endDrag);

    const hit = slotUnderJar();
    slots.forEach(s => s.style.outline = 'none');

    if(hit){
      react(hit);
    }

    // return jar home
    jar.classList.remove('dragging');
    jar.style.left = '';
    jar.style.top = '';
    jar.style.width = '';
    jar.style.height = '';
    if(homeNext){
      homeParent.insertBefore(jar, homeNext);
    } else {
      homeParent.appendChild(jar);
    }
  }

  function react(slot){
    const idx = slot.getAttribute('data-index');
    const color = reactionColors[idx] || '#999';
    slot.style.background = color;
    slot.classList.add('wet', 'reacting');
    setTimeout(() => slot.classList.remove('reacting'), 700);
  }

  jar.addEventListener('mousedown', startDrag);
  jar.addEventListener('touchstart', startDrag, {passive:false});
})();
