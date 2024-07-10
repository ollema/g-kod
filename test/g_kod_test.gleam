import g_kod
import gleeunit
import gleeunit/should

pub fn main() {
  gleeunit.main()
}

pub fn format_pair_test() {
  g_kod.greet()
  |> should.equal("hello world")
}
