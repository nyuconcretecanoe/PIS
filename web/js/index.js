
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


let loadedCsv1;
let loadedCsv2;

let proceedenabled = false;


document.getElementById('file-upload1').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {

        document.getElementById("upload1").innerHTML = `
        <div class="upload-text" style="margin-top: 25px;">Phone CSV Uploaded</div>
        <img src="./assets/greencheck.png" alt="checkmark" style="width: 34%;">
        `;

        document.getElementById('file-upload1').disabled = true;
        document.getElementById('upload1holder').style.cursor = "not-allowed";
        document.getElementById('upload1').style.cursor = "not-allowed";
        document.getElementById('file-upload1').style.cursor = "not-allowed";



        const reader = new FileReader();
        reader.onload = function(e) {
            const content = e.target.result;
            // document.getElementById('output').innerText = content;
            loadedCsv1 = content;
            // console.log(loadedCsv1);

            if (loadedCsv2 != null){
                enableanalysis();
            }
        };
        reader.readAsText(file);
    }
});


document.getElementById('file-upload2').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {

        document.getElementById("upload2").innerHTML = `
        <div class="upload-text" style="margin-top: 25px;">Watch CSV Uploaded</div>
        <img src="./assets/greencheck.png" alt="checkmark" style="width: 34%;">
        `;

        document.getElementById('file-upload2').disabled = true;
        document.getElementById('upload2holder').style.cursor = "not-allowed";
        document.getElementById('upload2').style.cursor = "not-allowed";
        document.getElementById('file-upload2').style.cursor = "not-allowed";


        const reader = new FileReader();
        reader.onload = function(e) {
            const content = e.target.result;
            // document.getElementById('output').innerText = content;
            loadedCsv2 = content;
            // console.log(loadedCsv2);
            if (loadedCsv1 != null){
                enableanalysis();
            }
        };
        reader.readAsText(file);
    }
});



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