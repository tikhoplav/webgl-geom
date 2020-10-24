window.onload  = async function () {
    let totalPoints = 10000;
    let fraction    = 1.61803398875;
    let indexes = new Float32Array(Array(totalPoints).fill().map((_, i) => i));

    // this function is used to update the parameters of image calculation
    // this calls the actual draw method on graphics driver.
    // Performance optimisation can be done by reducing number of calls to this function,
    // for example, not for each frame, but only when actual parameters are changed.
    const draw = function () {
        gl.uniform3f(cameraCoordLocation, 2.0, 0.785398, 1.0472);
        gl.uniform1f(aspectRatioLocation, app.width / app.height);
        gl.uniform1i(totalPointsLocation, totalPoints);
        gl.uniform1f(fractionLocation, fraction);
        gl.bufferData(gl.ARRAY_BUFFER, indexes, gl.DYNAMIC_DRAW);

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.drawArrays(gl.POINTS, 0, totalPoints);
        gl.flush();
        window.requestAnimationFrame(draw, app);
    }

    document.getElementsByTagName('body')[0].style = "margin: 0;";
    const app  = document.getElementById('app');
    app.style  = 'display:block;';
    app.width  = window.innerWidth;
    app.height = window.innerHeight;
    const gl   = app.getContext('webgl');

    if (!gl) {
        console.error('WebGL is not available');
        return;
    }

    const getSource = function (name) {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', name);
            xhr.onload = function () {
                if (xhr.status === 200) {
                    resolve(xhr.response);
                } else {
                    reject(`Failed to load ${name} : ${xhr.responseText}`);
                }
            }
            xhr.onerror = function () {
                reject(`Failed to load ${name} : ${xhr.responseText}`);
            }
            xhr.send();
        });
    }

    const vertexShaderSource = await getSource('vertex-shader.c');
    const vertexShader = gl.createShader(gl.VERTEX_SHADER);    
    gl.shaderSource(vertexShader, vertexShaderSource);
    gl.compileShader(vertexShader);
    if (! gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        console.error(`Vertex shader compilation failed: ${gl.getShaderInfoLog(vertexShader)}`);
        gl.deleteShader(vertexShader);
        return;
    }

    const fragmentShaderSource = await getSource('fragment-shader.c');
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentShaderSource);
    gl.compileShader(fragmentShader);
    if (! gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        console.error(`Vertex shader compilation failed: ${gl.getShaderInfoLog(fragmentShader)}`);
        gl.deleteShader(fragmentShader);
        return;
    }

    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if(! gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error(`Failed to init glsl program: ${gl.getProgramInfoLog(program)}`);
        gl.deleteProgram(program);
        gl.deleteShader(vertexShader);
        gl.deleteShader(fragmentShader);
        return;
    }

    gl.useProgram(program);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clearDepth(1.0);
    gl.viewport(0, 0, app.width, app.height);

    const indLocation = gl.getAttribLocation(program, 'index');
    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.enableVertexAttribArray(indLocation);
    gl.vertexAttribPointer(indLocation, 1.0, gl.FLOAT, gl.FALSE, 0, 0);

    const totalPointsLocation = gl.getUniformLocation(program, 'totalPoints');
    const fractionLocation    = gl.getUniformLocation(program, 'fraction');
    const aspectRatioLocation = gl.getUniformLocation(program, 'aspectRatio');
    const cameraCoordLocation = gl.getUniformLocation(program, 'sphericalCameraCoords');

    draw();
}