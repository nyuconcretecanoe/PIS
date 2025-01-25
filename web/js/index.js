let tickYarr = [];
let tickXarr = [];
let pointsarr = [];

let tickYbasis = 0;

let tickYincrement = 0.25;
let tickXincrement = 200;

let tickYbasis2 = 0;

let tickYincrement2 = 0.25;
let tickXincrement2 = 200;

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

    // the dict makedict returns is not important at this point
    makedict(phoneAccelerometerCSV, "PhoneAccel");
    makedict(phoneGyroscopeCSV, "PhoneGyro");
    makedict(phoneMagnetometerCSV, "PhoneMag");

    makedict(LeftWatchCSV, "LeftWatch");
    makedict(RightWatchCSV, "RightWatch");
    
    splitdata();

    updateOptimalGraph();
}

function initDraw(){
    let i = 20;
    let n = 0;
    while (i <= 100){
      drawTickY(0,i,n);
      n += 1;
      i += 10*2;
    }
    i = 10;
    n = 0;
    while (i <= 100){
      drawTickX(i, n, 0);
      i += 10;
    }
  }
  

function goodNumber(num){
    if (num < 100){
        return "&nbsp&nbsp"+String(num);
    }

    return String(num);
}


async function growPoint(id){

    let obj = document.getElementById(id);

    let w = 1;
    while (w < 100){
    obj.style.width = (w/100)*2.8+"%";
    await sleep();
    w += (110-w)/20;
    }
} 
  
function drawPoint(x, y, n, grow) {
    const num = n;

    console.log("drawing point at untampered "+x+" "+y);


    [coordX, coordY] = getcoord(x,y);

    // console.log("drawing point at "+coordX+" "+coordY);
    plotgraph.innerHTML += `<div class=point style="left: ${coordX}px; top: ${coordY}px;"></div>`;

}


function graphString(source, feature) {

    let arr = source[feature];

    let endstr = ""

    let i = 0;
    while (i < arr.length){
        if (!isNaN(arr[i]) && arr[i] != null){
            // point[0]/tickXincrement*10, point[1]/tickYincrement*10*2
            if (source == optimaldata){
                [coordX, coordY] = getcoord(i/tickXincrement*10, (arr[i]-tickYbasis)/tickYincrement*10*2);
                endstr += `<div class=point style="left: ${coordX}px; top: ${coordY}px;"></div>`;
            } else {
                [coordX, coordY] = getcoord(i/tickXincrement*10, (arr[i]-tickYbasis2)/tickYincrement2*10*2);
                endstr += `<div class=point style="left: ${coordX}px; top: ${coordY}px;"></div>`;
            }

        
        }
        i += 1;
    }

    return endstr;
}


function getcoord(percentX, percentY) {

    // let x = plotgraph.offsetLeft+percentX/100*plotgraph.offsetWidth+1.5;
    // let y = plotgraph.offsetTop+(1-(percentY/100))*plotgraph.offsetHeight+1.5;

    let x = percentX/100*plotgraph.offsetWidth;
    let y = (1-(percentY/100))*plotgraph.offsetHeight;

    return [x,y];
}

function tworound(num){
    return Math.round((num + Number.EPSILON) * 100) / 100
}

  
function drawTickX(x, y, i, push=true) {
    if (push){
        tickXarr.push([x, y]);
    }

    [coordX, coordY] = getcoord(x,y);

    plotgraph.innerHTML += `
    <div id="labelX${i}" class=tickLabel style="left: ${coordX-7.75-3}px; top: ${coordY}px;">${tworound(x*(tickXincrement/1000))}</div>
    <div id="tickX${i}" class=tickX style="left: ${coordX-3}px; top: ${coordY-0.017*plotgraph.offsetHeight}px;"></div>`;
}



function drawTickX2(x, y, i, push=true) {
    if (push){
        tickXarr.push([x, y]);
    }

    [coordX, coordY] = getcoord(x,y);

    plotgraph2.innerHTML += `
    <div id="labelX${i}" class=tickLabel style="left: ${coordX-7.75-3}px; top: ${coordY}px;">${tworound(x*(tickXincrement/1000))}</div>
    <div id="tickX${i}" class=tickX style="left: ${coordX-3}px; top: ${coordY-0.017*plotgraph.offsetHeight}px;"></div>`;
}


function drawTickY(x, y, num, push=true) {
    if (push){
        tickYarr.push([x, y]);
    }
  
    [coordX, coordY] = getcoord(x,y);

    // IMPORTANT: HALFS DISPLAY VALUE
  
    plotgraph.innerHTML += `
      <div id="labelY${num}" class=tickLabel style="left: ${coordX-0.04*window.innerWidth}px; top: ${coordY-9.75+2}px;">${goodNumber(tworound(y*(tickYincrement/10)/2+tickYbasis))}</div>
      <div id="tickY${num}" class=tickY style="left: ${coordX}px; top: ${coordY+2}px;"></div>`;
}

function drawTickY2(x, y, num, push=true) {
    if (push){
        tickYarr.push([x, y]);
    }
  
    [coordX, coordY] = getcoord(x,y);

    // IMPORTANT: HALFS DISPLAY VALUE
  
    plotgraph2.innerHTML += `
      <div id="labelY${num}" class=tickLabel style="left: ${coordX-0.04*window.innerWidth}px; top: ${coordY-9.75+2}px;">${goodNumber(tworound(y*(tickYincrement2/10)/2+tickYbasis2))}</div>
      <div id="tickY${num}" class=tickY style="left: ${coordX}px; top: ${coordY+2}px;"></div>`;
}

function drawResid(x, y, num){

    console.log("in resid");

    let [coordX, coordY] = getcoord(x,y);

    let resid = pointsarr[num][1] - ySolution(pointsarr[num][0]);

    const w = pointsarr[num][0]/tickXincrement*10+0.7+"%";
    let storeh = resid/tickYincrement*10+0.05;
    //const h = (resid/tickYincrement*10+0.05)+"%";

    // alert(storeh, resid);

    let offset;

    if (resid >= 0){
        offset = ySolution(pointsarr[num][0])/tickYincrement*10+"%";
    } else {
        storeh = -storeh;

        offset = pointsarr[num][1]/tickYincrement*10+"%";
    }

    storeh = storeh + "%";


    const h = storeh;

    const offsetuse = offset;

    console.log("middle of resid");

    residualArr.push(resid);


    plotgraph.innerHTML += `
    <div id="residualLine${num}" class=residualLine style="width: ${w}; height: ${h}; bottom: ${offsetuse}"></div>`;

}

function addpointmanual(x, y){

    let newpts = [x,y];
    pointsarr.push(newpts);

    lite();

    // in this case, not even needed since we pre-scale axes
    // monitorChange(x,y);
  }


// we dont actually care about this for this i think
function monitorChange(x,y){

    if (x <= tickXincrement*10 && y <= tickYincrement*5){
        return;
    }
  
    while (x > tickXincrement*10){
      tickXincrement = tickXincrement + 0.01;
    }
  
  
    while (y > tickYincrement*5){
      tickYincrement = tickYincrement + 0.01;
    }

    console.log("increments changed",tickXincrement, tickYincrement);

  
    redraw();
}


function predraw(feature){
    console.log('feature',feature);

    let label;

    if (feature == "PhoneAccelX"){
        tickYbasis = -1.25;
        tickYincrement = 0.25;
        label = "m/s²";
    } else if (feature == "PhoneAccelY"){
        tickYbasis = 0;
        tickYincrement = 0.25;
        label = "m/s²";
    } else if (feature == "PhoneAccelZ"){
        tickYbasis = -0.7;
        tickYincrement = 0.25;
        label = "m/s²";
    } else if (feature == "PhoneGyroX"){
        tickYbasis = -2;
        tickYincrement = 1;        
        label = "rad/s";
    } else if (feature == "PhoneGyroY"){
        tickYbasis = -2;
        tickYincrement = 1;
        label = "μT";
    } else if (feature == "PhoneGyroZ"){
        tickYbasis = -2;
        tickYincrement = 1;
        label = "μT";
    } else if (feature == "PhoneMagX"){
        tickYbasis = -140;
        tickYincrement = 10;
        label = "μT";
    } else if (feature == "PhoneMagY"){
        tickYbasis = -60;
        tickYincrement = 10;
        label = "μT";
    } else if (feature == "PhoneMagZ"){
        tickYbasis = -320;
        tickYincrement = 10;
        label = "μT";
    }

    plotgraph.innerHTML = ``;
  
    let i = tickYbasis;
    for (tick of tickYarr){
      drawTickY(tick[0], tick[1], i, false);
      i += tickYincrement;
    }

    [coordX, coordY] = getcoord(0,0);

    plotgraph.innerHTML += `
    <div class=tickLabel style="left: ${coordX-0.035*window.innerWidth}px; top: ${coordY-9.75+2}px;">${label}</div>`;

  
    i = 0;
    for (tick of tickXarr){
      drawTickX(tick[0], tick[1], i, false);
      i += 1;
    }
}


function predrawsecond(feature){
    console.log('feature',feature);

    let label;

    // DONT manually put these in, they should be automatically calculated after trimming and whatnot
    if (feature == "PhoneAccelX"){
        [tickYbasis2, tickYincrement2] = setplotparams(sampleDict.PhoneAccelX);
        label = "m/s²";
    } else if (feature == "PhoneAccelY"){
        [tickYbasis2, tickYincrement2] = setplotparams(sampleDict.PhoneAccelY);
        label = "m/s²";
    } else if (feature == "PhoneAccelZ"){
        [tickYbasis2, tickYincrement2] = setplotparams(sampleDict.PhoneAccelZ);
        label = "m/s²";
    } else if (feature == "PhoneGyroX"){
        [tickYbasis2, tickYincrement2] = setplotparams(sampleDict.PhoneGyroX);      
        label = "rad/s";
    } else if (feature == "PhoneGyroY"){
        [tickYbasis2, tickYincrement2] = setplotparams(sampleDict.PhoneGyroY);
        label = "μT";
    } else if (feature == "PhoneGyroZ"){
        [tickYbasis2, tickYincrement2] = setplotparams(sampleDict.PhoneGyroZ);
        label = "μT";
    } else if (feature == "PhoneMagX"){
        [tickYbasis2, tickYincrement2] = setplotparams(sampleDict.PhoneMagX);
        label = "μT";
    } else if (feature == "PhoneMagY"){
        [tickYbasis2, tickYincrement2] = setplotparams(sampleDict.PhoneMagY);
        label = "μT";
    } else if (feature == "PhoneMagZ"){
        [tickYbasis2, tickYincrement2] = setplotparams(sampleDict.PhoneMagZ);
        label = "μT";
    }

    plotgraph2.innerHTML = ``;
  
    let i = tickYbasis2;
    for (tick of tickYarr){
      drawTickY2(tick[0], tick[1], i, false);
      i += tickYincrement2;
    }

    [coordX, coordY] = getcoord(0,0);

    plotgraph2.innerHTML += `
    <div class=tickLabel style="left: ${coordX-0.035*window.innerWidth}px; top: ${coordY-9.75+2}px;">${label}</div>`;

  
    i = 0;
    for (tick of tickXarr){
      drawTickX2(tick[0], tick[1], i, false);
      i += 1;
    }
}



function redraw(pointgrow = null){

    plotgraph.innerHTML = ``;
  
    let i = tickYbasis;
    for (tick of tickYarr){
      drawTickY(tick[0], tick[1], i, false);
      i += tickYincrement;
    }
  
    i = 0;
    for (tick of tickXarr){
      drawTickX(tick[0], tick[1], i, false);
      i += 1;
    }
  
    console.log(pointgrow)
  
    i = 0;
    for (point of pointsarr){
      drawPoint(point[0]/tickXincrement*10, (point[1]-tickYbasis)/tickYincrement*10*2, i, (pointgrow == i));
      i += 1;
    }
  
    // plotgraph.innerHTML += `<div id="tickedBox" class="tickedBox"></div>`;
  
}

// lite redraw
function redrawlite(){
  
    let i = pointsarr.length-1;
  
    // console.log("point "+i+" being drawn");
    point = pointsarr[i];
    drawPoint(point[0]/tickXincrement*10, (point[1]-tickYbasis)/tickYincrement*10*2, i, true)
}

function makedict(datastr, type){
    let spltup = datastr.split('\n');

    let enddict = {
        "time": [],
        "seconds_elapsed": [],
        "x": [],
        "y": [],
        "z": []
    };

    if (type.includes("Phone")){
        // no changes needed to this

        let i = 1;
        while (i < spltup.length){
            let line = spltup[i].split(',');
            enddict.time.push(parseInt(line[0]));
            enddict.seconds_elapsed.push(parseInt(line[1]));
            enddict.x.push(parseFloat(line[4]));
            enddict.y.push(parseFloat(line[3]));
            enddict.z.push(parseFloat(line[2]));
            i += 1;
        }

        console.log(type,enddict);


        if (type == "PhoneAccel"){
            sampleDict.PhoneTimes = enddict.time;
            sampleDict.PhoneAccelX = enddict.x;
            sampleDict.PhoneAccelY = enddict.y;
            sampleDict.PhoneAccelZ = enddict.z;
        } else if (type == "PhoneGyro"){
            sampleDict.PhoneGyroX = enddict.x;
            sampleDict.PhoneGyroY = enddict.y;
            sampleDict.PhoneGyroZ = enddict.z;
        } else if (type == "PhoneMag"){
            sampleDict.PhoneMagX = enddict.x;
            sampleDict.PhoneMagY = enddict.y;
            sampleDict.PhoneMagZ = enddict.z;
        } else if (type == "WatchAccel"){
            sampleDict.WatchTimes = enddict.time;
            sampleDict.WatchAccelX = enddict.x;
            sampleDict.WatchAccelY = enddict.y;
            sampleDict.WatchAccelZ = enddict.z;
        } else if (type == "WatchGyro"){
            sampleDict.WatchGyroX = enddict.x;
            sampleDict.WatchGyroY = enddict.y;
            sampleDict.WatchGyroZ = enddict.z;
        } else if (type == "WatchMag"){
            sampleDict.WatchMagX = enddict.x;
            sampleDict.WatchMagY = enddict.y;
            sampleDict.WatchMagZ = enddict.z;
        }
    } else {
        // now the new stuff
        // only for watch though, everything else should be handled

        enddict = {
            "LeftWatchTimes": [],
            "RightWatchTimes": [],

            "LeftWatchRoll": [],
            "LeftWatchPitch": [],
            "LeftWatchYaw": [],

            "LeftWatchRotX": [],
            "LeftWatchRotY": [],
            "LeftWatchRotZ": [],

            "LeftWatchGravX": [],
            "LeftWatchGravY": [],
            "LeftWatchGravZ": [],
            
            "LeftWatchDMUAccelX": [],
            "LeftWatchDMUAccelY": [],
            "LeftWatchDMUAccelZ": [],
            
            "LeftWatchQuatW": [],
            "LeftWatchQuatX": [],
            "LeftWatchQuatY": [],
            "LeftWatchQuatZ": [],

            "LeftWatchAccelX": [],
            "LeftWatchAccelY": [],
            "LeftWatchAccelZ": [],
            
            "RightWatchRoll": [],
            "RightWatchPitch": [],
            "RightWatchYaw": [],

            "RightWatchRotX": [],
            "RightWatchRotY": [],
            "RightWatchRotZ": [],

            "RightWatchGravX": [],
            "RightWatchGravY": [],
            "RightWatchGravZ": [],
            
            "RightWatchDMUAccelX": [],
            "RightWatchDMUAccelY": [],
            "RightWatchDMUAccelZ": [],
            
            "RightWatchQuatW": [],
            "RightWatchQuatX": [],
            "RightWatchQuatY": [],
            "RightWatchQuatZ": [],

            "RightWatchAccelX": [],
            "RightWatchAccelY": [],
            "RightWatchAccelZ": []
        };

        let i = 1;
        while (i < spltup.length){
            let line = spltup[i].split(',');
            enddict[type+"Times"].push(parseInt(line[2])*1000000); // multiply by 10^6 because hemiphisio is in nanoseconds

            enddict[type+"Roll"].push(parseFloat(line[11]));
            enddict[type+"Pitch"].push(parseFloat(line[12]));
            enddict[type+"Yaw"].push(parseFloat(line[13]));

            enddict[type+"RotX"].push(parseFloat(line[14]));
            enddict[type+"RotY"].push(parseFloat(line[15]));
            enddict[type+"RotZ"].push(parseFloat(line[16]));

            enddict[type+"GravX"].push(parseFloat(line[17]));
            enddict[type+"GravY"].push(parseFloat(line[18]));
            enddict[type+"GravZ"].push(parseFloat(line[19]));

            enddict[type+"DMUAccelX"].push(parseFloat(line[20]));
            enddict[type+"DMUAccelY"].push(parseFloat(line[21]));
            enddict[type+"DMUAccelZ"].push(parseFloat(line[22]));

            enddict[type+"QuatW"].push(parseFloat(line[23]));
            enddict[type+"QuatX"].push(parseFloat(line[24]));
            enddict[type+"QuatY"].push(parseFloat(line[25]));
            enddict[type+"QuatZ"].push(parseFloat(line[26]));

            enddict[type+"AccelX"].push(parseFloat(line[27]));
            enddict[type+"AccelY"].push(parseFloat(line[28]));
            enddict[type+"AccelZ"].push(parseFloat(line[29]));
            i += 1;
        }

        let attributes = ["Times","Roll", "Pitch", "Yaw", "RotX", "RotY", "RotZ", "GravX", "GravY", "GravZ", "DMUAccelX", "DMUAccelY", "DMUAccelZ", "QuatW", "QuatX", "QuatY", "QuatZ", "AccelX", "AccelY", "AccelZ"];

        for (attr of attributes){
            sampleDict[type+attr] = enddict[type+attr];
        }
    }

    return enddict;
}


let phoneAccelerometerCSV;
let phoneGyroscopeCSV;
let phoneMagnetometerCSV;
let LeftWatchCSV;
let RightWatchCSV;

let proceedenabled = false;

function gettp(nm){
    if (nm.includes("Accelerometer")){
        return "Accelerometer";
    } else if (nm.includes("Gyroscope")){
        return "Gyroscope";
    } else if (nm.includes("Magnetometer")){
        return "Magnetometer";
    }     
}

let i = 1;
while (i < 4){
    const j = i;
    document.getElementById('file-upload'+j).addEventListener('change', function(event) {
        if (event.target.files.length != 3 && j == 1){
            alert("You must upload three files");
        } else {

            if (j == 1){
                // this should require no change really

                const file1 = event.target.files[0];
                const file2 = event.target.files[1];
                const file3 = event.target.files[2];
        
                // check all three valid files
                if ((file1.name.includes("Accelerometer") || file1.name.includes("Gyroscope") || file1.name.includes("Magnetometer")) && 
                    (file2.name.includes("Accelerometer") || file2.name.includes("Gyroscope") || file2.name.includes("Magnetometer")) &&
                    (file3.name.includes("Accelerometer") || file3.name.includes("Gyroscope") || file3.name.includes("Magnetometer"))){
                    document.getElementById("upload"+j).innerHTML = `
                    <div class="upload-text" style="width: 50%; text-align: right; float: left;">Uploaded</div>
                    <img src="./assets/greencheck.png" alt="checkmark" style="margin-left: 5%; margin-top: 2%; width: 10%; float: left;">
                    `;
            
                    document.getElementById('file-upload'+j).disabled = true;
                    document.getElementById('upload'+j).style.cursor = "not-allowed";
                    document.getElementById('file-upload'+j).style.cursor = "not-allowed";

            
                    let tp;
            
                    const readeraccel = new FileReader();
                    readeraccel.onload = function(e) {
                        const content = e.target.result;
                        console.log(e);
                        phoneAccelerometerCSV = content;
                        console.log(content);
            
                        if (phoneAccelerometerCSV != null && phoneGyroscopeCSV != null && phoneMagnetometerCSV != null && RightWatchCSV != null && LeftWatchCSV != null){
                            enableanalysis();
                        }
                    };

                    const readergyro = new FileReader();
                    readergyro.onload = function(e) {
                        const content = e.target.result;
                        console.log(e);
                        // document.getElementById('output').innerText = content;
                        phoneGyroscopeCSV = content;
                        console.log(content);
            
                        if (phoneAccelerometerCSV != null && phoneGyroscopeCSV != null && phoneMagnetometerCSV != null && RightWatchCSV != null && LeftWatchCSV != null){
                            enableanalysis();
                        }
                    };

                    const readermag = new FileReader();
                    readermag.onload = function(e) {
                        const content = e.target.result;
                        console.log(e);
                        // document.getElementById('output').innerText = content;
                        phoneMagnetometerCSV = content;
                        console.log(content);
            
                        if (phoneAccelerometerCSV != null && phoneGyroscopeCSV != null && phoneMagnetometerCSV != null && RightWatchCSV != null && LeftWatchCSV != null){
                            enableanalysis();
                        }
                    };

                    let fls = [file1, file2, file3];
                    
                    for (fl of fls){
                        if (fl.name.includes("Accelerometer")){
                            readeraccel.readAsText(fl);
                        } else if (fl.name.includes("Gyroscope")){
                            readergyro.readAsText(fl);
                        } else if (fl.name.includes("Magnetometer")){
                            readermag.readAsText(fl);
                        }   
                    }
                }
            } else {
                // the thing with only one file
                const file1 = event.target.files[0];

                document.getElementById("upload"+j).innerHTML = `
                <div class="upload-text" style="width: 50%; text-align: right; float: left;">Uploaded</div>
                <img src="./assets/greencheck.png" alt="checkmark" style="margin-left: 5%; margin-top: 2%; width: 10%; float: left;">
                `;
        
                document.getElementById('file-upload'+j).disabled = true;
                document.getElementById('upload'+j).style.cursor = "not-allowed";
                document.getElementById('file-upload'+j).style.cursor = "not-allowed"; 

                // for now, assign all the content to one thing. we will deal with the rest later.

                const reader = new FileReader();
                    reader.onload = function(e) {
                        const content = e.target.result;
                        console.log(e);

                        if (j == 2){
                            LeftWatchCSV = content;
                        } else {
                            RightWatchCSV = content;
                        }
                    
                        console.log(content);
            
                        if (phoneAccelerometerCSV != null && phoneGyroscopeCSV != null && phoneMagnetometerCSV != null && RightWatchCSV != null && LeftWatchCSV != null){
                            enableanalysis();
                        }
                    };

                reader.readAsText(file1);
            }
        }
    });
    i += 1;
}


function clipArray(attribute, clipLen){
    sampleDict[attribute] = sampleDict[attribute].slice(clipLen);
}


function addReading(newDict, oldDict, pindex, wlindex, wrindex){
    let attributes = ["PhoneTimes", "PhoneAccelX", "PhoneAccelY", "PhoneAccelZ", "PhoneGyroX",
        "PhoneGyroY", "PhoneGyroZ", "PhoneMagX", "PhoneMagY", "PhoneMagZ", "LeftWatchTimes", 
        "LeftWatchRoll", "LeftWatchPitch", "LeftWatchYaw","LeftWatchRotX", 
        "LeftWatchRotY", "LeftWatchRotZ", "LeftWatchGravX", "LeftWatchGravY", "LeftWatchGravZ", 
        "LeftWatchDMUAccelX", "LeftWatchDMUAccelY", "LeftWatchDMUAccelZ", "LeftWatchQuatW",
        "LeftWatchQuatX", "LeftWatchQuatY", "LeftWatchQuatZ", "LeftWatchAccelX",
        "LeftWatchAccelY", "LeftWatchAccelZ", "RightWatchTimes", "RightWatchRoll", 
        "RightWatchPitch", "RightWatchYaw", "RightWatchRotX", 
        "RightWatchRotY", "RightWatchRotZ", "RightWatchGravX", "RightWatchGravY",
        "RightWatchGravZ", "RightWatchDMUAccelX", "RightWatchDMUAccelY", "RightWatchDMUAccelZ",
        "RightWatchQuatW", "RightWatchQuatX", "RightWatchQuatY", "RightWatchQuatZ",
        "RightWatchAccelX", "RightWatchAccelY", "RightWatchAccelZ"];
        
    for (const i of attributes){
        let index = "";
        if (i.includes("Phone")){
            index = pindex
        } else if (i.includes("LeftWatch")){
            index = wlindex
        } else {
            index = wrindex
        }

        
        if (newDict[i] != null){
            if (oldDict == null){
                newDict[i].push(null);
            } else {
                newDict[i].push(oldDict[i][index]);
            }
        } else {
            if (oldDict == null){
                newDict[i] = [null];
            } else {
                newDict[i] = [oldDict[i][index]];
            }
        }
    }
}


