export default class Drawer {
    construct (gl, vertexShaderSource, fragmentShaderSource) {

    }

    makeVertexShader (gl, source) {
        const vertexShader = gl.createShader(gl.VERTEX_SHADER);    
        gl.shaderSource(vertexShader, source);
        gl.compileShader(vertexShader);
        if (! gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
            const err = `Vertex shader compilation failed: ${gl.getShaderInfoLog(vertexShader)}`;
            gl.deleteShader(vertexShader);
            throw err;
        }
        return vertexShader;
    }

    makeFragmentShader (gl, source) {
        const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fragmentShader, source);
        gl.compileShader(fragmentShader);
        if (! gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
            const err = `Vertex shader compilation failed: ${gl.getShaderInfoLog(fragmentShader)}`;
            gl.deleteShader(fragmentShader);
            throw err;
        }
        return fragmentShader;
    }

    makeProgram (gl, vertexShader, fragmentShader) {
        const program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        if(! gl.getProgramParameter(program, gl.LINK_STATUS)) {
            const err = `Failed to init glsl program: ${gl.getProgramInfoLog(program)}`;
            gl.deleteProgram(program);
            gl.deleteShader(vertexShader);
            gl.deleteShader(fragmentShader);
            throw err;
        }
        return program;
    }

    draw (gl) {
        
    }
}