const vertexShader = `
  attribute float randomStrength;
  uniform float time;
  varying vec3 vPosition;

  void main() {
    vPosition = position;
    vec3 pos = position.xyz;
    pos += vec3(0, 0, 0.3) * time * randomStrength;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos.xyz, 1.0);
  }
`

export default vertexShader
