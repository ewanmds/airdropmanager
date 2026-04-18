import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface FlowingWavesProps {
  color?: 'neutral' | 'blue' | 'green';
  disableCenterDimming?: boolean;
  className?: string;
}

export default function FlowingWavesShader({
  color = 'neutral',
  disableCenterDimming = true,
  className = '',
}: FlowingWavesProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const clock = new THREE.Clock();

    const vertexShader = `
      varying vec2 vTextureCoord;
      void main() {
        vTextureCoord = uv;
        gl_Position = vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      precision mediump float;
      uniform vec2 iResolution;
      uniform float iTime;
      uniform bool hasActiveReminders;
      uniform bool hasUpcomingReminders;
      uniform bool disableCenterDimming;
      varying vec2 vTextureCoord;

      void mainImage(out vec4 fragColor, in vec2 fragCoord) {
        vec2 uv = (2.0 * fragCoord - iResolution.xy) / min(iResolution.x, iResolution.y);

        vec2 center = iResolution.xy * 0.5;
        float dist = distance(fragCoord, center);
        float radius = min(iResolution.x, iResolution.y) * 0.5;
        float centerDim = disableCenterDimming ? 1.0 : smoothstep(radius * 0.3, radius * 0.5, dist);

        for(float i = 1.0; i < 10.0; i++){
          uv.x += 0.6 / i * cos(i * 2.5 * uv.y + iTime);
          uv.y += 0.6 / i * cos(i * 1.5 * uv.x + iTime);
        }

        if (hasActiveReminders) {
          fragColor = vec4(vec3(0.1, 0.3, 0.6) / abs(sin(iTime - uv.y - uv.x)), 1.0);
        } else if (hasUpcomingReminders) {
          fragColor = vec4(vec3(0.1, 0.5, 0.2) / abs(sin(iTime - uv.y - uv.x)), 1.0);
        } else {
          fragColor = vec4(vec3(0.1) / abs(sin(iTime - uv.y - uv.x)), 1.0);
        }

        if (!disableCenterDimming) {
          fragColor.rgb = mix(fragColor.rgb * 0.3, fragColor.rgb, centerDim);
        }
      }

      void main() {
        vec4 color;
        mainImage(color, vTextureCoord * iResolution);
        gl_FragColor = color;
      }
    `;

    const uniforms = {
      iTime:                { value: 0 },
      iResolution:          { value: new THREE.Vector2() },
      hasActiveReminders:   { value: color === 'blue' },
      hasUpcomingReminders: { value: color === 'green' },
      disableCenterDimming: { value: disableCenterDimming },
    };

    const material = new THREE.ShaderMaterial({ vertexShader, fragmentShader, uniforms });
    const geometry = new THREE.PlaneGeometry(2, 2);
    scene.add(new THREE.Mesh(geometry, material));

    const onResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      renderer.setSize(w, h);
      uniforms.iResolution.value.set(w, h);
    };
    window.addEventListener('resize', onResize);
    onResize();

    renderer.setAnimationLoop(() => {
      uniforms.iTime.value = clock.getElapsedTime();
      renderer.render(scene, camera);
    });

    return () => {
      window.removeEventListener('resize', onResize);
      renderer.setAnimationLoop(null);
      renderer.domElement.parentNode?.removeChild(renderer.domElement);
      material.dispose();
      geometry.dispose();
      renderer.dispose();
    };
  }, [color, disableCenterDimming]);

  return <div ref={containerRef} className={`w-full h-full ${className}`} aria-hidden="true" />;
}
