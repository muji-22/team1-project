export const extendLog = () => {
  const log = console.log
  console.log = function () {
      const stack = new Error().stack.split('\n')[2]
      const matches = stack.match(/\((.+):(\d+):(\d+)\)/)
      const file = matches[1].split('/').pop()
      const line = matches[2]
      log.apply(console, [
          `[${file}:${line}]`.gray,
          ...Array.prototype.slice.call(arguments)
      ])
  }
}