async function splitdata(){
    // this splits sampleDict

    loadingmotion();

    analysisdisplay.innerHTML = "<h2>Splitting strokes...</h2>"


    let currentPhoneTime = sampleDict["PhoneTimes"][0];
    let currentLeftWatchTime = sampleDict["LeftWatchTimes"][0];
    let currentRightWatchTime = sampleDict["RightWatchTimes"][0];
    
    let holdMetric;
    
    if (currentPhoneTime >= currentLeftWatchTime && currentPhoneTime >= currentRightWatchTime){
        holdMetric = "currentPhoneTime";
    } else if (currentLeftWatchTime >= currentPhoneTime && currentLeftWatchTime >= currentRightWatchTime){
        holdMetric = "currentLeftWatchTime";
    } else {
        holdMetric = "currentRightWatchTime";
    }

    
    let pindex = 0;
    let wlindex = 0;
    let wrindex = 0;
    while (true){
        currentPhoneTime = sampleDict["PhoneTimes"][pindex];
        currentLeftWatchTime = sampleDict["LeftWatchTimes"][wlindex];
        currentRightWatchTime = sampleDict["RightWatchTimes"][wrindex];
        
        if (holdMetric == "currentPhoneTime"){
            if (currentLeftWatchTime < currentPhoneTime && currentRightWatchTime < currentPhoneTime){
                wlindex += 1;
                wrindex += 1;
            } else if (currentLeftWatchTime < currentPhoneTime){
                wlindex += 1;
            } else if (currentRightWatchTime < currentPhoneTime){
                wrindex += 1;
            } else {
                break
            }

        } else if (holdMetric == "currentLeftWatchTime"){
            if (currentPhoneTime < currentLeftWatchTime && currentRightWatchTime < currentLeftWatchTime){
                pindex += 1;
                wrindex += 1;
            } else if (currentPhoneTime < currentLeftWatchTime) {
                pindex += 1;
            } else if (currentRightWatchTime < currentLeftWatchTime){
                wrindex += 1;
            } else {
                break
            }

        } else {
            if (currentPhoneTime < currentRightWatchTime && currentLeftWatchTime < currentRightWatchTime){
                pindex += 1;
                wlindex += 1;
            } else if (currentPhoneTime < currentRightWatchTime) {
                pindex += 1;
            } else if (currentLeftWatchTime < currentRightWatchTime) {
                wlindex += 1;
            } else {
                break
            }
        }
    }

    console.log("delta is", (sampleDict["PhoneTimes"][pindex]-sampleDict["LeftWatchTimes"][wlindex]*1000000)/(1000000000));
    console.log("delta is", (sampleDict["PhoneTimes"][pindex]-sampleDict["RightWatchTimes"][wrindex]*1000000)/(1000000000));


    PhoneAttributes = ["PhoneTimes", "PhoneAccelX", "PhoneAccelY", "PhoneAccelZ", "PhoneGyroX",
                       "PhoneGyroY", "PhoneGyroZ", "PhoneMagX", "PhoneMagY", "PhoneMagZ"]
                       
    LeftWatchAttributes = ["LeftWatchTimes", "LeftWatchRoll", "LeftWatchPitch", "LeftWatchYaw","LeftWatchRotX", 
                           "LeftWatchRotY", "LeftWatchRotZ", "LeftWatchGravX", "LeftWatchGravY", "LeftWatchGravZ", 
                           "LeftWatchDMUAccelX", "LeftWatchDMUAccelY", "LeftWatchDMUAccelZ", "LeftWatchQuatW",
                           "LeftWatchQuatX", "LeftWatchQuatY", "LeftWatchQuatZ", "LeftWatchAccelX",
                           "LeftWatchAccelY", "LeftWatchAccelZ"]
    RightWatchAttributes = ["RightWatchTimes", "RightWatchRoll", "RightWatchPitch", "RightWatchYaw", "RightWatchRotX", 
                            "RightWatchRotY", "RightWatchRotZ", "RightWatchGravX", "RightWatchGravY",
                            "RightWatchGravZ", "RightWatchDMUAccelX", "RightWatchDMUAccelY", "RightWatchDMUAccelZ",
                            "RightWatchQuatW", "RightWatchQuatX", "RightWatchQuatY", "RightWatchQuatZ",
                            "RightWatchAccelX", "RightWatchAccelY", "RightWatchAccelZ"]

    for (const i of PhoneAttributes){
        clipArray(i, pindex);
    }
    
    for (const i of LeftWatchAttributes){
        clipArray(i, wlindex);
    } 

    for (const i of RightWatchAttributes){
        clipArray(i, wrindex);
    }




    let streaks = [];

    let strokearr = [];

    let currentstroke = {};

    let pstart = pindex;
    let wlstart = wlindex;
    let wrstart = wrindex;

    let i = 0;
    let last = 0;
    while (pstart < sampleDict["PhoneAccelX"].length && wlstart < sampleDict["LeftWatchRoll"].length
          && wrstart < sampleDict["RightWatchRoll"].length){
        let subj = sampleDict["PhoneGyroX"][pstart];

        //cut it off as a stroke
        if (i < (sampleDict["PhoneGyroX"]).length-17 && subj > sampleDict["PhoneGyroX"][pstart+1] 
            && sampleDict["PhoneGyroX"][pstart+1] > sampleDict["PhoneGyroX"][pstart+2] 
            && sampleDict["PhoneGyroX"][pstart+2] > sampleDict["PhoneGyroX"][pstart+3] 
            && sampleDict["PhoneGyroX"][pstart+3] > sampleDict["PhoneGyroX"][pstart+4] 
            && sampleDict["PhoneGyroX"][pstart+4] > sampleDict["PhoneGyroX"][pstart+5] 
            && sampleDict["PhoneGyroX"][pstart+5] > sampleDict["PhoneGyroX"][pstart+6] 
            && sampleDict["PhoneGyroX"][pstart+6] > sampleDict["PhoneGyroX"][pstart+7] 
            && sampleDict["PhoneGyroX"][pstart+7] > sampleDict["PhoneGyroX"][pstart+8] 
            && sampleDict["PhoneGyroX"][pstart+8] > sampleDict["PhoneGyroX"][pstart+9] 
            && sampleDict["PhoneGyroX"][pstart+9] > sampleDict["PhoneGyroX"][pstart+10] 
            && sampleDict["PhoneGyroX"][pstart+10] > sampleDict["PhoneGyroX"][pstart+11] 
            && sampleDict["PhoneGyroX"][pstart+11] > sampleDict["PhoneGyroX"][pstart+12] 
            && sampleDict["PhoneGyroX"][pstart+12] > sampleDict["PhoneGyroX"][pstart+13] 
            && sampleDict["PhoneGyroX"][pstart+13] > sampleDict["PhoneGyroX"][pstart+14] 
            && sampleDict["PhoneGyroX"][pstart+14] > sampleDict["PhoneGyroX"][pstart+15] 
            && sampleDict["PhoneGyroX"][pstart+15] > sampleDict["PhoneGyroX"][pstart+16] 
            && sampleDict["PhoneGyroX"][pstart+16] > sampleDict["PhoneGyroX"][pstart+17] 
            && i-last > 100){

            strokearr.push(currentstroke);

            currentstroke = {}

            streaks.push(i-last); // will usually be around the threshold

            last = i;
        }

        if (i-last < 155){
            
            addReading(currentstroke, sampleDict, pstart, wlstart, wrstart);

        }

        i += 1;
        pstart += 1
        wlstart += 1
        wrstart += 1
    }

    analysisdisplay.innerHTML = `
    <h2 style='color: var(--main);'>Strokes found: ${strokearr.length}</h2>
    <h2>Analyzing strokes for consistency...</h2>`;


    console.log(streaks);

    // noew find out the differences
    let differences = [];
    i = 1;
    while (i < streaks.length){
        differences.push(streaks[i]-streaks[i-1]);
        i += 1
    }

    console.log(differences);


    // now i want to find the longest streak for which the absolute value of difference is less than 60
    let starts = [];
    let lns = [];

    let currentstart = 0;
    let currentlen = 0;
    i = 0;
    while (i < differences.length){
        if (differences[i] < 70 && differences[i] > -70){
            // within regulation, len goes up
            currentlen += 1;
        } else {
            // out of regulation, cut it off
            lns.push(currentlen);
            starts.push(currentstart);

            currentlen = 0;
            currentstart = i+1;
        }

        // check if thats the end
        if (i == differences.length-1){
            lns.push(currentlen);
            starts.push(currentstart);
    
            currentlen = 0;
            currentstart = i+1;
        }

        i += 1;
    }

    console.log(starts);
    console.log(lns);

    // lets look at the max length
    let mxlen = lns.reduce((a, b) => Math.max(a, b), -Infinity);
    let mxlenind = lns.indexOf(mxlen);

    let takestartindex = starts[mxlenind];
    let takelen = Math.min(mxlen, 8);

    console.log(takestartindex);
    console.log(takelen);


    // now create the data to plot
    // do it again, but this time dont push it if its not in the range


    newdict = {};

    i = 0;
    pstart = pindex;
    wlstart = wlindex;
    wrstart = wrindex;
    last = 0;
    let strokesgone = 0;

    while (pstart < sampleDict["PhoneAccelX"].length && wlstart < sampleDict["LeftWatchRoll"].length
        && wrstart < sampleDict["RightWatchRoll"].length){
        let subj = sampleDict.PhoneGyroX[i];

        if (i < sampleDict.PhoneGyroX.length-4 && subj > sampleDict.PhoneGyroX[i+1] && sampleDict.PhoneGyroX[i+1] > sampleDict.PhoneGyroX[i+2] && sampleDict.PhoneGyroX[i+3] > sampleDict.PhoneGyroX[i+4] && i-last > 100 && subj > 0.8){
            //insert spaces
            let j = 0;
            while (j < 100 && strokesgone >= takestartindex && strokesgone < takestartindex+takelen){
                
                addReading(newdict, null, pstart, wlstart, wrstart);

                j += 1;
            }

            strokesgone += 1;

            console.log(strokesgone);

            last = i;
        }

        if (strokesgone >= takestartindex && strokesgone < takestartindex+takelen){
            addReading(newdict, sampleDict, pstart, wlstart, wrstart);
        }


        i += 1;
        pstart += 1
        wlstart += 1
        wrstart += 1
    }

    sampleDict = newdict;


    // now process senddata, split into strokes and call the model for each one
    // not too hard
    // make an array of strokes
    let strokearray = [];
    // only take the ones that were approved by the automation
    console.log(starts);
    console.log(lns);

    console.log(strokearr);

    // send any set of strokes larger than 2 for evaluation




    i = 0;
    while (i < starts.length){
        if (lns[i] > 2){
            // actually do the thing

            let j = starts[i];
            while (j < starts[i]+lns[i]){
                if (strokearr[j].PhoneAccelX.length >= 155){
                    strokearray.push(strokearr[j]);
                }
                j += 1;
            }
        }
        // else skip over it
        i += 1;
    }

    console.log(strokearray);



    analysisdisplay.innerHTML = `
    <h2 style='color: var(--main);'>Strokes found: ${strokearr.length}</h2>
    <h2 style='color: var(--main);'>Consistent strokes found: ${strokearray.length}</h2>
    <h2>Analyzing stroke 0 of ${strokearray.length}</h2>`;

    sendData = strokearray;

    i = 0;
    while (i < sendData.length){
        
        await getPrediction(i, sendData.length, strokearr, strokearray);

        i += 1;
    }
}


function displayPie(total, strokearr, strokearray){
    let good = countgood();

    analysisdisplay.innerHTML = `
    <h2 style='color: var(--main);'>Strokes found: ${strokearr.length}</h2>
    <h2 style='color: var(--main);'>Consistent strokes found: ${strokearray.length}</h2>

    <h2>Analyzing stroke ${i} of ${strokearray.length}</h2>
    <div class="piechart" style="background-image: conic-gradient(
        green ${good/predictions.length*360}deg,
        red 0 ${(1-good/predictions.length)*360}deg
    );"></div>
    <div class="pielegend">
        <div class="key" style="background-color: green;"></div>
        <h3 style='color: green;'>Optimal strokes (${good})</h2>
    </div>
    <div class="pielegend">
        <div class="key" style="background-color: red;"></div>
        <h3 style='color: red;'>Inoptimal strokes (${predictions.length-good})</h2>
    </div>
    `;  
    
    if (predictions.length == total){
        analysisdisplay.innerHTML = `
        <h2 style='color: var(--main);'>Strokes found: ${strokearr.length}</h2>
        <h2 style='color: var(--main);'>Consistent strokes found: ${strokearray.length}</h2>

        <h2 style='color: var(--main);'>Optimal stroke percentage: ${(100*good/predictions.length).toFixed(2)}%</h2>
        <div class="piechart" style="background-image: conic-gradient(
            green ${good/predictions.length*360}deg,
            red 0 ${(1-good/predictions.length)*360}deg
        );"></div>
        <div class="pielegend">
            <div class="key" style="background-color: green;"></div>
            <h3 style='color: green;'>Optimal strokes (${good})</h2>
        </div>
        <div class="pielegend">
            <div class="key" style="background-color: red;"></div>
            <h3 style='color: red;'>Inoptimal strokes (${predictions.length-good})</h2>
        </div>
        `;   

        document.getElementById("loadinganim").style.display = "none";
        loadingmotionon = false;
    }
}


function countgood(){
    let i = 0;
    let count = 0;
    while (i < predictions.length){
        if (predictions[i] == 0){
            count += 1;
        }
        i += 1;
    }

    return count;
}

function getStrokeToSend(num){
    let stroke = sendData[num];

    let str = "";

    // no need for times here
    let features =  ["PhoneAccelX", "PhoneAccelY", "PhoneAccelZ", "PhoneGyroX",
        "PhoneGyroY", "PhoneGyroZ", "PhoneMagX", "PhoneMagY", "PhoneMagZ", 
        "LeftWatchRoll", "LeftWatchPitch", "LeftWatchYaw","LeftWatchRotX", 
        "LeftWatchRotY", "LeftWatchRotZ", "LeftWatchGravX", "LeftWatchGravY", "LeftWatchGravZ", 
        "LeftWatchDMUAccelX", "LeftWatchDMUAccelY", "LeftWatchDMUAccelZ", "LeftWatchQuatW",
        "LeftWatchQuatX", "LeftWatchQuatY", "LeftWatchQuatZ", "LeftWatchAccelX",
        "LeftWatchAccelY", "LeftWatchAccelZ", "RightWatchRoll", 
        "RightWatchPitch", "RightWatchYaw", "RightWatchRotX", 
        "RightWatchRotY", "RightWatchRotZ", "RightWatchGravX", "RightWatchGravY",
        "RightWatchGravZ", "RightWatchDMUAccelX", "RightWatchDMUAccelY", "RightWatchDMUAccelZ",
        "RightWatchQuatW", "RightWatchQuatX", "RightWatchQuatY", "RightWatchQuatZ",
        "RightWatchAccelX", "RightWatchAccelY", "RightWatchAccelZ"];
        
    let i = 0;
    while (i < features.length){
        let carr = stroke[features[i]];
        let currentstring = "";

        if (i != 0){
            str += "&"+features[i]+"=";
        } else {
            str += features[i]+"=";
        }

        let j = 0;
        while (j < carr.length){
            currentstring += String(carr[j]); //.toFixed(2)

            if (j != carr.length-1){
                currentstring += ",";
            }

            j += 1;
        }

        str += currentstring;
        

        i += 1;
    }

    return str;
}

async function getPrediction(num, current, strokearr, strokearray){
    let strokedictsend = getStrokeToSend(num);

    // let url = "https://predictor-vu7p.onrender.com/predict?"+strokestr;

    // console.log(url)

    // await fetch(url, {method: 'POST'})
    // .then(response => {
    //     return response.json();
    // })
    // .then(data => {
    //     console.log(data);
    //     console.log(parseInt(data.prediction));
    //     predictions.push(parseInt(data.prediction));
    // })

    console.log(strokedictsend);

    fetch("https://predictor-vu7p.onrender.com/predict", {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        body: strokedictsend
    })
    .then(response => {
        return response.json();
    })
    .then(data => {
        console.log(data);
        console.log(parseInt(data.prediction));
        predictions.push(parseInt(data.prediction));
        displayPie(current, strokearr, strokearray);
    })
}

let loadingmotionon = true;

let load1 = document.getElementById("loadingpoint1");
let load2 = document.getElementById("loadingpoint2");
let load3 = document.getElementById("loadingpoint3");
let load4 = document.getElementById("loadingpoint4");
let load6 = document.getElementById("loadingpoint5");
let load5 = document.getElementById("loadingpoint6");
let load7 = document.getElementById("loadingpoint7");
let load8 = document.getElementById("loadingpoint8");

function zeroify(x){
    if (x > 0){
        return 0;
    } else {
        return x;
    }
}

// but you never want to await this, its never gonna end
async function loadingmotion(){
    loadingdegree = 0;
    while (loadingmotionon){
        load1.style.opacity = (255-Math.abs(100-loadingdegree))/255;
        load3.style.opacity = (255-Math.abs(200-loadingdegree))/255;
        load6.style.opacity = (255-Math.abs(300-loadingdegree))/255;
        load7.style.opacity = (255-Math.abs(400-loadingdegree))/255;
        load8.style.opacity = (255-Math.abs(500-loadingdegree))/255;
        load5.style.opacity = (255-Math.abs(600-loadingdegree))/255;
        load4.style.opacity = (255-Math.abs(700-loadingdegree))/255;
        load2.style.opacity = (255-Math.abs(800-loadingdegree))/255;
        loadingdegree += 3;

    
        if (loadingdegree < 300){
            load5.style.opacity = (255-Math.abs(-200-loadingdegree))/255;
            load4.style.opacity = (255-Math.abs(-100-loadingdegree))/255;
            load2.style.opacity = (255-Math.abs(0-loadingdegree))/255;
        }

        if (loadingdegree > 500){
            load1.style.opacity = (255-Math.abs(900-loadingdegree))/255;
            load3.style.opacity = (255-Math.abs(1000-loadingdegree))/255;
            load6.style.opacity = (255-Math.abs(1100-loadingdegree))/255;
        }
        // if (loadingdegree > 250){
        //     load1.style.opacity = 1-(zeroify(loadingdegree-0)/90);
        //     load3.style.opacity = 1-(zeroify(loadingdegree-45)/90);
        //     load6.style.opacity = 1-(zeroify(loadingdegree-90)/90);
        //     load7.style.opacity = 1-(zeroify(loadingdegree-135)/90); 
        // }

        if (loadingdegree > 800){
            loadingdegree = 0;
        }
        await sleep();
    }
}

async function sendToModel(){
    // first let them know how many strokes have been found

}

function setplotparams(arr){
    const min = (values) => values.reduce((m, v) => (v != null && v < m ? v : m), Infinity);
    const max = (values) => values.reduce((m, v) => (v != null && v > m ? v : m), -Infinity);

    let mx = max(arr);
    let mn = min(arr);

    let diff = mx - mn;

    return [mn,diff/4];
}




initDraw();



function makesampledict(datastr){
    let spltup = datastr.split('\n');

    let enddict = {
        "PhoneAccelX": [],
        "PhoneAccelY": [],
        "PhoneAccelZ": [],
        "PhoneGyroX": [],
        "PhoneGyroY": [],
        "PhoneGyroZ": [],
        "PhoneMagX": [],
        "PhoneMagY": [],
        "PhoneMagZ": []
    };

    let i = 1;
    while (i < spltup.length){
        let line = spltup[i].split(',');
        enddict.PhoneAccelZ.push(parseFloat(line[3]));
        enddict.PhoneAccelY.push(parseFloat(line[4]));
        enddict.PhoneAccelX.push(parseFloat(line[5]));

        // watch features at the indices 6 7 8

        enddict.PhoneGyroZ.push(parseFloat(line[9]));
        enddict.PhoneGyroY.push(parseFloat(line[10]));
        enddict.PhoneGyroX.push(parseFloat(line[11]));
        
        // watch features at these indices 12 13 14

        enddict.PhoneMagZ.push(parseFloat(line[15]));
        enddict.PhoneMagY.push(parseFloat(line[16]));
        enddict.PhoneMagX.push(parseFloat(line[17]));
    
        // watch features at these indices 18 19 20

        i += 1;
    }

    return enddict;
}


