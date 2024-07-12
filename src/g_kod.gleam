import gleam/float
import gleam/int
import sprinkle.{format}

// operations
pub type Operation {
  FaceMilling(FaceMillingOptions)
}

// operation options
pub type FaceMillingOptions {
  FaceMillingOptions(
    length: Float,
    width: Float,
    initial_height: Float,
    final_height: Float,
    retract_height: Float,
    clearance_height: Float,
    depth_of_cut: Float,
    step_over: Float,
    direction: Direction,
  )
}

pub type Direction {
  X
  Y
}

// tools
pub type Tool {
  Tool(diameter: Float, speed: Int, feed: Int)
}

// entrypoint
pub fn generate_code(operation: Operation, tool: Tool) -> String {
  case operation {
    FaceMilling(options) -> generate_face_milling_code(options, tool)
  }
}

// code types
pub type Position {
  Position(x: Float, y: Float, z: Float)
}

// actual code generation
pub fn generate_face_milling_code(
  options: FaceMillingOptions,
  tool: Tool,
) -> String {
  let code =
    set_defaults()
    |> set_tool(tool)

  case options.direction {
    X -> {
      let home_position = Position(x: 0.0, y: 0.0, z: options.clearance_height)
      go_to_home(code, home_position)
    }
    Y -> {
      let home_position = Position(x: 0.0, y: 0.0, z: options.clearance_height)
      go_to_home(code, home_position)
    }
  }
}

// shared boilerplate
pub fn set_defaults() -> String {
  "
G17 (select xy plane)
G21 (select millimeters)
G40 (cancel cutter radius compensation)
G49 (cancel tool length offset)
G54 (select first work coordinate system)
G90 (absolute positioning)
G94 (enable feed per minute mode)

"
}

pub fn set_tool(code: String, tool: Tool) -> String {
  code
  <> format("(tool - diameter: {diameter} mm", [
    #("diameter", float.to_string(tool.diameter)),
  ])
  <> format(
    "S{speed} M03 (set spindle speed to {speed} and start spindle clockwise)\n",
    [#("speed", int.to_string(tool.speed))],
  )
}

pub fn go_to_home(code: String, home_position: Position) -> String {
  code
  <> "G00 X"
  <> float.to_string(home_position.x)
  <> " Y"
  <> float.to_string(home_position.y)
  <> " Z"
  <> float.to_string(home_position.z)
  <> " (rapid move to safe position)\n"
}
