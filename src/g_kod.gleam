import gleam/float
import gleam/int
import gleam/option.{type Option, None, Some}

// constants
const select_xy_plane = "G17 (select xy plane)\n"

const select_millimeters = "G21 (select millimeters)\n"

const cancel_cutter_radius_compensation = "G40 (cancel cutter radius compensation)\n"

const cancel_tool_length_offset = "G49 (cancel tool length offset)\n"

const select_first_work_coordinate_system = "G54 (select first work coordinate system)\n"

const absolute_positioning = "G90 (absolute positioning)\n"

const enable_feed_per_minute_mode = "G94 (enable feed per minute mode)\n"

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
  Tool(diameter: Float, speed: Int, feed: Int, n_teeth: Option(Int))
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
  "\n"
  <> select_xy_plane
  <> select_millimeters
  <> cancel_cutter_radius_compensation
  <> cancel_tool_length_offset
  <> select_first_work_coordinate_system
  <> absolute_positioning
  <> enable_feed_per_minute_mode
  <> "\n"
}

pub fn set_tool(code: String, tool: Tool) -> String {
  code
  <> "(tool - diameter: "
  <> float.to_string(tool.diameter)
  <> " mm"
  <> case tool.n_teeth {
    Some(n_teeth) -> ", number of teeth: " <> int.to_string(n_teeth) <> ")\n"
    None -> ")\n"
  }
  <> "S"
  <> int.to_string(tool.speed)
  <> " M03 (set spindle speed to "
  <> int.to_string(tool.speed)
  <> " and start spindle clockwise)\n"
  <> "\n"
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
