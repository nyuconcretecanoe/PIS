

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

    makedict(watchAccelerometerCSV, "WatchAccel");
    makedict(watchGyroscopeCSV, "WatchGyro");
    makedict(watchMagnetometerCSV, "WatchMag");
    
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

    let i = 1;
    while (i < spltup.length){
        let line = spltup[i].split(',');
        enddict.time.push(parseInt(line[0]));
        enddict.seconds_elapsed.push(parseInt(line[1]));
        enddict.x.push(parseFloat(line[2]));
        enddict.y.push(parseFloat(line[3]));
        enddict.z.push(parseFloat(line[4]));
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

    return enddict;
}


let phoneAccelerometerCSV;
let phoneGyroscopeCSV;
let phoneMagnetometerCSV;
let watchAccelerometerCSV;
let watchGyroscopeCSV;
let watchMagnetometerCSV;

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
while (i < 3){
    const j = i;
    document.getElementById('file-upload'+j).addEventListener('change', function(event) {
        if (event.target.files.length != 3){
            alert("You must upload three files.");
        } else if (true) {

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
                    // document.getElementById('output').innerText = content;
                    if (j == 1){
                        phoneAccelerometerCSV = content;
                    } else if (j == 2){
                        watchAccelerometerCSV = content;
                    }
                    console.log(content);
        
                    if (phoneAccelerometerCSV != null && phoneGyroscopeCSV != null && phoneMagnetometerCSV != null && watchAccelerometerCSV != null && watchGyroscopeCSV != null && watchMagnetometerCSV != null){
                        enableanalysis();
                    }
                };

                const readergyro = new FileReader();
                readergyro.onload = function(e) {
                    const content = e.target.result;
                    console.log(e);
                    // document.getElementById('output').innerText = content;
                    if (j == 1){
                        phoneGyroscopeCSV = content;
                    } else if (j == 2){
                        watchGyroscopeCSV = content;
                    }
                    console.log(content);
        
                    if (phoneAccelerometerCSV != null && phoneGyroscopeCSV != null && phoneMagnetometerCSV != null && watchAccelerometerCSV != null && watchGyroscopeCSV != null && watchMagnetometerCSV != null){
                        enableanalysis();
                    }
                };

                const readermag = new FileReader();
                readermag.onload = function(e) {
                    const content = e.target.result;
                    console.log(e);
                    // document.getElementById('output').innerText = content;
                    if (j == 1){
                        phoneMagnetometerCSV = content;
                    } else if (j == 2){
                        watchMagnetometerCSV = content;
                    }
                    console.log(content);
        
                    if (phoneAccelerometerCSV != null && phoneGyroscopeCSV != null && phoneMagnetometerCSV != null && watchAccelerometerCSV != null && watchGyroscopeCSV != null && watchMagnetometerCSV != null){
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
        }
    });
    i += 1;
}


function splitdata(){
    // this splits sampleDict

    let newdict = {
        "PhoneAccelX": [],
        "PhoneAccelY": [],
        "PhoneAccelZ": [],
        "PhoneGyroX": [],
        "PhoneGyroY": [],
        "PhoneGyroZ": [],
        "PhoneMagX": [],
        "PhoneMagY": [],
        "PhoneMagZ": [],
    
        "WatchAccelX": [],
        "WatchAccelY": [],
        "WatchAccelZ": [],
        "WatchGyroX": [],
        "WatchGyroY": [],
        "WatchGyroZ": [],
        "WatchMagX": [],
        "WatchMagY": [],
        "WatchMagZ": [],
    
        "PhoneTimes": [],
        "WatchTimes": []
    };


    // one thing to take into account
    // is the phone aligned with the watch
    // if not, we need to align it

    let currentwatchtime = sampleDict.WatchTimes[0];
    let currentphonetime = sampleDict.PhoneTimes[0];
    let pushmetric;

    if (currentwatchtime < currentphonetime){
        // watch started early, lets push it
        pushmetric = "watch";
    } else {
        // phone started early, lets push it
        pushmetric = "phone";
    }

    // keep pushing it until the opposite is true
    let windex = 0;
    let pindex = 0;
    while (true){
        // alert("pushing", currentwatchtime-currentphonetime,pushmetric);
        // console.log("pushing", currentwatchtime,currentphonetime, currentwatchtime-currentphonetime,pushmetric);
        currentwatchtime = sampleDict.WatchTimes[windex];
        currentphonetime = sampleDict.PhoneTimes[pindex];

        if (currentwatchtime > currentphonetime && pushmetric == "watch"){
            // we can break now
            break;
        }

        if (currentwatchtime < currentphonetime && pushmetric == "phone"){
            // we can break now
            break;
        }

        if (pushmetric == "watch"){
            windex += 1;
        } else {
            pindex += 1;
        }
    }

    console.log("use indices ", windex, pindex, "with times", sampleDict.WatchTimes[windex], sampleDict.PhoneTimes[pindex]);
    // notify of the delta. raise error if its too much

    console.log("delta is", (sampleDict.WatchTimes[windex]-sampleDict.PhoneTimes[pindex])/(1000000000));

    if (windex != 0){
        // slice index
        // slice all of the watch attributes of sample dict, keep windex and beyond
        sampleDict.WatchTimes = sampleDict.WatchTimes.slice(windex);
        sampleDict.WatchAccelX = sampleDict.WatchAccelX.slice(windex);
        sampleDict.WatchAccelY = sampleDict.WatchAccelY.slice(windex);
        sampleDict.WatchAccelZ = sampleDict.WatchAccelZ.slice(windex);
        sampleDict.WatchGyroX = sampleDict.WatchGyroX.slice(windex);
        sampleDict.WatchGyroY = sampleDict.WatchGyroY.slice(windex);
        sampleDict.WatchMagZ = sampleDict.WatchMagZ.slice(windex);
        sampleDict.WatchMagY = sampleDict.WatchMagY.slice(windex);
        sampleDict.WatchMagZ = sampleDict.WatchMagZ.slice(windex);
    } else {
        // the same thing but for phone attributes
        sampleDict.PhoneTimes = sampleDict.PhoneTimes.slice(pindex);
        sampleDict.PhoneAccelX = sampleDict.PhoneAccelX.slice(pindex);
        sampleDict.PhoneAccelY = sampleDict.PhoneAccelY.slice(pindex);
        sampleDict.PhoneAccelZ = sampleDict.PhoneAccelZ.slice(pindex);
        sampleDict.PhoneGyroX = sampleDict.PhoneGyroX.slice(pindex);
        sampleDict.PhoneGyroY = sampleDict.PhoneGyroY.slice(pindex);
        sampleDict.PhoneMagZ = sampleDict.PhoneMagZ.slice(pindex);
        sampleDict.PhoneMagY = sampleDict.PhoneMagY.slice(pindex);
        sampleDict.PhoneMagZ = sampleDict.PhoneMagZ.slice(pindex);
    }

    

    // lengths of strokes
    let streaks = [];


    let strokearr = [];

    let currentstroke = {
        "PhoneAccelX": [],
        "PhoneAccelY": [],
        "PhoneAccelZ": [],
        "PhoneGyroX": [],
        "PhoneGyroY": [],
        "PhoneGyroZ": [],
        "PhoneMagX": [],
        "PhoneMagY": [],
        "PhoneMagZ": [],
    
        "WatchAccelX": [],
        "WatchAccelY": [],
        "WatchAccelZ": [],
        "WatchGyroX": [],
        "WatchGyroY": [],
        "WatchGyroZ": [],
        "WatchMagX": [],
        "WatchMagY": [],
        "WatchMagZ": [],
    
        "PhoneTimes": [],
        "WatchTimes": []
    };


    let i = 0;
    let last = 0;
    while (i < sampleDict.PhoneAccelX.length){
        let subj = sampleDict.PhoneGyroX[i];

        // i think this is way more surefire now

        if (i < sampleDict.PhoneGyroX.length-4 && subj > sampleDict.PhoneGyroX[i+1] && sampleDict.PhoneGyroX[i+1] > sampleDict.PhoneGyroX[i+2] && sampleDict.PhoneGyroX[i+3] > sampleDict.PhoneGyroX[i+4] && i-last > 100 && subj > 0.8){
            //insert spaces
            let j = 0;
            while (j < 100){

                newdict.PhoneTimes.push(null);
                newdict.WatchTimes.push(null);

                newdict.PhoneAccelX.push(null);
                newdict.PhoneAccelY.push(null);
                newdict.PhoneAccelZ.push(null);
                newdict.PhoneGyroX.push(null);
                newdict.PhoneGyroY.push(null);
                newdict.PhoneGyroZ.push(null);
                newdict.PhoneMagX.push(null);
                newdict.PhoneMagY.push(null);
                newdict.PhoneMagZ.push(null);

                newdict.WatchAccelX.push(null);
                newdict.WatchAccelY.push(null);
                newdict.WatchAccelZ.push(null);
                newdict.WatchGyroX.push(null);
                newdict.WatchGyroY.push(null);
                newdict.WatchGyroZ.push(null);
                newdict.WatchMagX.push(null);
                newdict.WatchMagY.push(null);
                newdict.WatchMagZ.push(null);
                j += 1;
            }

            strokearr.push(currentstroke);
                 
            currentstroke = {
                "PhoneAccelX": [],
                "PhoneAccelY": [],
                "PhoneAccelZ": [],
                "PhoneGyroX": [],
                "PhoneGyroY": [],
                "PhoneGyroZ": [],
                "PhoneMagX": [],
                "PhoneMagY": [],
                "PhoneMagZ": [],
            
                "WatchAccelX": [],
                "WatchAccelY": [],
                "WatchAccelZ": [],
                "WatchGyroX": [],
                "WatchGyroY": [],
                "WatchGyroZ": [],
                "WatchMagX": [],
                "WatchMagY": [],
                "WatchMagZ": [],
            
                "PhoneTimes": [],
                "WatchTimes": []
            };

            streaks.push(i-last); // will usually be around the threshold

            last = i;
        }

        newdict.PhoneTimes.push(sampleDict.PhoneTimes[i]);
        newdict.WatchTimes.push(sampleDict.WatchTimes[i]);

        newdict.PhoneAccelX.push(sampleDict.PhoneAccelX[i]);
        newdict.PhoneAccelY.push(sampleDict.PhoneAccelY[i]);
        newdict.PhoneAccelZ.push(sampleDict.PhoneAccelZ[i]);
        newdict.PhoneGyroX.push(sampleDict.PhoneGyroX[i]);
        newdict.PhoneGyroY.push(sampleDict.PhoneGyroY[i]);
        newdict.PhoneGyroZ.push(sampleDict.PhoneGyroZ[i]);
        newdict.PhoneMagX.push(sampleDict.PhoneMagX[i]);
        newdict.PhoneMagY.push(sampleDict.PhoneMagY[i]);
        newdict.PhoneMagZ.push(sampleDict.PhoneMagZ[i]);

        newdict.WatchAccelX.push(sampleDict.WatchAccelX[i]);
        newdict.WatchAccelY.push(sampleDict.WatchAccelY[i]);
        newdict.WatchAccelZ.push(sampleDict.WatchAccelZ[i]);
        newdict.WatchGyroX.push(sampleDict.WatchGyroX[i]);
        newdict.WatchGyroY.push(sampleDict.WatchGyroY[i]);
        newdict.WatchGyroZ.push(sampleDict.WatchGyroZ[i]);
        newdict.WatchMagX.push(sampleDict.WatchMagX[i]);
        newdict.WatchMagY.push(sampleDict.WatchMagY[i]);
        newdict.WatchMagZ.push(sampleDict.WatchMagZ[i]);

        currentstroke.PhoneTimes.push(sampleDict.PhoneTimes[i]);
        currentstroke.WatchTimes.push(sampleDict.WatchTimes[i]);

        currentstroke.PhoneAccelX.push(sampleDict.PhoneAccelX[i]);
        currentstroke.PhoneAccelY.push(sampleDict.PhoneAccelY[i]);
        currentstroke.PhoneAccelZ.push(sampleDict.PhoneAccelZ[i]);
        currentstroke.PhoneGyroX.push(sampleDict.PhoneGyroX[i]);
        currentstroke.PhoneGyroY.push(sampleDict.PhoneGyroY[i]);
        currentstroke.PhoneGyroZ.push(sampleDict.PhoneGyroZ[i]);
        currentstroke.PhoneMagX.push(sampleDict.PhoneMagX[i]);
        currentstroke.PhoneMagY.push(sampleDict.PhoneMagY[i]);
        currentstroke.PhoneMagZ.push(sampleDict.PhoneMagZ[i]);

        currentstroke.WatchAccelX.push(sampleDict.WatchAccelX[i]);
        currentstroke.WatchAccelY.push(sampleDict.WatchAccelY[i]);
        currentstroke.WatchAccelZ.push(sampleDict.WatchAccelZ[i]);
        currentstroke.WatchGyroX.push(sampleDict.WatchGyroX[i]);
        currentstroke.WatchGyroY.push(sampleDict.WatchGyroY[i]);
        currentstroke.WatchGyroZ.push(sampleDict.WatchGyroZ[i]);
        currentstroke.WatchMagX.push(sampleDict.WatchMagX[i]);
        currentstroke.WatchMagY.push(sampleDict.WatchMagY[i]);
        currentstroke.WatchMagZ.push(sampleDict.WatchMagZ[i]);

        i += 1;
    }

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

    sendData = newdict;


    newdict = {
        "PhoneAccelX": [],
        "PhoneAccelY": [],
        "PhoneAccelZ": [],
        "PhoneGyroX": [],
        "PhoneGyroY": [],
        "PhoneGyroZ": [],
        "PhoneMagX": [],
        "PhoneMagY": [],
        "PhoneMagZ": [],
    
        "WatchAccelX": [],
        "WatchAccelY": [],
        "WatchAccelZ": [],
        "WatchGyroX": [],
        "WatchGyroY": [],
        "WatchGyroZ": [],
        "WatchMagX": [],
        "WatchMagY": [],
        "WatchMagZ": [],
    
        "PhoneTimes": [],
        "WatchTimes": [],
    };

    i = 0;
    last = 0;
    let strokesgone = 0;

    while (i < sampleDict.PhoneAccelX.length){
        let subj = sampleDict.PhoneGyroX[i];

        if (i < sampleDict.PhoneGyroX.length-4 && subj > sampleDict.PhoneGyroX[i+1] && sampleDict.PhoneGyroX[i+1] > sampleDict.PhoneGyroX[i+2] && sampleDict.PhoneGyroX[i+3] > sampleDict.PhoneGyroX[i+4] && i-last > 100 && subj > 0.8){
            //insert spaces
            let j = 0;
            while (j < 100 && strokesgone >= takestartindex && strokesgone < takestartindex+takelen){
                newdict.PhoneTimes.push(null);
                newdict.WatchTimes.push(null);

                newdict.PhoneAccelX.push(null);
                newdict.PhoneAccelY.push(null);
                newdict.PhoneAccelZ.push(null);
                newdict.PhoneGyroX.push(null);
                newdict.PhoneGyroY.push(null);
                newdict.PhoneGyroZ.push(null);
                newdict.PhoneMagX.push(null);
                newdict.PhoneMagY.push(null);
                newdict.PhoneMagZ.push(null);

                newdict.WatchAccelX.push(null);
                newdict.WatchAccelY.push(null);
                newdict.WatchAccelZ.push(null);
                newdict.WatchGyroX.push(null);
                newdict.WatchGyroY.push(null);
                newdict.WatchGyroZ.push(null);
                newdict.WatchMagX.push(null);
                newdict.WatchMagY.push(null);
                newdict.WatchMagZ.push(null);
                j += 1;
            }

            strokesgone += 1;

            console.log(strokesgone);

            last = i;
        }

        if (strokesgone >= takestartindex && strokesgone < takestartindex+takelen){
            newdict.PhoneTimes.push(sampleDict.PhoneTimes[i]);
            newdict.WatchTimes.push(sampleDict.WatchTimes[i]);
    
            newdict.PhoneAccelX.push(sampleDict.PhoneAccelX[i]);
            newdict.PhoneAccelY.push(sampleDict.PhoneAccelY[i]);
            newdict.PhoneAccelZ.push(sampleDict.PhoneAccelZ[i]);
            newdict.PhoneGyroX.push(sampleDict.PhoneGyroX[i]);
            newdict.PhoneGyroY.push(sampleDict.PhoneGyroY[i]);
            newdict.PhoneGyroZ.push(sampleDict.PhoneGyroZ[i]);
            newdict.PhoneMagX.push(sampleDict.PhoneMagX[i]);
            newdict.PhoneMagY.push(sampleDict.PhoneMagY[i]);
            newdict.PhoneMagZ.push(sampleDict.PhoneMagZ[i]);
    
            newdict.WatchAccelX.push(sampleDict.WatchAccelX[i]);
            newdict.WatchAccelY.push(sampleDict.WatchAccelY[i]);
            newdict.WatchAccelZ.push(sampleDict.WatchAccelZ[i]);
            newdict.WatchGyroX.push(sampleDict.WatchGyroX[i]);
            newdict.WatchGyroY.push(sampleDict.WatchGyroY[i]);
            newdict.WatchGyroZ.push(sampleDict.WatchGyroZ[i]);
            newdict.WatchMagX.push(sampleDict.WatchMagX[i]);
            newdict.WatchMagY.push(sampleDict.WatchMagY[i]);
            newdict.WatchMagZ.push(sampleDict.WatchMagZ[i]);
        }


        i += 1;
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
                strokearray.push(strokearr[j]);
                j += 1;
            }
        }
        // else skip over it
        i += 1;
    }

    sendData = strokearray;

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
    "PhoneAccelX": [],
    "PhoneAccelY": [],
    "PhoneAccelZ": [],
    "PhoneGyroX": [],
    "PhoneGyroY": [],
    "PhoneGyroZ": [],
    "PhoneMagX": [],
    "PhoneMagY": [],
    "PhoneMagZ": [],

    "WatchAccelX": [],
    "WatchAccelY": [],
    "WatchAccelZ": [],
    "WatchGyroX": [],
    "WatchGyroY": [],
    "WatchGyroZ": [],
    "WatchMagX": [],
    "WatchMagY": [],
    "WatchMagZ": [],

    "PhoneTimes": [],
    "WatchTimes": [],
};


let sendData;

fetchCSV('https://concretecanoe.skparab1.com/web/assets/Anthony_Optimal_Split_Forweb.csv');

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