/*
Conventions:

Coordinates are counted from bottom-left corner. Vertical coordinate comes first.

In string representation upper-case letters mean white pieces, lower-case ones mean black pieces.
*/

var assert = require('assert')

PIECE_NONE   = 0
PIECE_PAWN   = 1
PIECE_ROOK   = 2
PIECE_KNIGHT = 3
PIECE_BISHOP = 4
PIECE_QUEEN  = 5
PIECE_KING   = 6

PLAYER_WHITE = 0
PLAYER_BLACK = 1
PLAYER_NONE  = 2

DEFAULT_BOARD_WIDTH  = 8
DEFAULT_BOARD_HEIGHT = 8

class Tile {
	constructor(owner, piece) {
		this.owner = owner
		this.piece = piece
	}

	static fromString(str) {
		/**
		@brief create a Tile object from a compact string representation

		Pieces are denoted with letters P/R/N/B/Q/K with upper-case letters corresponding to white pieces
		and lower-cases ones corresponding to black pieces.
		A dot (.) means an empty tile

		@return a Tile object
		*/
		switch(str) {
		case 'P': return Tile(PLAYER_WHITE, PIECE_PAWN)
		case 'R': return Tile(PLAYER_WHITE, PIECE_ROOK)
		case 'N': return Tile(PLAYER_WHITE, PIECE_KNIGHT)
		case 'B': return Tile(PLAYER_WHITE, PIECE_BISHOP)
		case 'Q': return Tile(PLAYER_WHITE, PIECE_QUEEN)
		case 'K': return Tile(PLAYER_WHITE, PIECE_KING)
		case 'p': return Tile(PLAYER_BLACK, PIECE_PAWN)
		case 'r': return Tile(PLAYER_BLACK, PIECE_ROOK)
		case 'n': return Tile(PLAYER_BLACK, PIECE_KNIGHT)
		case 'b': return Tile(PLAYER_BLACK, PIECE_BISHOP)
		case 'q': return Tile(PLAYER_BLACK, PIECE_QUEEN)
		case 'k': return Tile(PLAYER_BLACK, PIECE_KING)
		case '.': return Tile(PLAYER_NONE, PIECE_NONE)
		default: throw Error('Cannot create Tile from string: ' + str)
		}
	}
}

Tile.prototype.toString = function tile_to_string() {
	if (this.owner == PLAYER_NONE) {
		return ' '
	}
	else if (this.owner == PLAYER_WHITE) {
		switch(this.piece) {
		case PIECE_PAWN:   return '♙'
		case PIECE_ROOK:   return '♖'
		case PIECE_KNIGHT: return '♘'
		case PIECE_BISHOP: return '♗'
		case PIECE_QUEEN:  return '♕'
		case PIECE_KING:   return '♔'
		}
	}
	else if (this.owner == PLAYER_BLACK) {
		switch(this.piece) {
		case PIECE_PAWN:   return '♟'
		case PIECE_ROOK:   return '♜'
		case PIECE_KNIGHT: return '♞'
		case PIECE_BISHOP: return '♝'
		case PIECE_QUEEN:  return '♛'
		case PIECE_KING:   return '♚'
		}
	}
	console.log('[ERROR] Tile stringification: owner is ' + this.owner + ', piece is ' + this.piece)
	return '?'
}

class Board {
	constructor(board_width, board_height) {
		this.tiles = make_board()
		this.width = board_width
		this.height = board_height
	}

	static fromString(str, board_width = DEFAULT_BOARD_WIDTH, board_height = DEFAULT_BOARD_HEIGHT) {
		/**
		@brief create a Board object from a compact string representation

		The tile from the top-left corner comes first. The next one is the tile to the right etc.

		@param str String containing the representation with one character per tile. Whitespace is ignored

		@return a Board object

		@see Tile.fromString
		*/

		// ignore whitespace
		str = str.replace(/\s/g, '');

		board = new Board(board_width, board_height)
		for (let i = 0; i < str; ++i) {
			rank_from_top = Math.floor(i % board_width)
			rank = board_height - rank_from_top - 1
			file = i % board_height
			board.tiles[rank][file] = Tile.fromString(str.charAt(i))
		}

		return board
	}
}

Board.prototype.toString = function() {
	res = ''
	for (let i = 0; i < this.height; ++i) {
		for (let j = 0; j < this.width; ++j) {
			res += this.tiles[this.height - i - 1][j].toString()
		}
		res += '\n'
	}
	return res
}

