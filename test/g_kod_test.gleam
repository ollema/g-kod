import g_kod
import gleeunit
import gleeunit/should

pub fn main() {
  gleeunit.main()
}

pub fn face_milling_test() {
  let options =
    g_kod.FaceMillingOptions(
      length: 10.0,
      width: 10.0,
      initial_height: 0.0,
      final_height: -5.0,
      retract_height: 5.0,
      clearance_height: 5.0,
      depth_of_cut: -2.0,
      step_over: 0.5,
      direction: g_kod.X,
    )

  let tool = g_kod.Tool(diameter: 5.0, speed: 10_000, feed: 2000)

  g_kod.generate_code(g_kod.FaceMilling(options), tool)
  |> should.equal(
    "
G17 (select xy plane)
G21 (select millimeters)
G40 (cancel cutter radius compensation)
G49 (cancel tool length offset)
G54 (select first work coordinate system)
G90 (absolute positioning)
G94 (enable feed per minute mode)

(tool - diameter: 5.0 mm, number of teeth: 2)
S10000 M03 (set spindle speed to 10000 and start spindle clockwise)

G00 X0.0 Y0.0 Z5.0 (rapid move to safe position)
",
  )
}
