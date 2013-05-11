var board = new Pattern("board", true);
var output = d3.select("#output");

board.set_callback(function(tiles) {
    var board_string = '[\n' + tiles.map(function(row) {
        return '    [' + row.join(',') + ']';
    }).join(',\n') + '\n]';
    output.text(board_string);
});

