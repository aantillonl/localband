class Bottleneck {
  constructor(opts) {
    this.opts = opts;
  }

  wrap(f) {
    return f;
  }
}

module.exports = Bottleneck;