async function prodapi(){
    let url = "PhoneAccelX=-1.1371612548828125,-1.077392578125,-0.98779296875,-0.8912811279296875,-0.795196533203125,-0.66888427734375,-0.5432891845703125,-0.4946441650390625,-0.47296142578125,-0.4390869140625,-0.408660888671875,-0.430145263671875,-0.56524658203125,-0.68328857421875,-0.624725341796875,-0.547088623046875,-0.5051116943359375,-0.514312744140625,-0.5683135986328125,-0.5642852783203125,-0.5984954833984375,-0.6132659912109375,-0.6951141357421875,-0.7941741943359375,-0.7584075927734375,-0.7083892822265625,-0.704193115234375,-0.720062255859375,-0.7138671875,-0.6882781982421875,-0.6521759033203125,-0.672637939453125,-0.705841064453125,-0.7561798095703125,-0.796783447265625,-0.738555908203125,-0.6612701416015625,-0.600921630859375,-0.714111328125,-0.9829559326171875,-1.1947021484375,-1.28045654296875,-1.37957763671875,-1.383209228515625,-1.2383575439453125,-1.1542816162109375,-1.221771240234375,-1.3389129638671875,-1.377838134765625,-1.3788909912109375,-1.309173583984375,-1.20599365234375,-1.14141845703125,-1.100830078125,-1.0694732666015625,-1.0004119873046875,-0.930816650390625,-0.943603515625,-0.9905853271484375,-1.0209503173828125,-1.01629638671875,-1.0185089111328125,-0.979278564453125,-0.896331787109375,-0.8515472412109375,-0.882568359375,-0.949310302734375,-1.020599365234375,-1.08465576171875,-1.0809478759765625,-0.9972991943359375,-0.9034881591796875,-0.8352508544921875,-0.78070068359375,-0.753662109375,-0.775970458984375,-0.8350067138671875,-0.86602783203125,-0.859100341796875,-0.8270111083984375,-0.773773193359375,-0.6997222900390625,-0.6454010009765625,-0.6632843017578125,-0.746856689453125,-0.8515625,-0.9202880859375,-0.916656494140625,-0.9325103759765625,-0.9596099853515625,-0.9382171630859375,-0.865631103515625,-0.7757110595703125,-0.6917266845703125,-0.6390533447265625,-0.6229095458984375,-0.65008544921875,-0.704559326171875,-0.749755859375,-0.8013153076171875,-0.8479461669921875,-0.8679656982421875,-0.876312255859375,-0.878814697265625,-0.86004638671875,-0.8245391845703125,-0.782196044921875,-0.7282562255859375,-0.68865966796875,-0.6987762451171875,-0.7551422119140625,-0.8397674560546875,-0.911407470703125,-0.9348602294921875,-0.935791015625,-0.9311065673828125,-0.9199371337890625,-0.885589599609375,-0.8176116943359375,-0.738433837890625,-0.681549072265625,-0.659423828125,-0.6728515625,-0.72637939453125,-0.807403564453125,-0.8723907470703125,-0.9050750732421875,-0.912506103515625,-0.896270751953125,-0.8667449951171875,-0.8369598388671875,-0.824249267578125,-0.82025146484375,-0.7965240478515625,-0.7440338134765625,-0.68682861328125,-0.646026611328125,-0.6300506591796875,-0.646392822265625,-0.7060089111328125,-0.7601318359375,-0.78021240234375,-0.76800537109375,-0.7415008544921875,-0.724365234375,-0.7242431640625,-0.7346649169921875,-0.749053955078125,-0.7635650634765625,-0.7523345947265625,-0.723419189453125,-0.6881866455078125,-0.6295166015625,-0.576751708984375,-0.56304931640625&PhoneAccelY=-0.614776611328125,-0.68450927734375,-0.7615509033203125,-0.86016845703125,-0.9863128662109375,-1.050537109375,-1.0029449462890625,-0.8886566162109375,-0.7621917724609375,-0.6705169677734375,-0.622589111328125,-0.5987548828125,-0.645538330078125,-0.6500396728515625,-0.6067352294921875,-0.5680389404296875,-0.5626373291015625,-0.580657958984375,-0.55487060546875,-0.519805908203125,-0.490386962890625,-0.5222015380859375,-0.618499755859375,-0.581878662109375,-0.4116058349609375,-0.276214599609375,-0.2938690185546875,-0.384552001953125,-0.4881439208984375,-0.56787109375,-0.5170745849609375,-0.3917388916015625,-0.3832550048828125,-0.47344970703125,-0.5306854248046875,-0.459075927734375,-0.390533447265625,-0.33697509765625,-0.2277679443359375,-0.17486572265625,-0.1710205078125,-0.1244049072265625,-0.141326904296875,-0.2983551025390625,-0.4483184814453125,-0.5115509033203125,-0.5103302001953125,-0.4357147216796875,-0.4484405517578125,-0.5911102294921875,-0.70538330078125,-0.7108612060546875,-0.6724700927734375,-0.6203460693359375,-0.5572967529296875,-0.5352630615234375,-0.4796905517578125,-0.49945068359375,-0.5868377685546875,-0.6298675537109375,-0.635772705078125,-0.6195220947265625,-0.551116943359375,-0.51031494140625,-0.5195465087890625,-0.547393798828125,-0.5843963623046875,-0.6091766357421875,-0.6262969970703125,-0.5820770263671875,-0.50030517578125,-0.4707183837890625,-0.505859375,-0.5603790283203125,-0.5996246337890625,-0.631561279296875,-0.6471099853515625,-0.58526611328125,-0.4681243896484375,-0.408355712890625,-0.44305419921875,-0.5064697265625,-0.54742431640625,-0.5668487548828125,-0.5598907470703125,-0.5330810546875,-0.5002593994140625,-0.4518280029296875,-0.434112548828125,-0.503692626953125,-0.577392578125,-0.588623046875,-0.576934814453125,-0.5753326416015625,-0.5826568603515625,-0.581390380859375,-0.5732879638671875,-0.5700836181640625,-0.5927581787109375,-0.609893798828125,-0.5615386962890625,-0.4886474609375,-0.4708709716796875,-0.524139404296875,-0.595855712890625,-0.643341064453125,-0.67327880859375,-0.6732940673828125,-0.597625732421875,-0.5077056884765625,-0.4914703369140625,-0.54730224609375,-0.632354736328125,-0.703216552734375,-0.7296295166015625,-0.6940765380859375,-0.62396240234375,-0.5827178955078125,-0.571563720703125,-0.5848541259765625,-0.635223388671875,-0.7210845947265625,-0.773406982421875,-0.753692626953125,-0.69708251953125,-0.6325225830078125,-0.5841217041015625,-0.5859527587890625,-0.6451873779296875,-0.7352447509765625,-0.78741455078125,-0.77410888671875,-0.71734619140625,-0.6671142578125,-0.6480712890625,-0.676666259765625,-0.7365264892578125,-0.796600341796875,-0.80816650390625,-0.762451171875,-0.698150634765625,-0.6527557373046875,-0.63751220703125,-0.6463623046875,-0.6884918212890625,-0.7524261474609375,-0.7675323486328125,-0.712677001953125,-0.6493988037109375,-0.6121063232421875,-0.6154937744140625,-0.6483917236328125,-0.6973419189453125,-0.746246337890625,-0.789703369140625&PhoneAccelZ=0.5925140380859375,0.5368804931640625,0.4901123046875,0.3951568603515625,0.299163818359375,0.21527099609375,0.1236419677734375,0.08721923828125,0.0681304931640625,0.094207763671875,0.096405029296875,0.0560302734375,0.0711517333984375,0.1405029296875,0.1321563720703125,0.0496826171875,-0.0410308837890625,0.0055084228515625,0.0876617431640625,0.0792236328125,-0.0172882080078125,-0.052825927734375,-0.0638427734375,0.0031585693359375,-0.0183258056640625,-0.067169189453125,-0.0977783203125,-0.173553466796875,-0.1516876220703125,-0.176422119140625,-0.2653961181640625,-0.2912750244140625,-0.29388427734375,-0.2625732421875,-0.18060302734375,-0.1433868408203125,-0.04180908203125,-0.0138397216796875,-0.002777099609375,0.1342620849609375,0.1858673095703125,0.2068023681640625,0.2860565185546875,0.316192626953125,0.199554443359375,0.0815582275390625,-0.0088653564453125,-0.0338134765625,-0.0675811767578125,-0.0771484375,0.0133209228515625,0.0869293212890625,0.129119873046875,0.224090576171875,0.2640228271484375,0.2667388916015625,0.23199462890625,0.1607208251953125,0.12261962890625,0.1372833251953125,0.186004638671875,0.301422119140625,0.353515625,0.3148345947265625,0.2321014404296875,0.1482696533203125,0.103790283203125,0.09173583984375,0.1579742431640625,0.235504150390625,0.238616943359375,0.16595458984375,0.0847015380859375,0.0312042236328125,0.0114593505859375,0.0167236328125,0.0620574951171875,0.12103271484375,0.14288330078125,0.1514434814453125,0.144195556640625,0.1180419921875,0.0723724365234375,0.05218505859375,0.1090850830078125,0.2215118408203125,0.3030242919921875,0.255767822265625,0.16436767578125,0.1210479736328125,0.1097869873046875,0.106048583984375,0.10650634765625,0.109527587890625,0.1134033203125,0.100860595703125,0.0691375732421875,0.0421905517578125,0.0324249267578125,0.061614990234375,0.1204833984375,0.154205322265625,0.142364501953125,0.1041717529296875,0.0680084228515625,0.013275146484375,-0.0170440673828125,0.0245819091796875,0.0741729736328125,0.1025238037109375,0.1047821044921875,0.0991363525390625,0.0875091552734375,0.0353240966796875,0.002960205078125,0.010345458984375,0.039031982421875,0.0935516357421875,0.147186279296875,0.1327056884765625,0.0629730224609375,0.020538330078125,0.00299072265625,0.0082550048828125,0.0632476806640625,0.1140594482421875,0.1354217529296875,0.137359619140625,0.1117401123046875,0.0681915283203125,0.0248260498046875,0.0310821533203125,0.0692596435546875,0.072479248046875,0.0563507080078125,0.0478668212890625,0.020660400390625,-0.01373291015625,-0.005096435546875,0.029388427734375,0.070068359375,0.0889129638671875,0.086181640625,0.0424957275390625,-0.0227813720703125,-0.06427001953125,-0.06634521484375,-0.032440185546875,0.0068817138671875,0.0297698974609375,0.015960693359375,-0.0224609375,-0.08056640625,-0.1127471923828125,-0.119293212890625&PhoneGyroX=4.641347885131836,4.604687690734863,4.394936561584473,4.158491611480713,4.014917373657227,3.8817508220672607,3.6874966621398926,3.3940560817718506,3.1712162494659424,3.0365703105926514,2.9066874980926514,2.7959461212158203,2.640946865081787,2.523757219314575,2.403348207473755,2.2045023441314697,2.098663091659546,1.9918484687805176,1.91336190700531,1.7243627309799194,1.4592669010162354,1.2289388179779053,1.1180226802825928,1.0511115789413452,0.9151170253753662,0.7050476670265198,0.49907585978507996,0.3938727378845215,0.30572158098220825,0.24974724650382996,0.13750939071178436,0.01991431973874569,-0.10999280959367752,-0.23291154205799103,-0.2685012221336365,-0.3235543668270111,-0.3305235803127289,-0.3334552049636841,-0.374224990606308,-0.3777257204055786,-0.38401904702186584,-0.42564132809638977,-0.4846513867378235,-0.5039553046226501,-0.4825482666492462,-0.44359660148620605,-0.37310752272605896,-0.3264468312263489,-0.36213478446006775,-0.4291846454143524,-0.44201549887657166,-0.44238248467445374,-0.36014673113822937,-0.3035910427570343,-0.2757519483566284,-0.29774248600006104,-0.38489043712615967,-0.4642994999885559,-0.5592265129089355,-0.6078342795372009,-0.561420202255249,-0.4887893795967102,-0.4393685758113861,-0.416291743516922,-0.4354449510574341,-0.4685107469558716,-0.4871286451816559,-0.4734376072883606,-0.43213915824890137,-0.34794437885284424,-0.2896991968154907,-0.2651784121990204,-0.29500100016593933,-0.3562300205230713,-0.42711085081100464,-0.45785757899284363,-0.41515111923217773,-0.35248056054115295,-0.3195449709892273,-0.2893633544445038,-0.30477482080459595,-0.3764308989048004,-0.44029322266578674,-0.428096741437912,-0.39915376901626587,-0.3681601881980896,-0.3526536524295807,-0.34989088773727417,-0.3506315052509308,-0.34738779067993164,-0.37839046120643616,-0.39497900009155273,-0.3789840638637543,-0.36705470085144043,-0.38368216156959534,-0.4270429313182831,-0.45299357175827026,-0.5083684325218201,-0.5656655430793762,-0.5772614479064941,-0.5553655028343201,-0.5312063694000244,-0.494223028421402,-0.48993057012557983,-0.5220597386360168,-0.554172933101654,-0.5920351147651672,-0.6271675229072571,-0.6346986889839172,-0.6448644995689392,-0.6529277563095093,-0.6544001698493958,-0.6642485857009888,-0.6610863208770752,-0.6534153819084167,-0.6385437250137329,-0.6066513061523438,-0.5971555709838867,-0.6196501851081848,-0.6466051340103149,-0.6812573671340942,-0.7442744374275208,-0.7958393692970276,-0.798949122428894,-0.788266122341156,-0.7846543192863464,-0.7782726287841797,-0.7786891460418701,-0.7759801745414734,-0.7760158181190491,-0.7530497908592224,-0.7400810122489929,-0.7575824856758118,-0.7754794955253601,-0.7907202243804932,-0.8472820520401001,-0.8694421648979187,-0.8729410767555237,-0.8669955730438232,-0.8492711186408997,-0.842818021774292,-0.849088728427887,-0.8825156688690186,-0.9338134527206421,-0.961012065410614,-0.9429968595504761,-0.9033223986625671,-0.8746164441108704,-0.8693263530731201,-0.8995545506477356,-0.9671034812927246,-1.0125598907470703,-1.011445164680481,-0.996955931186676,-1.0020174980163574&PhoneGyroY=1.4045906066894531,1.4496229887008667,1.3047553300857544,0.9573350548744202,0.5406352877616882,0.12851190567016602,-0.2569047510623932,-0.647430956363678,-1.0087281465530396,-1.195922613143921,-1.2245824337005615,-1.1467158794403076,-0.9919739961624146,-0.7256559729576111,-0.5718792080879211,-0.6744937300682068,-0.8804948329925537,-1.0147511959075928,-1.0338436365127563,-1.0247814655303955,-1.0009413957595825,-0.9939410090446472,-0.7328057885169983,-0.39850130677223206,-0.2825837731361389,-0.33966994285583496,-0.5226647853851318,-0.5285235047340393,-0.5179781913757324,-0.5310798287391663,-0.5307765007019043,-0.4763164818286896,-0.33193638920783997,-0.16244164109230042,-0.12258237600326538,-0.1776868999004364,-0.2747575342655182,-0.44424882531166077,-0.4243486225605011,-0.19638842344284058,0.21189413964748383,0.5118422508239746,0.695317804813385,0.568225085735321,0.16512024402618408,-0.20995695888996124,-0.2653650939464569,-0.12104679644107819,0.04870069399476051,0.30042827129364014,0.5160266160964966,0.5560741424560547,0.511882483959198,0.31541815400123596,0.09974337369203568,-0.08863319456577301,-0.22581209242343903,-0.21476688981056213,-0.06229479983448982,0.11181174963712692,0.22549410164356232,0.21166831254959106,0.0717005506157875,-0.18629451096057892,-0.39601603150367737,-0.4329093396663666,-0.32896509766578674,-0.11618120223283768,0.11518464237451553,0.29668787121772766,0.33389806747436523,0.2642036974430084,0.15386758744716644,0.053710900247097015,-0.013172526843845844,-0.011145062744617462,0.05320889130234718,0.12422581017017365,0.1563187688589096,0.12783093750476837,0.0290612131357193,-0.15136848390102386,-0.36009374260902405,-0.47573962807655334,-0.4481727182865143,-0.30929791927337646,-0.19110897183418274,-0.14305755496025085,-0.038533277809619904,0.11728294938802719,0.2566128671169281,0.3198411166667938,0.32332825660705566,0.2799733281135559,0.15423430502414703,-0.034504182636737823,-0.2073926031589508,-0.3351343274116516,-0.3891751766204834,-0.3473140299320221,-0.22056779265403748,-0.0537567064166069,0.09799367189407349,0.22259525954723358,0.27009326219558716,0.1988382637500763,0.07924129068851471,-0.07760903984308243,-0.2618159055709839,-0.392674058675766,-0.43929827213287354,-0.41282111406326294,-0.34359437227249146,-0.2377646267414093,-0.12477362155914307,-0.015280419029295444,0.10515011847019196,0.20818889141082764,0.1995445340871811,0.0417165532708168,-0.15320073068141937,-0.36323651671409607,-0.5537036657333374,-0.6350147724151611,-0.5830770134925842,-0.44862279295921326,-0.26257383823394775,-0.08334602415561676,0.021874671801924706,0.003005377249792218,-0.05172977223992348,-0.07588411122560501,-0.07659943401813507,-0.07821943610906601,-0.05884041264653206,-0.048764076083898544,-0.08272603899240494,-0.15830229222774506,-0.23775877058506012,-0.2872919738292694,-0.2997156083583832,-0.27431410551071167,-0.26144731044769287,-0.2851020395755768,-0.31309932470321655,-0.2921021580696106,-0.200935497879982,-0.10538900643587112,-0.03790876641869545,0.002785400254651904,0.0226746853441,0.021877335384488106,-0.04396506026387215,-0.15938539803028107,-0.257704496383667&PhoneGyroZ=2.8724007606506348,2.8747169971466064,2.889660358428955,2.949697971343994,3.004610061645508,2.9599013328552246,2.8164472579956055,2.6130754947662354,2.441556692123413,2.3361427783966064,2.269747495651245,2.241225004196167,2.0743191242218018,1.6281988620758057,1.0823485851287842,0.7531685829162598,0.8244872093200684,1.0800710916519165,1.1847532987594604,0.8968754410743713,0.3560539782047272,0.0012189288390800357,-0.17195232212543488,-0.28436195850372314,-0.4108258783817291,-0.5340279936790466,-0.70823734998703,-0.9224007725715637,-1.0528277158737183,-1.1048020124435425,-1.1587022542953491,-1.2160089015960693,-1.2500680685043335,-1.3179632425308228,-1.4563599824905396,-1.5321376323699951,-1.524772047996521,-1.4849823713302612,-1.3655248880386353,-1.2116743326187134,-1.1259506940841675,-1.1109368801116943,-1.0825786590576172,-1.0419611930847168,-0.9677740931510925,-0.7376927137374878,-0.3998595178127289,-0.16071005165576935,-0.12553715705871582,-0.2565827965736389,-0.4637005627155304,-0.5907740592956543,-0.5999012589454651,-0.539692759513855,-0.40915554761886597,-0.3830651044845581,-0.4234844148159027,-0.48536163568496704,-0.5724555253982544,-0.6597083806991577,-0.7003045678138733,-0.7029315233230591,-0.6387027502059937,-0.550738513469696,-0.48478132486343384,-0.4472928047180176,-0.46137988567352295,-0.4812776744365692,-0.5083860158920288,-0.5164937376976013,-0.4808574318885803,-0.4212934374809265,-0.4013136029243469,-0.4471231698989868,-0.4993291199207306,-0.4921337962150574,-0.4354606568813324,-0.3889560103416443,-0.3481907248497009,-0.2957530915737152,-0.269246369600296,-0.3158431649208069,-0.3887813091278076,-0.42850154638290405,-0.3996472656726837,-0.31846746802330017,-0.26402926445007324,-0.25315582752227783,-0.21671180427074432,-0.20177200436592102,-0.27316710352897644,-0.36782968044281006,-0.41528216004371643,-0.40724658966064453,-0.3531247675418854,-0.2899135649204254,-0.25786828994750977,-0.2734384536743164,-0.31229478120803833,-0.3583299219608307,-0.3964088559150696,-0.4037754237651825,-0.37677285075187683,-0.3605315685272217,-0.3677300810813904,-0.3901802599430084,-0.3992435336112976,-0.4220564365386963,-0.4170680642127991,-0.3781488835811615,-0.3215905427932739,-0.2703563868999481,-0.2409183382987976,-0.23479387164115906,-0.2560991644859314,-0.30238357186317444,-0.357334703207016,-0.41782599687576294,-0.472546249628067,-0.4964744746685028,-0.45873188972473145,-0.3977542817592621,-0.36489859223365784,-0.34667274355888367,-0.3467142879962921,-0.3783891201019287,-0.41193056106567383,-0.4310073256492615,-0.4106850028038025,-0.3780897855758667,-0.3438947796821594,-0.306940495967865,-0.2927333414554596,-0.30237263441085815,-0.3449632525444031,-0.4201810359954834,-0.48034530878067017,-0.5128902196884155,-0.5040335655212402,-0.4523133933544159,-0.39727890491485596,-0.35643693804740906,-0.34102949500083923,-0.36321601271629333,-0.38923004269599915,-0.40396904945373535,-0.4005673825740814,-0.35603293776512146,-0.3109986186027527,-0.3076355755329132,-0.3615105450153351,-0.4369163513183594,-0.5064975619316101,-0.5278452038764954,-0.488087922334671&PhoneMagX=-227.78721618652344,-228.416259765625,-227.98121643066406,-227.8179931640625,-227.62857055664062,-227.64614868164062,-227.58543395996094,-227.3856658935547,-227.609375,-227.136962890625,-227.31393432617188,-226.5968017578125,-226.67308044433594,-226.2364501953125,-226.64932250976562,-226.15489196777344,-226.19830322265625,-226.1396942138672,-226.47210693359375,-226.2218475341797,-225.75413513183594,-225.89053344726562,-225.70828247070312,-225.58004760742188,-225.17539978027344,-225.11346435546875,-225.2533416748047,-225.402587890625,-225.6602020263672,-225.83428955078125,-225.3826446533203,-225.13726806640625,-225.1194610595703,-225.00889587402344,-225.39437866210938,-224.64053344726562,-225.20970153808594,-225.27084350585938,-225.1721954345703,-224.87628173828125,-225.02626037597656,-225.40049743652344,-225.28663635253906,-224.88674926757812,-224.9410400390625,-224.95785522460938,-224.93936157226562,-224.75140380859375,-224.72314453125,-225.09959411621094,-224.74476623535156,-225.00344848632812,-224.54800415039062,-224.0923614501953,-224.4578399658203,-224.25550842285156,-224.1298370361328,-223.91915893554688,-223.78904724121094,-223.40338134765625,-223.41961669921875,-223.54879760742188,-223.1682891845703,-223.3500213623047,-223.5157928466797,-223.78207397460938,-223.5414581298828,-223.3324432373047,-223.14808654785156,-223.08995056152344,-223.2783203125,-222.8294677734375,-223.2233428955078,-222.94149780273438,-222.27337646484375,-222.38973999023438,-222.15823364257812,-222.2061004638672,-222.13011169433594,-221.80079650878906,-222.0077362060547,-221.51596069335938,-221.76980590820312,-221.3780975341797,-221.32858276367188,-221.26837158203125,-221.1634063720703,-221.0474395751953,-220.84674072265625,-220.44525146484375,-220.11512756347656,-220.10072326660156,-219.85662841796875,-219.3699493408203,-219.43133544921875,-219.03179931640625,-219.60260009765625,-219.93106079101562,-219.9462890625,-219.767822265625,-219.67051696777344,-220.22503662109375,-220.10231018066406,-220.22125244140625,-219.93443298339844,-219.9392852783203,-220.3113250732422,-220.38539123535156,-220.8545379638672,-220.96340942382812,-221.82138061523438,-222.59075927734375,-222.85633850097656,-223.6713104248047,-224.35769653320312,-224.58982849121094,-225.5370330810547,-226.70314025878906,-227.78851318359375,-228.8914337158203,-229.41758728027344,-229.5848388671875,-230.45480346679688,-230.75477600097656,-231.59979248046875,-231.6545867919922,-231.82212829589844,-232.01502990722656,-232.37814331054688,-232.74354553222656,-233.86070251464844,-234.60260009765625,-235.8060302734375,-236.60354614257812,-237.47796630859375,-238.65589904785156,-239.5039825439453,-240.2661590576172,-241.0587921142578,-241.8348846435547,-242.22860717773438,-242.81832885742188,-243.41091918945312,-243.96742248535156,-244.43533325195312,-244.8738555908203,-245.6408233642578,-245.29490661621094,-245.39854431152344,-246.25408935546875,-246.33941650390625,-246.06581115722656,-246.05210876464844,-246.0111083984375,-245.675537109375&PhoneMagY=3.3621063232421875,3.5514373779296875,3.43963623046875,3.5002593994140625,4.08154296875,3.8434906005859375,3.8573760986328125,3.76568603515625,4.0200958251953125,3.97454833984375,4.2116546630859375,4.527130126953125,4.433380126953125,4.4413909912109375,4.3759002685546875,4.5317230224609375,4.8894500732421875,5.3050079345703125,5.64642333984375,5.56903076171875,5.7813568115234375,5.9141693115234375,6.109466552734375,5.9820404052734375,5.99945068359375,6.3750762939453125,6.5775146484375,6.68115234375,6.61474609375,7.0382843017578125,7.20428466796875,7.497314453125,7.56591796875,7.7751312255859375,7.9238433837890625,8.222442626953125,8.123260498046875,8.465011596679688,8.972976684570312,8.865509033203125,8.9669189453125,9.56854248046875,9.820526123046875,10.146759033203125,10.512939453125,10.515151977539062,10.474273681640625,11.020278930664062,11.0921630859375,11.593460083007812,11.801498413085938,11.984649658203125,12.144699096679688,12.2640380859375,12.390350341796875,12.848388671875,13.036590576171875,12.929367065429688,12.841018676757812,13.286712646484375,13.609848022460938,13.762802124023438,13.726364135742188,14.00982666015625,14.225738525390625,14.626922607421875,14.62652587890625,14.814620971679688,14.748031616210938,15.04351806640625,15.49737548828125,15.146392822265625,15.558319091796875,15.9981689453125,16.1207275390625,16.356292724609375,16.546737670898438,16.339218139648438,16.812637329101562,16.795120239257812,17.50537109375,17.42022705078125,17.579696655273438,17.959197998046875,18.244720458984375,18.633926391601562,18.598495483398438,18.897415161132812,19.024078369140625,19.373397827148438,19.469970703125,19.7720947265625,19.633758544921875,19.427459716796875,19.878692626953125,19.741058349609375,20.190567016601562,20.487106323242188,20.435775756835938,20.63360595703125,20.833023071289062,21.242706298828125,21.45635986328125,22.338607788085938,22.393463134765625,23.0511474609375,23.322616577148438,23.554885864257812,23.590591430664062,24.250457763671875,24.037261962890625,23.972457885742188,23.887191772460938,24.319427490234375,23.600494384765625,23.589828491210938,23.38385009765625,23.292831420898438,22.763076782226562,22.489654541015625,21.723663330078125,21.45391845703125,20.86468505859375,20.291168212890625,20.017105102539062,19.29437255859375,19.098602294921875,18.692459106445312,18.577911376953125,18.183380126953125,18.216705322265625,18.294647216796875,18.20330810546875,18.252700805664062,18.5709228515625,18.936325073242188,18.938323974609375,18.957382202148438,19.550857543945312,19.688888549804688,19.553924560546875,19.3355712890625,19.510543823242188,19.957290649414062,19.789886474609375,19.698287963867188,19.7659912109375,19.371673583984375,19.160400390625,18.958221435546875,18.5806884765625,18.130401611328125,17.467178344726562,17.028305053710938,16.139114379882812&PhoneMagZ=-409.9538879394531,-410.3189697265625,-410.50469970703125,-410.63616943359375,-410.6319580078125,-411.2320556640625,-411.41778564453125,-411.4557189941406,-412.39373779296875,-412.1322326660156,-412.5090637207031,-412.510498046875,-412.5603332519531,-413.17974853515625,-413.90087890625,-413.48590087890625,-413.764892578125,-413.82257080078125,-414.529296875,-414.483154296875,-414.0876770019531,-415.28717041015625,-415.165283203125,-415.85247802734375,-415.529052734375,-416.2054443359375,-416.3580322265625,-416.44342041015625,-416.9854736328125,-417.2021484375,-417.4306640625,-417.4102783203125,-417.38726806640625,-417.8885498046875,-417.80242919921875,-418.5323486328125,-418.39306640625,-418.73919677734375,-418.89373779296875,-418.9827575683594,-419.0899963378906,-419.4158630371094,-418.9378662109375,-419.6551818847656,-420.33349609375,-420.79833984375,-421.0029602050781,-421.10748291015625,-421.2685852050781,-421.757080078125,-421.84857177734375,-421.7708740234375,-421.62615966796875,-421.8370361328125,-422.360595703125,-423.04754638671875,-423.2205810546875,-422.9208984375,-423.1961669921875,-423.6131591796875,-423.8770751953125,-423.87860107421875,-424.4510498046875,-424.7911376953125,-424.39752197265625,-424.7454833984375,-424.9615478515625,-425.16021728515625,-425.4283447265625,-425.63446044921875,-426.43646240234375,-426.1153564453125,-426.8187561035156,-426.6332092285156,-426.66839599609375,-426.7367248535156,-427.98907470703125,-428.1396484375,-427.8168029785156,-427.8390808105469,-428.1762390136719,-428.58917236328125,-428.6939697265625,-429.04461669921875,-428.9477233886719,-429.7633056640625,-429.56719970703125,-429.84381103515625,-429.45465087890625,-430.03973388671875,-430.7662048339844,-430.54791259765625,-430.9662170410156,-431.44561767578125,-431.091796875,-431.7933349609375,-431.547119140625,-432.210205078125,-431.83709716796875,-432.83282470703125,-432.13409423828125,-432.8369140625,-432.66387939453125,-433.0854187011719,-433.364990234375,-433.543212890625,-433.23187255859375,-433.58575439453125,-433.4965515136719,-432.94403076171875,-432.81317138671875,-432.2584228515625,-431.95477294921875,-431.95111083984375,-431.06805419921875,-430.94439697265625,-429.872314453125,-429.4901123046875,-428.050048828125,-426.86370849609375,-426.1695251464844,-425.4063415527344,-424.6011962890625,-423.7110290527344,-423.8836975097656,-423.05126953125,-422.28662109375,-421.87908935546875,-421.5216064453125,-420.468994140625,-419.75933837890625,-418.9534912109375,-418.5380859375,-416.8157958984375,-415.7841796875,-414.0345153808594,-413.27679443359375,-412.18304443359375,-410.89093017578125,-409.76080322265625,-408.57110595703125,-408.3896789550781,-406.98431396484375,-406.47955322265625,-405.71978759765625,-404.38787841796875,-403.4991149902344,-402.2271423339844,-401.781494140625,-401.383544921875,-401.1539306640625,-400.94232177734375,-400.03753662109375,-400.33856201171875,-399.3606262207031&LeftWatchRoll=-0.15526720165879168,-0.15582120226788723,-0.15632346278735923,-0.15761941271065003,-0.1594903493277721,-0.16167485140899618,-0.16417385639219717,-0.1667189734835361,-0.16878749742003368,-0.1697675913622123,-0.1699173640518163,-0.16992631143532635,-0.17022913361270417,-0.1710557539087348,-0.17222373877331157,-0.17364259511379615,-0.17489700679705758,-0.17529493432549983,-0.17431632832623695,-0.17195231481121165,-0.16841587513502573,-0.16399634967401788,-0.15894328485709394,-0.1533799141877486,-0.14741429764739167,-0.14095189265450517,-0.13398920126263522,-0.1265749993139079,-0.11878202257456079,-0.1106465926846703,-0.10233510369211646,-0.09389751824615425,-0.08504144571803762,-0.0754126185599443,-0.0644638561416679,-0.05165491844697809,-0.037170947623206066,-0.02140882110965457,-0.005101636342479664,0.0109497569566619,0.026415426050217537,0.040727838110515384,0.05447292988881441,0.06944724613940628,0.08582285750345517,0.10279342662844473,0.12004747709123754,0.13689449164293935,0.15317774632404502,0.16792510502310723,0.17978986727801474,0.18875674832711756,0.19524527278391565,0.19947257637266988,0.20016430371726213,0.1974608927296527,0.18967622588341804,0.17686213524429123,0.16047495981193496,0.14078648610894062,0.1183076819517759,0.09392570346123359,0.06812478089342519,0.0415117934527709,0.014854691194762496,-0.011655962110961215,-0.038468078975699656,-0.06576919091917789,-0.09343691884997803,-0.12069804521351718,-0.1470646902037701,-0.1721677013286642,-0.19554140510296938,-0.21697815789819533,-0.2366769544815939,-0.2544978577178311,-0.2703483841563745,-0.2842801451434891,-0.2963342226671509,-0.30576170810357695,-0.31160098518106844,-0.3135402033039403,-0.31370014458047646,-0.3127578101511591,-0.30998783043472744,-0.3051872776838269,-0.2984563199474323,-0.2900765010793142,-0.28017226762344993,-0.26938541295941404,-0.2575638821298258,-0.24520904143618397,-0.23272876537635306,-0.21930639320923226,-0.20500981885810893,-0.19046793823098845,-0.17638476950818707,-0.16259168309336386,-0.1504059529717755,-0.13978239128120534,-0.13075962236143426,-0.1249512424130624,-0.12223385068335217,-0.12185482340017764,-0.12250193447493267,-0.1237704577902862,-0.12571356498671254,-0.1272204331567394,-0.1284176005224688,-0.13038436670338946,-0.1331411555448447,-0.13694906771623452,-0.14142170386168587,-0.14590408984441583,-0.14926224877747693,-0.15049376711460896,-0.14971034076303788,-0.14776432760450095,-0.14537994770136514,-0.14269212472467627,-0.14000159946535917,-0.13761572312399614,-0.13568127073821418,-0.13402746420178036,-0.13270566330384692,-0.1316070285050099,-0.13095272052836954,-0.1308971662488679,-0.1308997706380628,-0.13112735014371243,-0.13140341853868284,-0.13167214613054434,-0.13226282391298638,-0.1333813073816694,-0.135089590727902,-0.1366845416128361,-0.1377747921130035,-0.1385616289597617,-0.13928807145605396,-0.139800986276716,-0.1398507769634988,-0.13971437520152247,-0.1391196862061319,-0.13792141097526486,-0.13644946753174966,-0.13466054432556698,-0.13297359447898296,-0.13167041774212979,-0.13058021373373488,-0.12973166232642508,-0.12883513007701258,-0.1274536320758095,-0.12574887527473808,-0.12415971073641262,-0.12286691994223889&LeftWatchPitch=0.08885165614148033,0.08425248896102236,0.08108662476270642,0.07684471313664139,0.07166291395609156,0.06497627885883922,0.056450983901546306,0.0472709753886985,0.039002257610085744,0.03266582010184416,0.02729886204679953,0.021691053694729026,0.01483387083729133,0.006415628520681942,-0.0028519755818533533,-0.012948088896821992,-0.022919596303131767,-0.03148718393181367,-0.038608587997387964,-0.045387933623042095,-0.052365749415216246,-0.059942262328592975,-0.06845532888630654,-0.07799367680925814,-0.08836851466462356,-0.09987009831310968,-0.11279082218973883,-0.12777057566564684,-0.14516809641237507,-0.16523809153973973,-0.18802094721787366,-0.21334566395611868,-0.2399860770842379,-0.2670703374629076,-0.2941021487434506,-0.32064880153463043,-0.3472550047757805,-0.3745264846369398,-0.4034419482593679,-0.4326985248011891,-0.46041834259996184,-0.4842892278234401,-0.5026624341191843,-0.5145830175049144,-0.5215722943309884,-0.5272655426074513,-0.5341946015026593,-0.5447549598897059,-0.5590739827438276,-0.5709441896528542,-0.5772805945805413,-0.5752125644655876,-0.5655932198104926,-0.5517009603186602,-0.5391569216808023,-0.5289390776594748,-0.5190133883507345,-0.5110129454622695,-0.5038959647632082,-0.4948676661600728,-0.4834984313507305,-0.4689358230826427,-0.45174454057304764,-0.4326040741947854,-0.4113786266577228,-0.38815241309953374,-0.36313815061479626,-0.3367674012784334,-0.3085173698887254,-0.2772676235940991,-0.24298321432611936,-0.2065332274191329,-0.1684794870154865,-0.12951705515007422,-0.09081882941131446,-0.05162692040366597,-0.011758153293402941,0.028090343692920017,0.06771208726391172,0.10562658144864749,0.14143199906821047,0.17596514021633441,0.21111019252205995,0.2458663365231212,0.2783075994724385,0.31128684790481753,0.3433111600932447,0.3745594636999662,0.4036801060246433,0.4293536987508543,0.4532069500615842,0.4744056552308664,0.4924689826430053,0.5099590315949017,0.5281775692676203,0.5434182821432323,0.5551583146193966,0.5651303435613697,0.5746213235874227,0.5838214865841066,0.5909324719297833,0.5956704295677875,0.5986204844016678,0.6008328941747011,0.6023780222134681,0.6031588748276402,0.6032113763379294,0.6026475807877542,0.5987749444894558,0.5925806135973211,0.5876010986541941,0.5839371785676327,0.5790718515502488,0.5710583529559197,0.5614506502024786,0.5504133780313509,0.5397811278894113,0.5298968503859668,0.521582640839936,0.5157035939664657,0.5116298879504888,0.5070170185678254,0.5010287207871276,0.49420109646137744,0.487734704865258,0.48258283365699595,0.4785252000972236,0.475656928536321,0.4731893435244554,0.4697500389580802,0.46488075497671394,0.4599313728389156,0.4557560670139299,0.4520108002906235,0.44794555894070026,0.44441706536188497,0.44036398312563807,0.4346790560083114,0.42757388165988314,0.42011498125646574,0.4123662918182039,0.4047283832467413,0.3981912665185654,0.3923980710010839,0.3868580081740027,0.38109376766866837,0.37479027535163933,0.3684390049461998,0.3623781290801295,0.3561031561207801,0.3499715009194429,0.34415167128517243,0.33795364000056627,0.331175579246122,0.3249257905768698&LeftWatchYaw=1.354706112196829,1.3441084851848573,1.334847813863809,1.3270057399521733,1.319861404415356,1.3123057109020784,1.3038364080486322,1.294372261129782,1.2844078328465942,1.2744412985429165,1.2649611983995468,1.2564834186619684,1.2488870568284736,1.2416728441036622,1.2347371494213983,1.2281014863725175,1.2219209579740418,1.2164686892314018,1.2121817359053768,1.2092194681241477,1.2075310549917924,1.2068722388834898,1.2071945769306256,1.208800725523746,1.2119442105191676,1.2171294508414385,1.2245796832005111,1.2342784319785782,1.2463110875321664,1.2607139309811055,1.277278659326933,1.2959669605384516,1.3172273127736354,1.341360201616787,1.3690597349989422,1.4008341764737373,1.436489859702489,1.4753985742686209,1.5167336711828137,1.5602247282400237,1.6055510774049722,1.6516093225071335,1.6978097507418946,1.7456081931484884,1.7953953097399993,1.8461626522714172,1.898988940019885,1.9543218727837675,2.0111883390263854,2.0662420251916216,2.1166414759945997,2.1621571554458043,2.2019727933525126,2.237178077608289,2.268197424359159,2.296093792718337,2.319477551059466,2.3384693148497506,2.354935288413608,2.3688714961090147,2.3804009540499886,2.390963262561314,2.4010973568191374,2.411000528813331,2.421093814339664,2.431052719174208,2.4403547408692994,2.4488850402236593,2.4564229886833724,2.463001552674453,2.468557752929277,2.4731114013677926,2.4766607041893796,2.4789997501288665,2.4797277052990747,2.4791231327169676,2.4773239767170616,2.474400821248747,2.4705073332172565,2.4652723952425046,2.459610359666564,2.4556710686660934,2.4543763107663894,2.4516321637085703,2.4473405352916813,2.4412527234075276,2.4340277215807453,2.4266597054913457,2.419618453590622,2.413304517745552,2.4052796030290193,2.3963207604081767,2.387493949458731,2.3784667066804,2.367339482009144,2.354310474052008,2.3381192049301562,2.3176763845890838,2.2965428221180697,2.2752423246182585,2.2546790325468513,2.237151477099063,2.222339186743269,2.2098280929789538,2.1988422260370877,2.1888846064795224,2.181804894091804,2.1776283251058612,2.1762125591190307,2.17759588662243,2.180647875364333,2.1850635251016133,2.1882744586505884,2.18925834779006,2.1869688985483378,2.1808571793541383,2.171943815773384,2.162718821448589,2.1550759519928344,2.148535468649256,2.14303445697126,2.1370425260320807,2.129876917950433,2.121612668367129,2.113520897287399,2.1066184114610675,2.101865769236384,2.0991614801601117,2.096582356882585,2.0932577005758546,2.088407861248076,2.0827316674896856,2.077050789098808,2.072994375531634,2.070783757157706,2.0695751780919585,2.0685275529523452,2.0669074140352675,2.0640341596272203,2.06009396946277,2.0550465641214166,2.0505432055485633,2.047960321548944,2.047334926300423,2.047737897082324,2.0477817733227583,2.0467956635814555,2.0443431686922064,2.041294727230726,2.03851233178732,2.0364415544434116,2.0347958899417966,2.0331453875251357,2.0310390261796165,2.0277819172949747&LeftWatchRotX=-0.7579429149627686,-0.47845929861068726,-0.4718813896179199,-0.5952256917953491,-0.6698386669158936,-0.8930741548538208,-1.0451068878173828,-1.0540391206741333,-0.8870851993560791,-0.7117195129394531,-0.6787464022636414,-0.7290564179420471,-0.8877485394477844,-0.9911276698112488,-1.0718144178390503,-1.1283323764801025,-1.0331569910049438,-0.8449487686157227,-0.7237986326217651,-0.714168131351471,-0.7311208844184875,-0.7890332341194153,-0.8866299390792847,-0.94182288646698,-1.0192286968231201,-1.1051568984985352,-1.267128348350525,-1.456156611442566,-1.708322286605835,-1.9551664590835571,-2.2297167778015137,-2.4307854175567627,-2.4920074939727783,-2.5284528732299805,-2.48171067237854,-2.484647512435913,-2.5428731441497803,-2.712698221206665,-2.9370639324188232,-2.931432008743286,-2.723114490509033,-2.3050589561462402,-1.7411479949951172,-1.1780750751495361,-0.9512537717819214,-1.0491222143173218,-1.4087059497833252,-1.943663477897644,-2.2576193809509277,-1.8135802745819092,-0.9567289352416992,-0.07345321774482727,0.6524032950401306,0.816158652305603,0.5512031316757202,0.5511986017227173,0.5683533549308777,0.40621212124824524,0.5651504397392273,0.8404965400695801,1.164853572845459,1.5245201587677002,1.7372288703918457,1.9833861589431763,2.1963846683502197,2.431962013244629,2.6007461547851562,2.739664316177368,3.013040781021118,3.324030876159668,3.5857090950012207,3.735102891921997,3.857800245285034,3.826016664505005,3.7524049282073975,3.8079867362976074,3.772820472717285,3.726179599761963,3.605996608734131,3.3137876987457275,3.181881904602051,3.1768364906311035,3.3932392597198486,2.991335391998291,2.9927611351013184,2.945519208908081,2.8340020179748535,2.7462000846862793,2.4419684410095215,2.212070941925049,2.0140836238861084,1.677117109298706,1.4955039024353027,1.5982484817504883,1.474091649055481,1.0442780256271362,0.8164203763008118,0.5974406003952026,0.6999863982200623,0.5758889317512512,0.3764181137084961,0.1933843493461609,0.11242654174566269,0.06294979900121689,0.03590941056609154,-0.06953978538513184,-0.05790659785270691,-0.18437638878822327,-0.5945807695388794,-0.5633155107498169,-0.3623390793800354,-0.2617592215538025,-0.6565665602684021,-0.8800683617591858,-1.1246000528335571,-1.1642409563064575,-1.142509937286377,-1.033644437789917,-0.7971232533454895,-0.524880051612854,-0.4549793601036072,-0.6141977906227112,-0.7369152307510376,-0.7848092317581177,-0.6725947856903076,-0.5209975242614746,-0.367748498916626,-0.26825037598609924,-0.2993687391281128,-0.4689447283744812,-0.5830184817314148,-0.5091458559036255,-0.4383562505245209,-0.41795775294303894,-0.4120787978172302,-0.326846718788147,-0.4797312021255493,-0.6957841515541077,-0.778461217880249,-0.7899176478385925,-0.855841875076294,-0.7558742761611938,-0.6075584292411804,-0.5541998744010925,-0.5474792122840881,-0.6030135750770569,-0.6620644927024841,-0.6564553380012512,-0.6355466246604919,-0.6560404300689697,-0.5955885648727417,-0.6096343398094177,-0.6651972532272339,-0.7011358141899109,-0.6002224087715149&LeftWatchRotY=-0.1748126596212387,-0.12087886035442352,-0.15150843560695648,-0.22823970019817352,-0.25028321146965027,-0.29068177938461304,-0.30777958035469055,-0.29313433170318604,-0.1966288834810257,-0.0740576907992363,-0.023167714476585388,-0.02734461799263954,-0.07042001932859421,-0.11144441366195679,-0.12779486179351807,-0.14139722287654877,-0.08250650763511658,0.036361560225486755,0.18336664140224457,0.3068837821483612,0.4081238806247711,0.47523126006126404,0.5233592391014099,0.5552039742469788,0.5822506546974182,0.6087115406990051,0.6206256747245789,0.6202986240386963,0.6043460369110107,0.5689587593078613,0.5047585964202881,0.4333174526691437,0.37777701020240784,0.33511343598365784,0.3224000036716461,0.30504605174064636,0.24800750613212585,0.14664492011070251,-0.03973880410194397,-0.28534749150276184,-0.5468975901603699,-0.7696685791015625,-0.8419977426528931,-0.8256454467773438,-0.8369207978248596,-0.8726676106452942,-1.0441352128982544,-1.265093445777893,-1.447274923324585,-1.5508028268814087,-1.5778239965438843,-1.5537426471710205,-1.4267830848693848,-1.4841989278793335,-1.58799147605896,-1.8025333881378174,-2.088737964630127,-2.3312392234802246,-2.536081075668335,-2.713738203048706,-2.850400686264038,-2.983931064605713,-3.0597829818725586,-3.0931835174560547,-3.0504400730133057,-3.0231730937957764,-3.0163028240203857,-3.022318124771118,-2.9682018756866455,-2.8494534492492676,-2.7000560760498047,-2.511080503463745,-2.2895314693450928,-2.0682647228240967,-1.877673625946045,-1.6754076480865479,-1.4841190576553345,-1.3118215799331665,-1.1238067150115967,-0.8455963730812073,-0.46121999621391296,-0.08006571978330612,-0.015666622668504715,0.11063805222511292,0.23188042640686035,0.36427199840545654,0.5167816281318665,0.6438759565353394,0.7929129004478455,0.8370532393455505,0.8360889554023743,0.8314201831817627,0.860592782497406,0.9081776142120361,0.865011990070343,0.6941505074501038,0.40156009793281555,0.19647885859012604,-0.034238141030073166,-0.16541720926761627,-0.31202709674835205,-0.48241105675697327,-0.6313340663909912,-0.6782627105712891,-0.6929373741149902,-0.6661201119422913,-0.5100703835487366,-0.2741100788116455,-0.1420394480228424,-0.10599727928638458,-0.1002139002084732,-0.1896742731332779,-0.3367997109889984,-0.4403543174266815,-0.4699030816555023,-0.4095348119735718,-0.34613898396492004,-0.19905152916908264,-0.09780746698379517,-0.009962297976016998,-0.0076955147087574005,-0.10041400045156479,-0.19952823221683502,-0.24704967439174652,-0.23564888536930084,-0.18379127979278564,-0.1294606328010559,-0.10659153759479523,-0.12990520894527435,-0.21615594625473022,-0.259889155626297,-0.30036652088165283,-0.3031712472438812,-0.27302584052085876,-0.2473364919424057,-0.17474405467510223,-0.1327497363090515,-0.17005476355552673,-0.20853981375694275,-0.2148304581642151,-0.19821472465991974,-0.11627405881881714,0.043966881930828094,0.13696420192718506,0.18176069855690002,0.17260608077049255,0.0829344168305397,0.012258385308086872,-0.011927178129553795,-0.00867439340800047,0.05319170281291008,0.10532121360301971,0.11826388537883759,0.05370006710290909,0.002999640069901943&LeftWatchRotZ=-1.008740782737732,-0.923698902130127,-0.7880721092224121,-0.6314252614974976,-0.6181038618087769,-0.6605751514434814,-0.7311414480209351,-0.8216697573661804,-0.859653115272522,-0.8779977560043335,-0.7967044711112976,-0.6823544502258301,-0.5867065191268921,-0.5436431765556335,-0.5026757717132568,-0.4501768946647644,-0.41595128178596497,-0.3511935770511627,-0.23836208879947662,-0.10290627181529999,0.006550982594490051,0.10862728953361511,0.23351196944713593,0.3790033757686615,0.561018168926239,0.7906388640403748,1.0275238752365112,1.2714433670043945,1.5169007778167725,1.7586854696273804,1.9594632387161255,2.176907777786255,2.4191160202026367,2.673369884490967,3.015139579772949,3.330005407333374,3.6151552200317383,3.8008086681365967,3.9071576595306396,3.9984023571014404,4.045786380767822,3.9689924716949463,3.9934442043304443,4.181424140930176,4.294190883636475,4.355433940887451,4.520099639892578,4.591546058654785,4.510033130645752,4.167742729187012,3.9243931770324707,3.609048366546631,3.335756301879883,3.0284690856933594,2.6814017295837402,2.395740509033203,1.94230318069458,1.6208077669143677,1.4547207355499268,1.2232763767242432,1.1064362525939941,1.0681339502334595,1.014900803565979,0.9872656464576721,0.9628686904907227,0.8664957880973816,0.732342004776001,0.5801769495010376,0.391035258769989,0.18538464605808258,-0.037350162863731384,-0.24662455916404724,-0.46185538172721863,-0.6834660768508911,-0.909644603729248,-1.1080466508865356,-1.299315094947815,-1.4389986991882324,-1.5732462406158447,-1.6571125984191895,-1.5696653127670288,-1.2610564231872559,-1.2073510885238647,-1.3964581489562988,-1.4577447175979614,-1.6564832925796509,-1.5752878189086914,-1.552001714706421,-1.3099744319915771,-1.2577476501464844,-1.350340485572815,-1.2409961223602295,-1.1497868299484253,-1.2101445198059082,-1.3858124017715454,-1.4514268636703491,-1.7198807001113892,-1.9521427154541016,-1.8742988109588623,-1.8936628103256226,-1.648618221282959,-1.3601312637329102,-1.1499487161636353,-0.9581738114356995,-0.8914285898208618,-0.7197372317314148,-0.452073872089386,-0.20857277512550354,0.06948493421077728,0.27398881316185,0.3601657748222351,0.429924875497818,0.2472299188375473,0.12141604721546173,-0.22948604822158813,-0.470119446516037,-0.6841289401054382,-0.5719603300094604,-0.5092743039131165,-0.44270646572113037,-0.4154873490333557,-0.4944157302379608,-0.591506838798523,-0.6452633142471313,-0.5866420865058899,-0.4820703864097595,-0.2391490638256073,-0.1897444874048233,-0.19693529605865479,-0.31724679470062256,-0.40793755650520325,-0.47470566630363464,-0.4027470648288727,-0.22096766531467438,-0.08438745141029358,-0.04761451855301857,-0.030810238793492317,-0.11763674020767212,-0.20185068249702454,-0.31319108605384827,-0.35524505376815796,-0.23915597796440125,-0.054853521287441254,0.09612986445426941,0.110992431640625,0.050440408289432526,-0.0773196816444397,-0.19121482968330383,-0.21222183108329773,-0.1354096233844757,-0.09279264509677887,-0.07626746594905853,-0.08118553459644318,-0.15646590292453766,-0.3020516037940979&LeftWatchGravX=-0.1540340632200241,-0.15464091300964355,-0.15517601370811462,-0.15650434792041779,-0.15840741991996765,-0.16063176095485687,-0.1631770133972168,-0.16576233506202698,-0.16785944998264313,-0.16886314749717712,-0.16903789341449738,-0.16906994581222534,-0.1693895310163498,-0.170219287276268,-0.1713729202747345,-0.17275682091712952,-0.17396101355552673,-0.17431211471557617,-0.17330561578273773,-0.17092998325824738,-0.1673910766839981,-0.16296900808811188,-0.15790419280529022,-0.15231479704380035,-0.1463078409433365,-0.13978560268878937,-0.13273979723453522,-0.12520825862884521,-0.11725644022226334,-0.10891694575548172,-0.10035618394613266,-0.0916338860988617,-0.08250473439693451,-0.07267017662525177,-0.06165323778986931,-0.0490003265440464,-0.03494418039917946,-0.019923260435461998,-0.004692032001912594,0.009940401650965214,0.02366194874048233,0.036034420132637024,0.04771118983626366,0.06040510907769203,0.07432027161121368,0.08867630362510681,0.10307434946298599,0.11671426892280579,0.12934871017932892,0.14062757790088654,0.14984457194805145,0.15744256973266602,0.16379457712173462,0.16875335574150085,0.17062464356422424,0.16937078535556793,0.1637118011713028,0.1534649282693863,0.13992683589458466,0.1234876736998558,0.1045023649930954,0.08366325497627258,0.06124357879161835,0.03767678514122963,0.013614869676530361,-0.01078862976282835,-0.03595058247447014,-0.06203004717826843,-0.08889579772949219,-0.11580656468868256,-0.14223060011863708,-0.16767749190330505,-0.19154655933380127,-0.2134765237569809,-0.2335072010755539,-0.25142404437065125,-0.267048716545105,-0.28035590052604675,-0.2913469970226288,-0.29934197664260864,-0.3035217225551605,-0.303665429353714,-0.3017295002937317,-0.29843080043792725,-0.29330939054489136,-0.28603118658065796,-0.2768861949443817,-0.26619505882263184,-0.25429487228393555,-0.24198295176029205,-0.22901038825511932,-0.2159498631954193,-0.2032269835472107,-0.18987226486206055,-0.1758347451686859,-0.16204635798931122,-0.14911875128746033,-0.13670754432678223,-0.12577500939369202,-0.11624971777200699,-0.10827644169330597,-0.10316227376461029,-0.10072779655456543,-0.10026521980762482,-0.1006881594657898,-0.10167084634304047,-0.10325492173433304,-0.10452651232481003,-0.1057850569486618,-0.10784793645143509,-0.11048269271850586,-0.1138995960354805,-0.11797169595956802,-0.122318334877491,-0.1258794218301773,-0.12778347730636597,-0.12794551253318787,-0.12703634798526764,-0.1256054788827896,-0.12371361255645752,-0.12167567014694214,-0.11992387473583221,-0.11863973736763,-0.11763787269592285,-0.11688795685768127,-0.11624117195606232,-0.11591150611639023,-0.11603453010320663,-0.11618395894765854,-0.11658904701471329,-0.11712050437927246,-0.11764851957559586,-0.11841659992933273,-0.11963045597076416,-0.12139148265123367,-0.12302330136299133,-0.12423669546842575,-0.12527436017990112,-0.1263391375541687,-0.12722879648208618,-0.12771053612232208,-0.1280093640089035,-0.12782225012779236,-0.1270350068807602,-0.12597396969795227,-0.12462233752012253,-0.12337880581617355,-0.12247948348522186,-0.12175317108631134,-0.12125183641910553,-0.12069093436002731,-0.11965543776750565,-0.11832349002361298,-0.11711153388023376,-0.11614509671926498&LeftWatchGravY=-0.08873479068279266,-0.08415284752845764,-0.08099779486656189,-0.07676910609006882,-0.07160159200429916,-0.06493056565523148,-0.056421007961034775,-0.04725337401032448,-0.038992371410131454,-0.03266001120209694,-0.027295472100377083,-0.02168935351073742,-0.014833326451480389,-0.0064155845902860165,0.002851971657946706,0.012947726994752884,0.02291758917272091,0.03148198127746582,0.03859899565577507,0.04537235200405121,0.05234181880950928,0.05990637093782425,0.06840187311172485,0.07791462540626526,0.08825355023145676,0.09970416128635406,0.11255182325839996,0.1274232119321823,0.14465875923633575,0.16448718309402466,0.1869150847196579,0.21173088252544403,0.23768910765647888,0.2639067769050598,0.2898806631565094,0.3151823580265045,0.3403179347515106,0.3658318817615509,0.39258626103401184,0.4193221628665924,0.4443229138851166,0.46557945013046265,0.4817603528499603,0.49217191338539124,0.4982439875602722,0.5031721591949463,0.5091480016708374,0.5182085633277893,0.5304014086723328,0.5404267311096191,0.5457472205162048,0.5440131425857544,0.5359167456626892,0.5241366028785706,0.5134127140045166,0.5046176910400391,0.49602368474006653,0.48906102776527405,0.4828409254550934,0.47491520643234253,0.46487942337989807,0.4519372284412384,0.4365357458591461,0.4192363917827606,0.3998733162879944,0.37847891449928284,0.35520946979522705,0.3304378092288971,0.30364635586738586,0.2737286686897278,0.24059927463531494,0.20506803691387177,0.16768355667591095,0.1291552633047104,0.09069403260946274,0.05160398781299591,0.011757882311940193,-0.028086649253964424,-0.06766035407781601,-0.10543027520179749,-0.1409609615802765,-0.17505845427513123,-0.2095455676317215,-0.24339669942855835,-0.27472877502441406,-0.3062838912010193,-0.33660686016082764,-0.36586257815361023,-0.3928053081035614,-0.4162832498550415,-0.4378509819507599,-0.4568098187446594,-0.47280290722846985,-0.4881414771080017,-0.5039600729942322,-0.5170648694038391,-0.527077853679657,-0.535525918006897,-0.543516993522644,-0.5512164831161499,-0.5571355819702148,-0.561063826084137,-0.5635033845901489,-0.5653296709060669,-0.5666035413742065,-0.5672467947006226,-0.5672900080680847,-0.5668256282806396,-0.5636309385299683,-0.5585035085678101,-0.5543660521507263,-0.5513129830360413,-0.5472473502159119,-0.5405227541923523,-0.5324147343635559,-0.5230395793914795,-0.5139482617378235,-0.505444347858429,-0.4982529580593109,-0.4931470453739166,-0.4895990788936615,-0.4855717122554779,-0.4803280830383301,-0.47432848811149597,-0.4686259329319,-0.46406859159469604,-0.4604705274105072,-0.4579225480556488,-0.4557274878025055,-0.4526634216308594,-0.44831621646881104,-0.4438866078853607,-0.44014132022857666,-0.436775267124176,-0.4331147074699402,-0.429931640625,-0.4262687563896179,-0.4211193323135376,-0.4146643280982971,-0.407865434885025,-0.4007783830165863,-0.39376911520957947,-0.3877517580986023,-0.3824053108692169,-0.37728047370910645,-0.37193599343299866,-0.36607736349105835,-0.36015963554382324,-0.3544989228248596,-0.3486245274543762,-0.3428710401058197,-0.3373982012271881,-0.33155718445777893,-0.32515496015548706,-0.31923845410346985&LeftWatchGravZ=-0.9840729832649231,-0.9843802452087402,-0.9845606684684753,-0.9846892356872559,-0.9847742319107056,-0.9848763942718506,-0.9849821925163269,-0.9850329756736755,-0.985039472579956,-0.9850982427597046,-0.9852315187454224,-0.9853653907775879,-0.9854375720024109,-0.9853852987289429,-0.9852021336555481,-0.9848793745040894,-0.9844858050346375,-0.9841870665550232,-0.9841114282608032,-0.9842379093170166,-0.9845001697540283,-0.9848108291625977,-0.9850824475288391,-0.9852560758590698,-0.98529452085495,-0.9851492643356323,-0.9847396612167358,-0.9839137196540833,-0.982509434223175,-0.9803473949432373,-0.9772366285324097,-0.9730227589607239,-0.967831015586853,-0.9618067741394043,-0.9550749063491821,-0.9477652907371521,-0.939660906791687,-0.9304676651954651,-0.9197032451629639,-0.9077830910682678,-0.8955541849136353,-0.8842722177505493,-0.8750032186508179,-0.8683996796607971,-0.863845705986023,-0.8596245050430298,-0.8544846773147583,-0.8472530245780945,-0.8378205895423889,-0.8295558094978333,-0.8244432210922241,-0.8241732716560364,-0.8282297849655151,-0.8347473740577698,-0.8410081267356873,-0.8465663194656372,-0.8527361750602722,-0.8586430549621582,-0.8644565343856812,-0.8713244795799255,-0.8791850805282593,-0.888117790222168,-0.8976000547409058,-0.9070949554443359,-0.9164693355560303,-0.9255470037460327,-0.9340952038764954,-0.9417871832847595,-0.9486287236213684,-0.9548096656799316,-0.9601470828056335,-0.9642776250839233,-0.9670533537864685,-0.9683732390403748,-0.9681162238121033,-0.9665004014968872,-0.9636113047599792,-0.9594851136207581,-0.9542216658592224,-0.9483031630516052,-0.9423399567604065,-0.9365584850311279,-0.9300806522369385,-0.922874391078949,-0.9156930446624756,-0.9079517126083374,-0.9000166058540344,-0.8917874097824097,-0.8837636113166809,-0.876443088054657,-0.8693910241127014,-0.8629544973373413,-0.8574125170707703,-0.8518605828285217,-0.8456396460533142,-0.840467095375061,-0.836631715297699,-0.8333805203437805,-0.8299216628074646,-0.8262242078781128,-0.8233323693275452,-0.8213189840316772,-0.8199499249458313,-0.8187485933303833,-0.8178155422210693,-0.8172479271888733,-0.8170192837715149,-0.8171799182891846,-0.8192250728607178,-0.8224613666534424,-0.8249071836471558,-0.8264870643615723,-0.828615128993988,-0.8323901295661926,-0.8370716571807861,-0.8426749110221863,-0.8482258915901184,-0.8534563779830933,-0.8578853011131287,-0.8611044883728027,-0.863416314125061,-0.8659321069717407,-0.8690279126167297,-0.8724527955055237,-0.8756294846534729,-0.8781391382217407,-0.880074679851532,-0.881386935710907,-0.8825042843818665,-0.8840265274047852,-0.8861689567565918,-0.8883262276649475,-0.8900859951972961,-0.8915805816650391,-0.8931269645690918,-0.8944406509399414,-0.8960247039794922,-0.8983122110366821,-0.9011614322662354,-0.904134213924408,-0.9072302579879761,-0.9102524518966675,-0.9128581881523132,-0.9152203798294067,-0.9174911379814148,-0.9198548197746277,-0.9223692417144775,-0.9248155951499939,-0.9270958304405212,-0.92938631772995,-0.931597113609314,-0.93372642993927,-0.935985803604126,-0.9383811354637146,-0.9405302405357361&LeftWatchDMUAccelX=0.11918297410011292,-0.02147604525089264,-0.08391395211219788,0.06873577833175659,0.03319378197193146,0.057116106152534485,0.1866907775402069,0.20226134359836578,0.17933405935764313,0.12125571072101593,0.08992105722427368,0.11633554100990295,0.1674516499042511,0.1672285497188568,0.1553664207458496,0.19880355894565582,0.20341046154499054,0.17853876948356628,0.16738519072532654,0.18354898691177368,0.24788117408752441,0.3007253408432007,0.3212648034095764,0.31990206241607666,0.3064335584640503,0.3273771405220032,0.3826634883880615,0.4541572332382202,0.5253527164459229,0.5925595164299011,0.6317434906959534,0.6602221131324768,0.7023015022277832,0.7416459918022156,0.7637253403663635,0.7512403130531311,0.7386032342910767,0.7625532746315002,0.8331984877586365,0.9360435009002686,1.0063978433609009,1.018851399421692,0.938281238079071,0.8631026148796082,0.8673606514930725,0.9080430865287781,0.9376819133758545,1.020172357559204,1.100174069404602,1.0839512348175049,0.9438749551773071,0.758878231048584,0.6579980850219727,0.644036591053009,0.6910086870193481,0.5860918760299683,0.4200895130634308,0.3594440519809723,0.3259850740432739,0.2710588872432709,0.2518819570541382,0.2480781078338623,0.20276403427124023,0.14039331674575806,0.12578947842121124,0.1376044601202011,0.15884491801261902,0.18852545320987701,0.18340876698493958,0.13195039331912994,0.08032575249671936,0.049833908677101135,0.014880344271659851,-0.005090340971946716,0.006731122732162476,-0.03466296195983887,-0.10793599486351013,-0.17620229721069336,-0.28108644485473633,-0.45197024941444397,-0.5948852300643921,-0.5834957361221313,-0.4511238932609558,-0.43730220198631287,-0.44578057527542114,-0.48316434025764465,-0.4571378231048584,-0.3477422893047333,-0.2726063132286072,-0.12206122279167175,-0.10346333682537079,-0.1708451509475708,-0.1583757847547531,-0.10985611379146576,-0.0968855619430542,0.0967692881822586,0.3360389471054077,0.4510233998298645,0.5032622218132019,0.4124075770378113,0.28672799468040466,0.320859432220459,0.4074142277240753,0.5413358211517334,0.6239730715751648,0.43617403507232666,0.14233270287513733,-0.09165571630001068,-0.2148478627204895,-0.13867303729057312,0.10497429221868515,0.3146900236606598,0.3933928608894348,0.3553963601589203,0.319803386926651,0.24735137820243835,0.19879209995269775,0.13837364315986633,0.0339154452085495,-0.07242283970117569,-0.02738741785287857,0.0694020465016365,0.0641506165266037,-0.006705977022647858,-0.10204512625932693,-0.198623925447464,-0.20380587875843048,-0.07787414640188217,0.06425832211971283,0.19660615921020508,0.20511797070503235,0.11404746770858765,0.05403978377580643,0.07826389372348785,0.10134145617485046,0.09152918308973312,0.12318386137485504,0.237838476896286,0.2536432147026062,0.22151288390159607,0.19014951586723328,0.1490970104932785,0.03738342225551605,-0.07720386981964111,-0.057467177510261536,0.03108598291873932,0.07004936039447784,0.10860925912857056,0.14271876215934753,0.09828736633062363,-0.028509482741355896,-0.12431732565164566,-0.05751878023147583,0.02928195893764496,0.017207123339176178&LeftWatchDMUAccelY=-0.027003072202205658,-0.004576966166496277,-0.08257636427879333,-0.2689034640789032,-0.21897147595882416,-0.20090800523757935,-0.16707442700862885,-0.03604431450366974,0.05477001145482063,0.03829054906964302,-0.1300073266029358,-0.21825505793094635,-0.22392089664936066,-0.26645728945732117,-0.2186722308397293,-0.2272573709487915,-0.21552923321723938,-0.20070190727710724,-0.3118533492088318,-0.4484179615974426,-0.491566002368927,-0.5068820118904114,-0.5646176338195801,-0.6304506063461304,-0.7376980781555176,-0.8390229344367981,-0.9071837663650513,-0.9241150617599487,-0.9271904230117798,-0.9544193744659424,-0.9957987070083618,-0.9738157987594604,-0.8840055465698242,-0.8210813999176025,-0.828882098197937,-0.8838316202163696,-0.893921971321106,-0.8460869789123535,-0.746696949005127,-0.5599318146705627,-0.2337058186531067,-0.024569839239120483,0.19556212425231934,0.39010658860206604,0.38455331325531006,0.3301103711128235,0.4504467844963074,0.5925551056861877,0.7327364683151245,0.9717345833778381,1.38381826877594,1.577248454093933,1.661791443824768,1.8752927780151367,1.9215543270111084,2.1433467864990234,2.104440212249756,1.8985732793807983,1.9037100076675415,1.9804681539535522,1.9150644540786743,1.6598334312438965,1.5447570085525513,1.5483691692352295,1.4534592628479004,1.3543702363967896,1.235061526298523,1.1538761854171753,1.1226232051849365,1.1269824504852295,1.1770185232162476,1.1897226572036743,1.176066517829895,1.130702018737793,1.0816540718078613,1.0140546560287476,0.9479436874389648,0.8214826583862305,0.682406485080719,0.7109448313713074,0.7475436329841614,0.5430089235305786,0.11552093923091888,-0.08668141067028046,0.0045413970947265625,0.12830540537834167,0.18377485871315002,-0.06434372067451477,-0.3277451992034912,-0.3343576192855835,-0.2579955756664276,-0.4772722125053406,-0.5541440844535828,-0.4164453148841858,-0.26464033126831055,0.2186792492866516,0.5101863741874695,0.5118901133537292,0.44537246227264404,0.1534351110458374,-0.08973026275634766,-0.23587220907211304,-0.4589422941207886,-0.6303642392158508,-0.809174656867981,-0.9999376535415649,-1.0198986530303955,-1.1322405338287354,-1.2837200164794922,-1.1032243967056274,-0.5806894302368164,-0.22848743200302124,-0.18480831384658813,0.01314854621887207,0.11934405565261841,0.26344186067581177,0.25750911235809326,0.27938538789749146,0.1290055215358734,0.10230845212936401,0.147359699010849,0.0967777669429779,0.14410066604614258,0.21926257014274597,0.1360301375389099,-0.022076427936553955,-0.1396423578262329,-0.1356290876865387,0.03136533498764038,0.08245471119880676,0.13558736443519592,0.1417626142501831,0.07254186272621155,0.018211454153060913,-0.13721302151679993,-0.1736449897289276,-0.10775831341743469,-0.1296466588973999,0.02405458688735962,0.1624583601951599,0.0975404679775238,-0.07714763283729553,-0.1744430661201477,-0.2622022032737732,-0.25544044375419617,-0.051663219928741455,0.05115124583244324,0.17543676495552063,0.2730933129787445,0.11907133460044861,-0.05195009708404541,-0.075916588306427,0.04249471426010132,0.13275691866874695,0.27468281984329224&LeftWatchDMUAccelZ=-0.2109190821647644,-0.06595849990844727,0.04817461967468262,0.06018972396850586,0.06592053174972534,-0.015733957290649414,-0.1335175633430481,-0.18263059854507446,-0.12259596586227417,-0.07697451114654541,-0.06580913066864014,-0.02641439437866211,0.02768915891647339,0.10606712102890015,0.0873749852180481,0.07664579153060913,0.10474038124084473,0.1311139464378357,0.09452402591705322,0.022323906421661377,-0.02413630485534668,-0.047354698181152344,-0.013162732124328613,0.053859591484069824,0.10857033729553223,0.13630282878875732,0.19903415441513062,0.18973958492279053,0.13682156801223755,0.11332780122756958,0.09167754650115967,0.09913665056228638,0.10432088375091553,0.11628681421279907,0.08739912509918213,0.016292572021484375,-0.128484845161438,-0.27595317363739014,-0.29657483100891113,-0.3640980124473572,-0.48504573106765747,-0.5358937978744507,-0.5598264336585999,-0.5424736738204956,-0.5190735459327698,-0.48646003007888794,-0.4044722318649292,-0.38503146171569824,-0.2868284583091736,-0.13547098636627197,-0.10367262363433838,-0.18359339237213135,-0.4247456192970276,-0.38191211223602295,-0.26407909393310547,-0.293326199054718,-0.4546520709991455,-0.4393916130065918,-0.5085902810096741,-0.6385784149169922,-0.5454670190811157,-0.44550037384033203,-0.34280216693878174,-0.2609958052635193,-0.22044777870178223,-0.17172771692276,-0.05902308225631714,0.0866847038269043,0.2225850224494934,0.40651559829711914,0.6349213123321533,0.8099502325057983,0.9952821135520935,1.0981645584106445,1.2303385734558105,1.3565455675125122,1.5020787715911865,1.6949586868286133,1.8605937957763672,2.0539398193359375,2.0159482955932617,1.8322341442108154,1.735607385635376,1.6559219360351562,1.780423879623413,1.87201726436615,1.7700116634368896,1.5583065748214722,1.4323170185089111,1.3006527423858643,1.2608551979064941,1.1869443655014038,1.0796568393707275,1.227653980255127,1.275937557220459,0.853589653968811,0.5306624174118042,0.16759377717971802,-0.10069668292999268,-0.2717982530593872,-0.36071914434432983,-0.6202551126480103,-0.7573053240776062,-0.8172682523727417,-0.8272650241851807,-0.6957221031188965,-0.3949405550956726,-0.1282547116279602,0.1223713755607605,0.1773044466972351,0.13310420513153076,0.13357019424438477,0.011506974697113037,-0.1192241907119751,-0.24511218070983887,-0.2922738194465637,-0.2490488886833191,-0.23148930072784424,-0.15482527017593384,-0.16062402725219727,-0.22903668880462646,-0.3798564672470093,-0.45755594968795776,-0.4545278549194336,-0.2918510437011719,-0.11331593990325928,0.0037471652030944824,-0.011053860187530518,-0.15127873420715332,-0.16420650482177734,-0.1815342903137207,-0.1708473563194275,-0.07475775480270386,0.08973121643066406,0.2243800163269043,0.2721414566040039,0.1648845672607422,0.012890458106994629,-0.10779547691345215,-0.19112646579742432,-0.12316524982452393,0.06210792064666748,0.25933951139450073,0.22656065225601196,0.1559554934501648,-0.0027373433113098145,-0.12639784812927246,-0.18021070957183838,-0.11092907190322876,0.08197420835494995,0.18727338314056396,0.14737999439239502,0.05343270301818848,-0.0256538987159729,-0.10745865106582642&LeftWatchQuatW=0.08306120478227524,0.0812706159239194,0.08002795710120393,0.07862061557105456,0.07701768350753857,0.07489029559778021,0.07208594504432374,0.0689776593294804,0.06603854748083222,0.06351520776454586,0.06112711236793723,0.05861470639623052,0.05569588890064178,0.05229169026374018,0.04862934384499721,0.04468967426930254,0.04074740632586914,0.0371431713966991,0.033773724978369876,0.030199311419777886,0.02626088576368344,0.02186756515146679,0.016949680367537884,0.011518839660944233,0.0056949934140168275,-0.0006445979207878679,-0.007607657469480716,-0.015435524914615811,-0.0242366113130677,-0.034081609714407914,-0.044918724848511386,-0.05662987536875664,-0.06875367534135716,-0.08100553341281964,-0.09329670022187803,-0.10558318331162173,-0.11801068945540708,-0.13068810860889918,-0.14373106914137085,-0.15635032625480844,-0.16775584331035337,-0.17706410919272608,-0.18407494431026983,-0.1891614342212426,-0.1930003983144863,-0.19657669441557785,-0.20040475789416096,-0.20473513060436765,-0.20944728606248103,-0.21283180394055864,-0.2140144419900094,-0.2125784465495235,-0.2091810283546179,-0.20459577403747825,-0.19934687114636174,-0.19348803925726785,-0.1859738303336616,-0.17704866695130955,-0.16693076116008398,-0.155227177218953,-0.14206860503119906,-0.1275512836955944,-0.11193252671379321,-0.09558432563624121,-0.07879888112398878,-0.06172258377574065,-0.04424581455607002,-0.026371961084845793,-0.008092138482943453,0.0104191505437851,0.028924252787004927,0.04709544815460093,0.06461235915639596,0.08124836860099302,0.0968948451507572,0.11164138893318579,0.12549627904960486,0.13839150872458697,0.15033679328151556,0.16076975302389185,0.1692143042661507,0.17565355352442663,0.18131641652826422,0.18642286384008183,0.19038448880740688,0.19361328069479025,0.1959381102704111,0.1974896730296407,0.1980901049132272,0.1977841376781559,0.1969454907981961,0.19562407894939363,0.1938284264195012,0.19163735961583286,0.18949722822602474,0.18706675138360235,0.18469594402649767,0.18273358168075432,0.18158914214792665,0.18120605749644667,0.18112713659037422,0.1816640366453956,0.18286648505336486,0.18464707236217168,0.18654445266343495,0.18841962990076863,0.19007931478352522,0.1910800736998449,0.1909216890845442,0.19026605793744825,0.19001435540982972,0.19033701392871347,0.19083084834471953,0.1909217112858881,0.19055759213197518,0.1893789553803727,0.18768541604106392,0.18564750831233595,0.18357242304457067,0.18177388199882286,0.18026129132881924,0.17879126797709338,0.1772944315332243,0.17580216649949756,0.17448941623177494,0.17344634068101297,0.17264127229337933,0.1721796104869292,0.17182187271138205,0.17138821522920403,0.17075683153433038,0.17015883543727048,0.16986626125909637,0.16975421352161577,0.1696557611365114,0.1695577114018371,0.16910866623064597,0.16817833482531683,0.16696394589136346,0.16563983032402207,0.16411429451279477,0.1624821248094061,0.16078877018343973,0.1588936891707314,0.1568784845355149,0.1546973262535306,0.15248586346609777,0.15050670282366102,0.1487163852535108,0.14694747508498246,0.14514519411218396,0.14318985860058897,0.14099874435203816,0.1387262134905259,0.1367645903126031&LeftWatchQuatX=-0.03262427038579622,-0.0347125191704689,-0.036265395605464594,-0.03839506465723484,-0.041001896740520724,-0.044195700057616305,-0.04808861910361558,-0.052207216106655366,-0.05584947817381098,-0.0584524979753432,-0.06039632674621834,-0.06230271277280495,-0.06464669060484779,-0.06762335364493609,-0.07095162895241931,-0.07458640489304834,-0.07808158855225014,-0.08078894154446038,-0.08248410483985225,-0.08348077619298779,-0.08402551337352235,-0.08435878327735558,-0.08468458669384377,-0.08508397007719747,-0.08555873479224775,-0.08616817094237576,-0.0870188724455444,-0.08834523810367181,-0.09032094269240491,-0.09308454466194328,-0.09676778076647682,-0.1013986339273076,-0.10657123018242377,-0.11195855063753367,-0.11729566155192966,-0.12235008391200503,-0.1274481335327723,-0.1329916331552817,-0.13960575788937798,-0.14718367602420854,-0.15518018683238882,-0.162825661039179,-0.1691590913677905,-0.17325732685785683,-0.17557898716737586,-0.17761008260644678,-0.1805425326654119,-0.18562597471562112,-0.192928876163755,-0.1998117040255468,-0.20488097922068324,-0.20669730404289263,-0.2052520350032895,-0.20190813415578102,-0.19939100594110626,-0.19818985016690008,-0.1975997187407869,-0.19832361587141945,-0.1997644833075621,-0.20060476181958073,-0.20055915132674904,-0.19917776376886534,-0.19664967982201306,-0.19317387017217919,-0.18856320794393283,-0.18280264570878496,-0.1760531717273464,-0.16855538068392392,-0.1600629785815371,-0.14995536760790637,-0.13816597815692022,-0.1250727772909004,-0.11089895298521077,-0.09597964501985057,-0.08095239100319136,-0.06546762943202802,-0.04944728182041858,-0.033244995879198144,-0.016970883109554732,-0.0012324367851212993,0.01401957221129002,0.029437661079526754,0.04565129050823208,0.06171972238052506,0.07685850817474489,0.09240145846820172,0.10770311217742953,0.12289884729534713,0.13739909292071387,0.15053197977478985,0.16284028029268222,0.1739366858209471,0.1836417146547913,0.19324809909165983,0.20315259310557593,0.21159511160300593,0.21810906130835322,0.22342377604887834,0.22817659294127235,0.23249144378600714,0.2356411997661746,0.23735768907809462,0.2378757754600521,0.23776284897395775,0.23726226969094538,0.2363769997990606,0.23528752738347863,0.23430420563198026,0.23224208594919402,0.22927746841849753,0.22680599596178996,0.22478495596888745,0.22198202831744981,0.21760934190935993,0.2124899402723812,0.20687717116371473,0.20164633897108647,0.19699441861058087,0.19328348500638276,0.19080360632447382,0.18920280714649815,0.18726351638532412,0.18453378454389197,0.18129315073329544,0.17815360810188988,0.17563254606291254,0.1736595787558708,0.17222283310275668,0.17095354539545232,0.16915327551494186,0.16660624382324735,0.16395990907629968,0.16156251165825639,0.15935251768556954,0.15701417363747047,0.15501565490139518,0.15293763830037854,0.15019966112166752,0.14677300564535747,0.14316545791262741,0.13946817578461962,0.13591664981713608,0.1331084983653958,0.13092980671668097,0.12900994793700904,0.12704852308580417,0.1247534866763691,0.1222290777095908,0.11973102995503725,0.11710368724036786,0.11460505532334003,0.11239864532454781,0.1101202081553453,0.10753822002796298,0.10502535500211203&LeftWatchQuatY=0.7782794864778997,0.7815191821445895,0.784336287799038,0.786677182798239,0.7887681564528916,0.7909410859907259,0.7933332773922257,0.7959778182795728,0.7987604514318662,0.8015755634966456,0.8042643019674586,0.8066371411685644,0.8086981005653592,0.8105742067154601,0.8123114278398648,0.813901735606147,0.8153397231653874,0.816619390008634,0.8176516527864961,0.8183663858317349,0.8187553576595,0.8188627183925759,0.8186778918526255,0.8181034474059646,0.817064591563269,0.815403181053454,0.813031600433437,0.809907768122014,0.8059627964344016,0.8011403266115124,0.7954540999523445,0.7888811265271548,0.7813310503021927,0.772753683541021,0.7629715294589079,0.7518593710275516,0.7393999363499025,0.7256986197899148,0.7108863214588231,0.6950795064871894,0.678494331321362,0.6616395301956347,0.6448904941727136,0.627918912225425,0.6104267729924135,0.5924262098659265,0.5733167145066402,0.552746166919876,0.5311156328895402,0.5099672701710357,0.490425264688284,0.47263867365537815,0.4569153695090277,0.4427369483401088,0.42974639394436703,0.4175740123793689,0.40673954118021494,0.39723463670126147,0.38842591005934124,0.38039512417360355,0.37318127103862575,0.36628977838267046,0.359560814682812,0.3529869565234573,0.34648708049070126,0.3402535451828421,0.33450885368761263,0.3293054688488919,0.32481328547092775,0.3211703014938226,0.3184781203168767,0.31672370851330606,0.3159009215377155,0.3160532690806341,0.31725145681441913,0.3193765873414667,0.32233256827455214,0.32598851121935474,0.3302055510527945,0.33500909601548573,0.33987766190443686,0.3437882429781363,0.34639490211114754,0.34950311696465697,0.3530049139985143,0.35710536877945637,0.3613860496123606,0.3653827258353111,0.36882556585126913,0.37155396825612597,0.3747113395710048,0.377986838077669,0.3809710029964298,0.383785056256132,0.3872610793385045,0.3913764466149599,0.39680272843313485,0.40400346179528884,0.41156247321631634,0.41925682660694225,0.4267787346296993,0.43339117218044837,0.43923991244713206,0.44439445082200635,0.44903532089872616,0.4533342445970156,0.456526223998526,0.4584729909816884,0.45936470326366213,0.4592642423865155,0.45849607862120795,0.4572129641472795,0.4565401768827696,0.456893916647592,0.4585301349637411,0.461574196295645,0.46556585032858677,0.4695464924288196,0.47277338985764905,0.47543830835275513,0.4776147971534698,0.48004496772483723,0.483053023477287,0.4865730336446989,0.4900377531794651,0.4929824988498639,0.49503371901472076,0.4962450062273811,0.4973958316704722,0.49890496393727596,0.5010938395280787,0.5036240116237798,0.5061546971026158,0.5080364809917002,0.5092043087330834,0.5099282279854522,0.5105564606590418,0.5114378533158748,0.5128648287859531,0.5147194378781456,0.5169994218184816,0.5190318385617471,0.5202084291239942,0.5205155863116417,0.5203720058901787,0.5203609118314771,0.520794809283359,0.5218618327995778,0.5231822449927335,0.5244091949064256,0.5253329270607842,0.5260451056238985,0.5267476883874217,0.5276557918001533,0.5290476879448521&LeftWatchQuatZ=0.6215444689624285,0.6175904937383879,0.6140821690810453,0.6111330076305568,0.6084669867519975,0.6056817249431036,0.6025890601554506,0.5991125914222869,0.5954002796882161,0.5916296845159661,0.5880261351866565,0.584824017803584,0.5820018905521036,0.5793635036858281,0.5768459187725121,0.574459475074445,0.5722446825099263,0.5702862756298231,0.5687718935934654,0.5677987110037931,0.567353283866388,0.5673353536830944,0.5677215726577513,0.568625517092556,0.5701340909015681,0.5724442541613993,0.5756296868970664,0.5796605974779547,0.5845330155641618,0.5902101187728619,0.5965493864763197,0.6034716905717074,0.61109522518949,0.6194798124743561,0.6288178649149868,0.639210628913405,0.6504754054723106,0.6622654152209934,0.674160487427513,0.6861166213165574,0.6981566139243195,0.710189689639053,0.7222312936445545,0.7347909320530762,0.7478650317594352,0.7608176545082385,0.7736604118287682,0.7861922814228772,0.7980141380758221,0.8091423265734462,0.8195759672926062,0.8298791617001476,0.8398472023112549,0.8493277564830685,0.8578007161688032,0.8653988372457099,0.8723136778541881,0.8783656740795547,0.8839420569633542,0.8893604307552263,0.8946107585301687,0.8999392629652108,0.9052713364688821,0.9104656852811989,0.9155225222075724,0.9203265634680919,0.924744048750061,0.9286827398063948,0.932100219911597,0.9350158748063228,0.9373608486700048,0.9390553974531528,0.9400709457822215,0.9403706524492337,0.9398987111064151,0.9387485254923218,0.936967157932959,0.9345983132616187,0.9317055129960921,0.9283966841498024,0.9250152175854973,0.9220026400136222,0.9192665543663426,0.9161249493973244,0.912816589693415,0.9090939188519525,0.9052118676262219,0.9013263587759124,0.8976911873295191,0.894521840754817,0.891227783031832,0.8880333794748283,0.8851934774192008,0.8824055280333182,0.8791182251787333,0.8758185120278879,0.8722749388332514,0.8680273555427808,0.8634680958862295,0.858682578697405,0.8541231114448614,0.850195048931792,0.846784113637886,0.8437344769934163,0.8409964332735067,0.8385177977985737,0.8367159136034509,0.8356988892058589,0.8358209415740493,0.8368434838649847,0.8379946129129212,0.8391662183703409,0.8401658540842399,0.8410963303150668,0.8415972823045135,0.841597743631403,0.8410477768509833,0.8403894636258983,0.839897541168949,0.8393513414929136,0.8388040277572724,0.8381664706193197,0.8373611654827338,0.8363451720578712,0.835271141094355,0.8342889138225225,0.8336540768834177,0.8333273854914993,0.8329763724275409,0.8325305861238375,0.8318590451508807,0.8309789365092524,0.8299701424675126,0.8292702560682376,0.8290201031002101,0.8289714922735965,0.829062452530381,0.8292089018105547,0.8291866993521164,0.8289337429184623,0.8284484737628833,0.8280895334997121,0.828137977499976,0.8286578865857213,0.829432716754051,0.8301517486191883,0.8306368174771015,0.8307034211615809,0.8305590203031634,0.8304747457853342,0.8305564539756344,0.8307465147726513,0.8309812411229393,0.831125770354662,0.8308873593685142&LeftWatchAccelX=-0.174652099609375,-0.1575164794921875,-0.13531494140625,-0.06817626953125,-0.0211944580078125,-0.03485107421875,-0.176116943359375,-0.2390899658203125,-0.0877685546875,-0.125213623046875,-0.103515625,0.0235137939453125,0.0364990234375,0.011474609375,-0.047607421875,-0.0791168212890625,-0.052734375,-0.0019378662109375,-0.00299072265625,-0.0160064697265625,0.0260467529296875,0.029449462890625,0.0042266845703125,-0.00592041015625,0.0126190185546875,0.0804901123046875,0.13775634765625,0.163360595703125,0.1675872802734375,0.160125732421875,0.187591552734375,0.2499237060546875,0.328948974609375,0.4080963134765625,0.483642578125,0.5313873291015625,0.5685882568359375,0.6197967529296875,0.668975830078125,0.7020721435546875,0.702239990234375,0.7036590576171875,0.7426300048828125,0.8285064697265625,0.94598388671875,1.030059814453125,1.0548858642578125,0.985992431640625,0.9235076904296875,0.941680908203125,0.9967193603515625,1.0407562255859375,1.1368865966796875,1.229522705078125,1.224578857421875,1.093719482421875,0.91632080078125,0.8217926025390625,0.8127899169921875,0.86163330078125,0.755462646484375,0.58380126953125,0.512908935546875,0.465911865234375,0.3945465087890625,0.35638427734375,0.3317413330078125,0.264007568359375,0.178070068359375,0.139404296875,0.1268157958984375,0.122894287109375,0.126495361328125,0.094512939453125,0.016143798828125,-0.0619049072265625,-0.1178436279296875,-0.176666259765625,-0.21856689453125,-0.226776123046875,-0.2860870361328125,-0.3749847412109375,-0.4565582275390625,-0.5724334716796875,-0.751312255859375,-0.898406982421875,-0.8871612548828125,-0.7528533935546875,-0.7357330322265625,-0.7390899658203125,-0.769195556640625,-0.7340240478515625,-0.6139373779296875,-0.5269012451171875,-0.364044189453125,-0.3324737548828125,-0.3867950439453125,-0.361602783203125,-0.2997283935546875,-0.2727203369140625,-0.065277099609375,0.186920166015625,0.3143157958984375,0.3774871826171875,0.2961578369140625,0.1784515380859375,0.2176971435546875,0.3066864013671875,0.441070556640625,0.523284912109375,0.334503173828125,0.0390777587890625,-0.1961822509765625,-0.3206329345703125,-0.24652099609375,-0.0055084228515625,0.2007904052734375,0.275421142578125,0.2330780029296875,0.1939239501953125,0.11956787109375,0.0708465576171875,0.0113372802734375,-0.0916900634765625,-0.196136474609375,-0.1490631103515625,-0.0505218505859375,-0.0544891357421875,-0.1243438720703125,-0.21893310546875,-0.3148651123046875,-0.3197174072265625,-0.19390869140625,-0.0519256591796875,0.08001708984375,0.0879974365234375,-0.00360107421875,-0.0643768310546875,-0.0413665771484375,-0.020050048828125,-0.031494140625,-0.0010528564453125,0.1125640869140625,0.1273040771484375,0.0942840576171875,0.06243896484375,0.021087646484375,-0.0904388427734375,-0.2042388916015625,-0.183441162109375,-0.093536376953125,-0.0533294677734375,-0.0138702392578125,0.020965576171875,-0.0229644775390625&LeftWatchAccelY=-0.2732086181640625,-0.2906341552734375,-0.22686767578125,-0.174224853515625,-0.1667633056640625,-0.1157379150390625,-0.0887298583984375,-0.16357421875,-0.345672607421875,-0.2905731201171875,-0.265838623046875,-0.2234954833984375,-0.0832977294921875,0.015777587890625,0.0056304931640625,-0.1573028564453125,-0.2399444580078125,-0.2387542724609375,-0.2728729248046875,-0.2158203125,-0.2143096923828125,-0.1926116943359375,-0.169219970703125,-0.27325439453125,-0.403045654296875,-0.4392242431640625,-0.4469757080078125,-0.4962158203125,-0.5525360107421875,-0.649444580078125,-0.73931884765625,-0.7946319580078125,-0.79669189453125,-0.78253173828125,-0.7899322509765625,-0.8088836669921875,-0.7620849609375,-0.6463165283203125,-0.5571746826171875,-0.53900146484375,-0.5686492919921875,-0.5536041259765625,-0.480255126953125,-0.3541107177734375,-0.1406097412109375,0.2106170654296875,0.441009521484375,0.6773223876953125,0.8822784423828125,0.8827972412109375,0.833282470703125,0.9595947265625,1.1107635498046875,1.2631378173828125,1.5121612548828125,1.9295654296875,2.1212615966796875,2.1977081298828125,2.3994293212890625,2.434967041015625,2.6479644775390625,2.6004638671875,2.38763427734375,2.3865509033203125,2.45538330078125,2.37994384765625,2.1117706298828125,1.981292724609375,1.9676055908203125,1.85333251953125,1.73284912109375,1.59027099609375,1.48431396484375,1.42626953125,1.4007110595703125,1.4176177978515625,1.3947906494140625,1.34375,1.259857177734375,1.1723480224609375,1.0656585693359375,0.9597015380859375,0.79339599609375,0.61474609375,0.6055145263671875,0.6065826416015625,0.367950439453125,-0.094024658203125,-0.330078125,-0.2701873779296875,-0.177978515625,-0.15283203125,-0.430206298828125,-0.720550537109375,-0.750640869140625,-0.6958465576171875,-0.93408203125,-1.026947021484375,-0.9045867919921875,-0.7686004638671875,-0.2983856201171875,-0.0168914794921875,-0.0236358642578125,-0.09814453125,-0.3977813720703125,-0.6468658447265625,-0.79693603515625,-1.0224456787109375,-1.1956939697265625,-1.3757781982421875,-1.5671844482421875,-1.587188720703125,-1.699066162109375,-1.84735107421875,-1.6617279052734375,-1.1350555419921875,-0.7798004150390625,-0.7320556640625,-0.527374267578125,-0.4130706787109375,-0.2595977783203125,-0.256439208984375,-0.2260589599609375,-0.3692474365234375,-0.390838623046875,-0.3422393798828125,-0.3887939453125,-0.3362274169921875,-0.25506591796875,-0.3325958251953125,-0.48614501953125,-0.6001129150390625,-0.5935516357421875,-0.4243621826171875,-0.370208740234375,-0.3127288818359375,-0.3021240234375,-0.3675994873046875,-0.4185638427734375,-0.5703277587890625,-0.60357666015625,-0.534027099609375,-0.5507659912109375,-0.3906097412109375,-0.2454071044921875,-0.3032379150390625,-0.470916748046875,-0.56219482421875,-0.6446075439453125,-0.632720947265625,-0.4235992431640625,-0.3149261474609375,-0.184722900390625,-0.0814056396484375,-0.22955322265625&LeftWatchAccelZ=-0.8447265625,-0.866485595703125,-0.9544525146484375,-1.126220703125,-1.2279815673828125,-1.1949920654296875,-1.0503387451171875,-0.9363861083984375,-0.92449951171875,-0.918853759765625,-1.0006103515625,-1.118499755859375,-1.16766357421875,-1.107635498046875,-1.06207275390625,-1.0510406494140625,-1.01177978515625,-0.9577484130859375,-0.8793182373046875,-0.8978271484375,-0.908233642578125,-0.8797454833984375,-0.8530731201171875,-0.88958740234375,-0.9619140625,-1.008636474609375,-1.03216552734375,-0.9982452392578125,-0.931396484375,-0.8767242431640625,-0.848846435546875,-0.78570556640625,-0.7941741943359375,-0.8456878662109375,-0.8670196533203125,-0.88555908203125,-0.8738861083984375,-0.8635101318359375,-0.84552001953125,-0.86767578125,-0.9314727783203125,-1.068145751953125,-1.2064208984375,-1.216278076171875,-1.271881103515625,-1.3805999755859375,-1.420166015625,-1.4348297119140625,-1.4108734130859375,-1.3829193115234375,-1.3460845947265625,-1.2589569091796875,-1.2322845458984375,-1.1246490478515625,-0.96502685546875,-0.9281158447265625,-1.0077667236328125,-1.2529754638671875,-1.2166595458984375,-1.1050872802734375,-1.139892578125,-1.3073883056640625,-1.29803466796875,-1.373046875,-1.5099029541015625,-1.424652099609375,-1.3336181640625,-1.2404022216796875,-1.1680908203125,-1.1369171142578125,-1.0972747802734375,-0.9931182861328125,-0.8551025390625,-0.726043701171875,-0.5482940673828125,-0.325225830078125,-0.154327392578125,0.028228759765625,0.129791259765625,0.2622222900390625,0.390045166015625,0.5384674072265625,0.7354736328125,0.9063720703125,1.1056365966796875,1.0736083984375,0.8956756591796875,0.8055267333984375,0.7330474853515625,0.8647308349609375,0.9640655517578125,0.8699951171875,0.6665191650390625,0.548553466796875,0.4242095947265625,0.3914642333984375,0.3239898681640625,0.2222442626953125,0.37579345703125,0.4302978515625,0.01312255859375,-0.30596923828125,-0.6657867431640625,-0.9306182861328125,-1.0980224609375,-1.184051513671875,-1.4415740966796875,-1.5772552490234375,-1.636016845703125,-1.64508056640625,-1.512969970703125,-1.2119598388671875,-0.9454345703125,-0.6968536376953125,-0.6451568603515625,-0.691802978515625,-0.6929168701171875,-0.817108154296875,-0.9516143798828125,-1.082183837890625,-1.13494873046875,-1.0972747802734375,-1.0849456787109375,-1.0127105712890625,-1.021728515625,-1.0924530029296875,-1.24578857421875,-1.3265838623046875,-1.3269805908203125,-1.16748046875,-0.991455078125,-0.8763275146484375,-0.8924407958984375,-1.033782958984375,-1.0482330322265625,-1.0677032470703125,-1.059173583984375,-0.96484375,-0.801849365234375,-0.6687469482421875,-0.6222991943359375,-0.73114013671875,-0.8854217529296875,-1.0089569091796875,-1.0952606201171875,-1.0303955078125,-0.84814453125,-0.6535186767578125,-0.68865966796875,-0.76153564453125,-0.9225921630859375,-1.04876708984375,-1.1050262451171875,-1.03802490234375,-0.847412109375&RightWatchRoll=0.9344290139076008,0.9366621385833882,0.9393209294052011,0.9418931040983187,0.9441690157481882,0.9462360034315578,0.948308495500372,0.9505763826032554,0.9534190426682178,0.9562596549747225,0.9588633209546521,0.9616894349225789,0.9642040218958422,0.9658933280221419,0.967162513330118,0.9684904350811027,0.9697218054473316,0.9707714519467651,0.9718149489377151,0.9727594969431473,0.973392999971468,0.9735255412577205,0.9733217181643461,0.9726253784938921,0.9719463002868215,0.970990017154275,0.9697017166713375,0.9689112647167099,0.9682034894522673,0.9675826259663074,0.9674746344043211,0.9674967218630172,0.9676232980598702,0.967877708463357,0.9679222632269535,0.967739928234209,0.9673283259294608,0.9665115588541184,0.9652491702787063,0.9638482832001981,0.9626435536518396,0.9615103030632798,0.9600947027331895,0.9580795936747484,0.9551966019358563,0.9516511638350637,0.9480256783320493,0.9441741817386264,0.9396074777488498,0.9339894207274578,0.9270916410390712,0.9186227192900231,0.9082661677857767,0.8959120845616754,0.8815200802290464,0.8648962555191434,0.8461271125657139,0.8244240636970054,0.7998313889497508,0.7726186136117048,0.7406354057580476,0.7049566939008225,0.6688597011489359,0.6328257461930352,0.5935574335552125,0.5537100472119177,0.5151331945787773,0.47730750956499945,0.4414111658209083,0.40776546861898477,0.37644733771010663,0.3472745489779543,0.32005342426197203,0.29448506442585465,0.2699850650891614,0.24642866137384392,0.22440924204825793,0.2040995489205161,0.18513396375223123,0.16678325965859697,0.1488593079801904,0.13129861204831594,0.11452813290473088,0.09887757007776722,0.08432154269887614,0.07117723166117419,0.0591672726486838,0.04759599820074623,0.03674140085224763,0.027556668638306043,0.019815663870376823,0.013844408692670753,0.010712471095868488,0.009819112982277145,0.010840805492718961,0.01322788775206097,0.01688820651188525,0.02265001107289863,0.03126462483303843,0.04282917453512281,0.056487880549478536,0.07234794488243897,0.09146268837221887,0.11249638017587539,0.13438399571276846,0.1571385983885175,0.18159206522615307,0.2071570223841159,0.23291277175716887,0.25830916611178745,0.2852431349135347,0.31541003451241756,0.34685839775063365,0.37648327409875065,0.40453472365825033,0.4323097346058262,0.4580765640244766,0.4772427417769215,0.4892890177791061,0.49809568229677886,0.505586489724863,0.5127643257715285,0.5191698043705256,0.5241330889652068,0.5274328288156426,0.5292625131084439,0.5307481926929848,0.5326630211110543,0.5357206486244331,0.5400689320111882,0.5464751468112883,0.5550212691630453,0.5644474137460469,0.5733975522357443,0.5809417082764077,0.5866850633592147,0.5923402857952218,0.5991413955674475,0.6068881515793686,0.6151179415124762,0.6233241112610385,0.6312437565720206,0.6383724522749807,0.64499273992824,0.6517024850053116,0.6586382577461398,0.6655312920081753,0.6720927909872121,0.6786005158330144,0.685507292455869,0.6920901252703268,0.697549884032217,0.7023322849738189,0.7069055398633278,0.7113016248492348&RightWatchPitch=0.5043624839588989,0.49981304636471174,0.4955538686668832,0.4913998931550508,0.48666834947123855,0.48117924512321364,0.4752618612472913,0.4698535083549563,0.4653389043508738,0.46086299440415446,0.4558204753409818,0.450955384447459,0.4464655287504682,0.44168511677895306,0.4364623320066908,0.43098310463862183,0.4258282621461659,0.42072014694526183,0.41549467060013534,0.41069834141066913,0.4060126247344778,0.4003291464794988,0.39318428579807385,0.3858559389137592,0.37954151160555305,0.3736331454660705,0.3677292879354435,0.36181179615270487,0.35592192173948073,0.34992793361443075,0.34327621994213264,0.3359321805782001,0.32833400806075114,0.3204255356228413,0.3120362660700394,0.3032061194231262,0.29397904644743744,0.2840949960464171,0.2738126914930635,0.2641938744272868,0.25638825935908754,0.2501282212379299,0.2446099071603195,0.2396681692569443,0.23486952924808555,0.23030096051013743,0.22623953130657778,0.2230432839872812,0.22109492808252745,0.22047481519220846,0.2213776102448001,0.2245430146391161,0.23082657206916157,0.24128896974933567,0.2562701142292903,0.2748720689250551,0.29487984976542014,0.3149273754867677,0.3339948139967352,0.3506573366946941,0.3620036092381584,0.3685189845968658,0.3733838824370121,0.3766878927141979,0.3740045005315235,0.36329369260849814,0.3484852016517208,0.33160620251374123,0.3131380709141982,0.29751638383543855,0.28710220226242467,0.28215042478242947,0.2813301921476329,0.28290735601790445,0.28502751006011073,0.2872989576756406,0.2904170189625107,0.2946590734513036,0.299837685973815,0.30555200804691257,0.3116692326133214,0.3188171519854521,0.327159262751549,0.33579702512013576,0.34494494687025784,0.35269240822826037,0.3579843708375885,0.36449862312616677,0.37491883285623717,0.38877529235699526,0.3997181787316645,0.4033265182659843,0.4029731424711555,0.4063905723244879,0.4192967424289024,0.4418277551184825,0.46905354382732056,0.4954032614907768,0.5179515520717938,0.5341404402178365,0.5463345917006793,0.5578327839616262,0.5712945857035155,0.5854306023870123,0.5988002233523158,0.6109075541007262,0.6203807334712211,0.6240012870692231,0.6239666327364318,0.6234896846570488,0.6298917946731863,0.6434832809338696,0.6602426086407231,0.6777224570018694,0.6987720931467376,0.7208079720008106,0.7366484360526052,0.7446842639073085,0.7491865502633852,0.7536484534323385,0.7578561063470949,0.7597771215199046,0.7601839239796113,0.7619361952209697,0.7630823313669456,0.762858385920455,0.7611514304446655,0.7586471167979253,0.756083755963692,0.7530566381122015,0.7504068639864249,0.7494120197551252,0.7496661180226236,0.7502834855768201,0.7487588025514486,0.7450296336599446,0.7421925124970182,0.7408060612093043,0.7401563073607084,0.7398330407943454,0.7399080848757119,0.7401025170392239,0.7397693931203307,0.7385638447331877,0.7359392233884633,0.7326716460568026,0.7295897995968843,0.7273090187640785,0.7258303000804751,0.7248669289055363,0.7230671403784729,0.7197978581414395,0.7158501942604929,0.7120244185191248,0.7081209901882914&RightWatchYaw=1.5289080014152254,1.5198890240882208,1.5102772250199614,1.5004875273836575,1.491073805601973,1.4818871529429027,1.4724829110745072,1.4626056674077437,1.4521297596505653,1.4419511461713657,1.432020876935578,1.4217102676882047,1.4114937188452312,1.4018173688521256,1.3924656359826506,1.3830487841403996,1.3737636021077357,1.3650262942157168,1.3563462604871996,1.3474814353330704,1.3389126521740315,1.3312427342416482,1.3243229175504831,1.3176257379907674,1.310062602072377,1.3025056331974147,1.2950866917557566,1.2865571515040954,1.2778779973394472,1.2697424853389692,1.262054498188216,1.2555632577407458,1.2503428795458,1.246467986893266,1.2443085559482985,1.243558987170738,1.2440998012948603,1.2462715896964827,1.250042045215115,1.254405167935309,1.2583825463998874,1.2623096359967645,1.2673291766416817,1.2744560492517827,1.2840367514882245,1.2957621383029578,1.309505950865543,1.3253914701138032,1.3445468978784891,1.3673499757468546,1.3937402472070821,1.4237461639611075,1.456610490747803,1.4906618581796314,1.5255628532284027,1.5623358587836744,1.601610402343697,1.6435253069329387,1.6882247638098313,1.7364898593826024,1.791209130882383,1.850237184261273,1.9092509222616485,1.9680417863459179,2.029508373716307,2.0917182432365014,2.1510621885621815,2.2063045962334034,2.256923453426841,2.3026561016440144,2.3422784704208803,2.3759838361885635,2.4055604346735766,2.432258225195944,2.456777606850273,2.4795236771215157,2.5006856491653373,2.520500075982321,2.539428419723476,2.557668703683431,2.5753228530209573,2.593049669322994,2.610591548331786,2.627477434160917,2.6436675886586367,2.658586815548312,2.6718134556171815,2.6839779284407825,2.695186482763695,2.705196841291874,2.7140156999557252,2.720591309890168,2.722727158252203,2.7209044034595067,2.718753790896706,2.718205167212288,2.7171266091054105,2.7129664196508925,2.705088106573868,2.694298811390997,2.6816731333988817,2.6674581231479007,2.650975576221115,2.6330724556325324,2.6138877119625845,2.5934436402115844,2.5726892739871032,2.5513776640946393,2.529884414964245,2.508052456072647,2.4840262146030003,2.455347243806452,2.423569870753586,2.391748898693547,2.3598209398976815,2.32797305773077,2.29865909671082,2.2745779882084625,2.256341813839455,2.2421174062484055,2.230342902616971,2.2196709186682653,2.2114156139081786,2.2067475071383407,2.2053491433663766,2.2059360903828917,2.207280620748874,2.2080011126372736,2.207323200006554,2.2048302152631014,2.1997423776066034,2.192390146494146,2.184306564326805,2.177650150039864,2.173095024848513,2.169782577280226,2.1655080669194464,2.1591546208616865,2.1510548829743157,2.1423496978914125,2.1341796255534717,2.1270809849566885,2.121342499534955,2.116091959881857,2.110613325849145,2.104593852583024,2.0982721308806855,2.0919139384682697,2.085732577332512,2.0800263530943566,2.0754900785250503,2.0722144580734656,2.069259518137258,2.065861243530729,2.0618366265390335&RightWatchRotX=0.32241371273994446,0.40729930996894836,0.45237335562705994,0.4392673969268799,0.3560376763343811,0.33044442534446716,0.34511756896972656,0.4696331322193146,0.5158932209014893,0.45033180713653564,0.4478919804096222,0.509366512298584,0.4825124740600586,0.41521093249320984,0.390005499124527,0.4040278196334839,0.39456456899642944,0.34821757674217224,0.3798642158508301,0.4200659692287445,0.3426521420478821,0.1799124926328659,0.08434166759252548,0.1509406715631485,0.2759830355644226,0.21598441898822784,0.27750638127326965,0.3570121228694916,0.3092261254787445,0.26897192001342773,0.15683627128601074,0.02354453131556511,-0.07476526498794556,-0.22421573102474213,-0.3849920630455017,-0.5023133754730225,-0.6392338871955872,-0.8247451782226562,-0.9286952018737793,-0.8397062420845032,-0.697623610496521,-0.6664934158325195,-0.7759221792221069,-0.9399023652076721,-1.1347215175628662,-1.2625505924224854,-1.3891582489013672,-1.5336943864822388,-1.7257176637649536,-1.93483304977417,-2.100085973739624,-2.1957154273986816,-2.0828282833099365,-1.8210339546203613,-1.5813002586364746,-1.5362800359725952,-1.5695706605911255,-1.6932930946350098,-1.8618170022964478,-2.312299966812134,-3.025080680847168,-3.243788719177246,-3.005309581756592,-3.19579815864563,-3.889915943145752,-4.1413469314575195,-4.035547733306885,-3.9500460624694824,-3.5778379440307617,-2.8618509769439697,-1.9765878915786743,-1.2764719724655151,-0.7707321047782898,-0.5142608880996704,-0.4020002782344818,-0.26669302582740784,-0.07361304014921188,0.09413600713014603,0.2101728618144989,0.30247777700424194,0.38651496171951294,0.563285768032074,0.6671195030212402,0.7198365330696106,0.8022136688232422,0.5030818581581116,0.4433213174343109,0.7680584192276001,1.2349106073379517,1.36562180519104,0.6949461102485657,0.0008603247115388513,0.01682860590517521,0.7575676441192627,1.8306885957717896,2.6304566860198975,2.7448995113372803,2.531644344329834,1.9792311191558838,1.397391438484192,1.153297781944275,1.3213200569152832,1.5713310241699219,1.5687743425369263,1.4682717323303223,1.416146159172058,0.9886153340339661,0.4242313504219055,0.3701476454734802,0.60194331407547,1.516473412513733,2.4246039390563965,2.3680009841918945,2.7152891159057617,3.053659677505493,2.806654691696167,1.9333701133728027,1.15897798538208,0.9233770966529846,0.8523839116096497,0.67823326587677,0.4040240943431854,0.3027835190296173,0.31807538866996765,0.007641665171831846,-0.09597686678171158,-0.2879858911037445,-0.20325662195682526,-0.2048565149307251,-0.12114670127630234,0.07888321578502655,0.29806190729141235,0.3643850088119507,0.2370065450668335,-0.12772615253925323,-0.17144380509853363,0.052772291004657745,0.23112791776657104,0.33817583322525024,0.34679752588272095,0.36109304428100586,0.27966535091400146,0.1837940812110901,0.07622608542442322,0.01790645346045494,0.004223131574690342,0.09271248430013657,0.13919103145599365,0.2070777416229248,0.16467514634132385,-0.024715274572372437,-0.1390722095966339,-0.15612272918224335,-0.10690937936306,-0.0906853973865509&RightWatchRotY=-0.23958329856395721,-0.193105548620224,-0.19967728853225708,-0.21246366202831268,-0.2188953310251236,-0.22222402691841125,-0.23044031858444214,-0.21118059754371643,-0.17011615633964539,-0.17666380107402802,-0.1780778169631958,-0.1706065833568573,-0.22101019322872162,-0.26994603872299194,-0.2658523619174957,-0.2650845944881439,-0.25990352034568787,-0.2484479546546936,-0.253475159406662,-0.2686714231967926,-0.2903684675693512,-0.28388819098472595,-0.3024391829967499,-0.3446582555770874,-0.3570760190486908,-0.39183321595191956,-0.3954382538795471,-0.37944650650024414,-0.3708023130893707,-0.3122878670692444,-0.2385873645544052,-0.19224169850349426,-0.12265267968177795,-0.07818561792373657,-0.04955703765153885,-0.03200467675924301,-0.020414598286151886,-0.020418327301740646,-0.023799963295459747,-0.024337656795978546,-0.013198098167777061,-0.01859925501048565,-0.021780623123049736,-0.038142286241054535,-0.08472035080194473,-0.07314199209213257,-0.03433356434106827,-0.026515856385231018,-0.04680994153022766,-0.08349259197711945,-0.14369872212409973,-0.22772784531116486,-0.36355677247047424,-0.5159865021705627,-0.6367267966270447,-0.7288956046104431,-0.8247935771942139,-0.9968554377555847,-1.0579239130020142,-1.1765373945236206,-1.3968634605407715,-1.508662223815918,-1.4201343059539795,-1.5323326587677002,-1.7733256816864014,-1.717618703842163,-1.8841276168823242,-1.9859803915023804,-1.9911096096038818,-1.99677312374115,-1.9928815364837646,-1.9505889415740967,-1.8562341928482056,-1.7829663753509521,-1.752416968345642,-1.668292760848999,-1.5294582843780518,-1.395848274230957,-1.305673360824585,-1.2849382162094116,-1.229256272315979,-1.1802120208740234,-1.0620936155319214,-0.9695180654525757,-0.8607403635978699,-0.76051926612854,-0.7261993288993835,-0.7250928282737732,-0.6194344758987427,-0.4857539236545563,-0.36975330114364624,-0.2604803442955017,-0.2000461369752884,-0.09490800648927689,0.1316559761762619,0.2864316999912262,0.34727126359939575,0.4163190424442291,0.5539536476135254,0.668437659740448,0.7670223116874695,0.9383721947669983,1.1049913167953491,1.1372485160827637,1.0894629955291748,1.1746418476104736,1.301648497581482,1.3354054689407349,1.2984832525253296,1.268881916999817,1.2868578433990479,1.3282043933868408,1.1225333213806152,0.8715945482254028,0.6896154284477234,0.7331395149230957,0.4816247522830963,0.08921705186367035,-0.10329674184322357,-0.0778568908572197,-0.04198962077498436,0.015823878347873688,0.1251615434885025,0.22908635437488556,0.21349301934242249,0.24332654476165771,0.2353852242231369,0.24984991550445557,0.26487237215042114,0.26687824726104736,0.3290693163871765,0.37246793508529663,0.41702553629875183,0.46754756569862366,0.40198275446891785,0.30393582582473755,0.2573985457420349,0.2405298352241516,0.22405391931533813,0.2505691349506378,0.28893235325813293,0.33481916785240173,0.31514981389045715,0.30818992853164673,0.29744991660118103,0.28487688302993774,0.24614399671554565,0.22658653557300568,0.26587915420532227,0.35409530997276306,0.3499242663383484,0.3098761737346649,0.25899824500083923,0.21072258055210114,0.13912685215473175&RightWatchRotZ=-0.8238890171051025,-0.8473077416419983,-0.8414010405540466,-0.8560657501220703,-0.8940342664718628,-0.95476233959198,-0.9721381068229675,-0.9334825873374939,-0.8922576904296875,-0.9039412140846252,-0.9439594745635986,-0.9124801158905029,-0.8864457011222839,-0.8994712233543396,-0.9282134175300598,-0.9353507161140442,-0.8754935264587402,-0.8792145252227783,-0.8749575018882751,-0.8369073271751404,-0.8329349756240845,-0.913299560546875,-0.9760932922363281,-0.932763397693634,-0.9057475328445435,-0.8662632703781128,-0.9067911505699158,-0.9647162556648254,-0.9280809164047241,-0.9420470595359802,-0.9700629711151123,-0.9313201308250427,-0.886120080947876,-0.8345364928245544,-0.7870535850524902,-0.750454306602478,-0.7144210934638977,-0.6769573092460632,-0.6007862091064453,-0.49589064717292786,-0.35049837827682495,-0.24425745010375977,-0.09458799660205841,0.07797898352146149,0.20996834337711334,0.3701169788837433,0.5319992899894714,0.7821952700614929,1.1080756187438965,1.4320744276046753,1.8078205585479736,2.2387304306030273,2.6712541580200195,3.0868728160858154,3.502446413040161,3.855808734893799,4.08910608291626,4.256232261657715,4.345005512237549,4.465242385864258,4.5652265548706055,4.579458236694336,4.563943862915039,4.5670013427734375,4.464559555053711,4.149293422698975,3.949375867843628,3.6083240509033203,3.408656358718872,3.245539665222168,2.977111339569092,2.747520685195923,2.5831191539764404,2.409113645553589,2.2454075813293457,2.103347063064575,1.9989848136901855,1.9057955741882324,1.8550825119018555,1.7804040908813477,1.7553157806396484,1.7845103740692139,1.7239978313446045,1.6448348760604858,1.5617914199829102,1.3536478281021118,1.2129411697387695,1.136301875114441,1.0364981889724731,0.9136582612991333,0.7519875764846802,0.41866931319236755,-0.026397226378321648,-0.24788223206996918,-0.09575457125902176,0.018282519653439522,-0.16065792739391327,-0.4774699807167053,-0.7720043063163757,-0.9656147956848145,-1.0791778564453125,-1.213173747062683,-1.3380017280578613,-1.363063931465149,-1.4736628532409668,-1.5008950233459473,-1.553655982017517,-1.7045294046401978,-1.7154477834701538,-1.7073062658309937,-1.7587194442749023,-1.8391157388687134,-1.8491990566253662,-1.568995714187622,-1.399307370185852,-1.263562798500061,-1.309376835823059,-1.1171112060546875,-0.8397623896598816,-0.5860568881034851,-0.5508851408958435,-0.608526885509491,-0.35850048065185547,-0.07965341955423355,0.013445739634335041,0.02611333131790161,-0.0339299775660038,-0.12768816947937012,-0.2282865196466446,-0.40591004490852356,-0.49288418889045715,-0.5238083004951477,-0.43593835830688477,-0.3388323187828064,-0.3941705524921417,-0.4170391261577606,-0.4346798062324524,-0.50210040807724,-0.5516951084136963,-0.5276235938072205,-0.449287086725235,-0.37954795360565186,-0.34965768456459045,-0.43415552377700806,-0.52540522813797,-0.5753568410873413,-0.5420476794242859,-0.48799002170562744,-0.41622552275657654,-0.37547731399536133,-0.38580772280693054,-0.41519996523857117,-0.4276963472366333,-0.4683138132095337,-0.5002989768981934&RightWatchGravX=0.7041157484054565,0.7070395946502686,0.7100608944892883,0.7129855751991272,0.7159644961357117,0.7191060781478882,0.7223911881446838,0.7255682945251465,0.7286977767944336,0.7317981719970703,0.734966516494751,0.7381690144538879,0.7410617470741272,0.7436187267303467,0.7460984587669373,0.7486783862113953,0.7510777115821838,0.7533494830131531,0.7556392550468445,0.757717490196228,0.7595828175544739,0.761495053768158,0.7636721134185791,0.7656098008155823,0.7672029137611389,0.7684953808784485,0.7695814967155457,0.7709041833877563,0.7722334265708923,0.7736095786094666,0.7754127383232117,0.7774390578269958,0.7795470952987671,0.7817598581314087,0.7839329242706299,0.7860365509986877,0.7880486249923706,0.7899230718612671,0.7915616631507874,0.7928930521011353,0.793877899646759,0.7945373058319092,0.794858455657959,0.7947051525115967,0.7940121293067932,0.7928735613822937,0.7915664911270142,0.789948046207428,0.7876745462417603,0.7845367789268494,0.7803575396537781,0.7748146653175354,0.767527163028717,0.7581607103347778,0.7465042471885681,0.7324590086936951,0.7164018750190735,0.6980502605438232,0.6776042580604553,0.6555367112159729,0.6310254335403442,0.6044953465461731,0.5773664712905884,0.5499597191810608,0.5206491947174072,0.4915253221988678,0.46303805708885193,0.4343620538711548,0.40644097328186035,0.37913718819618225,0.3525717258453369,0.3268790543079376,0.3022487163543701,0.27870920300483704,0.2559560537338257,0.23394356667995453,0.21321189403533936,0.19394998252391815,0.17586545646190643,0.15832164883613586,0.14116501808166504,0.12432412803173065,0.10821651667356491,0.09320301562547684,0.07926049828529358,0.06673961132764816,0.055384036153554916,0.044452279806137085,0.03418155387043953,0.02549699693918228,0.018252413719892502,0.012733133509755135,0.009854204021394253,0.009019237011671066,0.009901531971991062,0.011957286857068539,0.015063505619764328,0.019925257191061974,0.02715938165783882,0.03685208410024643,0.04823954030871391,0.0613267756998539,0.07683134078979492,0.0935651957988739,0.11066905409097672,0.12818752229213715,0.14694298803806305,0.1669178158044815,0.18731997907161713,0.207382932305336,0.22738942503929138,0.24816836416721344,0.268503338098526,0.28640222549438477,0.30134621262550354,0.31476011872291565,0.32756590843200684,0.33774757385253906,0.34415316581726074,0.3483765125274658,0.35176756978034973,0.35567113757133484,0.3595714569091797,0.36208516359329224,0.3637515902519226,0.36497172713279724,0.3664948642253876,0.36856594681739807,0.37137484550476074,0.37515783309936523,0.38009917736053467,0.38578295707702637,0.39153802394866943,0.39682862162590027,0.4020232558250427,0.4069361686706543,0.4114636778831482,0.41614070534706116,0.421098917722702,0.42620187997817993,0.43110790848731995,0.4357658922672272,0.44013816118240356,0.4445436894893646,0.4495685398578644,0.45498496294021606,0.4602971076965332,0.4650799334049225,0.46949052810668945,0.4739052951335907,0.4784703850746155,0.4830019772052765,0.4874298572540283,0.4916858673095703,0.49587282538414&RightWatchGravY=-0.48324939608573914,-0.47926145792007446,-0.47551897168159485,-0.4718605875968933,-0.4676836431026459,-0.46282485127449036,-0.4575712978839874,-0.4527556598186493,-0.44872570037841797,-0.4447212219238281,-0.4401991665363312,-0.4358256161212921,-0.43178021907806396,-0.42746347188949585,-0.42273610830307007,-0.41776421666145325,-0.41307520866394043,-0.4084179103374481,-0.40364256501197815,-0.39924970269203186,-0.3949492573738098,-0.38972148299217224,-0.38313165307044983,-0.3763522803783417,-0.37049463391304016,-0.36500030755996704,-0.35949745774269104,-0.3539693057537079,-0.34845465421676636,-0.3428301215171814,-0.3365739583969116,-0.3296493887901306,-0.32246649265289307,-0.314970463514328,-0.3069972097873688,-0.298581600189209,-0.28976285457611084,-0.28028884530067444,-0.27040404081344604,-0.2611311972141266,-0.2535885274410248,-0.24752819538116455,-0.24217785894870758,-0.23738029599189758,-0.23271609842777252,-0.2282705456018448,-0.22431448101997375,-0.22119854390621185,-0.21929803490638733,-0.21869297325611115,-0.21957382559776306,-0.2226608693599701,-0.22878225147724152,-0.23895445466041565,-0.25347423553466797,-0.2714238166809082,-0.2906248867511749,-0.3097474277019501,-0.32781970500946045,-0.34351521730422974,-0.3541486859321594,-0.36023423075675964,-0.36476823687553406,-0.3678426146507263,-0.3653460144996643,-0.3553548753261566,-0.3414744436740875,-0.32556214928627014,-0.3080456256866455,-0.29314661026000977,-0.28317421674728394,-0.27842170000076294,-0.27763378620147705,-0.2791486084461212,-0.2811838388442993,-0.2833629250526428,-0.2863517999649048,-0.29041364789009094,-0.2953651249408722,-0.30081966519355774,-0.3066478669643402,-0.31344354152679443,-0.3213542699813843,-0.3295217752456665,-0.33814486861228943,-0.34542572498321533,-0.3503870964050293,-0.3564808964729309,-0.36619699001312256,-0.379055380821228,-0.3891587555408478,-0.39248010516166687,-0.3921550512313843,-0.39529645442962646,-0.40711820125579834,-0.4275924265384674,-0.45204225182533264,-0.47538647055625916,-0.4951014220714569,-0.509101390838623,-0.519558846950531,-0.5293487906455994,-0.5407215356826782,-0.5525583028793335,-0.5636518597602844,-0.5736110806465149,-0.5813449621200562,-0.5842870473861694,-0.5842589139938354,-0.5838717818260193,-0.5890573263168335,-0.5999857187271118,-0.6133084893226624,-0.6270204186439514,-0.6432780623435974,-0.6599919199943542,-0.6718090772628784,-0.677739679813385,-0.6810433268547058,-0.6843037605285645,-0.6873658895492554,-0.6887598633766174,-0.6890547275543213,-0.6903235912322998,-0.6911523342132568,-0.6909905076026917,-0.6897555589675903,-0.6879401803016663,-0.6860775351524353,-0.6838721036911011,-0.6819363832473755,-0.6812084317207336,-0.6813943982124329,-0.6818461418151855,-0.6807300448417664,-0.6779935956001282,-0.6759054064750671,-0.6748829483985901,-0.6744033098220825,-0.6741645932197571,-0.6742200255393982,-0.6743636131286621,-0.6741176247596741,-0.6732266545295715,-0.6712836027145386,-0.6688581109046936,-0.6665639281272888,-0.6648619771003723,-0.6637566685676575,-0.6630358099937439,-0.661687433719635,-0.6592326760292053,-0.6562591791152954,-0.6533676981925964,-0.6504076719284058&RightWatchGravZ=-0.5202800035476685,-0.5200034976005554,-0.5193220973014832,-0.51865154504776,-0.5183309316635132,-0.5183432698249817,-0.5184395909309387,-0.518230676651001,-0.517344057559967,-0.5164249539375305,-0.5157995223999023,-0.514939546585083,-0.5141920447349548,-0.5141074061393738,-0.5144234895706177,-0.5147368311882019,-0.5150255560874939,-0.5154216289520264,-0.5158314108848572,-0.5162016153335571,-0.5167681574821472,-0.5179214477539062,-0.5196298360824585,-0.5217286348342896,-0.5235775709152222,-0.5255374908447266,-0.5277366042137146,-0.5295400619506836,-0.5312579870223999,-0.5329126119613647,-0.5342782735824585,-0.5356490612030029,-0.5369560122489929,-0.5381869673728943,-0.5396314859390259,-0.541290819644928,-0.5431547164916992,-0.5453988909721375,-0.5480071902275085,-0.5505735874176025,-0.5526762008666992,-0.5544731020927429,-0.5563721060752869,-0.5586541891098022,-0.5615943074226379,-0.5650169849395752,-0.5684239268302917,-0.5718859434127808,-0.57574063539505,-0.5802374482154846,-0.5855164527893066,-0.5916793346405029,-0.598799467086792,-0.6067067980766296,-0.61520916223526,-0.6243661642074585,-0.6342756748199463,-0.6455869674682617,-0.6583212018013,-0.6725094318389893,-0.6902070045471191,-0.7105045914649963,-0.7304738759994507,-0.7498241066932678,-0.7716519832611084,-0.7950634360313416,-0.8179187178611755,-0.8398445844650269,-0.8601823449134827,-0.8776788115501404,-0.8919112086296082,-0.9031231999397278,-0.9119019508361816,-0.9189109206199646,-0.9248903393745422,-0.9300407767295837,-0.9341002702713013,-0.9370396733283997,-0.9390584826469421,-0.9404476881027222,-0.9412967562675476,-0.941433310508728,-0.9407553672790527,-0.9395363926887512,-0.9377503991127014,-0.936069905757904,-0.9349660277366638,-0.933244526386261,-0.929909348487854,-0.9250226616859436,-0.9209898710250854,-0.9196723699569702,-0.9198463559150696,-0.918509304523468,-0.913321852684021,-0.9038925766944885,-0.8918693661689758,-0.8795514106750488,-0.8684106469154358,-0.8599172830581665,-0.8530718088150024,-0.8461849093437195,-0.8376856446266174,-0.8282058238983154,-0.8185651898384094,-0.8090354204177856,-0.8002786040306091,-0.7941958904266357,-0.7896535992622375,-0.7849115133285522,-0.7754389643669128,-0.7605456113815308,-0.7428046464920044,-0.7244440913200378,-0.703835129737854,-0.6821560263633728,-0.6643591523170471,-0.6531428694725037,-0.6463270783424377,-0.6405953168869019,-0.6354429721832275,-0.6317498683929443,-0.62921541929245,-0.626376748085022,-0.6244944334030151,-0.6239613890647888,-0.6244348883628845,-0.6252180337905884,-0.6256024837493896,-0.6257601976394653,-0.6248899698257446,-0.6221951246261597,-0.6183847784996033,-0.6145022511482239,-0.6123594045639038,-0.6121501922607422,-0.6114323735237122,-0.609393298625946,-0.6065112352371216,-0.6032032370567322,-0.5996444225311279,-0.5961055159568787,-0.5931644439697266,-0.590886652469635,-0.5892934203147888,-0.5878926515579224,-0.5863611102104187,-0.5845163464546204,-0.5822420716285706,-0.5794802904129028,-0.5772659778594971,-0.5762999653816223,-0.5759654641151428,-0.5756351947784424,-0.5753957033157349&RightWatchDMUAccelX=-0.0012653470039367676,-0.03249424695968628,-0.01807469129562378,0.002926349639892578,-0.00026619434356689453,-0.036580443382263184,-0.04592329263687134,0.011858522891998291,0.10940653085708618,0.15083128213882446,0.1078222393989563,0.029805898666381836,0.004391193389892578,0.04719865322113037,0.06327354907989502,0.05356776714324951,0.07584190368652344,0.13088208436965942,0.1252964735031128,0.06851547956466675,0.08285504579544067,0.06913244724273682,-0.015747249126434326,-0.0488128662109375,0.06496572494506836,0.170698344707489,0.14925700426101685,0.06153911352157593,-0.03866708278656006,-0.04547536373138428,-0.0659552812576294,-0.14229190349578857,-0.10176688432693481,-0.031179964542388916,-0.04415619373321533,-0.08379650115966797,-0.13338547945022583,-0.17249125242233276,-0.18163734674453735,-0.16053825616836548,-0.11213028430938721,-0.0649077296257019,-0.050000667572021484,-0.0671355128288269,-0.04865074157714844,-0.027065396308898926,-0.05226278305053711,-0.10772746801376343,-0.14010679721832275,-0.12436521053314209,-0.11345690488815308,-0.08525466918945312,-0.017084598541259766,0.07586944103240967,0.18283230066299438,0.2134181261062622,0.143049418926239,0.07018405199050903,0.09091997146606445,0.1792258620262146,0.18159663677215576,0.15887141227722168,0.20759141445159912,0.20881414413452148,-0.008960902690887451,-0.2875458002090454,-0.28550201654434204,-0.1223045289516449,-0.12114736437797546,-0.25500690937042236,-0.23274439573287964,-0.19812539219856262,-0.15620681643486023,-0.02407050132751465,0.1372934877872467,0.24565546214580536,0.30847084522247314,0.38870692253112793,0.5107190012931824,0.611652135848999,0.686410665512085,0.7255294322967529,0.730574369430542,0.7368598580360413,0.7248319387435913,0.7279838919639587,0.7345024347305298,0.7594875693321228,0.8570995926856995,0.8747410774230957,0.7562074065208435,0.5588001012802124,0.37031853199005127,0.35044732689857483,0.5463118553161621,0.7277430295944214,0.6668822765350342,0.45682036876678467,0.3290265202522278,0.33537083864212036,0.3635188937187195,0.3940260112285614,0.42699864506721497,0.4553545117378235,0.4468718469142914,0.38144078850746155,0.36689674854278564,0.4535961151123047,0.47163087129592896,0.4461662769317627,0.4007691740989685,0.31892457604408264,0.1655024290084839,0.06537392735481262,0.06417810916900635,0.07432377338409424,-0.016378164291381836,-0.06870454549789429,0.055077821016311646,0.33729249238967896,0.39930057525634766,0.16790375113487244,-0.08657640218734741,0.006902933120727539,0.32058990001678467,0.41385215520858765,0.3583434224128723,0.3224588930606842,0.28304412961006165,0.21941620111465454,0.11059299111366272,0.03656509518623352,0.09700265526771545,0.208106130361557,0.27522289752960205,0.2578282952308655,0.2215319573879242,0.20354929566383362,0.11832985281944275,0.053030967712402344,0.07662832736968994,0.13279184699058533,0.1737229824066162,0.18439316749572754,0.1532299816608429,0.06721663475036621,0.03274497389793396,0.06113472580909729,0.10701709985733032,0.1299918293952942,0.1365809440612793,0.1263273060321808,0.09026795625686646,0.023466169834136963,-0.02787044644355774&RightWatchDMUAccelY=-0.009060204029083252,-0.05449095368385315,-0.05075672268867493,-0.015932410955429077,-0.005628764629364014,-0.019154518842697144,-0.023050040006637573,-0.01076054573059082,0.04760262370109558,0.01881784200668335,-0.09250044822692871,-0.17403772473335266,-0.14414751529693604,-0.06663146615028381,-0.04366406798362732,-0.07189038395881653,-0.09809422492980957,-0.12138250470161438,-0.17837342619895935,-0.1875271201133728,-0.08806771039962769,-0.015002667903900146,-0.06733831763267517,-0.1380062699317932,-0.08330175280570984,-0.015233457088470459,-0.05400049686431885,-0.16020610928535461,-0.2687939405441284,-0.23032057285308838,-0.21606889367103577,-0.3057876229286194,-0.2916235625743866,-0.254151850938797,-0.2914067506790161,-0.3282647430896759,-0.34820717573165894,-0.36970511078834534,-0.40098264813423157,-0.4379044771194458,-0.4473240077495575,-0.4227294325828552,-0.4389287233352661,-0.4997870922088623,-0.5233111381530762,-0.5350961685180664,-0.5740559101104736,-0.6679463982582092,-0.7983564138412476,-0.8744619488716125,-0.8869324922561646,-0.889201283454895,-0.9434589743614197,-1.0070325136184692,-0.997593879699707,-0.9730982780456543,-1.0177552700042725,-1.0864317417144775,-1.094772458076477,-1.016698956489563,-0.9578172564506531,-0.8881330490112305,-0.850731611251831,-0.8439188599586487,-0.8026226758956909,-0.798270583152771,-0.7545338273048401,-0.5965264439582825,-0.416945219039917,-0.29813143610954285,-0.14930561184883118,-0.07326284050941467,-0.10067731142044067,-0.1405443549156189,-0.2379963994026184,-0.3432849943637848,-0.39003974199295044,-0.39574354887008667,-0.39149391651153564,-0.3820110857486725,-0.3228229284286499,-0.16012820601463318,0.017200857400894165,0.12738865613937378,0.20022070407867432,0.16232028603553772,0.08239701390266418,0.1784566342830658,0.34910717606544495,0.6012996435165405,0.8128343224525452,0.8387844562530518,0.733311116695404,0.49147263169288635,0.4118484556674957,0.8055221438407898,1.2544562816619873,1.3643940687179565,1.1658778190612793,0.8071513175964355,0.626370370388031,0.6784119009971619,0.8906818628311157,0.987571120262146,0.8258283734321594,0.7256039381027222,0.8191685080528259,0.8869146108627319,0.6615904569625854,0.4102572798728943,0.429618239402771,0.4605661630630493,0.14690834283828735,-0.13359969854354858,-0.22947895526885986,-0.21885329484939575,-0.05200678110122681,-0.16941308975219727,-0.6432822942733765,-0.7915568947792053,-0.6050382852554321,-0.5707768797874451,-0.728166401386261,-0.661605179309845,-0.41004395484924316,-0.22697830200195312,-0.13916289806365967,-0.10594409704208374,0.0384182333946228,0.0632207989692688,0.022497236728668213,0.07938647270202637,0.20622044801712036,0.20410871505737305,0.06284064054489136,-0.0949862003326416,-0.10214030742645264,-0.06912040710449219,-0.08362281322479248,-0.1299583911895752,-0.1553240418434143,-0.1337265968322754,-0.1334233283996582,-0.06934237480163574,-0.0295678973197937,-0.016505718231201172,-0.005295872688293457,0.002554178237915039,0.01449519395828247,0.05924546718597412,0.08604961633682251,0.05779218673706055,0.0033965706825256348,-0.02931058406829834,-0.005048930644989014&RightWatchDMUAccelZ=0.11670029163360596,0.08921736478805542,0.09206080436706543,0.11421734094619751,0.13275659084320068,0.1478598713874817,0.14119654893875122,0.14356642961502075,0.14213043451309204,0.06473428010940552,0.025885581970214844,-0.012190580368041992,-0.04220438003540039,0.02433079481124878,0.08887112140655518,0.016339004039764404,-0.05350160598754883,-0.05104559659957886,-0.0032572150230407715,0.04736006259918213,0.009260773658752441,-0.04134368896484375,-0.051018357276916504,-0.03236377239227295,0.003725886344909668,0.04746443033218384,0.15406423807144165,0.2319784164428711,0.1347430944442749,0.07014405727386475,0.006934523582458496,-0.0750533938407898,0.0028679370880126953,0.08341401815414429,0.08417189121246338,0.11494505405426025,0.05076885223388672,-0.06962192058563232,-0.08703309297561646,-0.03644728660583496,-0.020749151706695557,-0.044907331466674805,-0.039178431034088135,-0.046509385108947754,-0.07588744163513184,-0.1240851879119873,-0.20403701066970825,-0.27854740619659424,-0.35116976499557495,-0.4190606474876404,-0.4353422522544861,-0.44715428352355957,-0.4454662799835205,-0.33192235231399536,-0.2404579520225525,-0.2031484842300415,-0.1591050624847412,-0.04839801788330078,0.013377964496612549,-0.07715481519699097,-0.23299551010131836,-0.24786943197250366,-0.41749054193496704,-0.7203297019004822,-0.6795961856842041,-0.17928653955459595,0.19658082723617554,0.15319907665252686,0.042067110538482666,-0.04170900583267212,-0.11141520738601685,-0.157606840133667,-0.16217947006225586,-0.0480538010597229,0.06734639406204224,0.14874500036239624,0.20750725269317627,0.23568469285964966,0.29295557737350464,0.36500823497772217,0.41454803943634033,0.438198447227478,0.46433019638061523,0.5016549229621887,0.6186586022377014,0.704533040523529,0.7072286009788513,0.726121723651886,0.599159836769104,0.5926862359046936,0.8324278593063354,1.0712836980819702,1.1317298412322998,0.8830631375312805,0.5294411778450012,0.451820433139801,0.7345054745674133,0.9822888374328613,1.0445122718811035,0.8785635232925415,0.7632128000259399,0.6919795870780945,0.6360254287719727,0.5910232067108154,0.4616011381149292,0.39907753467559814,0.28314292430877686,0.23062777519226074,0.3079946041107178,0.34118592739105225,0.22021740674972534,-0.13273441791534424,-0.5702294111251831,-0.7319768071174622,-0.690451979637146,-0.7423434853553772,-0.5034569501876831,-0.16463667154312134,-0.16464704275131226,-0.5232993364334106,-0.7804505825042725,-0.7094824314117432,-0.7411306500434875,-0.6548579931259155,-0.40071308612823486,-0.1401224136352539,0.034118056297302246,0.06374037265777588,0.01880621910095215,-0.13620269298553467,-0.16841447353363037,-0.18565094470977783,-0.05988359451293945,0.06806975603103638,0.1456388235092163,0.1717510223388672,0.10522210597991943,-0.09350287914276123,-0.17330443859100342,-0.09879255294799805,-0.0905410647392273,-0.07819557189941406,-0.03453636169433594,-0.012674808502197266,-0.06131088733673096,-0.08097636699676514,-0.06673038005828857,-0.04159748554229736,-0.03703582286834717,-0.019122004508972168,-0.0032546520233154297,-0.0042969584465026855,-0.022438466548919678,-0.03566241264343262,-0.04261577129364014&RightWatchQuatW=-0.1410913443243748,-0.1413318517993866,-0.1414745612971345,-0.14150752019149404,-0.1417331895359779,-0.14221237282841426,-0.1427970192186079,-0.14315564761835212,-0.14324209889983916,-0.14338073489688435,-0.14370232088056448,-0.14394031462919402,-0.14396233335900493,-0.14395272168322856,-0.144049005922679,-0.14424506230574685,-0.14432671599786936,-0.1444667205582874,-0.14466468268834465,-0.1446342725378554,-0.14454069495717156,-0.14487815205430837,-0.1458364792744449,-0.14677486241417453,-0.14715057743603385,-0.14730370306639448,-0.14739858894125307,-0.1473994248214466,-0.14739001083302122,-0.14758011340753413,-0.14827776427121198,-0.1495555265352416,-0.15125616215827892,-0.1534218283225897,-0.15610136461823412,-0.1592020889952555,-0.1626758633535314,-0.16664200631203235,-0.17097765429082118,-0.17514302672427237,-0.17858880194612806,-0.1814577995354168,-0.18419934626600465,-0.187000613418295,-0.19001117760148126,-0.193177985512939,-0.19652761531426366,-0.19990363977373962,-0.2032470727909323,-0.20648711036550732,-0.2094463755625372,-0.2117488576334814,-0.21281638914620168,-0.21190001421276225,-0.20880589121168605,-0.2039765352895354,-0.19829752159459302,-0.19194016770530797,-0.18521488234821515,-0.17873687742242295,-0.17299788863325902,-0.1675890741280631,-0.16189008115287737,-0.1560093678163028,-0.1502138983755873,-0.14555106568603174,-0.14105197047236806,-0.13582905475043225,-0.1303012795525188,-0.12376553210848695,-0.1159143074425891,-0.10693871295896681,-0.0974116425767841,-0.08777556074432051,-0.07823087614375537,-0.06885679610849407,-0.05985779550036539,-0.05132426381194447,-0.04318355034050025,-0.035190210638174874,-0.027295980812409065,-0.019449567887111986,-0.01182932813132989,-0.004689109954779241,0.002006298178220598,0.007917809916433214,0.013110167850389352,0.018305242016891196,0.023645266071145095,0.028612867629642293,0.03262965550762005,0.03521924837887775,0.036473441519218726,0.03743204990752506,0.03848842809729092,0.0397308282002161,0.04091956308417662,0.04141192449908796,0.040690976987665536,0.03837825695538596,0.03499205551697467,0.030820040006397695,0.025810129150214637,0.020368152340690653,0.01481476360444443,0.009080816484333265,0.002432617082656211,-0.00534832449624759,-0.013654030156397845,-0.021741487922222413,-0.02890313197896872,-0.035242880341803076,-0.04065173052582038,-0.04465136238060635,-0.04674842915646157,-0.04802631527690741,-0.04982737299884428,-0.05131562937909019,-0.051641547818099647,-0.05136574595861212,-0.05106020047085866,-0.05137178485796154,-0.0522200857399146,-0.0528878395587691,-0.05369838397062995,-0.054651170395274874,-0.055985638977875576,-0.05756243048422032,-0.059336444911431314,-0.061381545463630456,-0.06364797848680798,-0.06591830287333027,-0.06807875892027276,-0.07024110281606956,-0.07280194729055951,-0.07543731468833463,-0.07760158475387284,-0.079421359166806,-0.08105984497796682,-0.08267118578643337,-0.08427212354258513,-0.08594483721195786,-0.08771890196828949,-0.08961607178643952,-0.09187525470037461,-0.09427902500266645,-0.09654716302119766,-0.09845176969070353,-0.1001515298748521,-0.101974564510997,-0.10415088946298284,-0.10655268912129379,-0.10893736204268019,-0.11110514077889436,-0.11308378258647198&RightWatchQuatX=0.4689917310809346,0.46906669667429024,0.469386714320238,0.46973380272823545,0.4698364060552755,0.4696850187833598,0.46945630930557286,0.4694583258602435,0.4699038960153353,0.4703503824841659,0.47058463088830954,0.47096859166227895,0.4713584736328451,0.4714062986590005,0.47120922994626246,0.47098294892004416,0.4708046392710601,0.4705513223792755,0.4702726995096793,0.4700852288357348,0.4698126452062105,0.46909442965641895,0.46788544912250324,0.4664684504330126,0.4653578414056049,0.464255175302284,0.46303924352137316,0.46206426135044043,0.461136854542226,0.46017801973281003,0.45921082153447623,0.458048691874663,0.4567751727286768,0.45537705189827243,0.4536701653233259,0.45167385775671554,0.4493987148964496,0.4466889295838785,0.443579821216151,0.44049757422018915,0.4379131535654228,0.43570230840784063,0.43345651035229243,0.4309334924358903,0.4279002239324333,0.42446882272464664,0.420909643702294,0.4172476030028208,0.41330415237248613,0.40895519369340155,0.4041955003125313,0.3991525447670058,0.39409321721856994,0.38954460016198533,0.38574024060473533,0.38237480080393005,0.37886706575748685,0.37465382389932433,0.36950621012761015,0.3630404930117653,0.35350846403715763,0.34155761267924495,0.32947632748529093,0.31740984499659947,0.30267109674585774,0.28510203462174827,0.26673016177719294,0.24825020373791395,0.2300660633382442,0.21410904064654696,0.20151494260348346,0.1923603951178636,0.18590315926070777,0.181218081447729,0.17729848536070025,0.1738917461162751,0.17136772665995678,0.169841047254333,0.16913293677642086,0.16893139996358633,0.16913475149821042,0.17001488245760102,0.17170437595480462,0.1738097268636189,0.17641078185487005,0.178612269720035,0.17984743093090852,0.18177634867790732,0.18570466405244918,0.19149404942014112,0.19606217255840963,0.19729020454235452,0.19684134106570622,0.19835367793027642,0.2045916152122991,0.2155810296497434,0.2288906304410649,0.24188704879211367,0.25325664095371825,0.26185582509395394,0.26877432722310235,0.27560418202550935,0.2837094070172485,0.2923734159081948,0.3008287351397344,0.30886864511867934,0.3159980792692718,0.3207389121790415,0.3240166372408532,0.3272178924022936,0.33383398244698437,0.34421670074536503,0.3562935791626373,0.3684890799647436,0.38196468107951,0.39574672691766594,0.4066173262343141,0.4132738290211562,0.41733632135591076,0.42078959955023865,0.4238765989943706,0.4260117319150757,0.42739366466464124,0.4289691273747956,0.42996427271114085,0.4301540905338576,0.4297070791913245,0.4290425968289664,0.42857663321209627,0.42819647119011656,0.4283736238676634,0.42960123777876436,0.431477560400272,0.4333763487338318,0.4341891166186743,0.4338595572029857,0.4338914547563288,0.43473625407913097,0.43608907136459,0.4376800702955096,0.4394041510358187,0.44109037703594317,0.4424061266803661,0.44331213058287644,0.4437479474600709,0.4440328132324814,0.4444075887604348,0.44502703403594485,0.4459244585293529,0.44705820702149757,0.44779416445586673,0.4477684096959212,0.44738118133346816,0.4470325061455361,0.4466701342891915&RightWatchQuatY=0.5462397652413046,0.5498244360870119,0.5534253155721872,0.5570634105107171,0.5607581997098271,0.5645803473746431,0.5685502201136005,0.5724929427213863,0.5762728375628222,0.5799246643628584,0.5836555162295576,0.5873938712783147,0.5910682838347342,0.5948064269432622,0.5986157944342501,0.6024655588269757,0.606203301364536,0.6097812781889488,0.6133477130909915,0.6168822101896576,0.6203551228577029,0.6238630222017384,0.6275088125659377,0.6312185742769115,0.6349520436106798,0.6386428241385178,0.6423471308033868,0.6462450381762366,0.6501370523573708,0.653845953224337,0.6574129238387246,0.6607159223890615,0.6636577650704437,0.6662266419763059,0.6684303582794627,0.6703536471226926,0.6720231680693468,0.6734299317661425,0.6745411038931073,0.6753768124797159,0.6759343288483338,0.6762012171588587,0.6760791753535205,0.6753769976902734,0.6741228524960553,0.6723325589820148,0.6698563690340436,0.666610993997441,0.6622775887501805,0.6567596591477608,0.6500331691862866,0.6419490263943944,0.6325730177098948,0.6221896278849771,0.6107988303227683,0.5982149475208516,0.5845684196572178,0.5701659048546227,0.5550883106854451,0.5392141379963781,0.5223031440069571,0.504666581069162,0.48669207260646435,0.4683734684492277,0.44977579912898197,0.4314144213355059,0.41377442625231214,0.39717472314995883,0.38170821585937753,0.3670276379547247,0.35364001370145093,0.3417177627415284,0.33081591076438543,0.3206932299911483,0.3113230305925925,0.30259626860931366,0.29434500980236117,0.2864566411653801,0.2787872893879669,0.27135107124731944,0.2641361566628909,0.2568116884360842,0.24947136702581635,0.24236767660476988,0.2355168811381058,0.22924311956352014,0.2237955735785164,0.21879626258924154,0.214101330913036,0.2097751943099621,0.20600804032982276,0.2033543725166782,0.20264778150231416,0.20352947748146424,0.2041472420141232,0.20358845730929298,0.20295137591147705,0.20345884871054193,0.2053695945359536,0.20836513798085407,0.2119810222220062,0.21595064864361535,0.2202754055425146,0.224749025531958,0.22951935958215752,0.23460873149098163,0.2395731717589936,0.24495178323500233,0.25062133257817765,0.2564766119496761,0.2622214365743315,0.2684372188993069,0.2750203845415056,0.28139036867647654,0.2871082195670069,0.2921820298708992,0.2971017969535769,0.3021520655584476,0.30666042647014435,0.3100778929478812,0.31273298136666366,0.3153760075818922,0.3174243855322036,0.31800382448170444,0.3176688247591522,0.31707024884820767,0.3165071108059762,0.3162664855214683,0.3163834739513947,0.3170804468747922,0.3183614875654738,0.31981782088539584,0.3211386325217465,0.32187610393870114,0.32245238329815545,0.3233394036342758,0.3244718517294028,0.3259322479271571,0.3277593121062315,0.32965512399138563,0.33123715322761954,0.3323988927522468,0.3332721355334621,0.33423419149264627,0.33556987822564394,0.337215449216096,0.3389542459327445,0.34060620901945027,0.3420188111722141,0.34302903078062286,0.34381169798953376,0.3446542200513022,0.3456695037872282,0.3468879791152646,0.3484209219542478&RightWatchQuatZ=0.6795309678627092,0.6765315880555424,0.67333624243863,0.6700794346919271,0.6668701544392394,0.6636420531107609,0.6602806735424234,0.6567855283313437,0.6531322281994467,0.6495384097900767,0.6459459483772854,0.6422136599165968,0.6385409319536822,0.6350270261234551,0.6315624544444135,0.6280159130760524,0.6245243074283199,0.6211905914522043,0.6178352128097875,0.6144569943624046,0.6111823415497761,0.6080755736041507,0.6050188249881987,0.6020196223188675,0.5988528811760891,0.5957383504373228,0.5926706900390635,0.5891838514775597,0.5856201506555724,0.5821871169942893,0.5787466025025422,0.5755685285546897,0.5727447164505877,0.570294311517389,0.5683457154237423,0.5668083270867201,0.5656522031409609,0.5649706486300945,0.5647990931588414,0.5649364545363337,0.5652001232368312,0.5656754080435324,0.5666595554973856,0.568500856695945,0.5712755282788841,0.5748717230703638,0.5792276741045036,0.584442505504382,0.5909812293790737,0.5989871083651924,0.6084530927276905,0.6194684522163186,0.6318632753012366,0.6451616010804087,0.659188467349171,0.674034264637629,0.6895054662773434,0.7054817865995756,0.7218294491504182,0.7385816876922439,0.7565071747081982,0.7749607023867104,0.7926965253571712,0.8096533695401622,0.826757469823803,0.8434533473944954,0.8589239544785519,0.873026231681991,0.8856581274017341,0.8967331533002394,0.9060323301105027,0.9136688472025876,0.9200608423434641,0.9255330937766074,0.9303350724104664,0.9345887722909916,0.9383023839154676,0.9415214743291922,0.9443553521768342,0.9468857281754534,0.9491473072357771,0.9511911182429175,0.9529647171400516,0.9544769658952128,0.9557234253533035,0.9568086504451206,0.9578093530945306,0.9585148646591469,0.958705149327517,0.9583870842608658,0.9581522141469103,0.9583753355890453,0.9585703303746104,0.9580346838251855,0.9565484936214605,0.9542002415284503,0.9511811126867324,0.9478292191688457,0.944472834958337,0.9415639638130283,0.9389356046077328,0.9361932536643971,0.9329102644692171,0.929295987924473,0.925528770507506,0.9216704743603287,0.9180109748581936,0.9149298742445101,0.9121490264385118,0.9092170327226852,0.9049638367580801,0.8990074244608863,0.8920573358159302,0.8848964616775253,0.8772038313600861,0.869314514088262,0.8625022390741339,0.8574822308341635,0.853887073967509,0.8509698379788169,0.8484807971142972,0.8464118244259465,0.8448962457183151,0.8438377044157472,0.8434060744022949,0.8434733335452899,0.8438251628723881,0.8441473375963533,0.8442173694919834,0.8440025837440446,0.8432621564637369,0.8419111212557095,0.840275288849458,0.8388367558794725,0.8379763101100195,0.8375720830890014,0.8369195141203527,0.8357422469419019,0.8341639555930704,0.8324237468896419,0.8307251390627303,0.8291946381425624,0.8279565823813335,0.8268803413318827,0.8258570488179626,0.8247620002888855,0.8235841019121679,0.8223416609281284,0.8210629552870788,0.8197996297791968,0.8187958966970288,0.8181465453513953,0.817615753518516,0.8169984750216481,0.8162725771683581&RightWatchAccelX=0.6978302001953125,0.6742401123046875,0.6954193115234375,0.71746826171875,0.713134765625,0.6787567138671875,0.6801605224609375,0.7494049072265625,0.8494110107421875,0.88189697265625,0.83319091796875,0.7609100341796875,0.7496185302734375,0.796966552734375,0.8084869384765625,0.80279541015625,0.8330230712890625,0.8890380859375,0.8739013671875,0.824676513671875,0.84552001953125,0.8227081298828125,0.7374725341796875,0.7236480712890625,0.85198974609375,0.9424591064453125,0.91082763671875,0.817596435546875,0.72723388671875,0.730438232421875,0.6993255615234375,0.632476806640625,0.68939208984375,0.7540130615234375,0.735137939453125,0.6976470947265625,0.6475677490234375,0.615142822265625,0.6109466552734375,0.63787841796875,0.687744140625,0.7346343994140625,0.7435302734375,0.7271728515625,0.74957275390625,0.765716552734375,0.73297119140625,0.6755523681640625,0.64739990234375,0.6625213623046875,0.6676788330078125,0.6948089599609375,0.759307861328125,0.84716796875,0.9377288818359375,0.9396514892578125,0.84527587890625,0.7623443603515625,0.7758636474609375,0.839263916015625,0.803070068359375,0.7635650634765625,0.78857421875,0.7412872314453125,0.4669342041015625,0.181915283203125,0.19256591796875,0.321563720703125,0.26605224609375,0.11358642578125,0.125518798828125,0.1268310546875,0.154296875,0.2728424072265625,0.4078521728515625,0.4854278564453125,0.5272369384765625,0.5944976806640625,0.6989288330078125,0.7784271240234375,0.8332061767578125,0.85003662109375,0.8381195068359375,0.8285675048828125,0.8009796142578125,0.795074462890625,0.7877044677734375,0.812286376953125,0.8993988037109375,0.8912811279296875,0.751953125,0.544921875,0.36517333984375,0.3744964599609375,0.58587646484375,0.747100830078125,0.6597442626953125,0.4539642333984375,0.3525238037109375,0.377899169921875,0.416473388671875,0.461700439453125,0.5096435546875,0.5534515380859375,0.5537109375,0.5037384033203125,0.5250244140625,0.6316070556640625,0.65789794921875,0.65301513671875,0.6211395263671875,0.5560302734375,0.4165191650390625,0.350067138671875,0.370758056640625,0.3842010498046875,0.3013458251953125,0.2723846435546875,0.4326629638671875,0.7126007080078125,0.7354888916015625,0.4849853515625,0.261627197265625,0.4062347412109375,0.7126617431640625,0.773773193359375,0.7193145751953125,0.6868743896484375,0.64935302734375,0.5838470458984375,0.477569580078125,0.42333984375,0.503265380859375,0.6177520751953125,0.6811370849609375,0.6589508056640625,0.6317596435546875,0.613525390625,0.527557373046875,0.4788360595703125,0.514434814453125,0.576385498046875,0.6165618896484375,0.6292724609375,0.5946502685546875,0.513763427734375,0.4942626953125,0.532012939453125,0.5817108154296875,0.6058502197265625,0.6152191162109375,0.60772705078125,0.5712890625,0.5071868896484375,0.465484619140625&RightWatchAccelY=-0.4994964599609375,-0.53558349609375,-0.5215911865234375,-0.482421875,-0.474273681640625,-0.481536865234375,-0.4811859130859375,-0.456024169921875,-0.39654541015625,-0.4371795654296875,-0.5462493896484375,-0.612823486328125,-0.565216064453125,-0.48663330078125,-0.467620849609375,-0.4942779541015625,-0.5122528076171875,-0.5351104736328125,-0.5875701904296875,-0.579498291015625,-0.4673614501953125,-0.4033966064453125,-0.4609832763671875,-0.5142822265625,-0.4403533935546875,-0.3796844482421875,-0.422149658203125,-0.530364990234375,-0.619720458984375,-0.563262939453125,-0.56103515625,-0.6401519775390625,-0.6056671142578125,-0.5695648193359375,-0.6028289794921875,-0.6278533935546875,-0.6392669677734375,-0.652099609375,-0.67535400390625,-0.701507568359375,-0.6985321044921875,-0.6677398681640625,-0.687591552734375,-0.7419586181640625,-0.7562103271484375,-0.765625,-0.80645751953125,-0.904327392578125,-1.03173828125,-1.0968170166015625,-1.1064910888671875,-1.1158905029296875,-1.1838531494140625,-1.2503509521484375,-1.248931884765625,-1.2481231689453125,-1.31878662109375,-1.4050445556640625,-1.417144775390625,-1.3521881103515625,-1.3065643310546875,-1.238922119140625,-1.216949462890625,-1.2075958251953125,-1.16375732421875,-1.15179443359375,-1.08184814453125,-0.89373779296875,-0.7079925537109375,-0.5717315673828125,-0.4154815673828125,-0.350433349609375,-0.383148193359375,-0.42742919921875,-0.5343017578125,-0.6359405517578125,-0.6796875,-0.68670654296875,-0.6871490478515625,-0.6807403564453125,-0.6154937744140625,-0.4499969482421875,-0.288818359375,-0.191436767578125,-0.135650634765625,-0.197601318359375,-0.2669219970703125,-0.1594696044921875,0.0073089599609375,0.255584716796875,0.436004638671875,0.440185546875,0.3165130615234375,0.0654449462890625,0.0279541015625,0.4410247802734375,0.833740234375,0.8760223388671875,0.627685546875,0.257965087890625,0.1021270751953125,0.1656036376953125,0.3758697509765625,0.422393798828125,0.2395782470703125,0.15240478515625,0.2558135986328125,0.289794921875,0.0390167236328125,-0.1893768310546875,-0.1392822265625,-0.1722869873046875,-0.5062255859375,-0.7857513427734375,-0.8782501220703125,-0.866363525390625,-0.71173095703125,-0.899627685546875,-1.371795654296875,-1.461517333984375,-1.27215576171875,-1.2762908935546875,-1.4272613525390625,-1.322357177734375,-1.0738372802734375,-0.898956298828125,-0.8272705078125,-0.7791595458984375,-0.6348724365234375,-0.6253509521484375,-0.660400390625,-0.58514404296875,-0.4664459228515625,-0.4886474609375,-0.64019775390625,-0.7826690673828125,-0.7717132568359375,-0.744293212890625,-0.7619171142578125,-0.809783935546875,-0.8278350830078125,-0.80712890625,-0.803466796875,-0.7339324951171875,-0.6996917724609375,-0.6824188232421875,-0.671295166015625,-0.660430908203125,-0.64630126953125,-0.596832275390625,-0.5760955810546875,-0.6072845458984375,-0.6584320068359375,-0.681671142578125,-0.6512298583984375&RightWatchAccelZ=-0.4087982177734375,-0.431427001953125,-0.426116943359375,-0.4006500244140625,-0.3845672607421875,-0.36871337890625,-0.379241943359375,-0.37139892578125,-0.38232421875,-0.459686279296875,-0.4925994873046875,-0.532867431640625,-0.5535736083984375,-0.47705078125,-0.4281463623046875,-0.5111846923828125,-0.570465087890625,-0.5636444091796875,-0.510345458984375,-0.4691619873046875,-0.51519775390625,-0.562225341796875,-0.5699462890625,-0.549774169921875,-0.515380859375,-0.4707794189453125,-0.3560943603515625,-0.3034515380859375,-0.40997314453125,-0.466949462890625,-0.5400543212890625,-0.6107330322265625,-0.51788330078125,-0.4532318115234375,-0.4530029296875,-0.4257354736328125,-0.5093994140625,-0.624053955078125,-0.6302947998046875,-0.581512451171875,-0.576324462890625,-0.60101318359375,-0.59503173828125,-0.6078338623046875,-0.6424713134765625,-0.69818115234375,-0.783294677734375,-0.85870361328125,-0.938079833984375,-1.0048065185546875,-1.021331787109375,-1.0433197021484375,-1.0363006591796875,-0.922943115234375,-0.8502655029296875,-0.825958251953125,-0.7830810546875,-0.683013916015625,-0.6477813720703125,-0.7737884521484375,-0.935638427734375,-0.9636077880859375,-1.1920928955078125,-1.4940948486328125,-1.4093780517578125,-0.9090576171875,-0.6127471923828125,-0.7021026611328125,-0.8353424072265625,-0.92840576171875,-1.01373291015625,-1.06536865234375,-1.0673065185546875,-0.949920654296875,-0.8477630615234375,-0.772735595703125,-0.723480224609375,-0.6963348388671875,-0.6369171142578125,-0.5675811767578125,-0.52325439453125,-0.4995880126953125,-0.4737396240234375,-0.427398681640625,-0.3022003173828125,-0.2298431396484375,-0.2245330810546875,-0.214385986328125,-0.3469390869140625,-0.310699462890625,-0.0555572509765625,0.1732330322265625,0.196746826171875,-0.081268310546875,-0.414276123046875,-0.4296875,-0.11456298828125,0.1230010986328125,0.168182373046875,-0.004302978515625,-0.093994140625,-0.16650390625,-0.2005157470703125,-0.2517547607421875,-0.3649444580078125,-0.420166015625,-0.529998779296875,-0.5576934814453125,-0.4700164794921875,-0.4532623291015625,-0.5734100341796875,-0.9642791748046875,-1.3374786376953125,-1.45782470703125,-1.3932952880859375,-1.4142913818359375,-1.1191558837890625,-0.7926788330078125,-0.840240478515625,-1.215423583984375,-1.414825439453125,-1.33642578125,-1.3728790283203125,-1.252410888671875,-0.992034912109375,-0.733306884765625,-0.5822296142578125,-0.559326171875,-0.6259613037109375,-0.7720947265625,-0.7965850830078125,-0.7994232177734375,-0.6575927734375,-0.5341796875,-0.460845947265625,-0.4423370361328125,-0.5252227783203125,-0.7257232666015625,-0.7733917236328125,-0.694976806640625,-0.69061279296875,-0.6697235107421875,-0.62078857421875,-0.6058349609375,-0.6574249267578125,-0.6665496826171875,-0.6512451171875,-0.6228485107421875,-0.618743896484375,-0.595855712890625,-0.5782623291015625,-0.5842437744140625,-0.5984954833984375,-0.6136016845703125,-0.6177520751953125"


    document.getElementById("prodapi").innerHTML = "Prodding...";


    fetch("https://predictor-vu7p.onrender.com/predict", {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        body: url
    })
    .then(response => {
        return response.json();
    })
    .then(data => {
        console.log(data);
        console.log(parseInt(data.prediction));
        document.getElementById("prodapi").innerHTML = "Prod API";
    })

}

