var NumberWidget = function(container, init, min, max) {
    container.attr('class', 'number-widget')
    var callback = function() {};
    this.set_callback = function(cb) { callback = cb; };
    min = (min === undefined)? 1 : min;
    max = (max === undefined)? 16 : max;
    var bound = function(to_bound) { return Math.min(Math.max(to_bound, min), max); };
    var dec = container.append('button').text('-');
    var val = container.append('span').text((init === undefined)? 2 : init);
    var inc = container.append('button').text('+');

    var set = function(to) {
        val.text(to);
        callback(to);
    };

    var change = function(amount) {
        var new_val = bound(parseInt(val.text()) + amount);
        set(new_val);
    };

    dec.on('click', function() { change(-1); });
    inc.on('click', function() { change(+1); });

    return this;
};


var GridWidget = function(container, istates, ixtiles, iytiles) {
    var tile_size = 24,
        tile_gutter = 3;
    this.istates = (istates === undefined)? 2 : istates;
    var callback =  function() {};
    this.set_callback = function(cb) { callback = cb };
    ixtiles = (ixtiles === undefined)? 3 : ixtiles;
    iytiles = (iytiles === undefined)? 3 : iytiles;
    var _tiles = [[0]];

    this.states = function(number) {
        if (number !== undefined) {
            this.istates = number;
        } else {
            return this.istates;
        }
    };

    this.xtiles = function(number) {
        var current_x = _tiles[0].length;
        if (number !== undefined) {
            if (number < current_x) {
                for (var y = 0; y < this.ytiles(); y++) {
                    _tiles[y].splice(number);
                }
            } else if (number > current_x) {
                for (var y = 0; y < this.ytiles(); y++) {
                    for (var x = current_x; x < number; x++) {
                        _tiles[y][x] = 0;
                    }
                }
            }
            callback(_tiles);
        } else {
            return current_x
        }
    };

    this.ytiles = function(number) {
        var current_y = _tiles.length;
        if (number !== undefined) {
            if (number < current_y) {
                _tiles.splice(number);
            } else if (number > current_y) {
                for (var y = current_y; y < number; y++) {
                    _tiles[y] = [];
                    for (var x = 0; x < this.xtiles(); x++) {
                        _tiles[y][x] = 0;
                    }
                }
            }
            callback(_tiles);
        } else {
            return current_y;
        }
    };

    this.tiles = function(new_tiles) {
        if (new_tiles !== undefined) {
            _tiles = new_tiles;
        } else {
            return _tiles;
        }
    }

    this.ytiles(iytiles);
    this.xtiles(ixtiles);

    var draw = (function() {
        var space = container.append('svg');
        var rows = space.selectAll('g')
            .data(_tiles);

        var hw = function(n) { return tile_size * n + tile_gutter * (n - 1); };

        var go = function() {
            space
                .attr('width', hw(this.xtiles()))
                .attr('height', hw(this.ytiles()));

            rows.data(_tiles)
                    .enter().append('g')
                .selectAll('rect').data(function(d) { return d; })
                    .enter().append('rect')
                        .attr('x', function(d, i) {
                            return i * (tile_size + tile_gutter); })
                        .attr('y', function(d, i, j) {
                            return j* (tile_size + tile_gutter); })
                        .attr('width', tile_size)
                        .attr('height', tile_size)
                        .attr('class', function(d) {
                            return "state-" + d; })
                        .on('click', (function() {
                            var $this = this;
                            return function(d, col, row) {
                                var new_val = (d + 1) % $this.states();
                                _tiles[row][col] = new_val;
                                $this.update();
                            };
                        }).call(this) );
        };

        return go;
    }).call(this);

    this.update = function() {
        draw.call(this);
        var board_string = '[\n' + _tiles.map(function(row) {
            return '    [' + row.join(',') + ']';
        }).join(',\n') + '\n]';
        console.log(board_string);
    };
    this.update();
    return this;
};


var Pattern = function(thing_id) {

    this.container = d3.select("#" + thing_id);

    var num_states = new NumberWidget(this.container.append('div'), 2, 2, 4);
    var xwidget = new NumberWidget(this.container.append('div'), 3);
    var ywidget = new NumberWidget(this.container.append('div'), 3);

    var g = new GridWidget(this.container.append('div'));
    num_states.set_callback(function(n) { g.states(n); });
    xwidget.set_callback(function(n) { g.xtiles(n); g.update(); });
    ywidget.set_callback(function(n) { g.ytiles(n); g.update(); });

    return this;
};

var board = new Pattern("board");

