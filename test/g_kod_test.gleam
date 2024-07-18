import birdie
import g_kod
import gleeunit

pub fn main() {
  gleeunit.main()
}

pub fn face_milling_test() {
  let options =
    g_kod.FaceMillingOptions(
      x_max: 10.0,
      y_max: 10.0,
      z_initial_height: 0.0,
      z_final_height: -5.0,
      z_safe_height: 5.0,
      z_depth_of_cut: -2.0,
      step_over: 0.5,
      corner: g_kod.BottomLeft,
      milling_direction: g_kod.Right,
    )

  let tool = g_kod.Tool(diameter: 5.0, speed: 10_000, feed: 2000)

  g_kod.generate_code(g_kod.FaceMilling(options), tool)
  |> birdie.snap(title: "bottom left -> right")

  let options = g_kod.FaceMillingOptions(..options, milling_direction: g_kod.Up)
  let tool = g_kod.Tool(..tool, diameter: 10.0)
  g_kod.generate_code(g_kod.FaceMilling(options), tool)
  |> birdie.snap(title: "bottom left -> up")

  let options =
    g_kod.FaceMillingOptions(
      ..options,
      step_over: 0.8,
      corner: g_kod.BottomRight,
      milling_direction: g_kod.Left,
    )
  let tool = g_kod.Tool(..tool, speed: 5000)
  g_kod.generate_code(g_kod.FaceMilling(options), tool)
  |> birdie.snap(title: "bottom right -> left")

  let options = g_kod.FaceMillingOptions(..options, milling_direction: g_kod.Up)
  let tool = g_kod.Tool(..tool, feed: 3000)
  g_kod.generate_code(g_kod.FaceMilling(options), tool)
  |> birdie.snap(title: "bottom right -> up")
}
