import { Effect, EffectAttribute } from "postprocessing";
import { Color, Uniform } from "three";

const fragmentShader = /* glsl */ `
uniform float pixelSize;
uniform float contrast;
uniform float bias;
uniform float edgeStrength;
uniform float depthStrength;
uniform float detailMix;
uniform vec3 blueColor;

float bayerThreshold(vec2 blockCoord) {
  int x = int(mod(blockCoord.x, 4.0));
  int y = int(mod(blockCoord.y, 4.0));
  int index = x + y * 4;

  if (index == 0) return 0.0625;
  if (index == 1) return 0.5625;
  if (index == 2) return 0.1875;
  if (index == 3) return 0.6875;
  if (index == 4) return 0.8125;
  if (index == 5) return 0.3125;
  if (index == 6) return 0.9375;
  if (index == 7) return 0.4375;
  if (index == 8) return 0.25;
  if (index == 9) return 0.75;
  if (index == 10) return 0.125;
  if (index == 11) return 0.625;
  if (index == 12) return 1.0;
  if (index == 13) return 0.5;
  if (index == 14) return 0.875;
  return 0.375;
}

void mainUv(inout vec2 uv) {
  vec2 coord = uv * resolution;
  coord = floor(coord / pixelSize) * pixelSize + pixelSize * 0.5;
  uv = coord / resolution;
}

void mainImage(const in vec4 inputColor, const in vec2 uv, const in float depth, out vec4 outputColor) {
  float luma = dot(inputColor.rgb, vec3(0.299, 0.587, 0.114));
  float lumaTone = clamp((1.0 - luma - bias) * contrast, 0.0, 1.0);

  // Edge response — spikes at lip lines, teeth, and morph-driven silhouette changes.
  vec2 lumaGrad = vec2(dFdx(luma), dFdy(luma));
  float lumaEdge = length(lumaGrad) * edgeStrength;

  // Depth response — mouth opening creates depth discontinuities at the cavity.
  vec2 depthGrad = vec2(dFdx(depth), dFdy(depth));
  float depthEdge = length(depthGrad) * depthStrength;

  float shapeTone = clamp(lumaTone, 0.0, 1.0);
  float motionTone = clamp(lumaEdge + depthEdge, 0.0, 1.0);
  float tone = clamp(mix(shapeTone, max(shapeTone, motionTone), detailMix), 0.0, 1.0);

  vec2 blockCoord = floor((uv * resolution) / pixelSize);
  float threshold = bayerThreshold(blockCoord);

  vec3 white = vec3(1.0);
  outputColor = vec4(tone > threshold ? blueColor : white, 1.0);
}
`;

export class BlueDitherEffectImpl extends Effect {
  constructor({
    pixelSize = 12,
    contrast = 1.35,
    bias = 0.08,
    edgeStrength = 18,
    depthStrength = 120,
    detailMix = 0.85,
    blueColor = "#0000ff",
  } = {}) {
    super("BlueDitherEffect", fragmentShader, {
      attributes: EffectAttribute.DEPTH,
      uniforms: new Map([
        ["pixelSize", new Uniform(pixelSize)],
        ["contrast", new Uniform(contrast)],
        ["bias", new Uniform(bias)],
        ["edgeStrength", new Uniform(edgeStrength)],
        ["depthStrength", new Uniform(depthStrength)],
        ["detailMix", new Uniform(detailMix)],
        ["blueColor", new Uniform(new Color(blueColor))],
      ]),
    });
  }

  updateSettings({
    pixelSize,
    contrast,
    bias,
    edgeStrength,
    depthStrength,
    detailMix,
    blueColor,
  }) {
    this.uniforms.get("pixelSize").value = pixelSize;
    this.uniforms.get("contrast").value = contrast;
    this.uniforms.get("bias").value = bias;
    this.uniforms.get("edgeStrength").value = edgeStrength;
    this.uniforms.get("depthStrength").value = depthStrength;
    this.uniforms.get("detailMix").value = detailMix;
    this.uniforms.get("blueColor").value.set(blueColor);
  }
}
