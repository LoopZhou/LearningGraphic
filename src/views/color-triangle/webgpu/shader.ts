export const webgpuShader = () => {
  const vertex = `
    @stage(vertex)
    fn main(@location(0) position : vec3<f32>) -> @builtin(position) vec4<f32> {
      return vec4<f32>(position, 1.0);
    }
  `;

  const fragment = `
    @group(0) @binding(0) var<uniform> color : vec4<f32>;

    @stage(fragment)
    fn main() -> @location(0) vec4<f32> {
      return color;
    }
  `;
  return { vertex, fragment };
};