let optimaldata;


function plotOptimalFeature(feature){
    predraw(feature);
    plotgraph.innerHTML += graphString(optimaldata, feature);

    
    predrawsecond(feature);
    plotgraph2.innerHTML += graphString(sampleDict, feature);

    // CAREFUL: Not stored in pointsarr
}

function updateOptimalGraph(){
    let feature = document.getElementById('feature').value;
    pointsarr = [];
    redraw();
    plotOptimalFeature(feature);
}

async function fetchCSV(url) {
    try {
        const response = await fetch(url);
        const data = await response.text();
        console.log(data);
        optimaldata = makesampledict(data);
        console.log(optimaldata);
        updateOptimalGraph();
    } catch (error) {
        console.error('Error fetching CSV:', error);
    }
}


let sampleDict = {
    "PhoneTimes": [],
    "LeftWatchTimes": [],
    "RightWatchTimes": [],

    "PhoneAccelX": [],
    "PhoneAccelY": [],
    "PhoneAccelZ": [],
    "PhoneGyroX": [],
    "PhoneGyroY": [],
    "PhoneGyroZ": [],
    "PhoneMagX": [],
    "PhoneMagY": [],
    "PhoneMagZ": [],

    "LeftWatchRoll": [],
    "LeftWatchPitch": [],
    "LeftWatchYaw": [],

    "LeftWatchRotX": [],
    "LeftWatchRotY": [],
    "LeftWatchRotZ": [],

    "LeftWatchGravX": [],
    "LeftWatchGravY": [],
    "LeftWatchGravZ": [],
    
    "LeftWatchDMUAccelX": [],
    "LeftWatchDMUAccelY": [],
    "LeftWatchDMUAccelZ": [],
    
    "LeftWatchQuatW": [],
    "LeftWatchQuatX": [],
    "LeftWatchQuatY": [],
    "LeftWatchQuatZ": [],

    "LeftWatchAccelX": [],
    "LeftWatchAccelY": [],
    "LeftWatchAccelZ": [],
    
    "RightWatchRoll": [],
    "RightWatchPitch": [],
    "RightWatchYaw": [],

    "RightWatchRotX": [],
    "RightWatchRotY": [],
    "RightWatchRotZ": [],

    "RightWatchGravX": [],
    "RightWatchGravY": [],
    "RightWatchGravZ": [],
    
    "RightWatchDMUAccelX": [],
    "RightWatchDMUAccelY": [],
    "RightWatchDMUAccelZ": [],
    
    "RightWatchQuatW": [],
    "RightWatchQuatX": [],
    "RightWatchQuatY": [],
    "RightWatchQuatZ": [],

    "RightWatchAccelX": [],
    "RightWatchAccelY": [],
    "RightWatchAccelZ": []
};


let predictions = [];
let sendData;

fetchCSV('https://concretecanoe.skparab1.com/assets/Anthony_Optimal_Split_Forweb.csv');

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