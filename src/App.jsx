import { useState, useEffect } from 'react'
import { supabase } from './supabase'
import './App.css'

import cube from './assets/キューブ.png'
import mimi from './assets/ミミ.png'
import mist from './assets/ミスト.png'
import rashomon from './assets/羅生門.png'
import suspiria from './assets/サスペリア.png'
import zodiac from './assets/ゾディアック.png'
import weaponHuman from './assets/武器人間.png'
import titanic from './assets/タイタニック.png'
import kokuhou from './assets/国宝.png'
import yoshizawa from './assets/吉沢亮.png'
import ryusei from './assets/横浜流星.png'
import whiteWhale from './assets/白鯨.png'
import psychoGoreman from './assets/サイコ・ゴアマン.png'
import logo from './assets/ロゴ.png'
import menu1 from './assets/menu_1.png'
import menu2 from './assets/menu_2.png'
import menu3 from './assets/menu_3.png'
import syogiSound from './assets/syogi_s01.mp3'



function App() {
  const [screen, setScreen] = useState('opening')
  const [playerSide, setPlayerSide] = useState(null)
  const [turn, setTurn] = useState('player')
  const [mistMoveCount, setMistMoveCount] = useState(0)
  const [result, setResult] = useState(null)
  const [roomId, setRoomId] = useState(null)
  const [onlineScreen, setOnlineScreen] = useState(false)
  useEffect(() => {
  if (screen !== 'game' || roomId) return
  if (turn !== (playerSide === 'player' ? 'opponent' : 'player')) return

 const cpuPieces = pieces.filter(
  (piece) =>
    (piece.side ?? 'player') === 'opponent'
)


  const moves = cpuPieces.flatMap((piece) =>
  getLegalMoves(
    piece,
    pieces.filter(
      (p) => !(p.name === 'ミスト' && (p.side ?? 'player') === 'player')
    )
  ).map((move) => ({
    piece,
    move,
  }))
)
if (moves.length === 0) return

const captureMoves = moves.filter(({ piece, move }) =>
  pieces.some(
    (target) =>
      target.row === move.row &&
      target.col === move.col &&
      target.name !== 'ミスト' &&
      (target.side ?? 'player') !== (piece.side ?? 'player')
  )
)

const titanMoves = moves.filter(({ move }) =>
  pieces.some(
    (target) =>
      target.row === move.row &&
      target.col === move.col &&
      target.name === 'タイタニック' &&
      (target.side ?? 'player') !== 'opponent'
  )
)

const cpuMove =
  titanMoves.length > 0
    ? titanMoves[Math.floor(Math.random() * titanMoves.length)]
    : captureMoves.length > 0
      ? captureMoves[Math.floor(Math.random() * captureMoves.length)]
      : moves[Math.floor(Math.random() * moves.length)]

const timer = setTimeout(() => {

syogiAudio.play()

setPieces((currentPieces) => {

  if (cpuMove.piece.name === 'ミスト') {
  setMistMoveCount((count) => count + 1)
}

  const capturedPiece = currentPieces.find(
    (piece) =>
      piece.row === cpuMove.move.row &&
      piece.col === cpuMove.move.col &&
      (piece.side ?? 'player') !== (cpuMove.piece.side ?? 'player')
  )

  if (capturedPiece?.name === 'タイタニック') {
  setResult('敗北')
}

  if (capturedPiece?.name === '国宝') {
  setOpponentHand((hand) => [
    ...hand,
    { ...capturedPiece, name: '吉沢亮', image: yoshizawa },
    { ...capturedPiece, name: '横浜流星', image: ryusei },
  ])
} else if (
  cpuMove.piece.name === 'ゾディアック' &&
  capturedPiece
) {
  setOpponentHand((hand) => [
    ...hand,
    capturedPiece,
  ])
}

  return currentPieces
    .filter((piece) => piece !== capturedPiece)
    .map((piece) =>
      piece === cpuMove.piece
        ? {
            ...piece,
            row: cpuMove.move.row,
            col: cpuMove.move.col,
            absorbedMoves:
              piece.name === '武器人間' && capturedPiece
                ? [capturedPiece.name]
                : piece.absorbedMoves,
          }
        : piece
    )
})

setTurn(playerSide)
}, 1000)

return () => clearTimeout(timer)
}, [turn, screen, playerSide])

useEffect(() => {
  if (!roomId || screen !== 'game') return

  const channel = supabase
    .channel(`game-${roomId}`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'game',
        filter: `room_id=eq.${roomId}`,
      },
      (payload) => {
        const gameState = payload.new.game_state

        setPieces(gameState.pieces)
        setTurn(gameState.turn)
        
        if (playerSide === 'player') {
  setPlayerHand(gameState.playerHand ?? [])
  setOpponentHand(gameState.opponentHand ?? [])
} else {
  setPlayerHand(gameState.opponentHand ?? [])
  setOpponentHand(gameState.playerHand ?? [])
}

        if (gameState.playerCount === 2) {
  setOnlineScreen(false)
}
      }
    )
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}, [roomId, screen])

  const [selectedPiece, setSelectedPiece] = useState(null)
  const [playerHand, setPlayerHand] = useState([])
  const [opponentHand, setOpponentHand] = useState([])
  const syogiAudio = new Audio(syogiSound)

