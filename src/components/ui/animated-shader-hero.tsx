import React, { useRef, useEffect } from 'react';

/* ── Default GLSL shader (nebula/cloud animation) ── */
const defaultShaderSource = `#version 300 es
precision highp float;
out vec4 O;
uniform vec2 resolution;
uniform float time;
#define FC gl_FragCoord.xy
#define T time
#define R resolution
#define MN min(R.x,R.y)

float rnd(vec2 p) {
  p=fract(p*vec2(12.9898,78.233));
  p+=dot(p,p+34.56);
  return fract(p.x*p.y);
}
float noise(in vec2 p) {
  vec2 i=floor(p), f=fract(p), u=f*f*(3.-2.*f);
  float a=rnd(i), b=rnd(i+vec2(1,0)), c=rnd(i+vec2(0,1)), d=rnd(i+1.);
  return mix(mix(a,b,u.x),mix(c,d,u.x),u.y);
}
float fbm(vec2 p) {
  float t=.0, a=1.; mat2 m=mat2(1.,-.5,.2,1.2);
  for (int i=0; i<5; i++) { t+=a*noise(p); p*=2.*m; a*=.5; }
  return t;
}
float clouds(vec2 p) {
  float d=1., t=.0;
  for (float i=.0; i<3.; i++) {
    float a=d*fbm(i*10.+p.x*.2+.2*(1.+i)*p.y+d+i*i+p);
    t=mix(t,d,a); d=a; p*=2./(i+1.);
  }
  return t;
}
void main(void) {
  vec2 uv=(FC-.5*R)/MN, st=uv*vec2(2,1);
  vec3 col=vec3(0);
  float bg=clouds(vec2(st.x+T*.5,-st.y));
  uv*=1.-.3*(sin(T*.2)*.5+.5);
  for (float i=1.; i<12.; i++) {
    uv+=.1*cos(i*vec2(.1+.01*i,.8)+i*i+T*.5+.1*uv.x);
    vec2 p=uv;
    float d=length(p);
    col+=.00125/d*(cos(sin(i)*vec3(1,2,3))+1.);
    float b=noise(i+p+bg*1.731);
    col+=.002*b/length(max(p,vec2(b*p.x*.02,p.y)));
    col=mix(col,vec3(bg*.25,bg*.137,bg*.05),d);
  }
  O=vec4(col,1);
}`;

/* ── WebGL2 canvas hook ── */
export function useShaderBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl2');
    if (!gl) return;

    const resize = () => {
      const dpr = Math.max(1, 0.5 * window.devicePixelRatio);
      canvas.width  = window.innerWidth  * dpr;
      canvas.height = window.innerHeight * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    window.addEventListener('resize', resize);
    resize();

    // Compile helpers
    const compile = (type: number, src: string) => {
      const sh = gl.createShader(type)!;
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      return sh;
    };

    const vs = compile(gl.VERTEX_SHADER, `#version 300 es
      in vec4 position;
      void main(){ gl_Position = position; }`);
    const fs = compile(gl.FRAGMENT_SHADER, defaultShaderSource);

    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,1,-1,-1,1,1,1,-1]), gl.STATIC_DRAW);
    const pos = gl.getAttribLocation(prog, 'position');
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(prog, 'time');
    const uRes  = gl.getUniformLocation(prog, 'resolution');

    const loop = (now: number) => {
      gl.uniform1f(uTime, now * 1e-3);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buf);
    };
  }, []);

  return canvasRef;
}

/* ── Standalone canvas component ── */
export function AnimatedShaderCanvas() {
  const canvasRef = useShaderBackground();
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full touch-none" />;
}

/* ── Full Hero wrapper ── */
interface HeroProps {
  headline: { line1: string; line2: string };
  subtitle: string;
  buttons?: {
    primary?:   { text: string; onClick?: () => void };
    secondary?: { text: string; onClick?: () => void };
  };
  className?: string;
}

const Hero: React.FC<HeroProps> = ({ headline, subtitle, buttons, className = '' }) => {
  const canvasRef = useShaderBackground();
  return (
    <div className={`relative w-full h-screen overflow-hidden bg-black ${className}`}>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full touch-none" />
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-white px-4 text-center space-y-6">
        <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-orange-300 via-yellow-400 to-amber-300 bg-clip-text text-transparent">
          {headline.line1}
        </h1>
        <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-yellow-300 via-orange-400 to-red-400 bg-clip-text text-transparent">
          {headline.line2}
        </h1>
        <p className="text-lg md:text-xl text-orange-100/90 max-w-2xl">{subtitle}</p>
        {buttons && (
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            {buttons.primary && (
              <button onClick={buttons.primary.onClick} className="px-8 py-4 bg-gradient-to-r from-orange-500 to-yellow-500 text-black rounded-full font-semibold hover:scale-105 transition-transform duration-300 cursor-pointer">
                {buttons.primary.text}
              </button>
            )}
            {buttons.secondary && (
              <button onClick={buttons.secondary.onClick} className="px-8 py-4 bg-orange-500/10 border border-orange-300/30 text-orange-100 rounded-full font-semibold hover:scale-105 transition-transform duration-300 cursor-pointer backdrop-blur-sm">
                {buttons.secondary.text}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Hero;
