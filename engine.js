/*
Conventions:

Coordinates are counted from bottom-left corner. Vertical coordinate comes first.
*/

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

class Tile{
	constructor(owner, piece) {
		this.owner = owner
		this.piece = piece
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

function print_board(board, board_width, board_height) {
	for (let i = 0; i < board_height; ++i) {
		for (let j = 0; j < board_width; ++j) {
			process.stdout.write(board[board_height - i - 1][j].toString())
		}
		console.log()
	}
}

board = make_board(DEFAULT_BOARD_WIDTH, DEFAULT_BOARD_HEIGHT)
print_board(board, DEFAULT_BOARD_WIDTH, DEFAULT_BOARD_HEIGHT)