const playSyogiSound = () => {
  syogiAudio.currentTime = 0
  syogiAudio.play()
}
  const getLegalMoves = (piece, pieces) => {
  if (!piece) return []

    if (piece.name === 'CUBE') {
    const move = {
  row: piece.row + (piece.side === 'opponent' ? 1 : -1),
  col: piece.col,
}

    if (
      move.row >= 0 &&
      !pieces.some(
        (p) =>
          p.row === move.row &&
          p.col === move.col &&
        (p.side ?? 'player') === (piece.side ?? 'player')
      )
    ) {
      return [move]
    }

    return []
  }

  if (piece.name === 'タイタニック') {
    const directions = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1],           [0, 1],
      [1, -1],  [1, 0],  [1, 1],
    ]

    return directions
      .map(([dr, dc]) => ({
        row: piece.row + dr,
        col: piece.col + dc,
      }))
      .filter(
  (move) =>
    move.row >= 0 &&
    move.row < 9 &&
    move.col >= 0 &&
    move.col < 9 &&
    !pieces.some(
  (p) =>
    p.row === move.row &&
    p.col === move.col &&
   (p.side ?? 'player') === (piece.side ?? 'player')
)
)
  }

  if (piece.name === '国宝') {
    const directions = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1],           [0, 1],
      [1, -1],  [1, 0],  [1, 1],
    ]

    const moves = []

    directions.forEach(([dr, dc]) => {
      let row = piece.row + dr
      let col = piece.col + dc

      while (row >= 0 && row < 9 && col >= 0 && col < 9) {
        const target = pieces.find(
          (p) => p.row === row && p.col === col
        )

        if (target) {
  if ((target.side ?? 'player') !== (piece.side ?? 'player')) {
    moves.push({ row, col })
  }
  break
}

        moves.push({ row, col })

        row += dr
        col += dc
      }
    })

    return moves
  }

    if (piece.name === '吉沢亮' || piece.name === '横浜流星') {
    const directions =
      piece.name === '吉沢亮'
        ? [[-1, 0], [1, 0], [0, -1], [0, 1]]
        : [[-1, -1], [-1, 1], [1, -1], [1, 1]]

    const moves = []

    for (const [dr, dc] of directions) {
      let row = piece.row + dr
      let col = piece.col + dc

      while (row >= 0 && row < 9 && col >= 0 && col < 9) {
        const target = pieces.find(
          (p) => p.row === row && p.col === col
        )

        if (target) {
          if (
            (target.side ?? 'player') !==
            (piece.side ?? 'player')
          ) {
            moves.push({ row, col })
          }
          break
        }

        moves.push({ row, col })
        row += dr
        col += dc
      }
    }

    return moves
  }

    if (piece.name === 'サスペリア') {
    const directions = [
      [-2, -2], [-2, -1], [-2, 0], [-2, 1], [-2, 2],
      [-1, -2],                             [-1, 2],
      [0, -2],                               [0, 2],
      [1, -2],                               [1, 2],
      [2, -2],  [2, -1],  [2, 0],  [2, 1],  [2, 2],
    ]

    return directions
      .map(([dr, dc]) => ({
        row: piece.row + dr,
        col: piece.col + dc,
      }))
      .filter(
        (move) =>
          move.row >= 0 &&
          move.row < 9 &&
          move.col >= 0 &&
          move.col < 9 &&
          !pieces.some(
            (p) =>
              p.row === move.row &&
              p.col === move.col &&
              (p.side ?? 'player') === (piece.side ?? 'player')
          )
      )
  }
  
      if (piece.name === '羅生門') {
    let direction = piece.direction

    if (piece.row === 0) {
      direction = 1
    }

    if (piece.row === 8) {
      direction = -1
    }

    const moves = []
    let row = piece.row + direction

    while (row >= 0 && row < 9) {
      const target = pieces.find(
        (p) => p.row === row && p.col === piece.col
      )

      if (target) {
        if (
          (target.side ?? 'player') !==
          (piece.side ?? 'player')
        ) {
          moves.push({ row, col: piece.col, direction })
        }
        break
      }

      moves.push({ row, col: piece.col, direction })
      row += direction
    }

    return moves
  }

  if (piece.name === 'サイコ・ゴアマン') {
  const directions = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
    [-1, -1],
    [-1, 1],
    [1, -1],
    [1, 1],
  ]

  const moves = []

  for (const [dr, dc] of directions) {
    let row = piece.row + dr
    let col = piece.col + dc

    while (row >= 0 && row < 9 && col >= 0 && col < 9) {
      const target = pieces.find(
        (p) => p.row === row && p.col === col
      )

      if (target) {
        if (
          (target.side ?? 'player') !==
          (piece.side ?? 'player')
        ) {
          moves.push({ row, col })
        }
        break
      }

      moves.push({ row, col })
      row += dr
      col += dc
    }
  }

  return moves
}

    if (piece.name === 'ミミ') {
    const direction = piece.side === 'opponent' ? 1 : -1

    const directions = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1],           [0, 1],
      [1, 0],
    ]

    return directions
      .map(([dr, dc]) => ({
        row: piece.row + dr * direction,
        col: piece.col + dc,
      }))
      .filter(
        (move) =>
          move.row >= 0 &&
          move.row < 9 &&
          move.col >= 0 &&
          move.col < 9 &&
          !pieces.some(
            (p) =>
              p.row === move.row &&
              p.col === move.col &&
              (p.side ?? 'player') === (piece.side ?? 'player')
          )
      )
  }

  if (piece.name === 'ミスト') {
  const directions = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1],           [0, 1],
    [1, -1],  [1, 0],  [1, 1],
  ]

  return directions
    .map(([dr, dc]) => ({
      row: piece.row + dr,
      col: piece.col + dc,
    }))
    .filter(
      (move) =>
        move.row >= 0 &&
        move.row < 9 &&
        move.col >= 0 &&
        move.col < 9 &&
        !pieces.some(
          (p) =>
            p.row === move.row &&
            p.col === move.col &&
            (p.side ?? 'player') === (piece.side ?? 'player')
        )
    )
}