function test_board_from_string_default_board() {
	input_str = 'rnbqkbnr \
	             pppppppp \
	             ........ \
	             ........ \
	             ........ \
	             ........ \
	             PPPPPPPP \
	             RNBQKBNR'
	board = Board.fromString(input_str)

	assert.deepEqual(board.tiles[0][0], new Tile(PLAYER_WHITE, PIECE_ROOK))
	assert.deepEqual(board.tiles[0][1], new Tile(PLAYER_WHITE, PIECE_KNIGHT))
	assert.deepEqual(board.tiles[0][2], new Tile(PLAYER_WHITE, PIECE_BISHOP))
	assert.deepEqual(board.tiles[0][3], new Tile(PLAYER_WHITE, PIECE_QUEEN))
	assert.deepEqual(board.tiles[0][4], new Tile(PLAYER_WHITE, PIECE_KING))
	assert.deepEqual(board.tiles[0][5], new Tile(PLAYER_WHITE, PIECE_BISHOP))
	assert.deepEqual(board.tiles[0][6], new Tile(PLAYER_WHITE, PIECE_KNIGHT))
	assert.deepEqual(board.tiles[0][7], new Tile(PLAYER_WHITE, PIECE_ROOK))
	assert.deepEqual(board.tiles[7][0], new Tile(PLAYER_BLACK, PIECE_ROOK))
	assert.deepEqual(board.tiles[7][1], new Tile(PLAYER_BLACK, PIECE_KNIGHT))
	assert.deepEqual(board.tiles[7][2], new Tile(PLAYER_BLACK, PIECE_BISHOP))
	assert.deepEqual(board.tiles[7][3], new Tile(PLAYER_BLACK, PIECE_QUEEN))
	assert.deepEqual(board.tiles[7][4], new Tile(PLAYER_BLACK, PIECE_KING))
	assert.deepEqual(board.tiles[7][5], new Tile(PLAYER_BLACK, PIECE_BISHOP))
	assert.deepEqual(board.tiles[7][6], new Tile(PLAYER_BLACK, PIECE_KNIGHT))
	assert.deepEqual(board.tiles[7][7], new Tile(PLAYER_BLACK, PIECE_ROOK))

	for (let j = 0; j < 8; ++j) {
		assert.deepEqual(board.tiles[1][j], new Tile(PLAYER_WHITE, PIECE_PAWN))
		assert.deepEqual(board.tiles[6][j], new Tile(PLAYER_BLACK, PIECE_PAWN))
		for (let i = 2; i < 6; ++i) {
			assert.deepEqual(board.tiles[i][j], new Tile(PLAYER_NONE, PIECE_NONE))
		}
	}
}

class PlayerInfo {
	constructor() {
		this.short_castling_available = true
		this.long_castling_available = true
	}
}

class Game {
	constructor() {
		this.board = Board()
		this.white_player_info = PlayerInfo()
		this.black_player_info = PlayerInfo()
	}
}

function make_empty_board(board_width, board_height) {
	res = []
	for (let i = 0; i < board_width; ++i) {
		empty_file = []
		for (let j = 0; j < board_height; ++j) {
			empty_file.push(new Tile(PLAYER_NONE, PIECE_NONE))
		}
		res.push(empty_file)
	}
	return res
}

function make_board() {
	res = make_empty_board(DEFAULT_BOARD_WIDTH, DEFAULT_BOARD_HEIGHT)
	res[0][0] = new Tile(PLAYER_WHITE, PIECE_ROOK)
	res[0][1] = new Tile(PLAYER_WHITE, PIECE_KNIGHT)
	res[0][2] = new Tile(PLAYER_WHITE, PIECE_BISHOP)
	res[0][3] = new Tile(PLAYER_WHITE, PIECE_QUEEN)
	res[0][4] = new Tile(PLAYER_WHITE, PIECE_KING)
	res[0][5] = new Tile(PLAYER_WHITE, PIECE_BISHOP)
	res[0][6] = new Tile(PLAYER_WHITE, PIECE_KNIGHT)
	res[0][7] = new Tile(PLAYER_WHITE, PIECE_ROOK)
	res[7][0] = new Tile(PLAYER_BLACK, PIECE_ROOK)
	res[7][1] = new Tile(PLAYER_BLACK, PIECE_KNIGHT)
	res[7][2] = new Tile(PLAYER_BLACK, PIECE_BISHOP)
	res[7][3] = new Tile(PLAYER_BLACK, PIECE_QUEEN)
	res[7][4] = new Tile(PLAYER_BLACK, PIECE_KING)
	res[7][5] = new Tile(PLAYER_BLACK, PIECE_BISHOP)
	res[7][6] = new Tile(PLAYER_BLACK, PIECE_KNIGHT)
	res[7][7] = new Tile(PLAYER_BLACK, PIECE_ROOK)
	for (let i = 0; i < DEFAULT_BOARD_WIDTH; ++i) {
		res[1][i] = new Tile(PLAYER_WHITE, PIECE_PAWN)
		res[6][i] = new Tile(PLAYER_BLACK, PIECE_PAWN)
	}
	return res
}

function run_all_tests() {
	test_board_from_string_default_board()
}

board = new Board(DEFAULT_BOARD_WIDTH, DEFAULT_BOARD_HEIGHT)
console.log(board.toString())
run_all_tests()
