export default class App {
    constructor (id = 'app') {
        const e = document.createElement('canvas');
        e.id    = id;
        e.style = "display:block";
        document.body.appendChild(e);

        const gl = e.getContext('webgl');
        if (!gl) {
            throw 'Webgl is not available';
        }
        gl.clearColor(0.3, 0.3, 0.3, 1.0);
        gl.clearDepth(1.0);

        this.gl = gl;
        this.drawers = [];
    }

    addDrawers(...drawers) {
        this.drawers.push(drawers);
    }

    clearDrawers() {
        this.drawers = [];
    }

    draw(params = {}) {
        const gl = this.gl;
        gl.canvas.width  = window.innerWidth;
        gl.canvas.height = window.innerHeight;
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        this.drawers.forEach(d => d.draw(this.gl, params));
        
        gl.flush();
    }
}