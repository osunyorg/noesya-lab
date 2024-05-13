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
    vec2 st = v_position; // 0 -> 1
    float z = 60.0;
    float _angle = 2.3;
    float n = 0.3;



    st *= u_resolution/u_resolution.y;
    float df = 0.00001*u_time;
    st.x += df*2.0;
    st.y -= df*3.0;
    st = mat2(cos(df+_angle),-sin(df+_angle),
    sin(df+_angle),cos(df+_angle)) * st;
    
    vec2 grid = st*z;
    vec2 f = floor(grid);
    grid.x += 0.1*random2(vec2(f.y)).x;
    grid.y += 0.1*random2(vec2(f.x)).y;
    grid = fract(grid);
    vec3 c = vec3(0.0);
    c+= vec3(grid.x, grid.y,grid.y);
    grid = vec2(0.5)-grid;
    float r = 0.5;
    vec2 rand = random2(random2(vec2(f.y)) * random2(vec2(f.x)));
    float yn = step(1.-n/2., rand.x);
    float d = length(grid)*3.0;
    r = (r*(rand.y))*yn;
    c *= 1.-smoothstep(r-0.3,r,d/2.0);
    
    gl_FragColor = vec4(vec3(0.7), c*0.02);
}
`;