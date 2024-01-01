const fragmentShader = `
  #ifdef GL_ES
  precision mediump float;
  #endif

  varying vec3 vPosition;

  void main() {
    vec3 color = normalize(vPosition)*0.5+0.5;
    color.z = color.z*3.0;
    gl_FragColor = vec4(color,1.0);
  }
`

export default fragmentShader
