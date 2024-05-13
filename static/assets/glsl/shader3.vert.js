export const vertex = `
precision mediump float;
attribute vec2 a_position;
uniform vec2 u_resolution;
varying vec2 v_position;
void main() {
    // convert the rectangle points from pixels to 0.0 to 1.0
    vec2 zeroToOne = a_position / u_resolution;

    // convert from 0->1 to 0->2
    vec2 zeroToTwo = zeroToOne * 2.0;

    // convert from 0->2 to -1->+1 (clipspace)
    vec2 clipSpace = zeroToTwo - 1.0;

    gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
    v_position = zeroToOne;
}
`;

export const fragment = `
precision mediump float;
varying vec2 v_position;
uniform float u_time;
uniform vec2 u_resolution;
void main() {
    float r = 0.1+abs(cos(u_time*0.0005))*0.5;
    float z = 20.0+ 10.0*abs(cos(20.0+u_time*0.0001));
    float _angle = sin(u_time*0.0001+2.4);
    vec2 st = v_position; // 0 -> 1
    vec3 c = vec3(0.0);
    st *= u_resolution/u_resolution.y;
    st = mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle)) * st;
    vec2 grid = st*z;
    grid.x += (((floor(grid.y*z)))/100.0)*step(1., mod(grid.y,2.0));
    grid = vec2(0.5)-fract(grid);
    float d = length(grid)*2.0;
    c += 1.-smoothstep(r-0.1,r+0.05,d/2.0);
    gl_FragColor = vec4(c,1.0);
}
`;