if (piece.name === 'ゾディアック') {
  const direction = piece.side === 'opponent' ? 1 : -1

  const directions = [
    [direction, 0],
    [0, -1],
    [0, 1],
  ]

  return directions
    .map(([dr, dc]) => ({
      row: piece.row + dr,
      col: piece.col + dc,
    }))
    .filter(
      (move) =>
        move.row >= 0 &&
        move.row < 9 &&
        move.col >= 0 &&
        move.col < 9 &&
        !pieces.some(
          (p) =>
            p.row === move.row &&
            p.col === move.col &&
            (p.side ?? 'player') === (piece.side ?? 'player')
        )
    )
}

if (piece.name === '白鯨') {
  const direction = piece.side === 'opponent' ? 1 : -1

  const moves = [
    { row: piece.row + direction * 2, col: piece.col },
    { row: piece.row - direction * 2, col: piece.col },
    { row: piece.row, col: piece.col - 1 },
    { row: piece.row, col: piece.col + 1 },
  ]

  return moves.filter(
    (move) =>
      move.row >= 0 &&
      move.row < 9 &&
      move.col >= 0 &&
      move.col < 9 &&
      !pieces.some(
  (p) =>
    p !== piece &&
    (
      (p.row === move.row && p.col === move.col) ||
      (
        p.row === move.row + (piece.side === 'opponent' ? 1 : -1) &&
        p.col === move.col
      )
    ) &&
    (p.side ?? 'player') === (piece.side ?? 'player')
)
  )
}

