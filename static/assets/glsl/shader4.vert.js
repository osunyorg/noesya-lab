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

vec2 random2(vec2 st){
    st = vec2( dot(st,vec2(127.1,311.7)),
              dot(st,vec2(269.5,183.3)) );
    return -1.0 + 2.0*fract(sin(st)*43758.5453123);
}

void main() {
    float density = 0.005*abs(cos(u_time*0.0005)); // 0.0 -> 1.0
    vec2 st = v_position; // 0 -> 1
    st *= u_resolution/u_resolution.y;
    vec2 grid = fract(random2(st))*(1.0+(1.0-log(1.0+20000.0*density)/10.0)*50.0);
    float r = 0.4;
    float d = length(grid);
    vec3 c = vec3(1.-smoothstep(r,r+0.07,d/2.0));
    gl_FragColor = vec4(c,1.0);
}
`;


