
function openprefs(){
    document.getElementById('preferences').style.display = 'block';
    document.getElementById('preferences').style.opacity = 1;
    document.getElementById('preferences').style.top = '25%';
}


function openel(el){
    document.getElementById(el).style.display = 'block';
    document.getElementById(el).style.opacity = 1;
    document.getElementById(el).style.top = '25%';
}

function toggletheme(override){
    var r = document.querySelector(':root');

    let endtime = new Date();
    var timediff = endtime - lasttoggle; 
    lasttoggle = endtime;

    if (timediff < 333 && !override){
        return;
    }

    console.log('changeing from  '+theme);
    if (theme == 'dark'){
        // make light
        theme = 'light';
        localStorage.setItem('bttheme','light');
        document.getElementById('theme').textContent = "Theme: (light)";
        r.style.setProperty('--bg', 'white');
        r.style.setProperty('--bgslight', 'rgba(255,255,255,0.6)');
        r.style.setProperty('--contrast', 'black');
        r.style.setProperty('--main', '#0d6efd');
        r.style.setProperty('--secondary', '#0a4bad');
        r.style.setProperty('--slight', 'rgb(220,220,220)');
    } else {
        // make dark
        theme = 'dark';
        localStorage.setItem('bttheme','dark');
        document.getElementById('theme').textContent = "Theme: (dark)";
        r.style.setProperty('--bgslight', 'rgba(30,30,30,0.6)');
        r.style.setProperty('--bg', 'black');
        r.style.setProperty('--contrast', 'white');
        r.style.setProperty('--main', '#0d6efd');
        r.style.setProperty('--secondary', '#0a4bad');
        r.style.setProperty('--slight', 'rgb(30, 30, 30)');
    }
}

function forcedark(){
    theme = 'dark';
    localStorage.setItem('bttheme','dark');
    document.getElementById('theme').textContent = "Theme: (dark)";
    
    var r = document.querySelector(':root');
    r.style.setProperty('--bgslight', 'rgba(30,30,30,0.6)');
    r.style.setProperty('--bg', 'black');
    r.style.setProperty('--contrast', 'white');
    r.style.setProperty('--main', '#0d6efd');
    r.style.setProperty('--secondary', '#0a4bad');
    r.style.setProperty('--slight', 'rgb(30, 30, 30)');
}

function closeprefs(){
    //document.getElementById('solutions').style.display = 'none';
    document.getElementById('preferences').style.opacity = 0;
    document.getElementById('preferences').style.top = '100%';
}

function closeel(el){
    //document.getElementById('solutions').style.display = 'none';
    document.getElementById(el).style.opacity = 0;
    document.getElementById(el).style.top = '100%';

}

function closesolutions(){
    //document.getElementById('solutions').style.display = 'none';
    document.getElementById('solutions').style.opacity = 0;
    document.getElementById('solutions').style.top = '100%';
}

function closeinstructions(){
    document.getElementById('instructions').style.top = '100%';
    document.getElementById('instructions').style.opacity = 0;
}
  

function enableanalysis(){
    document.getElementById("coolbutton").style.opacity = 1;
    document.getElementById("coolbutton").style.cursor = "pointer";
    proceedenabled = true;
}

function switchscreens(){
    if (!proceedenabled){
        return;
    }
    document.getElementById("screen1").style.display = "none";
    document.getElementById("screen2").style.display = "block";
}


let phoneAccelerometerCSV;
let phoneGyroscopeCSV;
let phoneMagnetometerCSV;
let watchAccelerometerCSV;
let watchGyroscopeCSV;
let watchMagnetometerCSV;

let proceedenabled = false;

let i = 1;
while (i < 7){
    const j = i;
    document.getElementById('file-upload'+j).addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
    
            document.getElementById("upload"+j).innerHTML = `
            <div class="upload-text" style="width: 50%; text-align: right; float: left;">Uploaded</div>
            <img src="./assets/greencheck.png" alt="checkmark" style="margin-left: 5%; margin-top: 2%; width: 10%; float: left;">
            `;
    
            document.getElementById('file-upload'+j).disabled = true;
            document.getElementById('upload'+j).style.cursor = "not-allowed";
            document.getElementById('file-upload'+j).style.cursor = "not-allowed";
    
    
    
            const reader = new FileReader();
            reader.onload = function(e) {
                const content = e.target.result;
                // document.getElementById('output').innerText = content;
                if (j == 1){
                    phoneAccelerometerCSV = content;
                } else if (j == 2){
                    phoneGyroscopeCSV = content;
                } else if (j == 3){
                    phoneMagnetometerCSV = content;
                } else if (j == 4){
                    watchAccelerometerCSV = content;
                } else if (j == 5){
                    watchGyroscopeCSV = content;
                } else if (j == 6){
                    watchMagnetometerCSV = content;
                }
                console.log(content);
    
                if (phoneAccelerometerCSV != null && phoneGyroscopeCSV != null && phoneMagnetometerCSV != null && watchAccelerometerCSV != null && watchGyroscopeCSV != null && watchMagnetometerCSV != null){
                    enableanalysis();
                }
            };
            reader.readAsText(file);
        }
    });
    i += 1;
}



// load the settings from localstorage
let theme = localStorage.getItem('bttheme');
let angle = localStorage.getItem('btangle');
let demospeed = localStorage.getItem('btspeed');

let lasttoggle = new Date();


if (theme == null){
    localStorage.setItem("bttheme",'dark');
    theme = 'dark';
    forcedark();
} else if (theme == 'dark'){
    forcedark();
}

const sleep = ms => new Promise(res => setTimeout(res, ms));