if (piece.name === '武器人間') {
  const absorbedMove = piece.absorbedMoves?.[0]

  if (absorbedMove === '羅生門') {
    const direction =
      piece.row === 0
        ? 1
        : piece.row === 8
        ? -1
        : piece.direction ?? -1

    const moves = []
    let row = piece.row + direction

    while (row >= 0 && row < 9) {
      const target = pieces.find(
        (p) => p.row === row && p.col === piece.col
      )

      if (target) {
        if (
          (target.side ?? 'player') !==
          (piece.side ?? 'player')
        ) {
          moves.push({ row, col: piece.col, direction })
        }
        break
      }

      moves.push({ row, col: piece.col, direction })
      row += direction
    }

    return moves
  }

  if (absorbedMove === '国宝') {
    const directions = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1],           [0, 1],
      [1, -1],  [1, 0],  [1, 1],
    ]

    const moves = []

    for (const [dr, dc] of directions) {
      let row = piece.row + dr
      let col = piece.col + dc

      while (row >= 0 && row < 9 && col >= 0 && col < 9) {
        const target = pieces.find(
          (p) => p.row === row && p.col === col
        )

        if (target) {
          if (
            (target.side ?? 'player') !==
            (piece.side ?? 'player')
          ) {
            moves.push({ row, col })
          }
          break
        }

        moves.push({ row, col })
        row += dr
        col += dc
      }
    }

    return moves
  }

    if (absorbedMove === 'サスペリア') {
    const moves = []

    for (let dr = -2; dr <= 2; dr++) {
      for (let dc = -2; dc <= 2; dc++) {
        if (
          Math.abs(dr) === 2 ||
          Math.abs(dc) === 2
        ) {
          const row = piece.row + dr
          const col = piece.col + dc

          if (
            row >= 0 &&
            row < 9 &&
            col >= 0 &&
            col < 9 &&
            !pieces.some(
              (p) =>
                p.row === row &&
                p.col === col &&
                (p.side ?? 'player') ===
                  (piece.side ?? 'player')
            )
          ) {
            moves.push({ row, col })
          }
        }
      }
    }

    return moves
  }

  const directions = [
    [-1, -1], [-1, 1],
    [1, -1],  [1, 1],
    ...(absorbedMove === 'ミスト'
      ? [
          [-1, 0], [1, 0],
          [0, -1], [0, 1],
        ]
      : []),
  ]

  return directions
    .map(([dr, dc]) => ({
      row: piece.row + dr,
      col: piece.col + dc,
    }))
    .filter(
      (move) =>
        move.row >= 0 &&
        move.row < 9 &&
        move.col >= 0 &&
        move.col < 9 &&
        !pieces.some(
          (p) =>
            p.row === move.row &&
            p.col === move.col &&
            (p.side ?? 'player') === (piece.side ?? 'player')
        )
    )
}

  return []
}
  const [pieces, setPieces] = useState([
  { name: '白鯨', image: whiteWhale, row: 8, col: 0, wide: true },
  { name: '羅生門', image: rashomon, row: 8, col: 1, direction: -1 },

  { name: 'ミスト', image: mist, row: 8, col: 2 },
  { name: '武器人間', image: weaponHuman, row: 8, col: 3, absorbedMoves: [] },
  { name: 'タイタニック', image: titanic, row: 8, col: 4, side: 'player' },
  { name: '国宝', image: kokuhou, row: 8, col: 5 },
  { name: 'ゾディアック', image: zodiac, row: 8, col: 6 },
  { name: 'サスペリア', image: suspiria, row: 8, col: 7 },
  { name: '白鯨', image: whiteWhale, row: 8, col: 8, wide: true },

  { name: 'ミミ', image: mimi, row: 7, col: 4, side: 'player' },

  { name: 'CUBE', image: cube, row: 6, col: 0 },
  { name: 'CUBE', image: cube, row: 6, col: 1 },
  { name: 'CUBE', image: cube, row: 6, col: 2 },
  { name: 'CUBE', image: cube, row: 6, col: 3 },
  { name: 'CUBE', image: cube, row: 6, col: 4 },
  { name: 'CUBE', image: cube, row: 6, col: 5 },
  { name: 'CUBE', image: cube, row: 6, col: 6 },
  { name: 'CUBE', image: cube, row: 6, col: 7 },
  { name: 'CUBE', image: cube, row: 6, col: 8 },
    { name: '白鯨', image: whiteWhale, row: 0, col: 0, wide: true, side: 'opponent' },
  { name: '羅生門', image: rashomon, row: 0, col: 1, side: 'opponent', direction: 1 },
  { name: 'ミスト', image: mist, row: 0, col: 2, side: 'opponent' },
  { name: '武器人間', image: weaponHuman, row: 0, col: 3, side: 'opponent', absorbedMoves: [] },
  { name: 'タイタニック', image: titanic, row: 0, col: 4, side: 'opponent' },
  { name: '国宝', image: kokuhou, row: 0, col: 5, side: 'opponent' },
  { name: 'ゾディアック', image: zodiac, row: 0, col: 6, side: 'opponent' },
  { name: 'サスペリア', image: suspiria, row: 0, col: 7, side: 'opponent' },
  { name: '白鯨', image: whiteWhale, row: 0, col: 8, wide: true, side: 'opponent' },

  { name: 'ミミ', image: mimi, row: 1, col: 4, side: 'opponent' },

  { name: 'CUBE', image: cube, row: 2, col: 0, side: 'opponent' },
  { name: 'CUBE', image: cube, row: 2, col: 1, side: 'opponent' },
  { name: 'CUBE', image: cube, row: 2, col: 2, side: 'opponent' },
  { name: 'CUBE', image: cube, row: 2, col: 3, side: 'opponent' },
  { name: 'CUBE', image: cube, row: 2, col: 4, side: 'opponent' },
  { name: 'CUBE', image: cube, row: 2, col: 5, side: 'opponent' },
  { name: 'CUBE', image: cube, row: 2, col: 6, side: 'opponent' },
  { name: 'CUBE', image: cube, row: 2, col: 7, side: 'opponent' },
  { name: 'CUBE', image: cube, row: 2, col: 8, side: 'opponent' },
])

