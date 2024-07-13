import g_kod
import gleeunit
import gleeunit/should

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
  |> should.equal(
    "G17 (select xy plane)
G21 (select millimeters)
G40 (cancel cutter radius compensation)
G49 (cancel tool length offset)
G54 (select first work coordinate system)
G90 (enable absolute positioning mode)
G94 (enable feed per minute mode)

(tool - diameter: 5.0 mm)
S10000 M03 (set spindle speed to 10000 and start spindle clockwise)

G00 X0.0 Y0.0 Z5.0 (rapid move to safe position)

G01 Z0.0 (move to start point)

G01 Z-2.0 (start face milling pass at -2.0 mm)
G01 Y10.0
G01 X2.5
G01 Y0.0
G01 X5.0
G01 Y10.0
G01 X7.5
G01 Y0.0
G01 X10.0
G01 Y10.0

G01 Z-4.0 (start face milling pass at -4.0 mm)
G01 Y0.0
G01 X7.5
G01 Y10.0
G01 X5.0
G01 Y0.0
G01 X2.5
G01 Y10.0
G01 X0.0
G01 Y0.0

G01 Z-5.0 (start face milling pass at -5.0 mm)
G01 Y10.0
G01 X2.5
G01 Y0.0
G01 X5.0
G01 Y10.0
G01 X7.5
G01 Y0.0
G01 X10.0
G01 Y10.0
",
  )
}
