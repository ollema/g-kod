import gleam/float
import gleam/int
import gleam/list
import gleam/option.{type Option, None, Some}
import gleam/string
import sprinkle.{format}

pub type Operation {
  FaceMilling(FaceMillingOptions)
}

pub type FaceMillingOptions {
  FaceMillingOptions(
    x_max: Float,
    y_max: Float,
    z_initial_height: Float,
    z_final_height: Float,
    z_safe_height: Float,
    z_depth_of_cut: Float,
    step_over: Float,
    corner: Corner,
    milling_direction: MillingDirection,
  )
}

pub type Corner {
  BottomRight
  BottomLeft
  TopRight
  TopLeft
}

pub type MillingDirection {
  Right
  Left
  Up
  Down
}

pub type Tool {
  Tool(diameter: Float, speed: Int, feed: Int)
}

pub fn generate_code(operation: Operation, tool: Tool) -> String {
  case operation {
    FaceMilling(options) ->
      string.join(generate_face_milling_code(options, tool), "\n")
  }
}

pub type GCode =
  List(String)

pub type Position {
  Position(x: Float, y: Float, z: Float)
}

pub fn generate_face_milling_code(
  options: FaceMillingOptions,
  tool: Tool,
) -> GCode {
  let home_position = case options.corner {
    BottomLeft -> Position(x: 0.0, y: 0.0, z: options.z_safe_height)
    BottomRight -> Position(x: options.x_max, y: 0.0, z: options.z_safe_height)
    TopRight ->
      Position(x: options.x_max, y: options.y_max, z: options.z_safe_height)
    TopLeft -> Position(x: 0.0, y: options.y_max, z: options.z_safe_height)
  }

  let code = set_defaults()
  let code = set_tool(code, tool)
  let #(code, position) = go_to_home(code, home_position)
  let #(code, position) =
    linear_move(
      code,
      position,
      Position(..position, z: 0.0),
      Some(tool.feed),
      Some("move to start point"),
    )
  let code = list.append(code, [""])
  let #(code, _) = do_face_milling(code, position, options, tool)
  code
}

pub fn do_face_milling(
  code: GCode,
  position: Position,
  options: FaceMillingOptions,
  tool: Tool,
) -> #(GCode, Position) {
  case position.z >. options.z_final_height {
    False -> #(code, position)
    True -> {
      // lower tool to new height
      let new_z =
        float.max(position.z +. options.z_depth_of_cut, options.z_final_height)
      let #(code, position) =
        linear_move(
          code,
          position,
          Position(..position, z: new_z),
          None,
          Some(
            format("start face milling pass at {Z} mm", [
              #("Z", float.to_string(new_z)),
            ]),
          ),
        )

      // do a machining pass at this new height
      let #(code, position) =
        do_face_milling_pass(code, position, options, tool)

      // recursive call to go deeper if needed while reversing direction
      case options.milling_direction {
        Right ->
          do_face_milling(
            code,
            position,
            FaceMillingOptions(..options, milling_direction: Left),
            tool,
          )
        Left ->
          do_face_milling(
            code,
            position,
            FaceMillingOptions(..options, milling_direction: Right),
            tool,
          )
        Up ->
          do_face_milling(
            code,
            position,
            FaceMillingOptions(..options, milling_direction: Down),
            tool,
          )
        Down ->
          do_face_milling(
            code,
            position,
            FaceMillingOptions(..options, milling_direction: Up),
            tool,
          )
      }
    }
  }
}

pub fn do_face_milling_pass(
  code: GCode,
  position: Position,
  options: FaceMillingOptions,
  tool: Tool,
) {
  let new_position = next_sidewise_position(code, position, options)
  let #(code, position) = linear_move(code, position, new_position, None, None)
  let new_position = next_forward_position(code, position, options, tool)

  case position.x == new_position.x, position.y == new_position.y {
    True, True -> {
      let code = list.append(code, [""])
      #(code, position)
    }
    _, _ -> {
      let #(code, position) =
        linear_move(code, position, new_position, None, None)
      do_face_milling_pass(code, position, options, tool)
    }
  }
}

pub fn next_sidewise_position(
  _code: GCode,
  position: Position,
  options: FaceMillingOptions,
) -> Position {
  case options.milling_direction {
    Right | Left -> {
      Position(
        ..position,
        y: case position.y {
          0.0 -> options.y_max
          _ -> 0.0
        },
      )
    }
    Up | Down -> {
      Position(
        ..position,
        x: case position.x {
          0.0 -> options.x_max
          _ -> 0.0
        },
      )
    }
  }
}

pub fn next_forward_position(
  _code: GCode,
  position: Position,
  options: FaceMillingOptions,
  tool: Tool,
) -> Position {
  case options.milling_direction {
    Right ->
      Position(
        ..position,
        x: float.min(
          position.x +. options.step_over *. tool.diameter,
          options.x_max,
        ),
      )
    Left ->
      Position(
        ..position,
        x: float.max(position.x -. options.step_over *. tool.diameter, 0.0),
      )
    Up ->
      Position(
        ..position,
        y: float.min(
          position.y +. options.step_over *. tool.diameter,
          options.y_max,
        ),
      )
    Down ->
      Position(
        ..position,
        y: float.max(position.y -. options.step_over *. tool.diameter, 0.0),
      )
  }
}

pub fn set_defaults() -> GCode {
  [
    "G17 (select xy plane)", "G21 (select millimeters)",
    "G40 (cancel cutter radius compensation)", "G49 (cancel tool length offset)",
    "G54 (select first work coordinate system)",
    "G90 (enable absolute positioning mode)",
    "G94 (enable feed per minute mode)\n",
  ]
}

pub fn set_tool(code: GCode, tool: Tool) -> GCode {
  list.append(code, [
    format("(tool - diameter: {diameter} mm)", [
      #("diameter", float.to_string(tool.diameter)),
    ]),
    format(
      "S{speed} M03 (set spindle speed to {speed} and start spindle clockwise)\n",
      [#("speed", int.to_string(tool.speed))],
    ),
  ])
}

pub fn go_to_home(code: GCode, home_position: Position) -> #(GCode, Position) {
  #(
    list.append(code, [
      format("G00 X{X} Y{Y} Z{Z} (rapid move to safe position)\n", [
        #("X", float.to_string(home_position.x)),
        #("Y", float.to_string(home_position.y)),
        #("Z", float.to_string(home_position.z)),
      ]),
    ]),
    home_position,
  )
}

pub fn linear_move(
  code: GCode,
  old_position: Position,
  new_position: Position,
  feed: Option(Int),
  comment: Option(String),
) -> #(GCode, Position) {
  let command = "G01"
  let command = case old_position.x == new_position.x {
    False -> command <> " X" <> float.to_string(new_position.x)

    True -> command
  }
  let command = case old_position.y == new_position.y {
    False -> command <> " Y" <> float.to_string(new_position.y)

    True -> command
  }
  let command = case old_position.z == new_position.z {
    False -> command <> " Z" <> float.to_string(new_position.z)

    True -> command
  }
  let command = case feed {
    Some(feed) -> command <> " F" <> int.to_string(feed)
    None -> command
  }
  let command = case comment {
    Some(comment) -> command <> " (" <> comment <> ")"
    None -> command
  }
  #(list.append(code, [command]), new_position)
}
