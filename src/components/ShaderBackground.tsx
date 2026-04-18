import { Warp } from "@paper-design/shaders-react"
import { GlassDistortionFilter } from "./ui/liquid-glass"

export function ShaderBackground() {
  return (
    <>
      <GlassDistortionFilter />
      <div className="fixed inset-0 -z-10">
        <Warp
          style={{ width: "100%", height: "100%" }}
          proportion={0.45}
          softness={1}
          distortion={0.25}
          swirl={0.8}
          swirlIterations={10}
          shape="checks"
          shapeScale={0.1}
          scale={1}
          rotation={0}
          speed={0.4}
          colors={["hsl(200, 100%, 20%)", "hsl(160, 100%, 75%)", "hsl(180, 90%, 30%)", "hsl(170, 100%, 80%)"]}
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>
    </>
  )
}