const createRoom = async () => {
  const newRoomId = Math.floor(100000 + Math.random() * 900000).toString()

  const { error } = await supabase
    .from('game')
    .insert({
      room_id: newRoomId,
      game_state: {
  pieces,
  turn: 'player',
  playerSide: 'player',
  playerCount: 1,
},
    })

  if (error) {
    alert(error.message)
    return
  }

  setRoomId(newRoomId)
  setPlayerSide('player')
  setScreen('game')
}

const joinRoom = async () => {
  if (!roomId) {
    alert('ルームIDを入力してください')
    return
  }

  const { data, error } = await supabase
  .from('game')
  .select('game_state')
  .eq('room_id', roomId)
  .limit(1)

  if (error || !data) {
  alert(error?.message || 'ルームが見つかりません')
  return
}

await supabase
  .from('game')
  .update({
    game_state: {
      ...data[0].game_state,
      playerCount: 2,
    },
  })
  .eq('room_id', roomId)

  setOnlineScreen(false)

  setPieces(data[0].game_state.pieces)
  setTurn(data[0].game_state.turn)
  setPlayerSide('opponent')
  setScreen('game')
}

const updateGameState = async (nextPieces, nextTurn, nextPlayerHand) => {
  if (!roomId) return

  await supabase
    .from('game')
    .update({
  game_state: {
  pieces: nextPieces,
  turn: nextTurn,
  playerSide,
  playerHand: playerSide === 'player' ? nextPlayerHand : opponentHand,
  opponentHand: playerSide === 'opponent' ? nextPlayerHand : playerHand,
},
    })
    .eq('room_id', roomId)
}

  return (
  <>

{result && (
  <div className="result-message">
    {result}
  </div>
)}

    {screen === 'opening' && (
  <div className="opening">
    <img src={logo} alt="映画将棋" />

    <div className="menu-buttons">
      <img src={menu1} alt="メニュー1" onClick={() => setScreen('turn-select')} />
      <img
        src={menu2}
        alt="メニュー2"
        onClick={() => {
  setOnlineScreen(true)
  setScreen('online')
}}
/>
      <img src={menu3} alt="メニュー3" />
    </div>
  </div>
)}

{onlineScreen && (
  <div className="turn-select">
    <button onClick={createRoom}>ルームを作る</button>
    <input
      type="number"
      placeholder="ルームID"
      value={roomId ?? ''}
      onChange={(e) => setRoomId(e.target.value)}
    />
    <button onClick={joinRoom}>ルームに入る</button>
  </div>
)}



{screen === 'turn-select' && (
  <div className="turn-select">
    <button onClick={() => {
  setPlayerSide('player')
  setTurn('player')
  setRoomId(null)
  setScreen('game')
}}>先手</button>
  
    <button onClick={() => {
  setPlayerSide('player')
  setTurn('opponent')
  setScreen('game')
}}>後手</button>
  </div>
)}

    {screen === 'game' && (
      <div className="game">
        {roomId && <div>ルームID: {roomId}</div>}

        <div>M: 0</div>

        <button className="home-button" onClick={() => {
  setResult(null)
  setRoomId(null)
  setScreen('opening')
}}>戻る</button>

      <div className="hand-box opponent-hand-box">
  {opponentHand.map((piece, index) => (
    <img
      key={index}
      className="hand-piece opponent-hand-piece"
      src={piece.image}
      alt={piece.name}
    />
  ))}
</div>

      <div className={`board ${playerSide === 'opponent' ? 'opponent-board' : ''}`}>
        {Array.from({ length: 81 }, (_, index) => {
          const row = Math.floor(index / 9)
          const col = index % 9

          const piece = pieces.find(
            (piece) => piece.row === row && piece.col === col
          )

          const legalMoves = selectedPiece?.fromHand
  ? Array.from({ length: 81 }, (_, index) => ({
      row: Math.floor(index / 9),
      col: index % 9,
    })).filter(
      (move) =>
        !pieces.some(
          (p) => p.row === move.row && p.col === move.col
        )
    )
  : getLegalMoves(selectedPiece, pieces)

          return (
            <div
  className={`square ${
 legalMoves.some((move) =>
  move.row === row &&
  move.col === col
) ||
(
  !selectedPiece?.fromHand &&
  legalMoves.some((move) =>
    selectedPiece?.name === '白鯨' &&
    move.col === col &&
    (
      move.row === row ||
      move.row + (selectedPiece.side === 'opponent' ? 1 : -1) === row
    )
  )
)
      ? 'legal-move'
      : ''
  }`}
  key={index}
  onClick={() => {
  if (screen !== 'game') return
  
  if (selectedPiece?.fromHand) {
    if (piece) return

    playSyogiSound()

    const nextPieces = [
  ...pieces,
  {
    ...selectedPiece,
    row,
    col,
    side: playerSide,
    fromHand: undefined,
    handIndex: undefined,
  },
]

const nextPlayerHand = playerHand.filter(
  (_, index) => index !== selectedPiece.handIndex
)

setPieces(nextPieces)
setPlayerHand(nextPlayerHand)

const nextTurn = turn === 'player' ? 'opponent' : 'player'
updateGameState(nextPieces, nextTurn, nextPlayerHand)

    setSelectedPiece(null)
    setTurn(turn === 'player' ? 'opponent' : 'player')
    return
  }

  if (legalMoves.some((move) => move.row === row && move.col === col)) {
    playSyogiSound()

    if (selectedPiece?.name === 'ミスト' && selectedPiece?.side !== 'opponent') {
  setMistMoveCount((count) => count + 1)
}
  const capturedPieces = pieces.filter((p) => {
 
if (selectedPiece?.name === '白鯨') {
  const secondRow =
    row + (selectedPiece.side === 'opponent' ? 1 : -1)

  if (p.name === '白鯨') {
    const whaleSecondRow =
      p.row + (p.side === 'opponent' ? 1 : -1)

    return (
      p !== selectedPiece &&
      (p.side ?? 'player') !== (selectedPiece.side ?? 'player') &&
      (
        (p.row === row && p.col === col) ||
        (p.row === secondRow && p.col === col) ||
        (whaleSecondRow === row && p.col === col) ||
        (whaleSecondRow === secondRow && p.col === col)
      )
    )
  }

  
  return (
    p !== selectedPiece &&
    (
      (p.row === row && p.col === col) ||
      (p.row === secondRow && p.col === col)
    ) &&
    (p.side ?? 'player') !== (selectedPiece.side ?? 'player')
  )
}

    if (p.name === '白鯨') {
    const whaleSecondRow =
      p.row + (p.side === 'opponent' ? 1 : -1)

    return (
      (p.row === row && p.col === col) ||
      (whaleSecondRow === row && p.col === col)
    )
  }

  return (
    p.row === row &&
    p.col === col &&
    (p.side ?? 'player') !== (selectedPiece.side ?? 'player')
  )
})

if (capturedPieces.some((captured) => captured.name === 'タイタニック')) {
  setResult('勝利')
}
  
let nextPlayerHand = playerHand

if (selectedPiece?.name === 'ゾディアック') {
  const newHand = capturedPieces.flatMap((captured) =>
    captured.name === '国宝'
      ? []
      : [captured]
  )

  nextPlayerHand = [...playerHand, ...newHand]
  setPlayerHand(nextPlayerHand)
}

if (capturedPieces.some((captured) => captured.name === '国宝')) {
  const kokuhou = capturedPieces.find((captured) => captured.name === '国宝')

  nextPlayerHand = [
    ...nextPlayerHand,
    { ...kokuhou, name: '吉沢亮', image: yoshizawa },
    { ...kokuhou, name: '横浜流星', image: ryusei },
  ]

  setPlayerHand(nextPlayerHand)
}

const nextPieces = pieces
  .filter((p) => !capturedPieces.includes(p))
  .map((p) =>
    p.row === selectedPiece.row && p.col === selectedPiece.col
      ? {
          ...p,
          row,
          col,
          direction: selectedPiece.direction,
          absorbedMoves:
            p.name === '武器人間' && capturedPieces.length > 0
              ? [capturedPieces[0].name]
              : p.absorbedMoves,
          ...(p.name === 'ミミ' && (
            (p.side === 'player' && row <= 2) ||
            (p.side === 'opponent' && row >= 6)
          )
            ? { name: 'サイコ・ゴアマン', image: psychoGoreman }
            : {})
        }
      : p
  )

setPieces(nextPieces)

const nextTurn = turn === 'player' ? 'opponent' : 'player'
updateGameState(nextPieces, nextTurn, nextPlayerHand ?? playerHand)

setSelectedPiece(null)
setTurn(turn === 'player' ? 'opponent' : 'player')
  }
}}

>

  
              {piece && !(piece.name === 'ミスト' && piece.side === 'opponent') && (
  <img
  className={`${piece.name === '白鯨' ? 'piece-image white-whale' : 'piece-image'} ${piece.side === 'opponent' ? 'opponent-piece' : ''} ${!selectedPiece?.fromHand && selectedPiece?.row === piece.row && selectedPiece?.col === piece.col ? 'selected' : ''}`}
  src={piece.image}
  alt={piece.name}
  onClick={(e) => {
  if (screen !== 'game') return
  if ((piece.side ?? 'player') !== playerSide) return
  if ((piece.side ?? 'player') !== turn) return

  if (
    selectedPiece &&
    piece.name === '白鯨' &&
    selectedPiece.side !== piece.side
  ) {
    
  } else {
    setSelectedPiece(piece)
  }
}}
/>
)}

{piece && piece.name === 'ミスト' && piece.side === 'opponent' && mistMoveCount >= 10 && (
  <img
    className="piece-image opponent-piece"
    src={piece.image}
    alt={piece.name}
  />
)}

            </div>
          )
        })}
      </div>

           

            <div className="hand-box">
  {playerHand.map((piece, index) => (
    <img
  key={index}
  className="hand-piece"
  src={piece.image}
  alt={piece.name}
  onClick={() => {
  if (turn !== playerSide) return
  setSelectedPiece({ ...piece, fromHand: true, handIndex: index })
}}
/>
  ))}
</div>
          </div>
    )}
  </>
  )
}

export default App