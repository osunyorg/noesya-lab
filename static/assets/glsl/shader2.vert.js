export const vertex = `
precision mediump float;
attribute vec2 a_position;
uniform vec2 u_resolution;
// uniform float u_time;
varying vec2 v_position;
// varying float v_time;
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

// Gradient Noise by Inigo Quilez - iq/2013
// https://www.shadertoy.com/view/XdXGW8
vec2 random2(vec2 st){
    st = vec2( dot(st,vec2(127.1,311.7)),
              dot(st,vec2(269.5,183.3)) );
    return -1.0 + 2.0*fract(sin(st)*43758.5453123);
}

float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    vec2 u = f*f*(3.0-2.0*f);

    return mix( mix( dot( random2(i + vec2(0.0,0.0) ), f - vec2(0.0,0.0) ),
                     dot( random2(i + vec2(1.0,0.0) ), f - vec2(1.0,0.0) ), u.x),
                mix( dot( random2(i + vec2(0.0,1.0) ), f - vec2(0.0,1.0) ),
                     dot( random2(i + vec2(1.0,1.0) ), f - vec2(1.0,1.0) ), u.x), u.y);
}

float fn(in float x) {
    float t = u_time/3000.0;
    float res = 0.1*noise(vec2(x+t,x)); 
    return res;
}

float plot(vec2 st) {
    float   x1 = st.x - 0.1, y1 = fn(x1),
            x2 = st.x + 0.1, y2 = fn(x2);
    float distance = abs((y2 - y1) * st.x - (x2 - x1) * st.y + x2*y1 - y2*x1 ) / sqrt((y2-y1)*(y2-y1) + (x2-x1)*(x2-x1));
    return (1.0 - clamp(distance / 0.01, 0.0, 1.0));
}

void main() {
    vec2 st = v_position; // 0 -> 1
    vec3 c = vec3(0.0);

    st *=2.0;
    float graphColor = plot(vec2(st.x, st.y-1.0));
    graphColor += plot(vec2(st.x, st.y-1.025));
    graphColor += plot(vec2(st.x+0.1, st.y-1.05));
    graphColor += plot(vec2(st.x, st.y-1.1));
    graphColor += plot(vec2(st.x+0.2, st.y-1.15));
    graphColor += plot(vec2(st.x, st.y-1.23));
    graphColor += plot(vec2(st.x+0.3, st.y-1.36));
    graphColor += plot(vec2(st.x, st.y-1.54));
    graphColor += plot(vec2(st.x+0.4, st.y-1.7));
    graphColor += plot(vec2(st.x, st.y-1.9));

    c += vec3(graphColor);
    gl_FragColor = vec4(c,1.0);
}
`;