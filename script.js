// Scroll animations
const observer = new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
        if(entry.isIntersecting){entry.target.classList.add("show")}
    })
});
document.querySelectorAll("section").forEach(section=>{
    section.classList.add("hidden");
    observer.observe(section);
});

// Cursor glow
const glow = document.querySelector(".cursor-glow");
document.addEventListener("mousemove", e=>{
    glow.style.left = e.clientX + "px";
    glow.style.top = e.clientY + "px";
});

// 3D tilt cards
document.querySelectorAll('.tilt').forEach(card=>{
    card.addEventListener('mousemove', e=>{
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const cx = rect.width/2;
        const cy = rect.height/2;
        const dx = x - cx;
        const dy = y - cy;
        card.style.transform = `rotateY(${dx/15}deg) rotateX(${-dy/15}deg) translateZ(0px)`;
    });
    card.addEventListener('mouseleave', ()=>{card.style.transform=`rotateY(0deg) rotateX(0deg)`;});
});

// Audio visualizer
const audio = document.getElementById('beatAudio');
const canvas = document.getElementById('audioVisualizer');
const ctx = canvas.getContext('2d');
canvas.width = 400; canvas.height = 100;
const audioCtx = new (window.AudioContext||window.webkitAudioContext)();
const analyser = audioCtx.createAnalyser();
const source = audioCtx.createMediaElementSource(audio);
source.connect(analyser); analyser.connect(audioCtx.destination);
analyser.fftSize=64; const bufferLength=analyser.frequencyBinCount;
const dataArray=new Uint8Array(bufferLength);
function drawVisualizer(){
    requestAnimationFrame(drawVisualizer);
    analyser.getByteFrequencyData(dataArray);
    ctx.clearRect(0,0,canvas.width,canvas.height);
    const barWidth = canvas.width / bufferLength;
    for(let i=0;i<bufferLength;i++){
        const barHeight = dataArray[i];
        ctx.fillStyle = '#55aaff';
        ctx.fillRect(i*barWidth,canvas.height-barHeight,barWidth,barHeight);
    }
}
audio.onplay=()=>{audioCtx.resume(); drawVisualizer();}

// Modal logic
const bookingBtn = document.querySelectorAll('.btn-primary, .btn-cta');
const modal = document.getElementById('bookingModal');
const closeBtn = document.querySelector('.close');
const thankYou = document.getElementById('thankYou');

document.querySelectorAll('.btn-primary, .btn-cta').forEach(btn=>{
    btn.addEventListener('click', ()=>{
        modal.style.display='flex';
        thankYou.style.display='none';
    });
});

closeBtn.addEventListener('click', ()=>{ modal.style.display='none'; });
window.addEventListener('click', e=>{ if(e.target==modal) modal.style.display='none'; });

// Listen button scroll
const listenBtn = document.querySelector('.btn-secondary');
const beatsSection = document.querySelector('.beats');
listenBtn.addEventListener('click', e=>{
    e.preventDefault();
    beatsSection.scrollIntoView({behavior:'smooth'});
    const audio = document.getElementById('beatAudio');
    audio.play();
});

// Netlify form submission with thank-you toast
const form = document.querySelector('form[name="booking"]');
form.addEventListener('submit', e=>{
    e.preventDefault();
    const formData = new FormData(form);
    fetch("/", {
        method:"POST",
        body:formData
    }).then(()=>{
        form.reset();
        thankYou.style.display = "block";
    }).catch((error)=>{alert("Error: "+error)});
});

function playVideo(el, id){
    el.innerHTML = `<iframe 
    src="https://www.youtube.com/embed/${id}?autoplay=1" 
    frameborder="0" allowfullscreen></iframe>`;
}

function playVideo(el, id){
    el.innerHTML = `<iframe 
    src="https://www.youtube.com/embed/${id}?autoplay=1" 
    frameborder="0" allowfullscreen></iframe>`;
}

document.querySelector('.contact-email').addEventListener('click', ()=>{
    navigator.clipboard.writeText('zeyd.hasla@gmail.com');
});