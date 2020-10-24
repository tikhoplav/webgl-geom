const float PI = 3.1415926535897932384626433832795;

// point index is the attribute of each vertex
attribute float index;

// other parameters are shared among all vertices
// parameters used for geometry build:
uniform int totalPoints;
uniform float fraction;

// parameters used to camera calculation:


void main(void) {
    // calculate vertex position
    float r = index / float(totalPoints - 1);
    float a = 2.0 * PI * mod(fraction, 1.0) * index;

    float x = r * cos(a);
    float y = r * sin(a);
    float z = 0.0;

    gl_Position = vec4(x, y, z, 1.0);
}