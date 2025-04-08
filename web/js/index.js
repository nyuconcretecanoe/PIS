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
        r.style.setProperty('--main', '#267D28');
        r.style.setProperty('--secondary', '#59905A');
        r.style.setProperty('--slight', 'rgb(220,220,220)');
    } else {
        // make dark
        theme = 'dark';
        localStorage.setItem('bttheme','dark');
        document.getElementById('theme').textContent = "Theme: (dark)";
        r.style.setProperty('--bgslight', 'rgba(30,30,30,0.6)');
        r.style.setProperty('--bg', 'black');
        r.style.setProperty('--contrast', 'white');
        r.style.setProperty('--main', '#267D28');
        r.style.setProperty('--secondary', '#59905A');
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
    r.style.setProperty('--main', '#267D28');
    r.style.setProperty('--secondary', '#59905A');
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

    try {            
        // the dict makedict returns is not important at this point
        makedict(phoneAccelerometerCSV, "PhoneAccel", sampleDict);
        makedict(phoneGyroscopeCSV, "PhoneGyro", sampleDict);
        makedict(phoneMagnetometerCSV, "PhoneMag", sampleDict);

        makedict(LeftWatchCSV, "LeftWatch", sampleDict);
        makedict(RightWatchCSV, "RightWatch", sampleDict);


        
        splitdata();

        document.getElementById("feature").value = "LeftWatchQuatW";

        updateOptimalGraph();
    } catch (error) {
        // show fake
        alert("failed. show fake");
    }
}


