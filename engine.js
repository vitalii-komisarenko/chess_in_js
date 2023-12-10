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
		case 'P': return new Tile(PLAYER_WHITE, PIECE_PAWN)
		case 'R': return new Tile(PLAYER_WHITE, PIECE_ROOK)
		case 'N': return new Tile(PLAYER_WHITE, PIECE_KNIGHT)
		case 'B': return new Tile(PLAYER_WHITE, PIECE_BISHOP)
		case 'Q': return new Tile(PLAYER_WHITE, PIECE_QUEEN)
		case 'K': return new Tile(PLAYER_WHITE, PIECE_KING)
		case 'p': return new Tile(PLAYER_BLACK, PIECE_PAWN)
		case 'r': return new Tile(PLAYER_BLACK, PIECE_ROOK)
		case 'n': return new Tile(PLAYER_BLACK, PIECE_KNIGHT)
		case 'b': return new Tile(PLAYER_BLACK, PIECE_BISHOP)
		case 'q': return new Tile(PLAYER_BLACK, PIECE_QUEEN)
		case 'k': return new Tile(PLAYER_BLACK, PIECE_KING)
		case '.': return new Tile(PLAYER_NONE, PIECE_NONE)
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
		/**
		 Create an empty board of given width and height
		 */
		this.width = board_width
		this.height = board_height

		this.tiles = []
		for (let i = 0; i < board_width; ++i) {
			let empty_file = []
			for (let j = 0; j < board_height; ++j) {
				empty_file.push(new Tile(PLAYER_NONE, PIECE_NONE))
			}
			this.tiles.push(empty_file)
		}
	}

	static defaultBoard() {
		/**
		 * Create an ordinary chess board
		 */
		board = new Board(DEFAULT_BOARD_WIDTH, DEFAULT_BOARD_HEIGHT)

		board.tiles[0][0] = new Tile(PLAYER_WHITE, PIECE_ROOK)
		board.tiles[0][1] = new Tile(PLAYER_WHITE, PIECE_KNIGHT)
		board.tiles[0][2] = new Tile(PLAYER_WHITE, PIECE_BISHOP)
		board.tiles[0][3] = new Tile(PLAYER_WHITE, PIECE_QUEEN)
		board.tiles[0][4] = new Tile(PLAYER_WHITE, PIECE_KING)
		board.tiles[0][5] = new Tile(PLAYER_WHITE, PIECE_BISHOP)
		board.tiles[0][6] = new Tile(PLAYER_WHITE, PIECE_KNIGHT)
		board.tiles[0][7] = new Tile(PLAYER_WHITE, PIECE_ROOK)
		board.tiles[7][0] = new Tile(PLAYER_BLACK, PIECE_ROOK)
		board.tiles[7][1] = new Tile(PLAYER_BLACK, PIECE_KNIGHT)
		board.tiles[7][2] = new Tile(PLAYER_BLACK, PIECE_BISHOP)
		board.tiles[7][3] = new Tile(PLAYER_BLACK, PIECE_QUEEN)
		board.tiles[7][4] = new Tile(PLAYER_BLACK, PIECE_KING)
		board.tiles[7][5] = new Tile(PLAYER_BLACK, PIECE_BISHOP)
		board.tiles[7][6] = new Tile(PLAYER_BLACK, PIECE_KNIGHT)
		board.tiles[7][7] = new Tile(PLAYER_BLACK, PIECE_ROOK)

		for (let i = 0; i < DEFAULT_BOARD_WIDTH; ++i) {
			board.tiles[1][i] = new Tile(PLAYER_WHITE, PIECE_PAWN)
			board.tiles[6][i] = new Tile(PLAYER_BLACK, PIECE_PAWN)
		}

		return board
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
		for (let i = 0; i < str.length; ++i) {
			let rank_from_top = Math.floor(i / board_width)
			let rank = board_height - rank_from_top - 1
			let file = i % board_height
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

Board.prototype.coordinatesAreInsideBoard = function(rank, file) {
	return (rank >= 0) && (rank < this.height) && (file >= 0) && (file < this.width)
}

Board.prototype.iterateMoves = function(player, rank, file, delta_rank, delta_file) {
	/**
	 @brief A helper function to iterate valid moves for bishops, rooks and queens

	 @return An array of moves
	 */

	starting_rank = rank
	starting_file = file
	res = []

	while (true) {
		rank += delta_rank
		file += delta_file

		// out of board
		if (!this.coordinatesAreInsideBoard(rank, file)) {
			break
		}

		// a piece of the same color
		if (this.tiles[rank][file].owner == player) {
			break
		}

		// empty tile or the opponent's piece
		res.push(new OrdinaryMove([starting_rank, starting_file], [rank, file]))

		// the opponent's piece
		if (this.tiles[rank][file].owner != PLAYER_NONE) {
			break
		}
	}
	return res
}

Board.prototype.movesFromPosition = function(rank, file) {
	tile = this.tiles[rank][file]

	if (tile.owner == PLAYER_NONE) {
		return []
	}

	if (tile.owner == PLAYER_WHITE) {
		player = PLAYER_WHITE
		opponent = PLAYER_BLACK
	}
	else {
		player = PLAYER_BLACK
		opponent = PLAYER_WHITE
	}

	res = []

	if (tile.piece == PIECE_KNIGHT) {
		candidates = [
			[rank - 2, file - 1],
			[rank - 1, file - 2],
			[rank - 2, file + 1],
			[rank - 1, file + 2],
			[rank + 2, file - 1],
			[rank + 1, file - 2],
			[rank + 2, file + 1],
			[rank + 1, file + 2],
		]

		for (const c of candidates) {
			[to_rank, to_file] = c
			if (!this.coordinatesAreInsideBoard(to_rank, to_file)) {
				continue
			}
			if (this.tiles[to_rank][to_file].owner == player) {
				continue
			}
			res.push(new OrdinaryMove([rank, file], [to_rank, to_file]))
		}
	}
	else if (tile.piece == PIECE_KING) {
		candidates = [
			[rank - 1, file - 1],
			[rank - 1, file    ],
			[rank - 1, file + 1],
			[rank    , file - 1],
			[rank    , file + 1],
			[rank + 1, file - 1],
			[rank + 1, file    ],
			[rank + 1, file + 1],
		]

		for (const c of candidates) {
			[to_rank, to_file] = c
			if (!this.coordinatesAreInsideBoard(to_rank, to_file)) {
				continue
			}
			if (this.tiles[to_rank][to_file].owner == player) {
				continue
			}
			res.push(new OrdinaryMove([rank, file], [to_rank, to_file]))
		}
	}
	else if (tile.piece == PIECE_PAWN) {
		if (player == PLAYER_WHITE) {
			candidates = [[rank + 1, file]]
			if ((rank == 1) && (this.tiles[rank + 1][file].owner == PLAYER_NONE)) {
				candidates.push([rank + 2, file])
			}
			for (const c of candidates) {
				[to_rank, to_file] = c
				if (this.tiles[to_rank][to_file].owner == PLAYER_NONE) {
					res.push(new OrdinaryMove([rank, file], [to_rank, to_file]))
				}
			}
			candidates = [
				[rank + 1, file - 1],
				[rank + 1, file + 1],
			]
			for (const c of candidates) {
				[to_rank, to_file] = c
				if (!this.coordinatesAreInsideBoard(to_rank, to_file)) {
					continue
				}
				if (this.tiles[to_rank][to_file].owner == PLAYER_BLACK) {
					res.push(new OrdinaryMove([rank, file], [to_rank, to_file]))
				}
			}
		}
		else {
			candidates = [[rank - 1, file]]
			if ((rank == 6) && (this.tiles[rank - 1][file].owner == PLAYER_NONE)) {
				candidates.push([rank - 2, file])
			}
			for (const c of candidates) {
				[to_rank, to_file] = c
				if (this.tiles[to_rank][to_file].owner == PLAYER_NONE) {
					res.push(new OrdinaryMove([rank, file], [to_rank, to_file]))
				}
			}
			candidates = [
				[rank - 1, file - 1],
				[rank - 1, file + 1],
			]
			for (const c of candidates) {
				[to_rank, to_file] = c
				if (!this.coordinatesAreInsideBoard(to_rank, to_file)) {
					continue
				}
				if (this.tiles[to_rank][to_file].owner == PLAYER_WHITE) {
					res.push(new OrdinaryMove([rank, file], [to_rank, to_file]))
				}
			}
		}
	}
	else {
		can_go_straight = ((tile.piece == PIECE_ROOK)   || (tile.piece == PIECE_QUEEN))
		can_go_diagonal = ((tile.piece == PIECE_BISHOP) || (tile.piece == PIECE_QUEEN))

		deltas = []
		if (can_go_straight) {
			deltas = deltas.concat([
				[0, -1],
				[0, 1],
				[-1, 0],
				[1, 0],
			])
		}
		if (can_go_diagonal) {
			deltas = deltas.concat([
				[-1, -1],
				[-1, 1],
				[1, -1],
				[1, 1],
			])
		}

		for (delta of deltas) {
			[delta_rank, delta_file] = delta
			res = res.concat(this.iterateMoves(player, rank, file, delta_rank, delta_file))
		}
	}

	return res
}

class OrdinaryMove {
	constructor(from, to) {
		this.from = from
		this.to = to
	}
}

function movesFromString(str, board_width = DEFAULT_BOARD_WIDTH, board_height = DEFAULT_BOARD_HEIGHT) {
	/**
	 * @brief Get moves from a human-readable string
	 *
	 * 'X' means move to this position is possible
	 * '.' means move to this position is not possible
	 * 'o' means the original position
	 * whitespace is ignored
	 *
	 * E.g. for a knight it looks like this:
	 * ........
	 * ...X.X..
	 * ..X...X.
	 * ....o...
	 * ..X...X.
	 * ...X.X..
	 * ........
	 * ........
	 */

	// ignore whitespace
	str = str.replace(/\s/g, '')

	let target_positions = []

	for (let i = 0; i < str.length; ++i) {
		let rank_from_top = Math.floor(i / board_width)
		let rank = board_height - rank_from_top - 1
		let file = i % board_height
		switch (str.charAt(i)) {
		case 'X': {
			target_positions.push([rank, file])
			continue
		}
		case 'o':
			var starting_rank = rank
			var starting_file = file
			continue
		}
	}

	res = []
	for (target_position of target_positions) {
		res.push(new OrdinaryMove([starting_rank, starting_file], target_position))
	}
	return res
}

function test_movesFromString() {
	input_str = '........ \
	             ........ \
	             ...X.X.. \
	             ..X...X. \
	             ....o... \
	             ..X...X. \
	             ...X.X.. \
	             ........'
	actual = movesFromString(input_str).sort(compareMoves)
	expected = [
		new OrdinaryMove([3, 4], [1, 3]),
		new OrdinaryMove([3, 4], [1, 5]),
		new OrdinaryMove([3, 4], [2, 2]),
		new OrdinaryMove([3, 4], [2, 6]),
		new OrdinaryMove([3, 4], [4, 2]),
		new OrdinaryMove([3, 4], [4, 6]),
		new OrdinaryMove([3, 4], [5, 3]),
		new OrdinaryMove([3, 4], [5, 5]),
	].sort(compareMoves)
	assert.deepEqual(actual, expected)
}

function compareMoves(a, b) {
	if (a.from[0] < b.from[0]) {
		return 1
	}
	if (a.from[0] > b.from[0]) {
		return -1
	}
	if (a.from[1] < b.from[1]) {
		return 1
	}
	if (a.from[1] > b.from[1]) {
		return -1
	}
	if (a.to[0] < b.to[0]) {
		return 1
	}
	if (a.to[0] > b.to[0]) {
		return -1
	}
	if (a.to[1] < b.to[1]) {
		return 1
	}
	if (a.to[1] > b.to[1]) {
		return -1
	}
	return 0
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

function test_misc_at_starting_position() {
	board = Board.defaultBoard()

	// test that there is no available moves from empty tile
	assert.deepEqual(board.movesFromPosition(3, 4), [])

	// test the moves of the knight in the starting position
	assert.deepEqual(board.movesFromPosition(0, 1), [
		new OrdinaryMove([0, 1], [2, 0]),
		new OrdinaryMove([0, 1], [2, 2]),
	])

	// test the pawn moves
	assert.deepEqual(board.movesFromPosition(1, 4), [
		new OrdinaryMove([1, 4], [2, 4]),
		new OrdinaryMove([1, 4], [3, 4]),
	])
	assert.deepEqual(board.movesFromPosition(6, 4), [
		new OrdinaryMove([6, 4], [5, 4]),
		new OrdinaryMove([6, 4], [4, 4]),
	])

	// test that the other pieces cannot move in the starting position
	for (const file of [0, 2, 3, 4, 5, 7]) {
		assert.deepEqual(board.movesFromPosition(0, file), [])
		assert.deepEqual(board.movesFromPosition(7, file), [])
	}
}

function test_knight_moves() {
	input_str = '........ \
	             ........ \
	             ........ \
	             ........ \
	             ........ \
	             ........ \
	             ........ \
	             N.......'
	board = Board.fromString(input_str)
	assert.deepEqual(board.movesFromPosition(0, 0).sort(), [
		new OrdinaryMove([0, 0], [2, 1]),
		new OrdinaryMove([0, 0], [1, 2]),
	])

	input_str = '........ \
	             ........ \
	             ........ \
	             ........ \
	             ........ \
	             .N...... \
	             ........ \
	             N.......'
	board = Board.fromString(input_str)
	assert.deepEqual(board.movesFromPosition(0, 0).sort(), [
		new OrdinaryMove([0, 0], [1, 2]),
	])

	input_str = '........ \
	             ........ \
	             ........ \
	             ........ \
	             ........ \
	             .n...... \
	             ........ \
	             N.......'
	board = Board.fromString(input_str)
	assert.deepEqual(board.movesFromPosition(0, 0), [
		new OrdinaryMove([0, 0], [2, 1]),
		new OrdinaryMove([0, 0], [1, 2]),
	])

	input_str = '.......n \
	             .....N.. \
	             ........ \
	             ........ \
	             ........ \
	             ........ \
	             ........ \
	             ........'
	board = Board.fromString(input_str)
	assert.deepEqual(board.movesFromPosition(7, 7), [
		new OrdinaryMove([7, 7], [5, 6]),
		new OrdinaryMove([7, 7], [6, 5]),
	])

	input_str = '........ \
	             ........ \
	             ........ \
	             ........ \
	             ....n... \
	             ........ \
	             ........ \
	             ........'
	board = Board.fromString(input_str)
	assert.deepEqual(board.movesFromPosition(3, 4), [
		new OrdinaryMove([3, 4], [1, 3]),
		new OrdinaryMove([3, 4], [2, 2]),
		new OrdinaryMove([3, 4], [1, 5]),
		new OrdinaryMove([3, 4], [2, 6]),
		new OrdinaryMove([3, 4], [5, 3]),
		new OrdinaryMove([3, 4], [4, 2]),
		new OrdinaryMove([3, 4], [5, 5]),
		new OrdinaryMove([3, 4], [4, 6]),
	])
}

function test_pawn_moves() {
	input_str = '........ \
	             ...p.... \
	             ...p.... \
	             .......P \
	             ....p... \
	             P...P... \
	             ........ \
	             ........'
	board = Board.fromString(input_str)
	assert.deepEqual(board.movesFromPosition(2, 0), [
		new OrdinaryMove([2, 0], [3, 0]),
	])
	assert.deepEqual(board.movesFromPosition(2, 4), [])
	assert.deepEqual(board.movesFromPosition(3, 4), [])
	assert.deepEqual(board.movesFromPosition(4, 7), [
		new OrdinaryMove([4, 7], [5, 7]),
	])
	assert.deepEqual(board.movesFromPosition(5, 3), [
		new OrdinaryMove([5, 3], [4, 3]),
	])
	assert.deepEqual(board.movesFromPosition(6, 3), [])
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

function run_all_tests() {
	test_movesFromString()
	test_board_from_string_default_board()
	test_misc_at_starting_position()
	test_pawn_moves()
	test_knight_moves()
}

board = new Board(DEFAULT_BOARD_WIDTH, DEFAULT_BOARD_HEIGHT)
console.log(board.toString())
run_all_tests()