function showFake(){

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


function graphString(source, feature, upTo=100) {

    // upto is how much 100 = 100%

    let arr = source[feature];

    let endstr = ""

    let i = 0;
    while (i < arr.length*upTo/100){
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
    console.log('feature PLOTTT',feature);

    let label;

    [tickYbasis, tickYincrement] = setplotparams(optimaldata[feature]);

    if (feature.includes("Accel")){
        label = "m/s²";
    } else if (feature.includes("Gyro") || feature.includes("Roll") || feature.includes("Pitch") || feature.includes("Yaw") || feature.includes("Rot")){
        label = "rad/s";
    } else if (feature.includes("Mag") || feature.includes("Grav")){
        label = "μT";
    } else {
        label = "units";
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
    [tickYbasis2, tickYincrement2] = setplotparams(sampleDict[feature]);

    if (feature.includes("Accel")){
        label = "m/s²";
    } else if (feature.includes("Gyro") || feature.includes("Roll") || feature.includes("Pitch") || feature.includes("Yaw") || feature.includes("Rot")){
        label = "rad/s";
    } else if (feature.includes("Mag") || feature.includes("Grav")){
        label = "μT";
    } else {
        label = "units";
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

function makedict(datastr, type, ultimateWriteDict){
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
            ultimateWriteDict.PhoneTimes = enddict.time;
            ultimateWriteDict.PhoneAccelX = enddict.x;
            ultimateWriteDict.PhoneAccelY = enddict.y;
            ultimateWriteDict.PhoneAccelZ = enddict.z;
        } else if (type == "PhoneGyro"){
            ultimateWriteDict.PhoneGyroX = enddict.x;
            ultimateWriteDict.PhoneGyroY = enddict.y;
            ultimateWriteDict.PhoneGyroZ = enddict.z;
        } else if (type == "PhoneMag"){
            ultimateWriteDict.PhoneMagX = enddict.x;
            ultimateWriteDict.PhoneMagY = enddict.y;
            ultimateWriteDict.PhoneMagZ = enddict.z;
        } else if (type == "WatchAccel"){
            ultimateWriteDict.WatchTimess = enddict.time;
            ultimateWriteDict.WatchAccelX = enddict.x;
            ultimateWriteDict.WatchAccelY = enddict.y;
            ultimateWriteDict.WatchAccelZ = enddict.z;
        } else if (type == "WatchGyro"){
            ultimateWriteDict.WatchGyroX = enddict.x;
            ultimateWriteDict.WatchGyroY = enddict.y;
            ultimateWriteDict.WatchGyroZ = enddict.z;
        } else if (type == "WatchMag"){
            ultimateWriteDict.WatchMagX = enddict.x;
            ultimateWriteDict.WatchMagY = enddict.y;
            ultimateWriteDict.WatchMagZ = enddict.z;
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

            // enddict[type+"QuatW"].push(parseFloat(line[23]));
            // enddict[type+"QuatX"].push(parseFloat(line[24]));
            // enddict[type+"QuatY"].push(parseFloat(line[25]));
            // enddict[type+"QuatZ"].push(parseFloat(line[26]));

            // might have finally fixed this bug
            enddict[type+"QuatW"].push(parseFloat(line[25]));
            enddict[type+"QuatX"].push(parseFloat(line[23]));
            enddict[type+"QuatY"].push(parseFloat(line[24]));
            enddict[type+"QuatZ"].push(parseFloat(line[26]));

            enddict[type+"AccelX"].push(parseFloat(line[27]));
            enddict[type+"AccelY"].push(parseFloat(line[28]));
            enddict[type+"AccelZ"].push(parseFloat(line[29]));
            i += 1;
        }

        let attributes = ["Times","Roll", "Pitch", "Yaw", "RotX", "RotY", "RotZ", "GravX", "GravY", "GravZ", "DMUAccelX", "DMUAccelY", "DMUAccelZ", "QuatW", "QuatX", "QuatY", "QuatZ", "AccelX", "AccelY", "AccelZ"];

        for (attr of attributes){
            ultimateWriteDict[type+attr] = enddict[type+attr];
        }
    }

    return enddict;
}




async function saveOperation(){

    let savePhoneAccel = await fetchFile("https://concretecanoe.skparab1.com/assets/serve/AccelerometerUncalibrated.csv");
    let savePhoneGyro = await fetchFile("https://concretecanoe.skparab1.com/assets/serve/GyroscopeUncalibrated.csv");
    let savePhoneMag = await fetchFile("https://concretecanoe.skparab1.com/assets/serve/MagnetometerUncalibrated.csv");
    let saveLeftWatch = await fetchFile("https://concretecanoe.skparab1.com/assets/serve/LeftWatch.csv");
    let saveRightWatch = await fetchFile("https://concretecanoe.skparab1.com/assets/serve/RightWatch.csv");

    makedict(savePhoneAccel, "PhoneAccel", sampleDict);
    makedict(savePhoneGyro, "PhoneGyro", sampleDict);
    makedict(savePhoneMag, "PhoneMag", sampleDict);

    makedict(saveLeftWatch, "LeftWatch", sampleDict);
    makedict(saveRightWatch, "RightWatch", sampleDict);
    
    splitdata();

    updateOptimalGraph();
}


async function askGPT(sampleGPTdata, optimalGPTdata){
    fetch('https://openrouter.ai/api/v1/chat/completions', {

        method: 'POST',
      
        headers: {
      
          Authorization: POCKET.OpenRouter_KEY,
          
          'Content-Type': 'application/json',
      
        },
      
        body: JSON.stringify({
      
          model: 'deepseek/deepseek-chat:free',
      
          messages: [
      
            {
      
              role: 'user',
      
              content: `Below are two arrays of data collected from two different paddlers in two separate but identical canoes. One paddler is performing optimal strokes, while one is performing suboptimal strokes. The data points are Quaternions, and they are measured over time. Can you tell me how a paddler could improve their stroke in the second array? Please answer with specific suggestions backed up with data from this stroke with clear areas for improvement, and use paddling-specific vocabulary. Please only report key observations, and do not include emojis, an introduction, a conclusion, or ask if I would like something else.

                        Suboptimal: ${sampleGPTdata}

                        Optimal:  ${optimalGPTdata}`,
      
            },
      
          ],
      
        }),
      
    }).then(response => {
        return response.json();
    })
    .then(data => {

        console.log("GPT data",data.choices[0].message.content);

        var converter = new showdown.Converter();
        var html = converter.makeHtml(data.choices[0].message.content);

        html = html.replace("ul","ol");

        GPTdisplay.innerHTML = html;

        console.log("GPT HTML",html);

        loadingmotionon = false;
    })
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
                prodapi();
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

        // console.log("feature",i);

        
        if (newDict[i] != null){
            if (oldDict == null){
                // console.log("could not find feature",i, "in olddict");
                newDict[i].push(null);
            } else {
                try {
                    newDict[i] = [oldDict[i][index]];
                } catch (e) {
                    if (i == "PhoneTimes"){
                        newDict["PhoneTime"] = [oldDict["PhoneTime"][index]];
                    }
                }
            }
        } else {
            // console.log("could not find feature",i, "in newdict");
            if (oldDict == null){
                newDict[i] = [null];
            } else {
                try {
                    newDict[i] = [oldDict[i][index]];
                } catch (e) {
                    if (i == "PhoneTimes"){
                        newDict["PhoneTime"] = [oldDict["PhoneTime"][index]];
                    }
                }
            }
        }
    }
}



function addReadingPush(newDict, oldDict, pindex, wlindex, wrindex){
    let attributes = ["PhoneAccelX", "PhoneAccelY", "PhoneAccelZ", "PhoneGyroX",
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
        
    for (const i of attributes){
        let index = "";
        if (i.includes("Phone")){
            index = pindex
        } else if (i.includes("LeftWatch")){
            index = wlindex
        } else {
            index = wrindex
        }

        // console.log("feature",i);
        if (newDict[i] == null){
            newDict[i] = [];
        }

        if (oldDict == null){
            newDict[i].push(null);
        } else {
            if (oldDict[i] == null){
                newDict[i].push(null);
            }
            newDict[i].push(oldDict[i][index]);
        }        

        
        // 
        //     if (oldDict == null){
        //         // console.log("could not find feature",i, "in olddict");
        //         newDict[i].push(null);
        //     } else {
        //         try {
        //             newDict[i] = [oldDict[i][index]];
        //         } catch (e) {
        //             if (i == "PhoneTimes"){
        //                 newDict["PhoneTime"] = [oldDict["PhoneTime"][index]];
        //             }
        //         }
        //     }
        // } else {
        //     // console.log("could not find feature",i, "in newdict");
        //     if (oldDict == null){
        //         newDict[i] = [null];
        //     } else {
        //         try {
        //             newDict[i] = [oldDict[i][index]];
        //         } catch (e) {
        //             if (i == "PhoneTimes"){
        //                 newDict["PhoneTime"] = [oldDict["PhoneTime"][index]];
        //             }
        //         }
        //     }
        // }
    }
}


function continuouslyupwards(arr, startIndex, wantlength){
    let checked = startIndex-wantlength;
    
    let anomalies = 0;
    while (checked < startIndex){
        
        try {
            
            if (checked < 0 || checked > arr.length-1){
                return false;
            }
            if (arr[checked] > arr[checked+1]){
                anomalies += 1;
            }
    
        } catch (e) {
            return false;
        }
        
        checked += 1;
    }
    
    return anomalies <= 3;
}

function continuouslydownward(arr, startIndex, wantlength){
    let checked = startIndex;
    
    let anomalies = 0;
    while (checked < startIndex+wantlength){
        
        if (arr.length <= startIndex+wantlength){
            return false;
        }
        if (arr[checked] < arr[checked+1]){
            anomalies += 1;
        }
        
        checked += 1;
    }
    
    return anomalies <= 3;
}
    

function splitIntoParts(currentDict){
    
    //currentDict is a dict with attributes of arrays

    let strokearr = [];
    
    let splitalready = false;
    let secondsplitalready = false;
    
    let last = 0;

    let currentstroke = {};

    let i = 0;
    while (i < currentDict["PhoneAccelX"].length && i < currentDict["LeftWatchRoll"].length
          && i < currentDict["RightWatchRoll"].length){
                
        // i want to see if its increasing consistently
        if ((!splitalready) && 
            continuouslyupwards(currentDict["LeftWatchGravY"], i, 40) && last-i < 40){
            
            //print("first split out, at index", i)

            if (currentstroke != {}){
                strokearr.push(currentstroke);
                
                splitalready = true;

                currentstroke = {};
            }
        }
               
                
        // now i want to see if its decreasing consistently
        if ((splitalready) && (!secondsplitalready) &&
                continuouslydownward(currentDict["LeftWatchGravY"], i, 8) && last-i < 8){
            //print("second split out, at index", i)
            
            if (currentstroke != {}){
                strokearr.push(currentstroke);
                
                secondsplitalready = true;

                currentstroke = {};
            }
        }
    
    
        addReadingPush(currentstroke, currentDict, i, i, i);

        i += 1;
        last = i;
    }

    if (currentstroke != {}){
        strokearr.push(currentstroke);
    }

    return strokearr;
}

function getSummaryStats(arr){
    // console.log(arr);

    var stats = new Statistics({id: 1, age: 23});

    let retarr = [
        stats.arithmeticMean(arr),
        stats.skewness(arr), 
        stats.standardDeviation(arr),
        stats.minimum(arr),
        stats.maximum(arr),
        stats.range(arr),
        stats.quartiles(arr)[0],
        stats.quartiles(arr)[1]];
    
    let k = 0;
    while (k < retarr.length){
        if (isNaN(retarr[k])){
            retarr[k] = 0;
        }
        k += 1;
    }

    let retstr = "";

    k = 0;
    while (k < retarr.length){
        retstr += retarr[k];
        if (k != retarr.length-1){
            retstr += ",";
        }
        k += 1
    }


    return retarr;
}

function convertToSummary(dct){
    let attributes = ["PhoneAccelX", "PhoneAccelY", "PhoneAccelZ", "PhoneGyroX",
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
    
    let endstr = "";

    // let totlen = 0;
    
    for (feature of attributes){
        endstr += "&"+feature+"=";
        endstr += getSummaryStats(dct[feature]);
        // totlen += 8;
    }

    // console.log("TOTLEN", totlen);

    return endstr;
}


async function splitdata(){
    // this splits sampleDict

    loadingmotion();

    analysisdisplay.innerHTML = "<h2>Splitting strokes...</h2>";


    let currentPhoneTimes = sampleDict["PhoneTimes"][0];
    let currentLeftWatchTimes = sampleDict["LeftWatchTimes"][0];
    let currentRightWatchTimes = sampleDict["RightWatchTimes"][0];
    
    let holdMetric;
    
    if (currentPhoneTimes >= currentLeftWatchTimes && currentPhoneTimes >= currentRightWatchTimes){
        holdMetric = "currentPhoneTimes";
    } else if (currentLeftWatchTimes >= currentPhoneTimes && currentLeftWatchTimes >= currentRightWatchTimes){
        holdMetric = "currentLeftWatchTimes";
    } else {
        holdMetric = "currentRightWatchTimes";
    }

    // console.log(sampleDict.PhoneAccelX);
    
    let pindex = 0;
    let wlindex = 0;
    let wrindex = 0;
    while (true){
        currentPhoneTimes = sampleDict["PhoneTimes"][pindex];
        currentLeftWatchTimes = sampleDict["LeftWatchTimes"][wlindex];
        currentRightWatchTimes = sampleDict["RightWatchTimes"][wrindex];
        
        if (holdMetric == "currentPhoneTimes"){
            if (currentLeftWatchTimes < currentPhoneTimes && currentRightWatchTimes < currentPhoneTimes){
                wlindex += 1;
                wrindex += 1;
            } else if (currentLeftWatchTimes < currentPhoneTimes){
                wlindex += 1;
            } else if (currentRightWatchTimes < currentPhoneTimes){
                wrindex += 1;
            } else {
                break
            }

        } else if (holdMetric == "currentLeftWatchTimes"){
            if (currentPhoneTimes < currentLeftWatchTimes && currentRightWatchTimes < currentLeftWatchTimes){
                pindex += 1;
                wrindex += 1;
            } else if (currentPhoneTimes < currentLeftWatchTimes) {
                pindex += 1;
            } else if (currentRightWatchTimes < currentLeftWatchTimes){
                wrindex += 1;
            } else {
                break
            }

        } else {
            if (currentPhoneTimes < currentRightWatchTimes && currentLeftWatchTimes < currentRightWatchTimes){
                pindex += 1;
                wlindex += 1;
            } else if (currentPhoneTimes < currentRightWatchTimes) {
                pindex += 1;
            } else if (currentLeftWatchTimes < currentRightWatchTimes) {
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


    console.log(pindex, wlindex, wrindex);

    // YOU DONT DO THIS.
    // CLIPPING IS TAKEN CARE OF BY THE LOOP DOWN THERE (STARTING LATER in the arr)

    // for (const i of PhoneAttributes){
    //     clipArray(i, pindex);
    // }
    
    // for (const i of LeftWatchAttributes){
    //     clipArray(i, wlindex);
    // } 

    // for (const i of RightWatchAttributes){
    //     clipArray(i, wrindex);
    // }

    // console.log("SAMPLE 0.5, after alignment", sampleDict);


    // first thing: 
    // where is the last seen match? sample 0. after that something must happen
    // rewrite from there down






    let streaks = [];

    let strokearr = [];

    let currentstroke = {};

    let pstart = pindex;
    let wlstart = wlindex;
    let wrstart = wrindex;

    // console.log("Sample 0", (sampleDict["LeftWatchRoll"].length), (sampleDict["PhoneAccelX"].length));
    console.log("Sample 0 data", sampleDict);


    let i = 0;
    let last = 0;
    while (pstart < sampleDict["PhoneAccelX"].length && wlstart < sampleDict["LeftWatchRoll"].length
          && wrstart < sampleDict["RightWatchRoll"].length){
        // console.log("wlstart currently ", wlstart, "value ", sampleDict["LeftWatchQuatX"][wlstart]);
        //cut it off as a stroke
        if (continuouslyupwards(sampleDict["LeftWatchQuatX"], wlstart, 20)
            && i-last > 150){

            // console.log("CUT");


            strokearr.push(currentstroke);

            currentstroke = {}

            streaks.push(i-last); // will usually be around the threshold

            last = i;
        }

        // if (i-last < 155){
            
        addReadingPush(currentstroke, sampleDict, pstart, wlstart, wrstart);

        // }

        i += 1;
        pstart += 1
        wlstart += 1
        wrstart += 1
    }

    try {

        console.log("SAMPLER", strokearr[0]["LeftWatchAccelX"]);
        console.log("SAMPLER1 len", strokearr[0]["LeftWatchAccelX"].length);
    } catch (error) {
        saveOperation();
        // we save it mang
        
        // indicate the save
        document.getElementById("indicatordot").style.backgroundColor = "orange";

        throw "Alignment or splitting failed";
    }



    analysisdisplay.innerHTML = ``;


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

    if (mxlen > 8){
        // move to the middle
        takestartindex += (mxlen-8)/2;
    }

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

    let allQuatW = [];
    let stopquat = true;

    while (pstart < sampleDict["PhoneAccelX"].length && wlstart < sampleDict["LeftWatchRoll"].length
        && wrstart < sampleDict["RightWatchRoll"].length){
        let subj = sampleDict.PhoneGyroX[i];

        if (i < sampleDict.PhoneGyroX.length-4 && subj > sampleDict.PhoneGyroX[i+1] && sampleDict.PhoneGyroX[i+1] > sampleDict.PhoneGyroX[i+2] && sampleDict.PhoneGyroX[i+3] > sampleDict.PhoneGyroX[i+4] && i-last > 100 && subj > 0.8){
            //insert spaces
            let j = 0;
            while (j < 100 && strokesgone >= takestartindex && strokesgone < takestartindex+takelen){
                
                addReadingPush(newdict, null, pstart, wlstart, wrstart);

                j += 1;
            }

            stopquat = !stopquat;

            strokesgone += 1;

            console.log(strokesgone);

            last = i;
        }

        if (strokesgone >= takestartindex && strokesgone < takestartindex+takelen){
            addReadingPush(newdict, sampleDict, pstart, wlstart, wrstart);

            if (!stopquat){
                allQuatW.push(sampleDict["LeftWatchQuatW"][wlstart]);
            }
        }


        i += 1;
        pstart += 1
        wlstart += 1
        wrstart += 1
    }

    sampleDict = newdict;

    console.log(sampleDict);
    // console.log("allQuatW",allQuatW.toString());

    askGPT("["+allQuatW.toString()+"]", optimalgptsend);


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

    console.log(strokearray);



    analysisdisplay.innerHTML = ``;

    sendData = strokearray;

    console.log("SAMPLER2 len", sendData[0]["LeftWatchAccelX"].length);
    console.log("Sampler 2 phone", sendData[0]["PhoneAccelX"])
    console.log("Sampler 2 leftwatch", sendData[0]["LeftWatchAccelX"])
    console.log("Sampler 2 rightwatch", sendData[0]["RightWatchAccelX"])

    let firstRun = true;

    i = 0;
    while (i < sendData.length){

        let spr = splitIntoParts(strokearray[i]);

        // console.log("First spliFt PL", spr);

        if (spr.length == 3 && Object.keys(spr[0]).length != 0 && Object.keys(spr[1]).length != 0 && Object.keys(spr[2]).length != 0){
            let catchSummary = convertToSummary(spr[0]);
            let pullSummary = convertToSummary(spr[1]);
            let recoverySummary = convertToSummary(spr[2]);

            // console.log("catch",catchSummary);
            // console.log("pull",pullSummary);
            // console.log("recovery",recoverySummary);

            await getPrediction("catch", catchSummary, strokearr, strokearray, i-2, firstRun);
            await getPrediction("pull", pullSummary, strokearr, strokearray, i-2, firstRun);
            await getPrediction("recovery", recoverySummary, strokearr, strokearray, i-2, firstRun);

            firstRun = false;

            // alert("one stroke");

            // await sleep(1000);


        } // else just skip over it
        

        i += 1;
    }

    displayPie(strokearr, strokearray, i, false, firstRun);
}

function getGoodPercentage(part){
    if (predictions[part].length != 0){
        return countgood(part)/predictions[part].length;
    } else {
        return 0;
    }
}


function setChart(part, decimalGood){

    // console.log("party is ", part);
    let chart = document.getElementById(part+"chart");

    chart.style.backgroundImage = `conic-gradient(
        green ${decimalGood*360}deg,
        red 0 ${decimalGood*360}deg
    )`;
}

async function updateChart(part, newDecimal){

    try {
        let chart = document.getElementById(part+"chart");
        let prevDecimal = parseFloat(String(chart.style.backgroundImage).split(',')[0].split("green ")[1].split("deg")[0])/360;
    
    
        let disp = document.getElementById(part+"disp");
    
        disp.innerHTML = `${Math.round(newDecimal*100)}% Optimal (${countgood(part)}/${predictions[part].length})`;
    
    
        let i = 0;
        while (i < 100){
            let currentDecimal = prevDecimal + (newDecimal - prevDecimal)*(i/100);
            setChart(part, currentDecimal);
    
            await sleep();
    
            i += (105-i)/50;
        }
    } catch (error) {
        console.log("Error in updateChart", error);
    }

}


async function displayPie(strokearr, strokearray, i, forcedone, firstRun){

    // let newp1 = getGoodPercentage('catch');
    // let newp2 = getGoodPercentage('pull');
    // let newp3 = getGoodPercentage('recovery');

    // let b = 0;

    // while (b < 100){
    //     BE CAREFUL IF UNCOMMENTING THE BELOW STATEMENT, the PARAMETERS OF DISPLAYPIEANIM HAVE CHANGED
    //     displayPieAnim(strokearr, strokearray, i, forcedone, previous1+(newp1-previous1)*b/100, previous2+(newp2-previous2)*b/100, previous3+(newp3-previous3)*b/100);
    //     b += 1;
    //     await sleep();
    // }
    

    let adden = ``;
    if (strokearray.length-5 != i || forcedone){
        // adden = `<h2 style='color: var(--main);'>Analyzing stroke ${i} of ${strokearray.length-5}</h2>`;
        document.getElementById("loadinganim").style.display = "none";
    }

    if (firstRun){

        analysisdisplay.innerHTML = `

        `+adden+`
    
        <div id="catchchart" class="piechart" style="background-image: conic-gradient(
            green ${getGoodPercentage('catch')*360}deg,
            red 0 ${(1-getGoodPercentage('catch'))*360}deg
        );">
            <h2 style='margin-top: -85px;'>Catch</h2>
            <h4 style='margin-top: 0px; color: var(--main);' id="catchdisp">${Math.round(getGoodPercentage('catch')*100)}% Optimal (${countgood('catch')}/${predictions['catch'].length})</h2>
        </div>

        <div id="pullchart" class="piechart" style="background-image: conic-gradient(
            green ${getGoodPercentage('pull')*360}deg,
            red 0 ${(1-getGoodPercentage('pull'))*360}deg
        );">
            <h2 style='margin-top: -85px;'>Pull</h2>
            <h4 style='margin-top: 0px; color: var(--main);' id="pulldisp">${Math.round(getGoodPercentage('pull')*100)}% Optimal (${countgood('pull')}/${predictions['pull'].length})</h2>
        </div>

        <div id="recoverychart" class="piechart" style="background-image: conic-gradient(
            green ${getGoodPercentage('recovery')*360}deg,
            red 0 ${(1-getGoodPercentage('recovery'))*360}deg
        );">
            <h2 style='margin-top: -85px;'>Recovery</h2>
            <h4 style='margin-top: 0px; color: var(--main);' id="recoverydisp">${Math.round(getGoodPercentage('recovery')*100)}% Optimal (${countgood('recovery')}/${predictions['recovery'].length})</h2>
        </div>
        `;
    }

    updateChart("catch", getGoodPercentage('catch'));
    updateChart("pull", getGoodPercentage('pull'));
    updateChart("recovery", getGoodPercentage('recovery'));
}



function countgood(part){
    let i = 0;
    let count = 0;
    while (i < predictions[part].length){
        if (predictions[part][i] == 0){
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

async function getPrediction(part, sendstr, strokearr, strokearray, i, firstRun){
    // let strokedictsend = getStrokeToSend(num);
    let url = POCKET.Render_Endpoint+part+"?"+sendstr;

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

    // console.log(strokedictsend);

    fetch(url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
    })
    .then(response => {
        return response.json();
    })
    .then(data => {
        console.log(data);
        console.log(parseInt(data.prediction));
        predictions[part].push(parseInt(data.prediction));
        displayPie(strokearr, strokearray, i, false, firstRun);
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

    return [mn-diff/4, diff/3];
}




initDraw();



async function splitDataOptimal(){
    let streaks = [];

    let strokearr = [];

    let currentstroke = {};


    let i = 0;
    let last = 0;
    while (i < optimaldata["PhoneAccelX"].length && i < optimaldata["LeftWatchRoll"].length
          && i < optimaldata["RightWatchRoll"].length){

        if (continuouslyupwards(optimaldata["LeftWatchQuatX"], i, 20)
            && i-last > 150){


            strokearr.push(currentstroke);

            currentstroke = {}

            streaks.push(i-last); // will usually be around the threshold

            last = i;
        }

        // if (i-last < 155){
            
        addReading(currentstroke, optimaldata, i, i, i);

        // }

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

    console.log("optimaldict RIGHT BEFORE", optimaldata);

    newdict = {};

    let allQuatW = [];
    let stopquat = true;

    i = 0;
    last = 0;
    let strokenumber = 0;
    while (i < optimaldata["PhoneAccelX"].length && i < optimaldata["LeftWatchRoll"].length
          && i < optimaldata["RightWatchRoll"].length){

        if (continuouslyupwards(optimaldata["LeftWatchQuatX"], i, 20)
            && i-last > 150){

            console.log("at a stroke to push, strokenumber:", strokenumber);
            // strokearr.push(currentstroke);

            // currentstroke = {}

            let b = 0;
            while (b < 100 && strokenumber >= takestartindex && strokenumber < takestartindex+takelen){
                addReadingPush(newdict, null, i, i, i);
                b += 1;
            }

            stopquat = !stopquat;

            strokenumber += 1;

            // streaks.push(i-last); // will usually be around the threshold

            last = i;
        }

        // if (i-last < 155){

        if (strokenumber >= takestartindex && strokenumber < takestartindex+takelen){
            
            addReadingPush(newdict, optimaldata, i, i, i);
            
            if (!stopquat){
                allQuatW.push(optimaldata["LeftWatchQuatW"][i]);
            }
        }
        // console.log("right after", newdict);

        // }

        i += 1;
    }

    optimaldata = newdict;

    console.log("optimalQuat", allQuatW.toString());

    optimalgptsend = "["+allQuatW.toString()+"]";


    // // now process senddata, split into strokes and call the model for each one
    // // not too hard
    // // make an array of strokes
    // let strokearray = [];
    // // only take the ones that were approved by the automation
    // console.log(starts);
    // console.log(lns);

    // console.log(strokearr);

    // // send any set of strokes larger than 2 for evaluation




    // i = 0;
    // while (i < starts.length){
    //     if (lns[i] > 2){
    //         // actually do the thing

    //         let j = starts[i];
    //         while (j < starts[i]+lns[i]){
    //             strokearray.push(strokearr[j]);
    //             j += 1;
    //         }
    //     }
    //     // else skip over it
    //     i += 1;
    // }

    // console.log(strokearray);



    // analysisdisplay.innerHTML = `
    // <h2 style='color: var(--main);'>Strokes found: ${strokearr.length}</h2>
    // <h2 style='color: var(--main);'>Consistent strokes found: ${strokearray.length}</h2>
    // <h2>Analyzing stroke 0 of ${strokearray.length}</h2>`;

    // sendData = strokearray;

    // console.log("SAMPLER2 len", sendData[0]["LeftWatchAccelX"].length);
    // console.log("Sampler 2 phone", sendData[0]["PhoneAccelX"])
    // console.log("Sampler 2 leftwatch", sendData[0]["LeftWatchAccelX"])
    // console.log("Sampler 2 rightwatch", sendData[0]["RightWatchAccelX"])

    // i = 2;
    // while (i < sendData.length - 2){

    //     let spr = splitIntoParts(strokearray[i]);

    //     // console.log("First spliFt PL", spr);

    //     if (spr.length == 3 && Object.keys(spr[0]).length != 0 && Object.keys(spr[1]).length != 0 && Object.keys(spr[2]).length != 0){
    //         let catchSummary = convertToSummary(spr[0]);
    //         let pullSummary = convertToSummary(spr[1]);
    //         let recoverySummary = convertToSummary(spr[2]);

    //         console.log("catch",catchSummary);
    //         console.log("pull",pullSummary);
    //         console.log("recovery",recoverySummary);

    //         await getPrediction("catch", catchSummary, strokearr, strokearray, i-2);
    //         await getPrediction("pull", pullSummary, strokearr, strokearray, i-2);
    //         await getPrediction("recovery", recoverySummary, strokearr, strokearray, i-2);


    //     } // else just skip over it
        

    //     i += 1;
    // }
}



function makesampledict(datastr){
    let spltup = datastr.split('\n');

    // console.log("SPLITUP", spltup);

    enddict = {
    };

    // PhoneTime,PhoneAccelZ,PhoneAccelY,PhoneAccelX,PhoneGryoZ,PhoneGyroY,PhoneGyroX,PhoneMagZ,PhoneMagY,PhoneMagX,LeftWatchTime,LeftWatchRoll,LeftWatchPitch,LeftWatchYaw,LeftWatchRotX,LeftWatchRotY,LeftWatchRotZ,LeftWatchGravX,LeftWatchGravY,LeftWatchGravZ,LeftWatchDMUAccelX,LeftWatchDMUAccelY,LeftWatchDMUAccelZ,LeftWatchQuatX,LeftWatchQuatY,LeftWatchQuatW,LeftWatchQuatZ,LeftWatchAccelX,LeftWatchAccelY,LeftWatchAccelZ,RightWatchRoll,RightWatchPitch,RightWatchYaw,RightWatchRotX,RightWatchRotY,RightWatchRotZ,RightWatchGravX,RightWatchGravY,RightWatchGravZ,RightWatchDMUAccelX,RightWatchDMUAccelY,RightWatchDMUAccelZ,RightWatchQuatX,RightWatchQuatY,RightWatchQuatW,RightWatchQuatZ,RightWatchAccelX,RightWatchAccelY,RightWatchAccelZ

    let features = [
        "PhoneTime", 
        "PhoneAccelZ", "PhoneAccelY", "PhoneAccelX",
        "PhoneGyroZ", "PhoneGyroY", "PhoneGyroX",
        "PhoneMagZ", "PhoneMagY", "PhoneMagX",

        "LeftWatchRoll", "LeftWatchPitch", "LeftWatchYaw",
        "LeftWatchRotX", "LeftWatchRotY", "LeftWatchRotZ",
        "LeftWatchGravX", "LeftWatchGravY", "LeftWatchGravZ",
        "LeftWatchDMUAccelX", "LeftWatchDMUAccelY", "LeftWatchDMUAccelZ",
        "LeftWatchQuatX", "LeftWatchQuatY", "LeftWatchQuatW", "LeftWatchQuatZ",
        "LeftWatchAccelX", "LeftWatchAccelY", "LeftWatchAccelZ",

        "RightWatchRoll", "RightWatchPitch", "RightWatchYaw",
        "RightWatchRotX", "RightWatchRotY", "RightWatchRotZ",
        "RightWatchGravX", "RightWatchGravY", "RightWatchGravZ",
        "RightWatchDMUAccelX", "RightWatchDMUAccelY", "RightWatchDMUAccelZ",
        "RightWatchQuatX", "RightWatchQuatY", "RightWatchQuatW", "RightWatchQuatZ",
        "RightWatchAccelX", "RightWatchAccelY", "RightWatchAccelZ"
    ];

    let i = 1;
    while (i < spltup.length){
        let line = spltup[i].split(',');

        let b = 0;
        while (b < features.length){
            if (enddict[features[b]] == undefined){
                enddict[features[b]] = [];
            }

            enddict[features[b]].push(parseFloat(line[b]));

            b += 1;
        }

        i += 1;
    }

    console.log("ENDDICT", enddict);

    return enddict;
}


async function prodapi(){

    document.getElementById("indicatordot").style.backgroundColor = "red";

    let produrl = "https://predictor-vu7p.onrender.com/predict/catch?&PhoneAccelX=-0.5548493169969128,-0.8574532290296533,0.19111578158111334,-1.1131591796875,-0.201904296875,0.9112548828125,-0.6220016479492188,-0.43102264404296875&PhoneAccelY=-0.852233394499748,0.4565321711220944,0.13653736615273696,-1.1604461669921875,-0.4539794921875,0.7064666748046875,-0.9377517700195312,-0.7930526733398438&PhoneAccelZ=0.22934329125189012,-0.08747782684468514,0.12305182865271355,-0.09918212890625,0.5132598876953125,0.6124420166015625,0.13271331787109375,0.327484130859375&PhoneGyroX=-0.4976881258189678,1.6295239073703034,0.4420963402131358,-1.15750253200531,1.2488899230957031,2.406392455101013,-0.6442253291606903,-0.4567030966281891&PhoneGyroY=-0.3208550938795651,0.9810760081772895,0.47387759276913144,-1.2477353811264038,1.3192524909973145,2.5669878721237183,-0.642156571149826,-0.10631405562162399&PhoneGyroZ=-0.5464560792691284,-1.8750796720760088,0.39386961317679986,-1.8588597774505615,-0.08103253692388535,1.7778272405266762,-0.5379999279975891,-0.32432375848293304&PhoneMagX=-221.40218254827684,-0.5924871985885306,13.244187762373382,-243.65792846679688,-207.36572265625,36.292205810546875,-234.50418853759766,-210.1790008544922&PhoneMagY=2.6787562216481855,0.08640380308630355,8.250755142626197,-8.10845947265625,14.620941162109375,22.729400634765625,-6.046058654785156,11.162422180175781&PhoneMagZ=-417.19176163211944,0.6433695282719561,8.132252277332444,-427.71575927734375,-399.92620849609375,27.78955078125,-424.3612976074219,-413.2318878173828&LeftWatchRoll=-0.3224907179335254,-0.21233155857331368,0.16964322337051085,-0.5958249616228634,-0.025189885510470182,0.5706350761123932,-0.4869048711647251,-0.17415605320780603&LeftWatchPitch=-0.18654093582249048,-0.4668203255410034,0.19398120350194353,-0.481953632297879,0.018816831497090538,0.5007704637949696,-0.4122534851599467,-0.015807390190173586&LeftWatchYaw=2.08583380447338,-0.6340951220353979,0.23499167258240802,1.674953411381184,2.373985582771242,0.6990321713900582,1.8439762823122152,2.270476775405216&LeftWatchRotX=0.47542446137466016,0.6914524484505444,0.7915831455826581,-0.5146840810775757,2.050466775894165,2.5651508569717407,-0.15772706270217896,1.1077850461006165&LeftWatchRotY=-0.23393076363830798,-0.32623264210138386,1.1303566562745435,-2.092724561691284,1.6094917058944702,3.7022162675857544,-1.3242843747138977,0.6407795250415802&LeftWatchRotZ=0.12080910469916079,-0.2446228698896849,0.5473643310603866,-1.1878242492675781,1.1055268049240112,2.2933510541915894,-0.33507147431373596,0.6000050008296967&LeftWatchGravX=-0.30288028324984256,-0.1594224075302467,0.15558633192748456,-0.5508414506912231,-0.02258150279521942,0.5282599478960037,-0.45061272382736206,-0.16892855614423752&LeftWatchGravY=0.18146724873522838,0.4492340230590124,0.18727566658766315,-0.018815720453858376,0.4635111689567566,0.48232688941061497,0.015806729439646006,0.40067237615585327&LeftWatchGravZ=-0.901360769425669,-0.021649093986547387,0.06413978263582994,-0.9913842678070068,-0.8055594563484192,0.18582481145858765,-0.9671691954135895,-0.8444651961326599&LeftWatchDMUAccelX=0.06962781501633505,-0.41014842935208673,0.1942942270660115,-0.3933815062046051,0.5099067687988281,0.9032882750034332,-0.043080560863018036,0.22019487619400024&LeftWatchDMUAccelY=0.05559262331394899,0.8195826271949341,0.23288191658898816,-0.5094636678695679,0.9383381605148315,1.4478018283843994,-0.06435088440775871,0.18033070117235184&LeftWatchDMUAccelZ=0.09423794381080135,0.6921361493219436,0.3744043644416272,-0.5098044276237488,0.8912678956985474,1.4010723233222961,-0.17780163884162903,0.4040558934211731&LeftWatchQuatW=0.47495493327631993,0.7476136653328773,0.0877372501086216,0.36220374712643577,0.6488508825163025,0.28664713538986675,0.4076160282924604,0.5443476503288887&LeftWatchQuatX=0.08360728146001146,-0.6131596792469318,0.10912180984503199,-0.14292011948510386,0.2323232690117579,0.3752433884968618,0.039315963334184946,0.164876834029244&LeftWatchQuatY=-0.14910972615646564,-0.16535587374193586,0.09138674842526721,-0.2851875997311525,-0.04526634083952807,0.2399212588916244,-0.23863409227038002,-0.05231866021237657&LeftWatchQuatZ=0.8447534613589703,-0.7360953673004821,0.06233363485371012,0.7258068439871653,0.9114972652350802,0.1856904212479149,0.7885490104695345,0.8920318699660171&LeftWatchAccelX=-0.21489383328345515,-0.3598109822833986,0.30250544177148214,-0.8482513427734375,0.288238525390625,1.1364898681640625,-0.483001708984375,0.01984405517578125&LeftWatchAccelY=0.2348357169858871,0.2333986129010844,0.2761046379036184,-0.2462005615234375,0.980377197265625,1.2265777587890625,-0.004638671875,0.46346282958984375&LeftWatchAccelZ=-0.8202252541818926,0.7484346585392587,0.42569842589660445,-1.4705657958984375,0.081939697265625,1.5525054931640625,-1.1219482421875,-0.4871063232421875&RightWatchRoll=0.4333975969922496,-0.20381166213222024,0.528355507170476,-0.335116504308223,1.0360567299210774,1.3711732342293004,-0.11494995045129368,0.9616537127674394&RightWatchPitch=0.6543135448101463,0.287544296692844,0.05364413454879082,0.5674179694775421,0.7636259971535366,0.19620802767599455,0.6134301302734093,0.7019034892720182&RightWatchYaw=0.3073865582252421,0.5728980312048444,0.5472038826037708,-0.2508816114461587,1.2029427231360688,1.4538243345822275,-0.18065489154441622,0.87413091826951&RightWatchRotX=0.1297898654255175,-0.12995503152846766,0.5776489735272816,-1.4569824934005737,1.2925446033477783,2.749527096748352,-0.18204016983509064,0.4716707915067673&RightWatchRotY=-0.08324341122962294,0.6640234390623672,1.368652138490624,-2.035672187805176,2.6261837482452393,4.661855936050415,-1.2480437755584717,0.599869430065155&RightWatchRotZ=0.6176808724900887,0.23477200736049866,1.2868523597984374,-1.0291016101837158,2.53708815574646,3.566189765930176,-0.6159957945346832,1.9948235154151917&RightWatchGravX=0.29261533728229905,-0.2808303681200524,0.36731983514418715,-0.2601272165775299,0.6974886655807495,0.9576158821582794,-0.0895293578505516,0.6512177586555481&RightWatchGravY=-0.6077407055324123,-0.22438821374200535,0.042281131746955664,-0.6915451884269714,-0.5374564528465271,0.15408873558044434,-0.6456723213195801,-0.5756755471229553&RightWatchGravZ=-0.6206556029858128,0.2246453328912451,0.15621115319538034,-0.8147290349006653,-0.397553026676178,0.4171760082244873,-0.7587997019290924,-0.4500434696674347&RightWatchDMUAccelX=0.10696634710315735,0.4440026083204952,0.2432769441750424,-0.5475300550460815,0.6993097066879272,1.2468397617340088,-0.0029678866267204285,0.18239831924438477&RightWatchDMUAccelY=-0.07815629532260279,0.555580112490048,0.2731295456471971,-0.5862306356430054,0.5404738187789917,1.126704454421997,-0.29446810483932495,0.1229223906993866&RightWatchDMUAccelZ=0.14075516596917184,0.4212892908500342,0.27985386593290923,-0.31758418679237366,0.6427867412567139,0.9603709280490875,-0.08057336509227753,0.36493784189224243&RightWatchQuatW=0.8575287881650462,0.04988909887293632,0.04731737305724289,0.7725055262919829,0.9338889177423864,0.16138339145040348,0.8285429673936648,0.8999786731621748&RightWatchQuatX=0.3162823537204858,0.0697380600426895,0.020038886234317713,0.2575060871359155,0.3606953346660584,0.10318924753014291,0.3048775479700132,0.32465127304563535&RightWatchQuatY=0.24997331169753131,-0.19507949023877832,0.16422605693252074,0.0015257536775333971,0.4434998123567909,0.44197405867925754,0.08702610022286816,0.41855541234624916&RightWatchQuatZ=0.2070511004445106,0.6736054392828135,0.173563101098215,0.01328395004724814,0.527685031177756,0.5144010811305079,0.06103518419934845,0.35716063669325476&RightWatchAccelX=0.39992597026209675,-0.4231840207453347,0.399466226281406,-0.3188629150390625,0.923553466796875,1.2424163818359375,-0.06125640869140625,0.7580718994140625&RightWatchAccelY=-0.6854526150611139,0.5918340679976162,0.24384748163964434,-1.1769561767578125,-0.125030517578125,1.0519256591796875,-0.8692550659179688,-0.5335617065429688&RightWatchAccelZ=-0.4801836321430822,0.3029662503826195,0.18837753168302,-0.9671783447265625,-0.09197998046875,0.8751983642578125,-0.595794677734375,-0.35224151611328125";

    fetch(produrl, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          }
    })
    .then(response => {
        return response.json();
    })
    .then(data => {
        console.log(data);

        document.getElementById("indicatordot").style.backgroundColor = "rgb(17, 188, 17)";
    })
     

}

let optimaldata;

async function animatePlotOptimalFeature(source, feature, drawfunc, graph){
    let i = 0;

    // predraw clears it? - YES

    while (i < 100){
        drawfunc(feature);
        graph.innerHTML += graphString(source, feature, i);

        await sleep(10);
        i += (108-i)/10;
    }
}


function plotOptimalFeature(feature, animate){

    if (animate){
        animatePlotOptimalFeature(optimaldata, feature, predraw, plotgraph);
        animatePlotOptimalFeature(sampleDict, feature, predrawsecond, plotgraph2);
    } else {
        predraw(feature);
        plotgraph.innerHTML += graphString(optimaldata, feature);
        predrawsecond(feature);
        plotgraph2.innerHTML += graphString(sampleDict, feature);
    }

    // CAREFUL: Not stored in pointsarr
}

function updateOptimalGraph(animate=true){
    let feature = document.getElementById('feature').value;
    pointsarr = [];
    redraw();
    plotOptimalFeature(feature, animate);
}

async function fetchCSV(url) {
    try {
        const response = await fetch(url);
        const data = await response.text();
        console.log(data);
        optimaldata = makesampledict(data);
        console.log(optimaldata);
        splitDataOptimal();
        console.log("FINAL",optimaldata);
        updateOptimalGraph();
    } catch (error) {
        console.error('Error fetching CSV:', error);
    }
}

async function fetchFile(url){
    const response = await fetch(url);
    const data = await response.text();
    return data;
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


let predictions = {
    "catch": [],
    "pull": [],
    "recovery": []
};
let sendData;

let optimalgptsend;


window.onerror = function(error) {
    alert("errored somewhere");
    console.log(error);
};

// prod it right away, and tell if it gets active
prodapi();

fetchCSV('https://concretecanoe.skparab1.com/assets/Paddling data new stuff.csv');



//https://concretecanoe.skparab1.com/assets/serve/LeftWatch.csv

// load the settings from localstorage
let theme = localStorage.getItem('bttheme');
let angle = localStorage.getItem('btangle');
let demospeed = localStorage.getItem('btspeed');

let lasttoggle = new Date();
let POCKET;

fetch('./js/pocket.json')
    .then((response) => response.json())
    .then((json) => {POCKET = json;});

//init object to store window properties
var windowSize = {
    w: window.outerWidth,
    h: window.outerHeight,
    iw: window.innerWidth,
    ih: window.innerHeight
};
  
window.addEventListener("resize", function() {
    //if window resizes
    if (window.outerWidth !== windowSize.w || window.outerHeight !== windowSize.h) {
        windowSize.w = window.outerWidth; // update object with current window properties
        windowSize.h = window.outerHeight;
        windowSize.iw = window.innerWidth;
        windowSize.ih = window.innerHeight;
        updateOptimalGraph(false)
    }
    //if the window doesn't resize but the content inside does by + or - 5%
    else if (window.innerWidth + window.innerWidth * .05 < windowSize.iw ||
        window.innerWidth - window.innerWidth * .05 > windowSize.iw) {
        updateOptimalGraph(false);
        windowSize.iw = window.innerWidth;
    }
}, false);

// usage
window.addEventListener('devicepixelratiochange',function(e){
  // note: browsers will change devicePixelRatio when page zoom changed or system display scale changed
  console.log('devicePixelRatio changed from '+e.oldValue+' to '+e.newValue);
});


if (theme == null){
    localStorage.setItem("bttheme",'dark');
    theme = 'dark';
    forcedark();
} else if (theme == 'dark'){
    forcedark();
}

const sleep = ms => new Promise(res => setTimeout(res, ms));